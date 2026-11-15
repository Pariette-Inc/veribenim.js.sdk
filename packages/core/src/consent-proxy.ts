/**
 * Birinci taraf rıza proxy'si — Fetch API (Request → Response) işleyicisi.
 *
 * SUNUCU TARAFI içindir (Next.js route handler, Node 18+, Cloudflare Worker,
 * Deno…). Tarayıcı paketine girmemeli: proxy anahtarı yalnızca sunucuda yaşar.
 *
 * Müşterinin kendi alan adındaki `/_vb/{token}/c` ve `/_vb/{token}/ping`
 * isteklerini Veribenim'in `{apiUrl}/api/vp/{token}/*` uçlarına iletir ve
 * yanıttaki rıza çerezini (`Set-Cookie: vb_consent_xxxxxxxx=…`) aynen taşır.
 * Ayrıntı: API deposu docs/FIRST_PARTY_CONSENT_COOKIE.md.
 *
 * Güvenlik kuralları (PHP çekirdeğindeki ConsentProxy ile aynı):
 *  - Yalnızca POST {basePath}/{token}/c ve GET {basePath}/{token}/ping;
 *    token yapılandırmadakiyle birebir. Başka her şey 404 — açık proxy değil.
 *  - İstek başlıkları izin listesiyle sıfırdan kurulur; Cookie yalnızca bu
 *    sitenin rıza çerezine indirilir. Authorization / X-Forwarded-For /
 *    X-Real-IP / oturum çerezleri iletilmez.
 *  - `X-VB-Proxy-Key` yalnızca upstream isteğine eklenir; yanıtta görünmez.
 *  - `X-VB-Client-IP` güvenilir kaynaktan: `clientIp` fonksiyonu ya da
 *    `clientIpHeader` (X-Forwarded-For için EN SAĞDAKİ değer — en yakın
 *    proxy'nin eklediği, istemcinin uyduramadığı adres).
 *  - Yanıttan yalnızca Content-Type, Cache-Control ve rıza çerezinin
 *    Set-Cookie'si taşınır; yönlendirme takip edilmez (502). Gövde ≤ 64 KB.
 */
import { DEFAULT_ENDPOINTS } from './endpoints';

export const CONSENT_PROXY_BASE_PATH = '/_vb';
export const CONSENT_PROXY_MAX_BODY_BYTES = 65536;

export interface ConsentProxyOptions {
  /** Site token'ı (Veribenim panelindeki environment token). */
  token: string;
  /** Konsoldaki proxy anahtarı (vbpk_…). YALNIZCA sunucu ortam değişkeninden verin. */
  proxyKey: string;
  /** API tabanı. Varsayılan https://live.veribenim.com (On-Prem'de kendi adresiniz). */
  apiUrl?: string;
  /** Yol öneki. Bundle sabit `/_vb` kullanır; değiştirmeyin. */
  basePath?: string;
  /**
   * Ziyaretçi IP'sini çözen fonksiyon (platformun güvenilir verisi).
   * Verilirse `clientIpHeader` yok sayılır.
   */
  clientIp?: (request: Request) => string | null | undefined;
  /**
   * IP'nin okunacağı başlık. Varsayılan 'x-forwarded-for' (en sağdaki değer).
   * Cloudflare arkasında 'cf-connecting-ip', Nginx real_ip ile 'x-real-ip'.
   * Uygulamanız bu başlığı kendisi yazan bir proxy'nin arkasında değilse
   * istemci başlığı uydurabilir — o durumda `clientIp` verin.
   */
  clientIpHeader?: string;
  /** Upstream zaman aşımı (ms). Varsayılan 5000. */
  timeoutMs?: number;
  /** Test / özel ortam için fetch. Varsayılan globalThis.fetch. */
  fetch?: typeof fetch;
}

export type ConsentProxyHandler = (request: Request) => Promise<Response>;

const FORWARD_REQUEST_HEADERS = ['content-type', 'accept', 'accept-language', 'user-agent', 'origin', 'referer'];
const FORWARD_RESPONSE_HEADERS = ['content-type', 'cache-control'];
const TOKEN_RE = /^[A-Za-z0-9]{16,64}$/;
const NONCE_RE = /^[A-Za-z0-9]{16,64}$/;
const COOKIE_VALUE_RE = /^[A-Za-z0-9_\-=.]{0,4096}$/;
const IPV4_RE = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const IPV6_RE = /^[0-9A-Fa-f:.]{2,45}$/;

/** IPv4 ya da (biçim olarak) IPv6 mı? */
export function isValidIp(value: string | null | undefined): value is string {
  if (!value) return false;
  const v = value.trim();
  if (IPV4_RE.test(v)) return true;
  return v.includes(':') && IPV6_RE.test(v) && (v.match(/::/g) || []).length <= 1;
}

/**
 * Sitenin rıza çerezinin adı — API'deki ConsentCookie::name() ile aynı:
 * "vb_consent_" + sha256("vb-consent-cookie|" + token)'ın ilk 8 hanesi.
 */
export async function consentCookieName(token: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('[Veribenim] Web Crypto (crypto.subtle) gerekli');
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(`vb-consent-cookie|${token}`));
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  return `vb_consent_${hex.slice(0, 8)}`;
}

function json(status: number, code: string, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ status: false, code }), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra },
  });
}

function setCookieValues(headers: Headers): string[] {
  const h = headers as Headers & { getSetCookie?: () => string[] };
  if (typeof h.getSetCookie === 'function') return h.getSetCookie();
  const single = headers.get('set-cookie');
  return single ? [single] : [];
}

function resolveClientIp(request: Request, options: ConsentProxyOptions): string | null {
  if (options.clientIp) {
    const ip = options.clientIp(request);
    return isValidIp(ip) ? ip.trim() : null;
  }
  const headerName = (options.clientIpHeader ?? 'x-forwarded-for').toLowerCase();
  const raw = request.headers.get(headerName);
  if (!raw) return null;
  const candidate = headerName === 'x-forwarded-for'
    ? raw.split(',').map((s) => s.trim()).filter(Boolean).pop()
    : raw.trim();
  return isValidIp(candidate) ? candidate.trim() : null;
}

/**
 * Proxy işleyicisini kurar. Dönen fonksiyon her `Request` için `Response` üretir.
 */
export function createConsentProxy(options: ConsentProxyOptions): ConsentProxyHandler {
  const { token, proxyKey } = options;
  if (!TOKEN_RE.test(token || '')) throw new Error('[Veribenim] createConsentProxy: geçersiz site token');
  if (!proxyKey || !proxyKey.trim()) throw new Error('[Veribenim] createConsentProxy: proxyKey boş olamaz');

  const apiUrl = (options.apiUrl || DEFAULT_ENDPOINTS.apiUrl).trim().replace(/\/+$/, '');
  if (!/^https?:\/\/[^/]+/i.test(apiUrl)) throw new Error('[Veribenim] createConsentProxy: apiUrl http(s) olmalı');

  const basePath = '/' + (options.basePath ?? CONSENT_PROXY_BASE_PATH).replace(/^\/+|\/+$/g, '');
  const upstreamBase = `${apiUrl}/api/vp/${token}`;
  const timeoutMs = options.timeoutMs ?? 5000;
  const doFetch = options.fetch ?? globalThis.fetch;
  const cookieNamePromise = consentCookieName(token);
  const redact = (text: string) => (text.includes(proxyKey) ? text.split(proxyKey).join('[redacted]') : text);

  return async function handleConsentProxy(request: Request): Promise<Response> {
    let url: URL;
    try {
      url = new URL(request.url);
    } catch {
      return json(404, 'VB_PROXY_NOT_FOUND');
    }

    let endpoint: 'c' | 'ping' | null = null;
    if (url.pathname === `${basePath}/${token}/c`) endpoint = 'c';
    else if (url.pathname === `${basePath}/${token}/ping`) endpoint = 'ping';
    if (!endpoint) return json(404, 'VB_PROXY_NOT_FOUND');

    const method = request.method.toUpperCase();
    const allowed = endpoint === 'c' ? 'POST' : 'GET';
    if (method !== allowed) return json(405, 'VB_PROXY_METHOD_NOT_ALLOWED', { allow: allowed });

    let body: ArrayBuffer | undefined;
    if (endpoint === 'c') {
      const declared = Number(request.headers.get('content-length') || '0');
      if (declared > CONSENT_PROXY_MAX_BODY_BYTES) return json(413, 'VB_PROXY_PAYLOAD_TOO_LARGE');
      body = await request.arrayBuffer();
      if (body.byteLength > CONSENT_PROXY_MAX_BODY_BYTES) return json(413, 'VB_PROXY_PAYLOAD_TOO_LARGE');
    }

    const cookieName = await cookieNamePromise;
    const headers = new Headers();
    for (const name of FORWARD_REQUEST_HEADERS) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    for (const part of (request.headers.get('cookie') || '').split(';')) {
      const pair = part.trim();
      const eq = pair.indexOf('=');
      if (eq > 0 && pair.slice(0, eq).trim() === cookieName && COOKIE_VALUE_RE.test(pair.slice(eq + 1))) {
        headers.set('cookie', `${cookieName}=${pair.slice(eq + 1)}`);
        break;
      }
    }
    headers.set('x-vb-proxy-key', proxyKey);
    const clientIp = resolveClientIp(request, options);
    if (clientIp) headers.set('x-vb-client-ip', clientIp);

    let target = `${upstreamBase}/${endpoint}`;
    const nonce = url.searchParams.get('n');
    if (endpoint === 'ping' && nonce && NONCE_RE.test(nonce)) target += `?n=${nonce}`;

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

    let upstream: Response;
    let text: string;
    try {
      upstream = await doFetch(target, {
        method: allowed,
        headers,
        body,
        redirect: 'manual',
        signal: controller?.signal,
        // Sunucu ortamında çerez kavanozu yok; yine de açıkça kapalı.
        credentials: 'omit',
        cache: 'no-store',
      } as RequestInit);
      text = await upstream.text();
    } catch {
      // Ayrıntı (adres, anahtar, hata metni) yanıta yazılmaz.
      return json(502, 'VB_PROXY_UPSTREAM_ERROR');
    } finally {
      if (timer) clearTimeout(timer);
    }

    const status = upstream.status;
    if (status < 200 || status >= 600 || (status >= 300 && status < 400) || upstream.type === 'opaqueredirect') {
      return json(502, 'VB_PROXY_UPSTREAM_ERROR');
    }

    const out = new Headers();
    for (const name of FORWARD_RESPONSE_HEADERS) {
      const value = upstream.headers.get(name);
      if (value && !value.includes(proxyKey)) out.set(name, value);
    }
    if (!out.has('cache-control')) out.set('cache-control', 'no-store');
    for (const cookie of setCookieValues(upstream.headers)) {
      if (cookie.split('=', 1)[0].trim() === cookieName && !cookie.includes(proxyKey)) {
        out.append('set-cookie', cookie); // aynen
      }
    }

    return new Response(redact(text), { status, headers: out });
  };
}
