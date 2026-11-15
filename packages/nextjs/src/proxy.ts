/**
 * @veribenim/nextjs/proxy — Birinci taraf rıza proxy'si için Route Handler.
 *
 * SUNUCU tarafı modülüdür ('use client' YOK). Proxy anahtarını yalnızca
 * sunucu ortam değişkeninden okur; `NEXT_PUBLIC_` önekli bir anahtar
 * tarayıcı paketine gömüleceği için reddedilir.
 *
 * Bundle kararı sitenizin kendi alan adındaki `/_vb/{token}/c` adresine
 * gönderir; App Router'da alt çizgiyle başlayan klasörler "özel" sayıldığı
 * için klasör adı `%5Fvb` olmalıdır:
 *
 * @example app/%5Fvb/[...path]/route.ts
 * import { createConsentProxyRoute } from '@veribenim/nextjs/proxy';
 *
 * export const runtime = 'nodejs';
 * export const dynamic = 'force-dynamic';
 * export const { GET, POST } = createConsentProxyRoute();
 * // .env: VERIBENIM_TOKEN=..., VERIBENIM_PROXY_KEY=vbpk_...
 *
 * Ziyaretçi IP'si varsayılan olarak `x-forwarded-for`'un EN SAĞDAKİ değeridir
 * (Vercel ve önündeki Nginx bu başlığı kendisi yazar). Cloudflare arkasında
 * `clientIpHeader: 'cf-connecting-ip'` verin; başka bir düzende `clientIp`
 * fonksiyonuyla güvenilir kaynağı kendiniz belirtin.
 */
import { createConsentProxy, type ConsentProxyOptions, type ConsentProxyHandler } from '@veribenim/core';

export interface ConsentProxyRouteOptions
  extends Omit<ConsentProxyOptions, 'token' | 'proxyKey'> {
  /** Varsayılan: process.env.VERIBENIM_TOKEN ?? process.env.NEXT_PUBLIC_VERIBENIM_TOKEN */
  token?: string;
  /** Varsayılan: process.env.VERIBENIM_PROXY_KEY (ASLA NEXT_PUBLIC_ önekli olmamalı) */
  proxyKey?: string;
  /** Test için ortam değişkenleri kaynağı. Varsayılan process.env. */
  env?: Record<string, string | undefined>;
}

export interface ConsentProxyRoute {
  GET: ConsentProxyHandler;
  POST: ConsentProxyHandler;
}

function processEnv(): Record<string, string | undefined> {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env ?? {};
}

/**
 * `{ GET, POST }` döner. İşleyici ilk istekte kurulur; böylece derleme
 * sırasında ortam değişkeni yoksa build kırılmaz, istek 503 alır.
 */
export function createConsentProxyRoute(options: ConsentProxyRouteOptions = {}): ConsentProxyRoute {
  const { env: envOverride, token: tokenOpt, proxyKey: keyOpt, ...rest } = options;
  let handler: ConsentProxyHandler | null = null;

  const resolve = (): ConsentProxyHandler | null => {
    if (handler) return handler;
    const env = envOverride ?? processEnv();
    if (env.NEXT_PUBLIC_VERIBENIM_PROXY_KEY) {
      throw new Error(
        '[Veribenim] NEXT_PUBLIC_VERIBENIM_PROXY_KEY tanımlı: bu anahtar tarayıcı paketine girer. ' +
          'Silin ve VERIBENIM_PROXY_KEY kullanın (anahtarı konsoldan yenileyin).'
      );
    }
    const token = tokenOpt ?? env.VERIBENIM_TOKEN ?? env.NEXT_PUBLIC_VERIBENIM_TOKEN ?? '';
    const proxyKey = keyOpt ?? env.VERIBENIM_PROXY_KEY ?? '';
    if (!token || !proxyKey) return null;
    handler = createConsentProxy({ ...rest, token, proxyKey });
    return handler;
  };

  const route: ConsentProxyHandler = async (request) => {
    const h = resolve();
    if (!h) {
      return new Response(JSON.stringify({ status: false, code: 'VB_PROXY_NOT_CONFIGURED' }), {
        status: 503,
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      });
    }
    return h(request);
  };

  return { GET: route, POST: route };
}

export type { ConsentProxyOptions, ConsentProxyHandler } from '@veribenim/core';
