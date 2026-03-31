/**
 * Veribenim SDK tip tanımlamaları
 * Token = Environment token (32 karakter, her site için unique)
 */

export type ConsentAction =
  | 'accept_all'
  | 'reject_all'
  | 'save_preferences'
  | 'ping'
  | 'visit'
  | 'exit';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface VeribenimConfig {
  /**
   * Environment token — Veribenim panelinden alınır.
   * Panelde: Siteniz → Entegrasyon → Token
   */
  token: string;
  /** Banner dili. Varsayılan: 'tr' */
  lang?: 'tr' | 'en';
  /** Debug modu. Varsayılan: false */
  debug?: boolean;
  /**
   * @internal — Yalnızca ileri düzey kullanım.
   * SDK normalde yalnızca API işlemleri için kullanılır;
   * banner script'i doğrudan <script> tag ile eklenir.
   */
  _scriptUrl?: string;
  /** @internal */
  _apiUrl?: string;
}

export interface VeribenimInternalConfig {
  token: string;
  apiUrl: string;
  lang: 'tr' | 'en';
  debug: boolean;
}

export interface ImpressionPayload {
  url: string;
  referrer?: string;
  user_agent?: string;
}

export interface ConsentLogPayload {
  action: ConsentAction;
  preferences?: ConsentPreferences;
  session_id?: string;
  url?: string;
}

export interface PreferencesResponse {
  session_id: string;
  preferences: ConsentPreferences;
  created_at: string;
  updated_at: string;
}

export type ConsentCallback = (preferences: ConsentPreferences) => void;

export interface VeribenimEvents {
  onAccept?: ConsentCallback;
  onDecline?: ConsentCallback;
  onChange?: ConsentCallback;
}

// -------------------------------------------------------------------------
// Form Rızası
// -------------------------------------------------------------------------

export interface FormConsentPayload {
  /** Formun adı / tipi (örn: "contact", "newsletter", "register") */
  form_name: string;
  /** Kullanıcının onay verip vermediği */
  consented: boolean;
  /** Onay metni — kullanıcının gördüğü ifade */
  consent_text?: string;
  /** İsteğe bağlı ek veri — şema zorunluluğu yok */
  metadata?: Record<string, unknown>;
}

export interface FormConsentResponse {
  id: string;
  form_name: string;
  consented: boolean;
  ip_address: string;
  created_at: string;
}

// -------------------------------------------------------------------------
// DSAR (Veri Sahibi Başvurusu)
// -------------------------------------------------------------------------

export type DsarRequestType =
  | 'access'          // Verilerime erişim
  | 'rectification'   // Düzeltme
  | 'erasure'         // Silme (unutulma hakkı)
  | 'restriction'     // İşleme kısıtlama
  | 'portability'     // Taşınabilirlik
  | 'objection'       // İtiraz
  | 'automated';      // Otomatik karar itirazı

export interface DsarPayload {
  request_type: DsarRequestType;
  /** Başvuranın adı soyadı */
  full_name: string;
  /** İletişim e-posta adresi */
  email: string;
  /** Başvuru açıklaması (opsiyonel) */
  description?: string;
  /** İsteğe bağlı ek belge URL'i */
  attachment_url?: string;
}

export interface DsarResponse {
  id: string;
  request_type: DsarRequestType;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'cancelled';
  deadline: string; // ISO8601 — 30 günlük yasal süre
  created_at: string;
}
