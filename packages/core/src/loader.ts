import type { VeribenimInternalConfig } from './types';

const DEFAULT_SCRIPT_URL = 'https://bundles.veribenim.com/bundle.js';

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

      const scriptUrl = this.config.scriptUrl || DEFAULT_SCRIPT_URL;
      const src = `${scriptUrl}?token=${this.config.token}&lang=${this.config.lang}`;

      // Zaten yüklenmiş mi kontrol et
      if (document.querySelector(`script[src="${src}"]`)) {
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
        if (this.config.debug) console.log('[Veribenim] Script yüklendi');
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

export { DEFAULT_SCRIPT_URL };
