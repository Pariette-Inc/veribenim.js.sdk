/**
 * ScriptLoader ve domain yardımcıları testleri.
 */
import {
  ScriptLoader,
  cleanDomainForFilename,
  getBundleUrl,
  DEFAULT_BUNDLE_BASE,
} from '../loader';
import type { VeribenimInternalConfig } from '../types';

const baseConfig: VeribenimInternalConfig = {
  token: 'tok-123',
  apiUrl: 'https://live.veribenim.com',
  lang: 'tr',
  debug: false,
};

describe('cleanDomainForFilename', () => {
  it('protokol, www ve özel karakterleri temizler', () => {
    expect(cleanDomainForFilename('https://www.claude.com')).toBe('claudecom');
    expect(cleanDomainForFilename('http://Example.Com/path')).toBe('examplecompath');
    expect(cleanDomainForFilename('sub.domain-name.com.tr')).toBe('subdomainnamecomtr');
  });

  it('boş sonuçta "bundle" fallback döner', () => {
    expect(cleanDomainForFilename('')).toBe('bundle');
  });
});

describe('getBundleUrl', () => {
  it('varsayılan base ile bundle URL üretir', () => {
    expect(getBundleUrl('claude.com')).toBe(`${DEFAULT_BUNDLE_BASE}/claudecom.js`);
  });

  it('özel base URL sonundaki slash temizlenir', () => {
    expect(getBundleUrl('example.com', 'https://cdn.test.com/')).toBe(
      'https://cdn.test.com/examplecom.js'
    );
  });
});

describe('ScriptLoader', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('domain veya scriptUrl yoksa reject eder', async () => {
    const loader = new ScriptLoader({ ...baseConfig });

    await expect(loader.load()).rejects.toThrow(
      '[Veribenim] Script yüklemek için domain veya _scriptUrl gerekli'
    );
  });

  it('script elementini data-veribenim attribute\'u ile head\'e ekler', async () => {
    const loader = new ScriptLoader({ ...baseConfig, domain: 'example.com' });

    const promise = loader.load();
    const script = document.head.querySelector(
      'script[data-veribenim="tok-123"]'
    ) as HTMLScriptElement;

    expect(script).not.toBeNull();
    expect(script.src).toBe(`${DEFAULT_BUNDLE_BASE}/examplecom.js`);
    expect(script.async).toBe(true);

    script.onload?.(new Event('load'));
    await promise;
    expect(loader.isLoaded).toBe(true);
  });

  it('scriptUrl override domain\'den türetilen URL\'e göre önceliklidir', async () => {
    const loader = new ScriptLoader({
      ...baseConfig,
      domain: 'example.com',
      scriptUrl: 'https://cdn.custom.com/custom.js',
    });

    const promise = loader.load();
    const script = document.head.querySelector(
      'script[data-veribenim="tok-123"]'
    ) as HTMLScriptElement;

    expect(script.src).toBe('https://cdn.custom.com/custom.js');
    script.onload?.(new Event('load'));
    await promise;
  });

  it('script zaten sayfadaysa yenisini eklemez', async () => {
    const existing = document.createElement('script');
    existing.setAttribute('data-veribenim', 'tok-123');
    document.head.appendChild(existing);

    const loader = new ScriptLoader({ ...baseConfig, domain: 'example.com' });
    await loader.load();

    expect(document.head.querySelectorAll('script')).toHaveLength(1);
    expect(loader.isLoaded).toBe(true);
  });

  it('aynı anda birden fazla load çağrısı tek promise paylaşır', () => {
    const loader = new ScriptLoader({ ...baseConfig, domain: 'example.com' });

    const p1 = loader.load();
    const p2 = loader.load();

    expect(p1).toBe(p2);
    expect(document.head.querySelectorAll('script')).toHaveLength(1);

    const script = document.head.querySelector('script') as HTMLScriptElement;
    script.onload?.(new Event('load'));
  });

  it('script yüklenemezse reject eder', async () => {
    const loader = new ScriptLoader({ ...baseConfig, domain: 'example.com' });

    const promise = loader.load();
    const script = document.head.querySelector('script') as HTMLScriptElement;
    script.onerror?.(new Event('error'));

    await expect(promise).rejects.toThrow('[Veribenim] Script yüklenemedi');
  });
});
