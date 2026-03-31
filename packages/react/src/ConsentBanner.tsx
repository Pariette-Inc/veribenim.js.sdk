import type { ReactNode } from 'react';
import { useVeribenim } from './hooks';
import type { ConsentPreferences } from '@veribenim/core';

export interface ConsentBannerProps {
  /** Banner henüz onay verilmemişken render edilsin mi? */
  showWhenPending?: boolean;
  /** Özel render fonksiyonu */
  children?: (props: {
    preferences: ConsentPreferences | null;
    isConsented: boolean;
    accept: () => Promise<void>;
    decline: () => Promise<void>;
    savePreferences: (prefs: ConsentPreferences) => Promise<void>;
  }) => ReactNode;
  /** Hazır banner mı kullanılacak? */
  className?: string;
}

/**
 * Basit headless banner bileşeni
 * Kendi UI'ınızı children render prop ile sağlayın.
 *
 * @example
 * <ConsentBanner>
 *   {({ accept, decline }) => (
 *     <div>
 *       <button onClick={accept}>Kabul Et</button>
 *       <button onClick={decline}>Reddet</button>
 *     </div>
 *   )}
 * </ConsentBanner>
 */
export function ConsentBanner({ children, showWhenPending = true }: ConsentBannerProps) {
  const { preferences, isConsented, accept, decline, savePreferences } = useVeribenim();

  if (isConsented && showWhenPending) return null;

  if (children) {
    return (
      <>
        {children({ preferences, isConsented, accept, decline, savePreferences })}
      </>
    );
  }

  // Varsayılan minimal banner (styling yok — kendi CSS'inizi uygulayın)
  return (
    <div
      role="dialog"
      aria-label="Çerez izni"
      data-veribenim-banner
    >
      <p>Bu site çerezler kullanmaktadır. Deneyiminizi iyileştirmek için onayınıza ihtiyacımız var.</p>
      <button onClick={() => accept()}>Tümünü Kabul Et</button>
      <button onClick={decline}>Yalnızca Zorunlular</button>
    </div>
  );
}
