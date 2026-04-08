import type {
  VeribenimInternalConfig,
  ImpressionPayload,
  ConsentLogPayload,
  ConsentPreferences,
  PreferencesResponse,
  FormConsentPayload,
  FormConsentResponse,
  DsarPayload,
  DsarResponse,
  FormSchema,
  FormSubmitPayload,
  FormSubmitResponse,
  RenderFormOptions,
} from './types';
import { FormRenderer } from './form-renderer';

export class VeribenimApiClient {
  constructor(private readonly config: VeribenimInternalConfig) {}

  private get baseUrl(): string {
    return this.config.apiUrl.replace(/\/$/, '');
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[Veribenim]', ...args);
    }
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T | null> {
    const url = `${this.baseUrl}${path}`;
    this.log(`${method} ${url}`, body);

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        this.log(`HTTP ${res.status}`, await res.text());
        return null;
      }

      const text = await res.text();
      return text ? (JSON.parse(text) as T) : null;
    } catch (err) {
      this.log('Request failed:', err);
      return null;
    }
  }

  /**
   * Sayfa görüntüleme loglar
   * POST /api/impressions/{token}
   */
  async logImpression(payload?: Partial<ImpressionPayload>): Promise<boolean> {
    const data: ImpressionPayload = {
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...payload,
    };

    const result = await this.request('POST', `/api/impressions/${this.config.token}`, data);
    return result !== null;
  }

  /**
   * Onay kararı loglar
   * POST /api/consents/{token}/log
   */
  async logConsent(payload: ConsentLogPayload): Promise<boolean> {
    const result = await this.request(
      'POST',
      `/api/consents/${this.config.token}/log`,
      payload
    );
    return result !== null;
  }

  /**
   * Ziyaretçi tercihlerini okur
   * GET /api/preferences/{token}?session_id=...
   */
  async getPreferences(sessionId?: string): Promise<PreferencesResponse | null> {
    const qs = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : '';
    return this.request<PreferencesResponse>(
      'GET',
      `/api/preferences/${this.config.token}${qs}`
    );
  }

  /**
   * Ziyaretçi tercihlerini kaydeder
   * POST /api/preferences/{token}
   */
  async savePreferences(
    preferences: ConsentPreferences,
    sessionId?: string
  ): Promise<PreferencesResponse | null> {
    return this.request<PreferencesResponse>(
      'POST',
      `/api/preferences/${this.config.token}`,
      { preferences, session_id: sessionId }
    );
  }

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
  async logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null> {
    return this.request<FormConsentResponse>(
      'POST',
      `/api/form-consents/${this.config.token}`,
      payload
    );
  }

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
  async submitDsar(payload: DsarPayload): Promise<DsarResponse | null> {
    return this.request<DsarResponse>(
      'POST',
      `/api/dsar/${this.config.token}`,
      payload
    );
  }

  /**
   * Form şemasını yükle
   * GET /api/public/forms/{token}/{slug}?lang=...
   * @param slug Form slug'ı
   * @param lang Dil kodu (tr, en, de, fr, es, bg, ar). Belirtilmezse environment dili kullanılır.
   */
  async getFormSchema(slug: string, lang?: string): Promise<FormSchema> {
    const qs = lang ? `?lang=${encodeURIComponent(lang)}` : '';
    const response = await fetch(
      `${this.baseUrl}/api/public/forms/${this.config.token}/${slug}${qs}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.ok) {
      throw new Error(`Form bulunamadı: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Form verilerini gönder
   * POST /api/public/forms/{token}/{slug}
   */
  async submitForm(slug: string, data: FormSubmitPayload): Promise<FormSubmitResponse> {
    // File olan field'lar varsa FormData kullan, yoksa JSON
    const hasFiles = Object.values(data).some(
      (v) => v instanceof File || v instanceof FileList
    );

    let body: FormData | string;
    let headers: HeadersInit = {};

    if (hasFiles) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (value instanceof FileList) {
          for (let i = 0; i < value.length; i++) {
            formData.append(`${key}[]`, value[i]);
          }
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
      body = formData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const response = await fetch(
      `${this.baseUrl}/api/public/forms/${this.config.token}/${slug}`,
      { method: 'POST', headers, body }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Form gönderilemedi');
    }
    return response.json();
  }

  /**
   * Form'u bir DOM elementine render et
   * @param slug Form slug'ı
   * @param selector CSS selector
   * @param options Render seçenekleri
   */
  async renderForm(
    slug: string,
    selector: string,
    options: RenderFormOptions = {}
  ): Promise<void> {
    return FormRenderer.render(this.config, slug, selector, options);
  }
}
