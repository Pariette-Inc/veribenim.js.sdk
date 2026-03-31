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
} from './types';

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
}
