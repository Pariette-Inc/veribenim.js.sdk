/**
 * IAB TCF 2.2 köprüsü.
 *
 * Bundle, TCF açık sitelerde standart `window.__tcfapi` arayüzünü kurar.
 * Bu modül onu Promise'e çevirir — reklam entegrasyonu yazan geliştiricinin
 * callback + "CMP daha yüklenmedi" durumunu her seferinde elle çözmesi
 * gerekmesin diye.
 *
 * ÖNEMLİ: TCF katmanı yalnızca (a) sitede TCF açıksa ve (b) platformda kayıtlı
 * bir IAB CMP kimliği varsa yüklenir. KVKK-only bir sitede `__tcfapi` HİÇ
 * tanımlı olmaz ve buradaki çağrılar `null` döner — bu bir hata değildir.
 */

/** TCF spec'indeki eventStatus değerleri. */
export type TcfEventStatus = 'tcloaded' | 'cmpuishown' | 'useractioncomplete';

export interface TcfPingReturn {
  gdprApplies: boolean;
  cmpLoaded: boolean;
  cmpStatus: 'stub' | 'loading' | 'loaded' | 'error';
  displayStatus: 'visible' | 'hidden' | 'disabled';
  apiVersion: string;
  cmpId: number;
  cmpVersion: number;
  gvlVersion: number;
  tcfPolicyVersion: number;
}

export interface TcfData {
  /** Kodlanmış TC String. IAB kütüphaneleriyle çözülebilir. */
  tcString: string;
  /** Google Additional Consent string'i (varsa). */
  addtlConsent?: string;
  eventStatus: TcfEventStatus;
  cmpStatus: string;
  gdprApplies: boolean;
  cmpId: number;
  cmpVersion: number;
  tcfPolicyVersion: number;
  purpose: { consents: Record<number, boolean>; legitimateInterests: Record<number, boolean> };
  vendor: { consents: Record<number, boolean>; legitimateInterests: Record<number, boolean> };
  listenerId?: number;
  [key: string]: unknown;
}

type TcfApi = (
  command: string,
  version: number,
  callback: (returnValue: unknown, success: boolean) => void,
  parameter?: unknown
) => void;

declare global {
  interface Window {
    __tcfapi?: TcfApi;
  }
}

/** Sayfada TCF arayüzü var mı? */
export function isTcfAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.__tcfapi === 'function';
}

function call<T>(command: string, parameter?: unknown): Promise<T | null> {
  return new Promise((resolve) => {
    if (!isTcfAvailable()) {
      resolve(null);
      return;
    }
    try {
      window.__tcfapi!(command, 2, (value, success) => {
        resolve(success ? (value as T) : null);
      }, parameter);
    } catch {
      resolve(null);
    }
  });
}

/** CMP durumu. TCF yoksa null. */
export function ping(): Promise<TcfPingReturn | null> {
  return call<TcfPingReturn>('ping');
}

/**
 * Güncel TCData. Ziyaretçi HENÜZ KARAR VERMEDİYSE `null` döner — boş bir
 * TC String'i "rıza yok" diye yorumlamak yerine kararı beklemek doğrudur.
 */
export function getTCData(): Promise<TcfData | null> {
  return call<TcfData>('getTCData');
}

/**
 * Rıza değişikliklerini dinle. Dönen fonksiyon dinleyiciyi kaldırır.
 * TCF yoksa no-op bir kaldırıcı döner.
 */
export function onTcfChange(handler: (data: TcfData) => void): () => void {
  if (!isTcfAvailable()) return () => {};

  let listenerId: number | undefined;
  try {
    window.__tcfapi!('addEventListener', 2, (value, success) => {
      if (!success || !value) return;
      const data = value as TcfData;
      if (typeof data.listenerId === 'number') listenerId = data.listenerId;
      handler(data);
    });
  } catch {
    return () => {};
  }

  return () => {
    if (listenerId === undefined) return;
    try {
      window.__tcfapi!('removeEventListener', 2, () => {}, listenerId);
    } catch {
      /* CMP kaldırıldıysa yapacak bir şey yok */
    }
  };
}

/**
 * Ziyaretçi karar verene kadar bekler (eventStatus `useractioncomplete`).
 * Zaten karar verilmişse hemen döner. `timeoutMs` dolarsa null.
 */
export function waitForTcfDecision(timeoutMs = 10000): Promise<TcfData | null> {
  return new Promise((resolve) => {
    if (!isTcfAvailable()) {
      resolve(null);
      return;
    }

    let done = false;
    // `remove` önce tanımlanıyor: CMP, addEventListener callback'ini SENKRON
    // çağırıyor (ziyaretçi zaten karar vermişse ilk çağrıda döner). const ile
    // bırakılsaydı o senkron yolda TDZ hatası alınırdı.
    let remove: () => void = () => {};
    const finish = (data: TcfData | null) => {
      if (done) return;
      done = true;
      remove();
      clearTimeout(timer);
      resolve(data);
    };

    const timer = setTimeout(() => finish(null), timeoutMs);
    remove = onTcfChange((data) => {
      if (data.eventStatus === 'useractioncomplete' || data.eventStatus === 'tcloaded') {
        if (data.tcString) finish(data);
      }
    });
    // Senkron yolda finish zaten çalıştıysa dinleyici o an henüz atanmamıştı.
    if (done) remove();
  });
}
