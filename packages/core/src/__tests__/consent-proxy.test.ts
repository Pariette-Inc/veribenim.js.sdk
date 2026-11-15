/**
 * @jest-environment node
 *
 * Birinci taraf rıza proxy'si — güvenlik testleri (Fetch API, Node 18+).
 */
import { createConsentProxy, consentCookieName, isValidIp } from '../consent-proxy';

const TOKEN = 'abcdEFGH1234567890abcdEFGH123456';
const KEY = 'vbpk_SECRETsecretSECRETsecretSECRETsecret12';
// sha256('vb-consent-cookie|' + TOKEN) ilk 8 hane — PHP hash() ile de doğrulandı.
const COOKIE = 'vb_consent_62acc4db';
const SITE = 'https://www.musteri.com';

type Call = { url: string; init: RequestInit & { headers: Headers } };

function upstream(response: () => Response) {
  const calls: Call[] = [];
  const fetchMock = jest.fn(async (url: string, init: any) => {
    calls.push({ url, init });
    return response();
  });
  return { calls, fetch: fetchMock as unknown as typeof fetch };
}

function okUpstream() {
  return upstream(() => {
    const headers = new Headers({ 'content-type': 'application/json', 'x-powered-by': 'PHP', 'access-control-allow-origin': '*' });
    headers.append('set-cookie', `${COOKIE}=eyJ2IjoxfQ; Domain=musteri.com; Path=/; Max-Age=31536000; Secure; SameSite=Lax`);
    headers.append('set-cookie', 'laravel_session=abc; Path=/; HttpOnly');
    return new Response('{"status":true}', { status: 200, headers });
  });
}

function consentRequest(headers: Record<string, string> = {}, body = '{"action":"accept_all","session_id":"s"}') {
  return new Request(`${SITE}/_vb/${TOKEN}/c`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain', origin: SITE, 'x-forwarded-for': '203.0.113.7', ...headers },
    body,
  });
}

describe('consentCookieName', () => {
  it('API formülüyle aynı adı üretir', async () => {
    await expect(consentCookieName(TOKEN)).resolves.toBe(COOKIE);
  });
});

describe('createConsentProxy', () => {
  it('rıza kararını /api/vp/{token}/c ucuna anahtar ve IP ile iletir', async () => {
    const up = okUpstream();
    const handler = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch });

    const res = await handler(consentRequest());

    expect(res.status).toBe(200);
    expect(up.calls).toHaveLength(1);
    const { url, init } = up.calls[0];
    expect(url).toBe(`https://live.veribenim.com/api/vp/${TOKEN}/c`);
    expect(init.method).toBe('POST');
    expect(init.redirect).toBe('manual');
    expect(init.headers.get('x-vb-proxy-key')).toBe(KEY);
    expect(init.headers.get('x-vb-client-ip')).toBe('203.0.113.7');
    expect(init.headers.get('origin')).toBe(SITE);
    expect(init.headers.get('content-type')).toBe('text/plain');
    expect(new TextDecoder().decode(init.body as ArrayBuffer)).toBe('{"action":"accept_all","session_id":"s"}');
  });

  it.each([
    ['başka uç', `/_vb/${TOKEN}/e`],
    ['başka token', '/_vb/ZZZZEFGH1234567890abcdEFGH123456/c'],
    ['ek segment', `/_vb/${TOKEN}/c/x`],
    ['sondaki eğik çizgi', `/_vb/${TOKEN}/c/`],
    ['kodlanmış tırmanma', `/_vb/${TOKEN}/%2e%2e/%2e%2e/api/v1/me`],
    ['önek dışı', `/api/vp/${TOKEN}/c`],
    ['yalnız önek', '/_vb'],
  ])('izinli olmayan yolu reddeder: %s', async (_name, path) => {
    const up = okUpstream();
    const handler = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch });

    const res = await handler(new Request(`${SITE}${path}`, { method: 'POST', body: '{}' }));

    expect(res.status).toBe(404);
    expect(up.calls).toHaveLength(0);
  });

  it('yanlış yöntem 405, büyük gövde 413 — upstream çağrılmaz', async () => {
    const up = okUpstream();
    const handler = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch });

    const get = await handler(new Request(`${SITE}/_vb/${TOKEN}/c`));
    const post = await handler(new Request(`${SITE}/_vb/${TOKEN}/ping`, { method: 'POST', body: '{}' }));
    const big = await handler(consentRequest({}, 'x'.repeat(65537)));

    expect([get.status, post.status, big.status]).toEqual([405, 405, 413]);
    expect(get.headers.get('allow')).toBe('POST');
    expect(up.calls).toHaveLength(0);
  });

  it('Cookie başlığını yalnızca sitenin rıza çerezine indirir; tehlikeli başlıkları atar', async () => {
    const up = okUpstream();
    const handler = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch });

    await handler(
      consentRequest({
        cookie: `next-auth.session-token=SECRET; ${COOKIE}=eyJ2IjoxfQ; vb_consent_deadbeef=x; vb_probe_session=p`,
        authorization: 'Bearer secret',
        'x-real-ip': '8.8.8.8',
        'x-vb-proxy-key': 'attacker',
        'x-vb-client-ip': '1.1.1.1',
      })
    );

    const h = up.calls[0].init.headers;
    expect(h.get('cookie')).toBe(`${COOKIE}=eyJ2IjoxfQ`);
    expect(h.get('authorization')).toBeNull();
    expect(h.get('x-real-ip')).toBeNull();
    expect(h.get('x-forwarded-for')).toBeNull();
    expect(h.get('x-vb-proxy-key')).toBe(KEY);
    expect(h.get('x-vb-client-ip')).toBe('203.0.113.7');
  });

  it('X-Forwarded-For\'un en sağdaki (en yakın proxy\'nin eklediği) değerini alır', async () => {
    const up = okUpstream();
    const handler = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch });

    await handler(consentRequest({ 'x-forwarded-for': '6.6.6.6, 198.51.100.23' }));

    expect(up.calls[0].init.headers.get('x-vb-client-ip')).toBe('198.51.100.23');
  });

  it('clientIp fonksiyonu ve özel başlık; geçersiz IP gönderilmez', async () => {
    const up = okUpstream();
    const viaFn = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch, clientIp: () => '2001:db8::7' });
    const viaHeader = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch, clientIpHeader: 'cf-connecting-ip' });
    const bad = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch, clientIp: () => 'evil' });

    await viaFn(consentRequest());
    await viaHeader(consentRequest({ 'cf-connecting-ip': '192.0.2.44' }));
    await bad(consentRequest());

    expect(up.calls.map((c) => c.init.headers.get('x-vb-client-ip'))).toEqual(['2001:db8::7', '192.0.2.44', null]);
  });

  it('Set-Cookie\'yi aynen taşır; yalnızca izinli yanıt başlıkları döner', async () => {
    const up = okUpstream();
    const handler = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch });

    const res = await handler(consentRequest());

    expect(res.headers.getSetCookie()).toEqual([
      `${COOKIE}=eyJ2IjoxfQ; Domain=musteri.com; Path=/; Max-Age=31536000; Secure; SameSite=Lax`,
    ]);
    expect(res.headers.get('x-powered-by')).toBeNull();
    expect(res.headers.get('access-control-allow-origin')).toBeNull();
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.text()).toBe('{"status":true}');
  });

  it('proxy anahtarı yanıtta asla görünmez (gövde, başlık, hata)', async () => {
    const echo = upstream(() => {
      const headers = new Headers({ 'content-type': 'application/json', 'cache-control': `x ${KEY}` });
      headers.append('set-cookie', `${COOKIE}=${KEY}`);
      return new Response(`{"code":"PROXY_KEY_INVALID","k":"${KEY}"}`, { status: 403, headers });
    });
    const failing = upstream(() => {
      throw new Error(`connect ECONNREFUSED key=${KEY}`);
    });

    const responses = [
      await createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: echo.fetch })(consentRequest()),
      await createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: failing.fetch })(consentRequest()),
      await createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: echo.fetch })(new Request(`${SITE}/_vb/x/c`)),
    ];

    expect(responses.map((r) => r.status)).toEqual([403, 502, 404]);
    for (const res of responses) {
      expect(await res.text()).not.toContain(KEY);
      res.headers.forEach((value, name) => expect(`${name}:${value}`).not.toContain(KEY));
    }
  });

  it('upstream yönlendirmesini takip etmez ve taşımaz', async () => {
    const up = upstream(() => new Response(null, { status: 302, headers: { location: 'https://evil.example/' } }));
    const handler = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch });

    const res = await handler(consentRequest());

    expect(res.status).toBe(502);
    expect(res.headers.get('location')).toBeNull();
  });

  it('ping yalnızca geçerli nonce\'u iletir; On-Prem apiUrl kullanılır', async () => {
    const up = okUpstream();
    const handler = createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch, apiUrl: 'https://api.kurum.local/' });
    const nonce = 'aB3'.repeat(8);

    await handler(new Request(`${SITE}/_vb/${TOKEN}/ping?n=${nonce}&x=1`));
    await handler(new Request(`${SITE}/_vb/${TOKEN}/ping?n=..%2F..%2Fx`));

    expect(up.calls.map((c) => c.url)).toEqual([
      `https://api.kurum.local/api/vp/${TOKEN}/ping?n=${nonce}`,
      `https://api.kurum.local/api/vp/${TOKEN}/ping`,
    ]);
    expect(up.calls[0].init.method).toBe('GET');
    expect(up.calls[0].init.body).toBeUndefined();
  });

  it('upstream hata durumlarını (bundle yedek zinciri için) olduğu gibi döndürür', async () => {
    const up = upstream(() => new Response('{"message":"x"}', { status: 422, headers: { 'content-type': 'application/json' } }));

    const res = await createConsentProxy({ token: TOKEN, proxyKey: KEY, fetch: up.fetch })(consentRequest());

    expect(res.status).toBe(422);
  });

  it('hatalı yapılandırmayı reddeder, hata metninde anahtar yok', () => {
    for (const opts of [
      { token: 'bad/token', proxyKey: KEY },
      { token: TOKEN, proxyKey: '  ' },
      { token: TOKEN, proxyKey: KEY, apiUrl: 'ftp://x' },
    ]) {
      expect(() => createConsentProxy(opts)).toThrow(/Veribenim/);
      try {
        createConsentProxy(opts);
      } catch (e) {
        expect(String(e)).not.toContain(KEY);
      }
    }
  });
});

describe('isValidIp', () => {
  it('IPv4/IPv6 kabul eder, çöpü reddeder', () => {
    expect(isValidIp('192.0.2.1')).toBe(true);
    expect(isValidIp('2001:db8::1')).toBe(true);
    expect(isValidIp('256.1.1.1')).toBe(false);
    expect(isValidIp('1.2.3.4, 5.6.7.8')).toBe(false);
    expect(isValidIp('evil')).toBe(false);
    expect(isValidIp('')).toBe(false);
  });
});
