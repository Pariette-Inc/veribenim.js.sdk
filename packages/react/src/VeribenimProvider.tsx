import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { Veribenim, type VeribenimConfig, type ConsentPreferences } from '@veribenim/core';
import { VeribenimContext, type VeribenimContextValue } from './VeribenimContext';

const ALL_ACCEPTED: ConsentPreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
  preferences: true,
};

const ALL_DECLINED: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

export interface VeribenimProviderProps {
  config: VeribenimConfig;
  children: ReactNode;
}

/**
 * Veribenim Provider — uygulamanın kökünde kullanılır
 *
 * @example
 * <VeribenimProvider config={{ token: 'ENV_TOKEN' }}>
 *   <App />
 * </VeribenimProvider>
 */
export function VeribenimProvider({ config, children }: VeribenimProviderProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const client = useMemo(() => {
    return new Veribenim(config, {
      onAccept: (prefs) => setPreferences(prefs),
      onDecline: (prefs) => setPreferences(prefs),
      onChange: (prefs) => setPreferences(prefs),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.token]);

  // Bundle script'i otomatik yükle (domain veya _scriptUrl varsa)
  useEffect(() => {
    client.loadScript().catch(() => {
      // domain veya scriptUrl yoksa sessizce geç
    });
  }, [client]);

  useEffect(() => {
    // Mevcut tercihleri yükle
    client.getPreferences().then((res) => {
      if (res) setPreferences(res.preferences);
      setIsLoaded(true);
    });
  }, [client]);

  const accept = useCallback(
    async (prefs?: Partial<ConsentPreferences>) => {
      const fullPrefs = { ...ALL_ACCEPTED, ...prefs };
      const res = await client.savePreferences(fullPrefs);
      if (res) {
        setPreferences(res.preferences);
        await client.logConsent({ action: 'accept_all', preferences: fullPrefs });
      }
    },
    [client]
  );

  const decline = useCallback(async () => {
    const res = await client.savePreferences(ALL_DECLINED);
    if (res) {
      setPreferences(res.preferences);
      await client.logConsent({ action: 'reject_all', preferences: ALL_DECLINED });
    }
  }, [client]);

  const savePreferences = useCallback(
    async (prefs: ConsentPreferences) => {
      const res = await client.savePreferences(prefs);
      if (res) {
        setPreferences(res.preferences);
        await client.logConsent({ action: 'save_preferences', preferences: prefs });
      }
    },
    [client]
  );

  const isConsented = preferences !== null;

  const value: VeribenimContextValue = {
    client,
    preferences,
    isLoaded,
    isConsented,
    accept,
    decline,
    savePreferences,
  };

  return <VeribenimContext.Provider value={value}>{children}</VeribenimContext.Provider>;
}
