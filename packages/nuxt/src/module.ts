import { defineNuxtModule, addPlugin, createResolver, addImports } from '@nuxt/kit';
import type { VeribenimConfig } from '@veribenim/core';

export interface ModuleOptions extends Omit<VeribenimConfig, 'token'> {
  /**
   * Environment token — Veribenim panelinden alınır.
   * Önerilen: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN ile set edin
   */
  token: string;
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
    lang: 'tr',
    autoLoad: true,
    debug: false,
    apiUrl: 'https://api.veribenim.com',
    scriptUrl: 'https://bundles.veribenim.com/bundle.js',
  },

  setup(options, nuxt) {
    if (!options.token) {
      console.warn('[Veribenim] token ayarlanmamış. nuxt.config.ts\'de veribenim.token\'ı belirtin.');
    }

    // Runtime config'e token'ı ekle
    nuxt.options.runtimeConfig.public.veribenim = {
      token: options.token,
      lang: options.lang,
      apiUrl: options.apiUrl,
      scriptUrl: options.scriptUrl,
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
  },
});
