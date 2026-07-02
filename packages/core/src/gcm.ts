/**
 * Google Consent Mode v2 köprüsü.
 *
 * Veribenim rıza tercihlerini (ConsentPreferences) Google Consent Mode v2
 * sinyallerine çevirir. gtag tanımlı değilse window.dataLayer üzerinden
 * klasik gtag shim'i ile çalışır; ikisi de yoksa sessizce no-op olur.
 *
 * Kategori eşleşmesi:
 * - marketing            → ad_storage, ad_user_data, ad_personalization
 * - analytics            → analytics_storage
 * - functional           → functionality_storage
 * - (her zaman granted)  → security_storage
 */

import type { ConsentPreferences, GcmConsentState } from './types';

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

/**
 * Consent Mode v2 varsayılan durumu — banner gösterilmeden ÖNCE gönderilir.
 * Tüm sinyaller "denied" başlar (security_storage hariç); wait_for_update
 * ile Google tag'leri 500ms boyunca rıza güncellemesini bekler.
 */
export const GCM_DEFAULT_STATE: GcmConsentState & { wait_for_update: number } = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500,
};

/**
 * Kullanılabilir gtag fonksiyonunu döner.
 * 1. window.gtag tanımlıysa onu kullan
 * 2. Değilse ama window.dataLayer varsa klasik gtag shim'i oluştur
 * 3. İkisi de yoksa null (no-op)
 */
function resolveGtag(): GtagFn | null {
  if (typeof window === 'undefined') return null;

  if (typeof window.gtag === 'function') return window.gtag;

  if (Array.isArray(window.dataLayer)) {
    // Klasik gtag shim'i: gtag() argümanlarını olduğu gibi dataLayer'a iter.
    // (Google tag'leri arguments objesini bekler — array'e çevrilmez.)
    return function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }

  return null;
}

/**
 * Veribenim tercihlerini Consent Mode v2 sinyal haritasına çevirir.
 */
export function mapPreferencesToGcm(prefs: ConsentPreferences): GcmConsentState {
  const grant = (v: boolean): 'granted' | 'denied' => (v ? 'granted' : 'denied');

  return {
    ad_storage: grant(prefs.marketing),
    ad_user_data: grant(prefs.marketing),
    ad_personalization: grant(prefs.marketing),
    analytics_storage: grant(prefs.analytics),
    functionality_storage: grant(prefs.functional),
    security_storage: 'granted',
  };
}

/**
 * Consent Mode v2 varsayılanlarını gönderir.
 * Banner gösterilmeden / kullanıcı karar vermeden önce çağrılmalıdır.
 * gtag ve dataLayer yoksa sessizce no-op.
 */
export function setGcmDefaults(): void {
  const gtag = resolveGtag();
  if (!gtag) return;
  gtag('consent', 'default', { ...GCM_DEFAULT_STATE });
}

/**
 * Kullanıcının rıza tercihlerini Consent Mode v2 update sinyali olarak gönderir.
 * accept-all / reject-all / tercih kaydetme sonrasında çağrılır.
 * gtag ve dataLayer yoksa sessizce no-op.
 */
export function emitGcmSignals(prefs: ConsentPreferences): void {
  const gtag = resolveGtag();
  if (!gtag) return;
  gtag('consent', 'update', mapPreferencesToGcm(prefs));
}
