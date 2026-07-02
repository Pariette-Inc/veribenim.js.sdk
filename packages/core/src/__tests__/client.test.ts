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

      const ok = await client.logConsent({ action: 'accept_all', consents });

      expect(ok).toBe(true);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://live.veribenim.com/api/consents/test-token-32-char/log');
      expect(JSON.parse(init.body)).toEqual({ action: 'accept_all', consents });
    });

    it('HTTP hatasında false döner', async () => {
      mockFetchOnce({ error: 'bad' }, false, 422);

      const ok = await client.logConsent({ action: 'reject_all' });

      expect(ok).toBe(false);
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

    it('DSAR başvurusunu doğru endpoint\'e gönderir', async () => {
      const fetchMock = mockFetchOnce({ id: '1', request_type: 'erasure', status: 'pending' });

      const result = await client.submitDsar({
        request_type: 'erasure',
        full_name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
      });

      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://live.veribenim.com/api/dsar/test-token-32-char'
      );
      expect(result?.request_type).toBe('erasure');
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
