/**
 * Veribenim SDK tip tanımlamaları
 * Token = Environment token (32 karakter, her site için unique)
 */

export type ConsentAction =
  | 'accept_all'
  | 'reject_all'
  | 'save_preferences'
  | 'withdraw'
  | 'ping'
  | 'visit'
  | 'exit';

/**
 * Çerez rıza durumu — platformun otoritatif kategori anahtarları.
 * (KAYNAK: veribenim.api PreferenceCenterController + CookieProviderSeeder)
 */
export interface ConsentPreferences {
  strictly_necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface VeribenimConfig {
  /**
   * Environment token — Veribenim panelinden alınır.
   * Panelde: Siteniz → Entegrasyon → Token
   */
  token: string;
  /**
   * Site domain'i — Bundle script URL'ini oluşturmak için kullanılır.
   * Örn: 'claude.com', 'https://www.example.com'
   * Belirtilirse script URL: https://bundles.veribenim.com/{cleanDomain}.js
   */
  domain?: string;
  /** Banner dili. Varsayılan: 'tr' */
  lang?: 'tr' | 'en';
  /** Debug modu. Varsayılan: false */
  debug?: boolean;
  /**
   * @internal — Yalnızca ileri düzey kullanım.
   * Tam script URL'i. domain yerine bunu kullanarak override edebilirsiniz.
   */
  _scriptUrl?: string;
  /** @internal */
  _apiUrl?: string;
}

export interface VeribenimInternalConfig {
  token: string;
  domain?: string;
  apiUrl: string;
  lang: 'tr' | 'en';
  debug: boolean;
  scriptUrl?: string;
}

export interface ImpressionPayload {
  url: string;
  referrer?: string;
  user_agent?: string;
}

export interface ConsentLogPayload {
  action: ConsentAction;
  /** Kategori bazlı rıza. Platform `consents` alanını bekler. */
  consents?: ConsentPreferences;
  session_id?: string;
  url?: string;
}

/** GET /api/preferences/{token} içindeki kategori tanımı. */
export interface ConsentCategoryCookie {
  id: number;
  name: string;
  description?: string;
  mandatory?: boolean;
  is_enabled_by_default?: boolean;
}

export interface ConsentCategoryInfo {
  id: 'strictly_necessary' | 'functional' | 'analytics' | 'marketing';
  label: string;
  label_en: string;
  required: boolean;
  cookies: ConsentCategoryCookie[];
}

/**
 * GET /api/preferences/{token} yanıtı.
 * `current_consents` yalnızca geçerli bir session_id verildiğinde dolar; aksi halde null.
 */
export interface PreferencesResponse {
  status: boolean;
  environment_name?: string;
  environment_url?: string;
  banner_settings?: Record<string, any>;
  active_regulations?: string[];
  categories: ConsentCategoryInfo[];
  current_consents: ConsentPreferences | null;
}

/** POST /api/preferences/{token} yanıtı (yalnızca durum + mesaj döner). */
export interface SavePreferencesResponse {
  status: boolean;
  message: string;
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

// -------------------------------------------------------------------------
// Form Generator
// -------------------------------------------------------------------------

export type FieldType =
  | 'input'
  | 'number'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'date'
  | 'rating'
  | 'consent'
  | 'divider'
  | 'heading';

export interface FieldOption {
  label: string;
  value: string;
}

export interface ConditionalCondition {
  field_uuid: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'is_empty' | 'is_not_empty';
  value: string;
}

export interface ConditionalLogic {
  action: 'show' | 'hide';
  logic: 'and' | 'or';
  conditions: ConditionalCondition[];
}

export interface FormField {
  uuid: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  help_text?: string;
  required: boolean;
  options?: FieldOption[];
  validation?: {
    min?: number;
    max?: number;
    min_length?: number;
    max_length?: number;
    file_types?: string[];
    max_file_size?: number;
  };
  conditional_logic?: ConditionalLogic;
  settings?: Record<string, any>;
  order: number;
  form_step_id?: number | null;
}

export interface FormStep {
  id: number;
  order: number;
  title?: string;
  description?: string;
  fields?: FormField[];
}

export interface FormThemeMode {
  label_color?: string;
  placeholder_color?: string;
  input_bg?: string;
  input_border?: string;
  value_color?: string;
  button_bg?: string;
  button_text?: string;
}

export interface FormSchema {
  id: number;
  name: string;
  slug: string;
  type: 'single_step' | 'multi_step';
  steps: FormStep[];
  fields: FormField[];
  company?: string;
  domain?: string;
  settings?: {
    submit_button_text?: string;
    success_title?: string;
    success_message?: string;
    redirect_url?: string;
    theme?: {
      light?: FormThemeMode;
      dark?: FormThemeMode;
    };
  };
}

export interface FormSubmitPayload {
  [fieldUuid: string]: string | string[] | number | File | FileList | null;
}

export interface FormSubmitResponse {
  message: string;
  success_title?: string;
  success_message?: string;
}

export interface RenderFormOptions {
  theme?: {
    primaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
  };
  onSuccess?: (data: FormSubmitResponse) => void;
  onError?: (error: Error) => void;
  locale?: 'tr' | 'en';
  /** Form label/placeholder dilini belirler. API'den o dilde çözümlenmiş schema döner. */
  lang?: string;
}

/**
 * Web Analytics hit verisi (POST /api/v/{token}/e — sendBeacon uyumlu).
 * Yalnızca 'sid' ve 'url' zorunludur.
 */
export interface AnalyticsHitPayload {
  /** session_id (UUID) — zorunlu */
  sid: string;
  /** Tam sayfa URL'i — zorunlu */
  url: string;
  /** visitor_id (hash); verilmezse backend sid'e düşer */
  vid?: string;
  title?: string;
  /** referrer URL */
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** scroll derinliği (%) */
  scroll?: number;
  /** önceki sayfada geçen süre (ms) */
  ttp?: number;
  /** ekran çözünürlüğü, örn "1920x1080" */
  res?: string;
  /** dil kodu, örn "tr-TR" */
  lang?: string;
  /** davranışsal ipucu: fare hareketi var mı (0/1) */
  hm?: 0 | 1;
  /** sayfa yüklenme süresi (ms) */
  lt?: number;
}

/** Çerez tarama sonucundaki tek bir tespit (POST /api/public/cookie-scan). */
export interface CookieScanResultItem {
  provider_id: number | null;
  slug: string | null;
  name: string;
  /** analytics | marketing | functional | strictly_necessary | other */
  category: string;
  description: string | null;
  matched_pattern: string;
  is_in_db: boolean;
}

export interface CookieScanResponse {
  status: boolean;
  message: string;
  detected: CookieScanResultItem[];
  scanned_url: string;
  count: number;
}

/** Domain doğrulama yanıtı (GET /api/public/verify/{domain}). */
export interface DomainVerifyResponse {
  found: boolean;
  domain: string;
  message?: string;
  title?: string;
  verified?: boolean;
  verified_at?: string | null;
  active_regulations?: string[];
  subscription_status?: 'active' | 'suspended' | 'free';
  last_published_at?: string | null;
  compliance_grade?: 'A' | 'B' | 'C' | 'D' | 'F';
  protected_categories?: string[];
  sdk_active?: boolean;
  total_consents_collected?: number;
  badge_verified?: boolean;
  plan_name?: string;
  badge_url?: string;
  embed_badge_url?: string;
}

/** impressionPixelUrl seçenekleri (GET /api/impressions/{token}/pixel). */
export interface ImpressionPixelOptions {
  url?: string;
  session_id?: string;
  referrer?: string;
  domain?: string;
}
