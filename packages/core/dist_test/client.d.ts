import type { VeribenimInternalConfig, ImpressionPayload, ConsentLogPayload, ConsentPreferences, PreferencesResponse, FormConsentPayload, FormConsentResponse, DsarPayload, DsarResponse, FormSchema, FormSubmitPayload, FormSubmitResponse, RenderFormOptions } from './types';
export declare class VeribenimApiClient {
    private readonly config;
    constructor(config: VeribenimInternalConfig);
    private get baseUrl();
    private log;
    private request;
    /**
     * Sayfa görüntüleme loglar
     * POST /api/impressions/{token}
     */
    logImpression(payload?: Partial<ImpressionPayload>): Promise<boolean>;
    /**
     * Onay kararı loglar
     * POST /api/consents/{token}/log
     */
    logConsent(payload: ConsentLogPayload): Promise<boolean>;
    /**
     * Ziyaretçi tercihlerini okur
     * GET /api/preferences/{token}?session_id=...
     */
    getPreferences(sessionId?: string): Promise<PreferencesResponse | null>;
    /**
     * Ziyaretçi tercihlerini kaydeder
     * POST /api/preferences/{token}
     */
    savePreferences(preferences: ConsentPreferences, sessionId?: string): Promise<PreferencesResponse | null>;
    /**
     * Form rızasını kaydeder
     * POST /api/form-consents/{token}
     *
     * İletişim formu, üyelik formu, bülten gibi custom formlardaki
     * KVKK onay kutucuğu verilerini Veribenim'e iletir.
     *
     * @example
     * await client.logFormConsent({
     *   form_name: 'contact',
     *   consented: true,
     *   consent_text: 'KVKK kapsamında verilerimin işlenmesini onaylıyorum',
     *   metadata: { page: '/iletisim', email: 'user@example.com' },
     * });
     */
    logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>;
    /**
     * DSAR (Veri Sahibi Başvurusu) oluşturur
     * POST /api/dsar/{token}
     *
     * Ziyaretçinin erişim, silme, taşınabilirlik vb. haklarını kullanması için
     * başvuru oluşturur. 30 günlük yasal süre otomatik hesaplanır.
     *
     * @example
     * await client.submitDsar({
     *   request_type: 'erasure',
     *   full_name: 'Ahmet Yılmaz',
     *   email: 'ahmet@example.com',
     *   description: 'Tüm verilerimin silinmesini talep ediyorum.',
     * });
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
     */
    renderForm(slug: string, selector: string, options?: RenderFormOptions): Promise<void>;
}
