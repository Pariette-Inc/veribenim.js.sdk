import { VeribenimApiClient } from './client';
import { ScriptLoader } from './loader';
import type {
  VeribenimConfig,
  VeribenimInternalConfig,
  VeribenimEvents,
  ConsentPreferences,
  ConsentLogPayload,
  PreferencesResponse,
  FormConsentPayload,
  FormConsentResponse,
  DsarPayload,
  DsarResponse,
  FieldType,
  FieldOption,
  ConditionalCondition,
  ConditionalLogic,
  FormField,
  FormStep,
  FormSchema,
  FormSubmitPayload,
  FormSubmitResponse,
  RenderFormOptions,
} from './types';

export * from './types';
export type {
  VeribenimConfig,
  VeribenimInternalConfig,
  VeribenimEvents,
  ConsentPreferences,
  ConsentLogPayload,
  PreferencesResponse,
  FormConsentPayload,
  FormConsentResponse,
  DsarPayload,
  DsarResponse,
  FieldType,
  FieldOption,
  ConditionalCondition,
  ConditionalLogic,
  FormField,
  FormStep,
  FormSchema,
  FormSubmitPayload,
  FormSubmitResponse,
  RenderFormOptions,
};
export { VeribenimApiClient } from './client';
export { FormRenderer } from './form-renderer';
export { ScriptLoader, cleanDomainForFilename, getBundleUrl } from './loader';

const DEFAULT_CONFIG: Omit<VeribenimInternalConfig, 'token'> = {
  apiUrl: 'https://live.veribenim.com',
  lang: 'tr',
  debug: false,
};

/**
 * Veribenim SDK ana sınıfı
 *
 * @example
 * const veribenim = new Veribenim({ token: 'ENV_TOKEN_32_CHAR' });
 * veribenim.onAccept((prefs) => { enableAnalytics(); });
 */
export class Veribenim {
  private readonly config: VeribenimInternalConfig;
  private readonly api: VeribenimApiClient;
  private readonly callbacks: {
    onAccept: Array<(prefs: ConsentPreferences) => void>;
    onDecline: Array<(prefs: ConsentPreferences) => void>;
    onChange: Array<(prefs: ConsentPreferences) => void>;
  } = { onAccept: [], onDecline: [], onChange: [] };

  constructor(config: VeribenimConfig, events?: VeribenimEvents) {
    if (!config.token) throw new Error('[Veribenim] token zorunludur');

    this.config = {
      ...DEFAULT_CONFIG,
      token: config.token,
      domain: config.domain,
      lang: config.lang ?? 'tr',
      debug: config.debug ?? false,
      apiUrl: config._apiUrl ?? 'https://live.veribenim.com',
      scriptUrl: config._scriptUrl,
    };
    this.api = new VeribenimApiClient(this.config);

    if (events?.onAccept) this.onAccept(events.onAccept);
    if (events?.onDecline) this.onDecline(events.onDecline);
    if (events?.onChange) this.onChange(events.onChange);
  }

  /**
   * Bundle script'i sayfaya yükler.
   * domain veya _scriptUrl config'de tanımlıysa çalışır.
   */
  loadScript(): Promise<void> {
    const loader = new ScriptLoader(this.config);
    return loader.load();
  }

  /** Kullanıcı tüm çerezleri kabul ettiğinde çağrılır */
  onAccept(callback: (prefs: ConsentPreferences) => void): this {
    this.callbacks.onAccept.push(callback);
    return this;
  }

  /** Kullanıcı tüm çerezleri reddetti */
  onDecline(callback: (prefs: ConsentPreferences) => void): this {
    this.callbacks.onDecline.push(callback);
    return this;
  }

  /** Herhangi bir tercih değişikliğinde çağrılır */
  onChange(callback: (prefs: ConsentPreferences) => void): this {
    this.callbacks.onChange.push(callback);
    return this;
  }

  /** Callback'leri tetikle */
  emit(event: 'accept' | 'decline' | 'change', prefs?: ConsentPreferences): void {
    switch (event) {
      case 'accept':
        this.callbacks.onAccept.forEach((cb) => prefs && cb(prefs));
        break;
      case 'decline':
        this.callbacks.onDecline.forEach((cb) => prefs && cb(prefs));
        break;
      case 'change':
        this.callbacks.onChange.forEach((cb) => prefs && cb(prefs));
        break;
    }
  }

  // --- API Kısayolları ---

  /** Sayfa görüntüleme logla */
  logImpression(): Promise<boolean> {
    return this.api.logImpression();
  }

  /** Onay kararını logla */
  logConsent(payload: ConsentLogPayload): Promise<boolean> {
    return this.api.logConsent(payload);
  }

  /** Ziyaretçi tercihlerini getir */
  getPreferences(sessionId?: string): Promise<PreferencesResponse | null> {
    return this.api.getPreferences(sessionId);
  }

  /** Ziyaretçi tercihlerini kaydet */
  savePreferences(
    preferences: ConsentPreferences,
    sessionId?: string
  ): Promise<PreferencesResponse | null> {
    return this.api.savePreferences(preferences, sessionId);
  }

  /**
   * Belirtilen kategori için ziyaretçi izni var mı?
   * @param category - 'analytics' | 'marketing' | 'functional' | 'necessary'
   * @param sessionId - Opsiyonel session ID
   */
  async hasConsent(category: keyof ConsentPreferences, sessionId?: string): Promise<boolean> {
    const prefs = await this.api.getPreferences(sessionId);
    if (!prefs) return false;
    const consents = (prefs as any).consents ?? prefs.preferences;
    return !!(consents as ConsentPreferences)[category];
  }

  /**
   * Form rızasını kaydet (iletişim formu, üyelik, bülten vb.)
   * POST /api/form-consents/{token}
   */
  logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null> {
    return this.api.logFormConsent(payload);
  }

  /**
   * DSAR başvurusu oluştur (erişim, silme, taşınabilirlik vb.)
   * POST /api/dsar/{token}
   */
  submitDsar(payload: DsarPayload): Promise<DsarResponse | null> {
    return this.api.submitDsar(payload);
  }

  /**
   * Form şemasını yükle
   * GET /api/public/forms/{token}/{slug}
   */
  getFormSchema(slug: string): Promise<FormSchema> {
    return this.api.getFormSchema(slug);
  }

  /**
   * Form verilerini gönder
   * POST /api/public/forms/{token}/{slug}
   */
  submitForm(slug: string, data: FormSubmitPayload): Promise<FormSubmitResponse> {
    return this.api.submitForm(slug, data);
  }

  /**
   * Form'u bir DOM elementine render et
   * @param slug Form slug'ı
   * @param selector CSS selector
   * @param options Render seçenekleri
   *
   * @example
   * const veribenim = new Veribenim({ token: 'ENV_TOKEN' });
   * await veribenim.renderForm('contact-form', '#form-container', {
   *   theme: { primaryColor: '#6366f1' },
   *   onSuccess: (data) => console.log('Form submitted!'),
   * });
   */
  renderForm(
    slug: string,
    selector: string,
    options: RenderFormOptions = {}
  ): Promise<void> {
    return this.api.renderForm(slug, selector, options);
  }
}

/** Factory fonksiyonu */
/** @deprecated createVeribenim yerine init kullanın */
export const createVeribenim = init;

export function init(config: VeribenimConfig, events?: VeribenimEvents): Veribenim {
  return new Veribenim(config, events);
}

export default Veribenim;
