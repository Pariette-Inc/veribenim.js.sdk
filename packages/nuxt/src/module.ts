import { defineNuxtModule, addPlugin, createResolver, addImports, addComponent } from '@nuxt/kit';
import { DEFAULT_ENDPOINTS, type VeribenimConfig } from '@veribenim/core';

export interface ModuleOptions extends Omit<VeribenimConfig, 'token'> {
  /**
   * Environment token — Veribenim panelinden alınır.
   * Önerilen: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN ile set edin
   */
  token: string;
  /** Banner script'ini otomatik yükle. Varsayılan: true */
  autoLoad?: boolean;
  /**
   * API tabanı. Varsayılan: https://live.veribenim.com.
   * Kısayol: `endpoints.apiUrl` ile aynıdır (On-Prem için `endpoints` tercih edin).
   */
  apiUrl?: string;
}

/**
 * Veribenim Nuxt 3 Modülü
 *
 * @example nuxt.config.ts:
 * export default defineNuxtConfig({
 *   modules: ['@veribenim/nuxt'],
 *   veribenim: {
 *     token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
 *     lang: 'tr',
 *   }
 * });
 *
 * @example Composable (otomatik import):
 * const { preferences, accept, decline } = useVeribenim();
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@veribenim/nuxt',
    configKey: 'veribenim',
    compatibility: { nuxt: '^3.0.0' },
  },

  defaults: {
    token: '',
    domain: '',
    lang: 'tr',
    autoLoad: true,
    debug: false,
    apiUrl: DEFAULT_ENDPOINTS.apiUrl,
  },

  setup(options, nuxt) {
    if (!options.token) {
      console.warn('[Veribenim] token ayarlanmamış. nuxt.config.ts\'de veribenim.token\'ı belirtin.');
    }

    // Runtime config'e (TARAYICIYA AÇIK — buraya sır koymayın) yapılandırmayı ekle.
    // `endpoints` Veribenim çekirdeğinin okuduğu alandır; eskiden `apiUrl`
    // çekirdeğe hiç ulaşmıyordu (çekirdek `_apiUrl`/`endpoints` okur).
    nuxt.options.runtimeConfig.public.veribenim = {
      token: options.token,
      domain: options.domain,
      lang: options.lang,
      apiUrl: options.apiUrl,
      endpoints: {
        ...options.endpoints,
        apiUrl: options.endpoints?.apiUrl || options.apiUrl || DEFAULT_ENDPOINTS.apiUrl,
      },
      autoLoad: options.autoLoad,
      debug: options.debug,
    };

    const resolver = createResolver(import.meta.url);

    // Plugin ekle (client-side)
    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
      mode: 'client',
    });

    // Composable otomatik import
    addImports({
      name: 'useVeribenim',
      from: resolver.resolve('./runtime/composables'),
    });
    addImports({
      name: 'useVeribenimReady',
      from: resolver.resolve('./runtime/composables'),
    });

    // Bileşenleri otomatik kaydet: <ConsentBanner /> ve <VeribenimForm />
    addComponent({
      name: 'ConsentBanner',
      filePath: '@veribenim/vue',
      export: 'ConsentBanner',
    });
    addComponent({
      name: 'VeribenimForm',
      filePath: '@veribenim/vue',
      export: 'VeribenimForm',
    });
    // Formu sayfadaki bundle ile çizer (VeribenimReady'i bekler)
    addComponent({
      name: 'VeribenimBundleForm',
      filePath: '@veribenim/vue',
      export: 'VeribenimBundleForm',
    });
  },
});
