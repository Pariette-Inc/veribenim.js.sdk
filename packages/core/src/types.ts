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
