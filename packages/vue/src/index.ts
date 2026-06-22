import { ref, readonly, type App, type Ref } from 'vue';
import {
  Veribenim,
  type VeribenimConfig,
  type ConsentPreferences,
} from '@veribenim/core';
import {
  VERIBENIM_KEY,
  useVeribenim,
  type VeribenimVueState,
} from './context';

export type { VeribenimConfig, ConsentPreferences } from '@veribenim/core';
export { useVeribenim } from './context';
export type { VeribenimVueState } from './context';
export { ConsentBanner } from './ConsentBanner';
export { VeribenimForm } from './VeribenimForm';

/** Geriye dönük uyumluluk için takma ad. */
export type VeribenimPluginState = VeribenimVueState;

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
      onAccept: (prefs) => {
        preferences.value = prefs;
      },
      onDecline: (prefs) => {
        preferences.value = prefs;
      },
      onChange: (prefs) => {
        preferences.value = prefs;
      },
    });

    // Mevcut tercihleri yükle
    client.getPreferences().then((res) => {
      if (res) preferences.value = res.current_consents;
      isLoaded.value = true;
    });

    const state: VeribenimVueState = {
      client,
      preferences: readonly(preferences) as Readonly<
        Ref<ConsentPreferences | null>
      >,
      isLoaded: readonly(isLoaded) as Readonly<Ref<boolean>>,
      get isConsented() {
        return preferences.value !== null;
      },

      async accept(prefs?: Partial<ConsentPreferences>) {
        const fullPrefs: ConsentPreferences = {
          strictly_necessary: true,
          functional: true,
          analytics: true,
          marketing: true,
          ...prefs,
        };
        const res = await client.savePreferences(fullPrefs);
        if (res) {
          preferences.value = fullPrefs;
          await client.logConsent({ action: 'accept_all', consents: fullPrefs });
        }
      },

      async decline() {
        const declined: ConsentPreferences = {
          strictly_necessary: true,
          functional: false,
          analytics: false,
          marketing: false,
        };
        const res = await client.savePreferences(declined);
        if (res) {
          preferences.value = declined;
          await client.logConsent({ action: 'reject_all', consents: declined });
        }
      },

      async savePreferences(prefs: ConsentPreferences) {
        const res = await client.savePreferences(prefs);
        if (res) {
          preferences.value = prefs;
          await client.logConsent({ action: 'save_preferences', consents: prefs });
        }
      },
    };

    app.provide(VERIBENIM_KEY, state);
    app.config.globalProperties.$veribenim = state;
  },
};
