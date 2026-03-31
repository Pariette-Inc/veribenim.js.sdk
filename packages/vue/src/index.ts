import { ref, readonly, type App } from 'vue';
import { Veribenim, type VeribenimConfig, type ConsentPreferences } from '@veribenim/core';

export type { VeribenimConfig, ConsentPreferences } from '@veribenim/core';

const INJECTION_KEY = Symbol('veribenim');

export interface VeribenimPluginState {
  preferences: ConsentPreferences | null;
  isConsented: boolean;
  isLoaded: boolean;
}

/**
 * Veribenim Vue 3 Plugin
 *
 * @example main.ts:
 * import { createApp } from 'vue';
 * import { VeribenimPlugin } from '@veribenim/vue';
 *
 * const app = createApp(App);
 * app.use(VeribenimPlugin, { token: 'ENV_TOKEN' });
 * app.mount('#app');
 *
 * @example Composable:
 * import { useVeribenim } from '@veribenim/vue';
 * const { preferences, accept, decline } = useVeribenim();
 */
export const VeribenimPlugin = {
  install(app: App, config: VeribenimConfig) {
    const preferences = ref<ConsentPreferences | null>(null);
    const isLoaded = ref(false);

    const client = new Veribenim(config, {
      onLoad: () => { isLoaded.value = true; },
      onAccept: (prefs) => { preferences.value = prefs; },
      onDecline: (prefs) => { preferences.value = prefs; },
      onChange: (prefs) => { preferences.value = prefs; },
    });

    // Mevcut tercihleri yükle
    client.getPreferences().then((res) => {
      if (res) preferences.value = res.preferences;
    });

    const state = {
      client,
      preferences: readonly(preferences),
      isLoaded: readonly(isLoaded),
      get isConsented() { return preferences.value !== null; },

      async accept(prefs?: Partial<ConsentPreferences>) {
        const fullPrefs: ConsentPreferences = {
          necessary: true,
          analytics: true,
          marketing: true,
          preferences: true,
          ...prefs,
        };
        const res = await client.savePreferences(fullPrefs);
        if (res) {
          preferences.value = res.preferences;
          await client.logConsent({ action: 'accept_all', preferences: fullPrefs });
        }
      },

      async decline() {
        const declined: ConsentPreferences = {
          necessary: true,
          analytics: false,
          marketing: false,
          preferences: false,
        };
        const res = await client.savePreferences(declined);
        if (res) {
          preferences.value = res.preferences;
          await client.logConsent({ action: 'reject_all', preferences: declined });
        }
      },

      async savePreferences(prefs: ConsentPreferences) {
        const res = await client.savePreferences(prefs);
        if (res) {
          preferences.value = res.preferences;
          await client.logConsent({ action: 'save_preferences', preferences: prefs });
        }
      },
    };

    app.provide(INJECTION_KEY, state);
    app.config.globalProperties.$veribenim = state;
  },
};

/**
 * Vue Composable
 */
export function useVeribenim() {
  const { inject } = require('vue');
  const state = inject(INJECTION_KEY);
  if (!state) {
    throw new Error('[Veribenim] useVeribenim() çağrısı VeribenimPlugin kurulmadan yapıldı');
  }
  return state;
}
