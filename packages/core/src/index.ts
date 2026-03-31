import { VeribenimApiClient } from './client';
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
} from './types';

export * from './types';
export { VeribenimApiClient } from './client';

const DEFAULT_CONFIG: Omit<VeribenimInternalConfig, 'token'> = {
  apiUrl: 'https://api.veribenim.com',
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
      lang: config.lang ?? 'tr',
      debug: config.debug ?? false,
      apiUrl: config._apiUrl ?? 'https://api.veribenim.com',
    };
    this.api = new VeribenimApiClient(this.config);

    if (events?.onAccept) this.onAccept(events.onAccept);
    if (events?.onDecline) this.onDecline(events.onDecline);
    if (events?.onChange) this.onChange(events.onChange);
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

  /** Script yüklendiğinde çağrılır */
  onLoad(callback: () => void): this {
    this.callbacks.onLoad.push(callback);
    return this;
  }

  /** Callback'leri tetikle (genellikle banner JS'i çağırır) */
  emit(event: 'accept' | 'decline' | 'change' | 'load', prefs?: ConsentPreferences): void {
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
      case 'load':
        this.callbacks.onLoad.forEach((cb) => cb());
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
}

/** Factory fonksiyonu */
/** @deprecated createVeribenim yerine init kullanın */
export const createVeribenim = init;

export function init(config: VeribenimConfig, events?: VeribenimEvents): Veribenim {
  return new Veribenim(config, events);
}

export default Veribenim;
