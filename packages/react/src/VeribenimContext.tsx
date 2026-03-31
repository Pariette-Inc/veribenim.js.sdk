import { createContext, useContext } from 'react';
import type { Veribenim, ConsentPreferences } from '@veribenim/core';

export interface VeribenimContextValue {
  client: Veribenim;
  preferences: ConsentPreferences | null;
  isLoaded: boolean;
  isConsented: boolean;
  accept: (prefs?: Partial<ConsentPreferences>) => Promise<void>;
  decline: () => Promise<void>;
  savePreferences: (prefs: ConsentPreferences) => Promise<void>;
}

export const VeribenimContext = createContext<VeribenimContextValue | null>(null);

export function useVeribenimContext(): VeribenimContextValue {
  const ctx = useContext(VeribenimContext);
  if (!ctx) {
    throw new Error('[Veribenim] useVeribenim hook\'u <VeribenimProvider> içinde kullanılmalıdır');
  }
  return ctx;
}
