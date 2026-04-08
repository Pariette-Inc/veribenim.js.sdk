import type { VeribenimConfig, VeribenimInternalConfig, VeribenimEvents, ConsentPreferences, ConsentLogPayload, PreferencesResponse, FormConsentPayload, FormConsentResponse, DsarPayload, DsarResponse, FieldType, FieldOption, ConditionalCondition, ConditionalLogic, FormField, FormStep, FormSchema, FormSubmitPayload, FormSubmitResponse, RenderFormOptions } from './types';
export * from './types';
export type { VeribenimConfig, VeribenimInternalConfig, VeribenimEvents, ConsentPreferences, ConsentLogPayload, PreferencesResponse, FormConsentPayload, FormConsentResponse, DsarPayload, DsarResponse, FieldType, FieldOption, ConditionalCondition, ConditionalLogic, FormField, FormStep, FormSchema, FormSubmitPayload, FormSubmitResponse, RenderFormOptions, };
export { VeribenimApiClient } from './client';
export { FormRenderer } from './form-renderer';
/**
 * Veribenim SDK ana sınıfı
 *
 * @example
 * const veribenim = new Veribenim({ token: 'ENV_TOKEN_32_CHAR' });
 * veribenim.onAccept((prefs) => { enableAnalytics(); });
 */
export declare class Veribenim {
    private readonly config;
    private readonly api;
    private readonly callbacks;
    constructor(config: VeribenimConfig, events?: VeribenimEvents);
    /** Kullanıcı tüm çerezleri kabul ettiğinde çağrılır */
    onAccept(callback: (prefs: ConsentPreferences) => void): this;
    /** Kullanıcı tüm çerezleri reddetti */
    onDecline(callback: (prefs: ConsentPreferences) => void): this;
    /** Herhangi bir tercih değişikliğinde çağrılır */
    onChange(callback: (prefs: ConsentPreferences) => void): this;
    /** Callback'leri tetikle */
    emit(event: 'accept' | 'decline' | 'change', prefs?: ConsentPreferences): void;
    /** Sayfa görüntüleme logla */
    logImpression(): Promise<boolean>;
    /** Onay kararını logla */
    logConsent(payload: ConsentLogPayload): Promise<boolean>;
    /** Ziyaretçi tercihlerini getir */
    getPreferences(sessionId?: string): Promise<PreferencesResponse | null>;
    /** Ziyaretçi tercihlerini kaydet */
    savePreferences(preferences: ConsentPreferences, sessionId?: string): Promise<PreferencesResponse | null>;
    /**
     * Belirtilen kategori için ziyaretçi izni var mı?
     * @param category - 'analytics' | 'marketing' | 'functional' | 'necessary'
     * @param sessionId - Opsiyonel session ID
     */
    hasConsent(category: keyof ConsentPreferences, sessionId?: string): Promise<boolean>;
    /**
     * Form rızasını kaydet (iletişim formu, üyelik, bülten vb.)
     * POST /api/form-consents/{token}
     */
    logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>;
    /**
     * DSAR başvurusu oluştur (erişim, silme, taşınabilirlik vb.)
     * POST /api/dsar/{token}
     */
    submitDsar(payload: DsarPayload): Promise<DsarResponse | null>;
    /**
     * Form şemasını yükle
     * GET /api/public/forms/{token}/{slug}
     */
    getFormSchema(slug: string): Promise<FormSchema>;
    /**
     * Form verilerini gönder
     * POST /api/public/forms/{token}/{slug}
     */
    submitForm(slug: string, data: FormSubmitPayload): Promise<FormSubmitResponse>;
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
    renderForm(slug: string, selector: string, options?: RenderFormOptions): Promise<void>;
}
/** Factory fonksiyonu */
/** @deprecated createVeribenim yerine init kullanın */
export declare const createVeribenim: typeof init;
export declare function init(config: VeribenimConfig, events?: VeribenimEvents): Veribenim;
export default Veribenim;
