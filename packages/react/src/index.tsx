export { VeribenimProvider } from './VeribenimProvider';
export type { VeribenimProviderProps } from './VeribenimProvider';
export { VeribenimContext } from './VeribenimContext';
export type { VeribenimContextValue } from './VeribenimContext';
export { ConsentBanner } from './ConsentBanner';
export type { ConsentBannerProps } from './ConsentBanner';
export {
  useVeribenim,
  useConsentCategory,
  useConsentPending,
  useVeribenimClient,
} from './hooks';

// Core re-exports (kullanıcı kolaylığı için)
export type {
  VeribenimConfig,
  ConsentPreferences,
  ConsentAction,
  PreferencesResponse,
} from '@veribenim/core';
