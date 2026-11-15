/**
 * @jest-environment node
 *
 * @veribenim/nextjs/proxy — Route Handler sarmalayıcısı. (nextjs paketinin
 * kendi test altyapısı yok; çekirdek jest'i üzerinden çalıştırılır.)
 */
import { createConsentProxyRoute } from '../../../nextjs/src/proxy';

const TOKEN = 'abcdEFGH1234567890abcdEFGH123456';
const KEY = 'vbpk_nextSECRETnextSECRETnextSECRET1234';

function fetchOk() {
  const headers = new Headers({ 'content-type': 'application/json' });
  headers.append('set-cookie', 'vb_consent_62acc4db=eyJ2IjoxfQ; Path=/; Max-Age=60; SameSite=Lax');
  return jest.fn(async () => new Response('{"status":true}', { status: 200, headers })) as unknown as typeof fetch;
}

describe('createConsentProxyRoute', () => {
  it('ortamdaki token/anahtarla GET ve POST işleyicisi verir', async () => {
    const fetchMock = fetchOk();
    const { GET, POST } = createConsentProxyRoute({
      env: { VERIBENIM_TOKEN: TOKEN, VERIBENIM_PROXY_KEY: KEY },
      fetch: fetchMock,
    });

    const res = await POST(
      new Request(`https://site.com/_vb/${TOKEN}/c`, {
        method: 'POST',
        body: '{}',
        headers: { 'x-forwarded-for': '203.0.113.1' },
      })
    );

    expect(GET).toBe(POST);
    expect(res.status).toBe(200);
    expect(res.headers.getSetCookie()).toEqual(['vb_consent_62acc4db=eyJ2IjoxfQ; Path=/; Max-Age=60; SameSite=Lax']);
    const init = (fetchMock as unknown as jest.Mock).mock.calls[0][1];
    expect(init.headers.get('x-vb-proxy-key')).toBe(KEY);
    expect(init.headers.get('x-vb-client-ip')).toBe('203.0.113.1');
  });

  it('yapılandırma yoksa 503 döner (build kırılmaz)', async () => {
    const { POST } = createConsentProxyRoute({ env: {} });
    const res = await POST(new Request(`https://site.com/_vb/${TOKEN}/c`, { method: 'POST', body: '{}' }));
    expect(res.status).toBe(503);
  });

  it('NEXT_PUBLIC_ önekli anahtarı reddeder (tarayıcıya sızar)', async () => {
    const { POST } = createConsentProxyRoute({
      env: { VERIBENIM_TOKEN: TOKEN, NEXT_PUBLIC_VERIBENIM_PROXY_KEY: KEY },
    });
    await expect(POST(new Request(`https://site.com/_vb/${TOKEN}/c`, { method: 'POST', body: '{}' }))).rejects.toThrow(
      'NEXT_PUBLIC_VERIBENIM_PROXY_KEY'
    );
  });

  it('başka yollar 404', async () => {
    const fetchMock = fetchOk();
    const { POST } = createConsentProxyRoute({ env: { VERIBENIM_TOKEN: TOKEN, VERIBENIM_PROXY_KEY: KEY }, fetch: fetchMock });
    const res = await POST(new Request(`https://site.com/_vb/${TOKEN}/i`, { method: 'POST', body: '{}' }));
    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
