/**
 * window.veribenim sarmalayıcıları ve adres yapılandırması testleri (jsdom).
 */
import {
  getBundle,
  isBundleReady,
  onBundleReady,
  waitForBundle,
  renderBundleForm,
  VERIBENIM_READY_EVENT,
  type VeribenimBundleApi,
} from '../bundle';
import { DEFAULT_ENDPOINTS, resolveEndpoints } from '../endpoints';
import { Veribenim } from '../index';

function installBundle(ready: boolean): VeribenimBundleApi & { renderForm: jest.Mock } {
  const api = {
    ready,
    renderForm: jest.fn().mockResolvedValue({ slug: 'iletisim' }),
  };
  window.veribenim = api as unknown as VeribenimBundleApi;
  return api as VeribenimBundleApi & { renderForm: jest.Mock };
}

function fireReady(bundle: { ready?: boolean }) {
  bundle.ready = true;
  window.dispatchEvent(new CustomEvent(VERIBENIM_READY_EVENT));
}

afterEach(() => {
  delete window.veribenim;
  jest.useRealTimers();
});

describe('bundle hazır olma', () => {
  it('ready bayrağı yoksa hazır sayılmaz', () => {
    installBundle(false);
    expect(isBundleReady()).toBe(false);
    expect(getBundle()).toBeNull();
  });

  it('bundle önceden hazırsa beklemeden çözer (olay kaçırılmaz)', async () => {
    const api = installBundle(true);
    await expect(waitForBundle()).resolves.toBe(api);
  });

  it('VeribenimReady window olayını bekler', async () => {
    const api = installBundle(false);
    const promise = waitForBundle();
    fireReady(api);
    await expect(promise).resolves.toBe(api);
  });

  it('document üzerindeki olayla değil window olayıyla tetiklenir', async () => {
    const cb = jest.fn();
    const api = installBundle(false);
    onBundleReady(cb);
    document.dispatchEvent(new CustomEvent(VERIBENIM_READY_EVENT));
    expect(cb).not.toHaveBeenCalled();
    fireReady(api);
    expect(cb).toHaveBeenCalledWith(api);
  });

  it('zaman aşımında hata verir', async () => {
    jest.useFakeTimers();
    installBundle(false);
    const promise = waitForBundle({ timeout: 100 });
    jest.advanceTimersByTime(101);
    await expect(promise).rejects.toThrow('100 ms');
  });

  it('dinleyici kaldırılabilir', () => {
    const cb = jest.fn();
    const api = installBundle(false);
    const off = onBundleReady(cb);
    off();
    fireReady(api);
    expect(cb).not.toHaveBeenCalled();
  });
});

describe('renderBundleForm', () => {
  it('bundle hazır olunca renderForm(slug, hedef, {lang,onSuccess,onError}) çağırır', async () => {
    const api = installBundle(false);
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const el = document.createElement('div');

    const promise = renderBundleForm('iletisim', el, { lang: 'en', onSuccess, onError, timeout: 1000 });
    expect(api.renderForm).not.toHaveBeenCalled();
    fireReady(api);

    await expect(promise).resolves.toEqual({ slug: 'iletisim' });
    expect(api.renderForm).toHaveBeenCalledWith('iletisim', el, { lang: 'en', onSuccess, onError });
  });

  it('bundle gelmezse onError çağrılır ve reddedilir', async () => {
    jest.useFakeTimers();
    const onError = jest.fn();
    const promise = renderBundleForm('iletisim', '#x', { onError, timeout: 50 });
    jest.advanceTimersByTime(51);
    await expect(promise).rejects.toThrow();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('renderForm desteklemeyen eski bundle anlaşılır hata verir', async () => {
    window.veribenim = { ready: true } as unknown as VeribenimBundleApi;
    await expect(renderBundleForm('a', '#x')).rejects.toThrow('renderForm desteklemiyor');
  });

  it('Veribenim sınıfı üzerinden de çağrılabilir', async () => {
    const api = installBundle(true);
    const vb = new Veribenim({ token: 'tok' });
    await vb.renderBundleForm('kvkk', '#f');
    expect(api.renderForm).toHaveBeenCalledWith('kvkk', '#f', {});
  });
});

describe('adresler (On-Prem)', () => {
  it('varsayılanlar bugünkü adreslerdir', () => {
    expect(DEFAULT_ENDPOINTS).toEqual({
      apiUrl: 'https://live.veribenim.com',
      bundleBaseUrl: 'https://bundles.veribenim.com',
      webUrl: 'https://veribenim.com',
    });
    expect(new Veribenim({ token: 'tok' }).endpoints).toEqual(DEFAULT_ENDPOINTS);
  });

  it('kısmi geçersiz kılma; boş değer varsayılana düşer, sondaki / atılır', () => {
    expect(resolveEndpoints({ apiUrl: 'https://api.kurum.local/', webUrl: ' ' })).toEqual({
      apiUrl: 'https://api.kurum.local',
      bundleBaseUrl: 'https://bundles.veribenim.com',
      webUrl: 'https://veribenim.com',
    });
  });

  it('_apiUrl (eski) endpoints.apiUrl\'den önceliklidir', () => {
    const vb = new Veribenim({
      token: 'tok',
      _apiUrl: 'https://eski.local',
      endpoints: { apiUrl: 'https://yeni.local', bundleBaseUrl: 'https://cdn.kurum.local' },
    });
    expect(vb.endpoints.apiUrl).toBe('https://eski.local');
    expect(vb.endpoints.bundleBaseUrl).toBe('https://cdn.kurum.local');
  });

  it('loadScript On-Prem bundle tabanını kullanır', () => {
    const vb = new Veribenim({ token: 'tok', domain: 'www.claude.com', endpoints: { bundleBaseUrl: 'https://cdn.kurum.local/b/' } });
    void vb.loadScript().catch(() => undefined);
    const script = document.head.querySelector('script[data-veribenim="tok"]') as HTMLScriptElement;
    expect(script.src).toBe('https://cdn.kurum.local/b/claudecom.js');
    document.head.innerHTML = '';
  });
});
