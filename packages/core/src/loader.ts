import type { VeribenimInternalConfig } from './types';

const DEFAULT_BUNDLE_BASE = 'https://bundles.veribenim.com';

/**
 * Domain'den bundle dosya adını türetir.
 * Backend'deki CookieBundleService::cleanDomainForFilename() ile aynı mantık.
 * Örn: 'https://www.claude.com' → 'claudecom'
 */
export function cleanDomainForFilename(url: string): string {
  let domain = url.replace(/^https?:\/\//, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return domain || 'bundle';
}

/**
 * Domain'den tam bundle script URL'ini oluşturur.
 * Örn: 'claude.com' → 'https://bundles.veribenim.com/claudecom.js'
 */
export function getBundleUrl(domain: string, baseUrl?: string): string {
  const base = (baseUrl || DEFAULT_BUNDLE_BASE).replace(/\/$/, '');
  const filename = cleanDomainForFilename(domain);
  return `${base}/${filename}.js`;
}

export class ScriptLoader {
  private loaded = false;
  private loading: Promise<void> | null = null;

  constructor(private readonly config: VeribenimInternalConfig) {}

  load(): Promise<void> {
    if (this.loaded) return Promise.resolve();
    if (this.loading) return this.loading;

    this.loading = new Promise<void>((resolve, reject) => {
      if (typeof document === 'undefined') {
        // SSR ortamında script yüklenmez
        resolve();
        return;
      }

      // Script URL belirleme sırası:
      // 1. Explicit scriptUrl (override)
      // 2. Domain'den türetilen URL
      // 3. Hata — domain veya scriptUrl gerekli
      let src: string;

      if (this.config.scriptUrl) {
        src = this.config.scriptUrl;
      } else if (this.config.domain) {
        src = getBundleUrl(this.config.domain);
      } else {
        reject(new Error('[Veribenim] Script yüklemek için domain veya _scriptUrl gerekli'));
        return;
      }

      // Zaten yüklenmiş mi kontrol et
      const cleanFilename = this.config.domain ? cleanDomainForFilename(this.config.domain) : '';
      const existingScript = document.querySelector(
        `script[data-veribenim="${this.config.token}"], script[src*="${cleanFilename}.js"]`
      );
      if (existingScript) {
        this.loaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-veribenim', this.config.token);

      script.onload = () => {
        this.loaded = true;
        if (this.config.debug) console.log('[Veribenim] Script yüklendi:', src);
        resolve();
      };

      script.onerror = () => {
        this.loading = null;
        reject(new Error('[Veribenim] Script yüklenemedi: ' + src));
      };

      document.head.appendChild(script);
    });

    return this.loading;
  }

  get isLoaded(): boolean {
    return this.loaded;
  }
}

export { DEFAULT_BUNDLE_BASE };
