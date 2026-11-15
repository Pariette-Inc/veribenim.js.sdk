/**
 * Sayfaya yüklenen Veribenim bundle'ının (`window.veribenim`) tipli sarmalayıcısı.
 *
 * Bundle yüklendiğinde DOM hazırken `window.veribenim.ready = true` kurar ve
 * `window` üzerinde `VeribenimReady` olayını atar (rejim çözümünü beklemeden).
 * Buradaki yardımcılar bu iki sinyali birlikte kullanır: bundle önce
 * yüklendiyse olay kaçırılmaz, sonra yüklenirse olay beklenir.
 *
 * Bu modül analitik izleyiciye dokunmaz; yalnızca form gömme ve hazır olma
 * durumunu sarar.
 */

/** Bundle'ın renderForm başarı yanıtı (POST /api/public/forms/{token}/{slug}). */
export interface BundleFormSuccess {
  success: boolean;
  message?: string;
  success_title?: string;
  success_message?: string;
  [key: string]: unknown;
}

/** `veribenim.renderForm(slug, hedef, seçenekler)` seçenekleri — bundle imzası. */
export interface BundleRenderFormOptions {
  /** Form dili (tr, en, de, fr, es, bg, ar). Verilmezse sitenin dili. */
  lang?: string;
  /** Gönderim başarılı olduğunda (sunucu yanıtıyla) çağrılır. */
  onSuccess?: (data: BundleFormSuccess) => void;
  /** Yükleme ya da gönderim hatasında çağrılır. */
  onError?: (error: Error) => void;
}

/** `window.veribenim` — bundle'ın genel arayüzünün kararlı kısmı. */
export interface VeribenimBundleApi {
  /** Bundle DOM hazırken kurar; `VeribenimReady` ile aynı an. */
  ready?: boolean;
  /** Konsoldaki form gömme kodunun çağırdığı uç. Şema nesnesiyle çözülür. */
  renderForm(
    slug: string,
    target: string | Element,
    options?: BundleRenderFormOptions
  ): Promise<unknown>;
  acceptAll?(): void;
  rejectAll?(): void;
  savePreferences?(): void;
  showBanner?(): void;
  openDialog?(tab?: string): void;
  closeDialog?(): void;
  [key: string]: unknown;
}

declare global {
  interface Window {
    veribenim?: VeribenimBundleApi;
  }
}

export const VERIBENIM_READY_EVENT = 'VeribenimReady';

/** Varsayılan bekleme süresi (ms). */
export const DEFAULT_BUNDLE_TIMEOUT = 15000;

export interface WaitForBundleOptions {
  /** Zaman aşımı (ms). 0 = süresiz. Varsayılan 15000. */
  timeout?: number;
}

/** Bundle yüklü ve hazırsa onu, değilse null döner (SSR'da null). */
export function getBundle(): VeribenimBundleApi | null {
  if (typeof window === 'undefined') return null;
  const vb = window.veribenim;
  return vb && vb.ready === true ? vb : null;
}

/** Bundle hazır mı? */
export function isBundleReady(): boolean {
  return getBundle() !== null;
}

/**
 * Bundle hazır olduğunda çağrılır (hazırsa hemen, eşzamanlı olarak).
 * Dönen fonksiyon dinleyiciyi kaldırır.
 */
export function onBundleReady(callback: (bundle: VeribenimBundleApi) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const ready = getBundle();
  if (ready) {
    callback(ready);
    return () => undefined;
  }

  const listener = () => {
    window.removeEventListener(VERIBENIM_READY_EVENT, listener);
    const vb = window.veribenim;
    if (vb) callback(vb);
  };
  window.addEventListener(VERIBENIM_READY_EVENT, listener);
  return () => window.removeEventListener(VERIBENIM_READY_EVENT, listener);
}

/**
 * Bundle'ın hazır olmasını bekler. Bundle'ı YÜKLEMEZ — yükleme için
 * `Veribenim#loadScript()` ya da sitenin kendi script etiketi kullanılır.
 */
export function waitForBundle(options: WaitForBundleOptions = {}): Promise<VeribenimBundleApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('[Veribenim] waitForBundle yalnızca tarayıcıda çalışır'));
  }
  const timeout = options.timeout ?? DEFAULT_BUNDLE_TIMEOUT;

  return new Promise<VeribenimBundleApi>((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const off = onBundleReady((bundle) => {
      if (timer) clearTimeout(timer);
      resolve(bundle);
    });
    if (timeout > 0 && !isBundleReady()) {
      timer = setTimeout(() => {
        off();
        reject(new Error(`[Veribenim] bundle ${timeout} ms içinde hazır olmadı (VeribenimReady gelmedi)`));
      }, timeout);
    }
  });
}

/**
 * Bundle'ın `veribenim.renderForm`'unu, bundle hazır olduğunda çağırır.
 *
 * @example
 * await renderBundleForm('iletisim', '#vb-form-iletisim', { lang: 'tr' });
 */
export async function renderBundleForm(
  slug: string,
  target: string | Element,
  options: BundleRenderFormOptions & WaitForBundleOptions = {}
): Promise<unknown> {
  const { timeout, ...formOptions } = options;
  let bundle: VeribenimBundleApi;
  try {
    bundle = await waitForBundle({ timeout });
    if (typeof bundle.renderForm !== 'function') {
      throw new Error('[Veribenim] yüklü bundle renderForm desteklemiyor (bundle güncel değil)');
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    formOptions.onError?.(error);
    throw error;
  }
  // Bundle kendi hatalarında onError'u kendisi çağırır; tekrar çağırmayız.
  return bundle.renderForm(slug, target, formOptions);
}
