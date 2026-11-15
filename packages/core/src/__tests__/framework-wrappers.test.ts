/**
 * React / Vue ince sarmalayıcıları: VeribenimBundleForm + useVeribenimReady.
 * (Bu paketlerin kendi jest kurulumu yok; çekirdek jest'i üzerinden.)
 */
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { createApp, h, nextTick } from 'vue';
import { VeribenimBundleForm as ReactBundleForm, useVeribenimReady as useReactReady } from '../../../react/src/VeribenimBundleForm';
import { VeribenimBundleForm as VueBundleForm } from '../../../vue/src/VeribenimBundleForm';
import { VERIBENIM_READY_EVENT, type VeribenimBundleApi } from '../bundle';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function installBundle(ready: boolean) {
  const api = { ready, renderForm: jest.fn().mockResolvedValue({}) };
  window.veribenim = api as unknown as VeribenimBundleApi;
  return api;
}

async function fireReady(api: { ready: boolean }) {
  api.ready = true;
  window.dispatchEvent(new CustomEvent(VERIBENIM_READY_EVENT));
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  delete window.veribenim;
  document.body.innerHTML = '';
});

describe('React VeribenimBundleForm', () => {
  it('bundle hazır olunca kendi kabına renderForm çağırır', async () => {
    const api = installBundle(false);
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);

    await act(async () => {
      root.render(React.createElement(ReactBundleForm, { slug: 'iletisim', lang: 'tr', fallback: 'Yükleniyor' }));
    });
    expect(host.textContent).toContain('Yükleniyor');
    expect(api.renderForm).not.toHaveBeenCalled();

    await act(async () => {
      await fireReady(api);
    });

    expect(api.renderForm).toHaveBeenCalledTimes(1);
    const [slug, target, opts] = api.renderForm.mock.calls[0];
    expect(slug).toBe('iletisim');
    expect(target).toBeInstanceOf(HTMLElement);
    expect(host.contains(target)).toBe(true);
    expect(opts.lang).toBe('tr');
    expect(host.textContent).not.toContain('Yükleniyor');

    await act(async () => root.unmount());
  });

  it('useVeribenimReady olayla true olur', async () => {
    const api = installBundle(false);
    const seen: boolean[] = [];
    function Probe() {
      seen.push(useReactReady());
      return null;
    }
    const root = createRoot(document.createElement('div'));
    await act(async () => root.render(React.createElement(Probe)));
    await act(async () => {
      await fireReady(api);
    });
    expect(seen[0]).toBe(false);
    expect(seen[seen.length - 1]).toBe(true);
    await act(async () => root.unmount());
  });
});

describe('Vue VeribenimBundleForm', () => {
  it('bundle hazırsa mount sırasında renderForm çağırır ve success yayar', async () => {
    const api = installBundle(true);
    api.renderForm.mockImplementation((_s: string, _t: Element, o: any) => {
      o.onSuccess({ success: true });
      return Promise.resolve({});
    });
    const onSuccess = jest.fn();
    const host = document.createElement('div');
    document.body.appendChild(host);

    const app = createApp({ render: () => h(VueBundleForm, { slug: 'kvkk', lang: 'en', onSuccess }) });
    app.mount(host);
    await nextTick();
    await Promise.resolve();
    await Promise.resolve();

    expect(api.renderForm).toHaveBeenCalledTimes(1);
    const [slug, target, opts] = api.renderForm.mock.calls[0];
    expect(slug).toBe('kvkk');
    expect(host.contains(target)).toBe(true);
    expect(opts.lang).toBe('en');
    expect(onSuccess).toHaveBeenCalledWith({ success: true });
    app.unmount();
  });
});
