/**
 * VeribenimApiClient testleri — fetch mock'lanır, payload ve URL'ler doğrulanır.
 */
import { VeribenimApiClient } from '../client';
import type { VeribenimInternalConfig, ConsentPreferences } from '../types';

const config: VeribenimInternalConfig = {
  token: 'test-token-32-char',
  apiUrl: 'https://live.veribenim.com/',
  lang: 'tr',
  debug: false,
};

function mockFetchOnce(body: unknown, ok = true, status = 200): jest.Mock {
  const fn = jest.fn().mockResolvedValue({
    ok,
    status,
    text: () => Promise.resolve(body === null ? '' : JSON.stringify(body)),
    json: () => Promise.resolve(body),
  });
  (globalThis as any).fetch = fn;
  return fn;
}

describe('VeribenimApiClient', () => {
  let client: VeribenimApiClient;

  beforeEach(() => {
    client = new VeribenimApiClient(config);
  });

  afterEach(() => {
    delete (globalThis as any).fetch;
  });

  describe('logImpression', () => {
    it('doğru endpoint\'e url/referrer/user_agent gönderir', async () => {
      const fetchMock = mockFetchOnce({ status: true });

      const ok = await client.logImpression();

      expect(ok).toBe(true);
      const [url, init] = fetchMock.mock.calls[0];
      // apiUrl sonundaki slash temizlenmeli
      expect(url).toBe('https://live.veribenim.com/api/impressions/test-token-32-char');
      expect(init.method).toBe('POST');
      const body = JSON.parse(init.body);
      expect(body.url).toBe(window.location.href);
      expect(body).toHaveProperty('user_agent');
    });

    it('verilen payload alanları varsayılanları ezer', async () => {
      const fetchMock = mockFetchOnce({ status: true });

      await client.logImpression({ url: 'https://example.com/page' });

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.url).toBe('https://example.com/page');
    });
  });

  describe('logConsent', () => {
    it('action ve consents payload\'ını log endpoint\'ine gönderir', async () => {
      const fetchMock = mockFetchOnce({ status: true });
      const consents: ConsentPreferences = {
        strictly_necessary: true,
        functional: false,
        analytics: true,
        marketing: false,
      };

      const ok = await client.logConsent({ action: 'accept_all', consents, session_id: 's-1' });

      expect(ok).toBe(true);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://live.veribenim.com/api/consents/test-token-32-char/log');
      expect(JSON.parse(init.body)).toEqual({ action: 'accept_all', consents, session_id: 's-1' });
    });

    it('HTTP hatasında false döner', async () => {
      mockFetchOnce({ error: 'bad' }, false, 422);

      const ok = await client.logConsent({ action: 'reject_all', session_id: 's-1' });

      expect(ok).toBe(false);
    });

    it('session_id yoksa API\'ye gitmez (API alanı zorunlu tutar)', async () => {
      const fetchMock = mockFetchOnce({ status: true });

      const ok = await client.logConsent({ action: 'reject_all' });

      expect(ok).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('getPreferences', () => {
    it('session_id query string olarak eklenir ve yanıt parse edilir', async () => {
      const response = { status: true, categories: [], current_consents: null };
      const fetchMock = mockFetchOnce(response);

      const result = await client.getPreferences('sess/123');

      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://live.veribenim.com/api/preferences/test-token-32-char?session_id=sess%2F123'
      );
      expect(result).toEqual(response);
    });

    it('session_id verilmezse query string eklenmez', async () => {
      const fetchMock = mockFetchOnce({ status: true, categories: [], current_consents: null });

      await client.getPreferences();

      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://live.veribenim.com/api/preferences/test-token-32-char'
      );
    });
  });

  describe('savePreferences', () => {
    it('consents ve session_id\'yi POST body\'sinde gönderir', async () => {
      const fetchMock = mockFetchOnce({ status: true, message: 'ok' });
      const consents: ConsentPreferences = {
        strictly_necessary: true,
        functional: true,
        analytics: false,
        marketing: false,
      };

      const result = await client.savePreferences(consents, 'sess-1');

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://live.veribenim.com/api/preferences/test-token-32-char');
      expect(JSON.parse(init.body)).toEqual({ consents, session_id: 'sess-1' });
      expect(result).toEqual({ status: true, message: 'ok' });
    });
  });

  describe('logFormConsent / submitDsar', () => {
    it('form rızası payload\'ını doğru endpoint\'e gönderir', async () => {
      const fetchMock = mockFetchOnce({ id: '1', form_name: 'contact', consented: true });

      await client.logFormConsent({ form_name: 'contact', consented: true });

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://live.veribenim.com/api/form-consents/test-token-32-char');
      expect(JSON.parse(init.body)).toEqual({ form_name: 'contact', consented: true });
    });

    it('DSAR başvurusunu API alan adlarıyla gönderir', async () => {
      const fetchMock = mockFetchOnce({
        status: true,
        message: 'Talebiniz alındı.',
        data: { id: 1, request_type: 'Silme', due_at: '2026-12-15T00:00:00Z' },
      });

      const result = await client.submitDsar({
        request_type: 'erasure',
        first_name: 'Ahmet',
        last_name: 'Yılmaz',
        email: 'ahmet@example.com',
        phone: '+90 555',
        message: 'Silin',
      });

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://live.veribenim.com/api/dsar/test-token-32-char');
      expect(JSON.parse(init.body)).toEqual({
        first_name: 'Ahmet',
        last_name: 'Yılmaz',
        email: 'ahmet@example.com',
        request_type: 'erasure',
        phone: '+90 555',
        message: 'Silin',
      });
      expect(result?.data.id).toBe(1);
    });

    it('eski full_name/description/automated alanlarını API adlarına çevirir', async () => {
      const fetchMock = mockFetchOnce({ status: true, message: '', data: { id: 2, request_type: '', due_at: '' } });

      await client.submitDsar({
        request_type: 'automated',
        full_name: 'Ahmet Can Yılmaz',
        email: 'a@b.com',
        description: 'Açıklama',
        attachment_url: 'https://x',
      });

      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
        first_name: 'Ahmet Can',
        last_name: 'Yılmaz',
        email: 'a@b.com',
        request_type: 'automated_decision',
        message: 'Açıklama',
      });
    });

    it('soyad çıkarılamıyorsa istek atmaz', async () => {
      const fetchMock = mockFetchOnce({});

      expect(await client.submitDsar({ request_type: 'access', full_name: 'Ahmet', email: 'a@b.com' })).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('withdrawConsent / getConsentHistory', () => {
    it('tercih merkezi withdraw ucuna session_id gönderir', async () => {
      const fetchMock = mockFetchOnce({ status: true, message: 'ok' });

      expect(await client.withdrawConsent('s-9')).toBe(true);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://live.veribenim.com/api/preferences/test-token-32-char/withdraw');
      expect(init.method).toBe('POST');
      expect(JSON.parse(init.body)).toEqual({ session_id: 's-9' });
    });

    it('session_id yoksa istek atmaz', async () => {
      const fetchMock = mockFetchOnce({ status: true });
      expect(await client.withdrawConsent('')).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('geçmiş ucunu çağırır', async () => {
      const fetchMock = mockFetchOnce({ status: true, data: {} });
      await client.getConsentHistory('a b');
      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://live.veribenim.com/api/preferences/test-token-32-char/history?session_id=a%20b'
      );
    });
  });

  describe('savePreferences session_id', () => {
    it('session_id yoksa API\'ye gitmez', async () => {
      const fetchMock = mockFetchOnce({ status: true });

      expect(
        await client.savePreferences({ strictly_necessary: true, functional: false, analytics: false, marketing: false })
      ).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('submitForm dosya alanları', () => {
    it('tek dosyayı ve çoklu seçimi `alan[]` adıyla gönderir, slug kodlanır', async () => {
      const fetchMock = mockFetchOnce({ success: true, message: 'ok' });
      const file = new File(['x'], 'kimlik.pdf', { type: 'application/pdf' });

      await client.submitForm('iletişim formu', { 'u-file': file, 'u-multi': ['a', 'b'], 'u-name': 'Ali' });

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://live.veribenim.com/api/public/forms/test-token-32-char/ileti%C5%9Fim%20formu');
      const fd = init.body as FormData;
      expect(fd.getAll('u-file[]')).toHaveLength(1);
      expect(fd.get('u-file')).toBeNull();
      expect(fd.getAll('u-multi[]')).toEqual(['a', 'b']);
      expect(fd.get('u-name')).toBe('Ali');
    });
  });

  describe('request hata yönetimi', () => {
    it('network hatasında null döner, exception fırlatmaz', async () => {
      (globalThis as any).fetch = jest.fn().mockRejectedValue(new Error('network down'));

      const result = await client.getPreferences();

      expect(result).toBeNull();
    });

    it('boş yanıt gövdesinde null döner', async () => {
      mockFetchOnce(null);

      const result = await client.getPreferences();

      expect(result).toBeNull();
    });
  });

  describe('trackPageview', () => {
    it('sid eksikse istek atmadan false döner', async () => {
      const fetchMock = mockFetchOnce({});

      const ok = await client.trackPageview({ sid: '' });

      expect(ok).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('sendBeacon yoksa keepalive fetch ile gönderir ve bağlamı doldurur', async () => {
      const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 204 });
      (globalThis as any).fetch = fetchMock;

      const ok = await client.trackPageview({ sid: 'sid-1' });

      expect(ok).toBe(true);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://live.veribenim.com/api/v/test-token-32-char/e');
      expect(init.keepalive).toBe(true);
      const body = JSON.parse(init.body);
      expect(body.sid).toBe('sid-1');
      expect(body.url).toBe(window.location.href);
      expect(body.title).toBe(document.title);
      expect(body).toHaveProperty('lang');
    });

    it('sendBeacon başarılıysa fetch çağrılmaz', async () => {
      const beacon = jest.fn().mockReturnValue(true);
      (navigator as any).sendBeacon = beacon;
      const fetchMock = mockFetchOnce({});

      const ok = await client.trackPageview({ sid: 'sid-1' });

      expect(ok).toBe(true);
      expect(beacon).toHaveBeenCalledTimes(1);
      expect(fetchMock).not.toHaveBeenCalled();

      delete (navigator as any).sendBeacon;
    });
  });

  describe('trackEvent', () => {
    it('eid veya sid eksikse istek atmadan false döner', async () => {
      const fetchMock = mockFetchOnce({});

      const ok = await client.trackEvent({ eid: 0, sid: '' });

      expect(ok).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('sendBeacon yoksa form-urlencoded keepalive fetch ile gönderir', async () => {
      const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 204 });
      (globalThis as any).fetch = fetchMock;

      const ok = await client.trackEvent({ eid: 7, sid: 'sid-1', txt: 'Satın Al' });

      expect(ok).toBe(true);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://live.veribenim.com/api/v/test-token-32-char/ce');
      expect(init.keepalive).toBe(true);
      expect(init.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
      const body = new URLSearchParams(init.body);
      expect(body.get('eid')).toBe('7');
      expect(body.get('sid')).toBe('sid-1');
      expect(body.get('txt')).toBe('Satın Al');
      expect(body.get('url')).toBe(window.location.href);
    });

    it('sendBeacon başarılıysa fetch çağrılmaz', async () => {
      const beacon = jest.fn().mockReturnValue(true);
      (navigator as any).sendBeacon = beacon;
      const fetchMock = mockFetchOnce({});

      const ok = await client.trackEvent({ eid: 7, sid: 'sid-1' });

      expect(ok).toBe(true);
      expect(beacon).toHaveBeenCalledTimes(1);
      expect(fetchMock).not.toHaveBeenCalled();

      delete (navigator as any).sendBeacon;
    });
  });

  describe('getVendors', () => {
    it('public vendors endpoint\'ini çağırır ve yanıtı döner', async () => {
      const fetchMock = mockFetchOnce({
        status: true,
        data: { gvl_version: 42, purposes_meta: null, vendors: [] },
      });

      const result = await client.getVendors();

      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://live.veribenim.com/api/public/vendors/test-token-32-char'
      );
      expect(result?.data.gvl_version).toBe(42);
    });
  });

  describe('verifyDomain', () => {
    it('domain\'i temizleyip public verify endpoint\'ini çağırır', async () => {
      const fetchMock = mockFetchOnce({ found: true, domain: 'example.com' });

      await client.verifyDomain('https://www.Example.com/path');

      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://live.veribenim.com/api/public/verify/example.com'
      );
    });

    it('domain yoksa istek atmadan null döner', async () => {
      const fetchMock = mockFetchOnce({});

      const result = await client.verifyDomain();

      expect(result).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('impressionPixelUrl', () => {
    it('parametreleri query string olarak ekler', () => {
      const url = client.impressionPixelUrl({
        url: 'https://example.com/a',
        session_id: 's1',
        domain: 'example.com',
      });

      const parsed = new URL(url);
      expect(parsed.pathname).toBe('/api/impressions/test-token-32-char/pixel');
      expect(parsed.searchParams.get('u')).toBe('https://example.com/a');
      expect(parsed.searchParams.get('s')).toBe('s1');
      expect(parsed.searchParams.get('d')).toBe('example.com');
    });
  });
});
