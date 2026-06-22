import { inject, type InjectionKey, type Ref } from 'vue';
import type { Veribenim, ConsentPreferences } from '@veribenim/core';

/** VeribenimPlugin tarafından sağlanan paylaşılan state. */
export interface VeribenimVueState {
  client: Veribenim;
  preferences: Readonly<Ref<ConsentPreferences | null>>;
  isLoaded: Readonly<Ref<boolean>>;
  readonly isConsented: boolean;
  accept: (prefs?: Partial<ConsentPreferences>) => Promise<void>;
  decline: () => Promise<void>;
  savePreferences: (prefs: ConsentPreferences) => Promise<void>;
}

export const VERIBENIM_KEY: InjectionKey<VeribenimVueState> = Symbol('veribenim');

/**
 * Vue Composable — VeribenimPlugin state'ine erişim.
 */
export function useVeribenim(): VeribenimVueState {
  const state = inject(VERIBENIM_KEY);
  if (!state) {
    throw new Error(
      '[Veribenim] useVeribenim() çağrısı VeribenimPlugin kurulmadan yapıldı'
    );
  }
  return state;
}
