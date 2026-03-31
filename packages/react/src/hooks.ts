import { useVeribenimContext } from './VeribenimContext';
import type { ConsentPreferences } from '@veribenim/core';

/**
 * Ana Veribenim hook'u — tüm state ve aksiyonlara erişim
 *
 * @example
 * const { preferences, accept, decline } = useVeribenim();
 */
export function useVeribenim() {
  return useVeribenimContext();
}

/**
 * Belirli bir çerez kategorisinin durumunu döner
 *
 * @example
 * const analyticsAllowed = useConsentCategory('analytics');
 */
export function useConsentCategory(category: keyof ConsentPreferences): boolean {
  const { preferences } = useVeribenimContext();
  if (!preferences) return false;
  return preferences[category] ?? false;
}

/**
 * Kullanıcı henüz karar vermedi mi?
 */
export function useConsentPending(): boolean {
  const { isConsented } = useVeribenimContext();
  return !isConsented;
}

/**
 * Doğrudan API client'a erişim (gelişmiş kullanım)
 */
export function useVeribenimClient() {
  return useVeribenimContext().client;
}
