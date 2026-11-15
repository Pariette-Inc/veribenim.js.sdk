import React, { useEffect, useRef, useState } from 'react';
import {
  renderBundleForm,
  onBundleReady,
  isBundleReady,
  type BundleRenderFormOptions,
} from '@veribenim/core';

export interface VeribenimBundleFormProps {
  /** Form slug'ı (konsoldaki "Formu Göm" ekranındaki ad). */
  slug: string;
  /** Form dili (tr, en, de, fr, es, bg, ar). Verilmezse sitenin dili. */
  lang?: string;
  onSuccess?: BundleRenderFormOptions['onSuccess'];
  onError?: BundleRenderFormOptions['onError'];
  /** Bundle'ı bekleme süresi (ms). Varsayılan 15000; 0 = süresiz. */
  timeout?: number;
  className?: string;
  /** Bundle gelene kadar gösterilecek içerik. */
  fallback?: React.ReactNode;
}

/**
 * Formu sayfadaki Veribenim BUNDLE'ı ile çizer (`veribenim.renderForm`).
 * Bundle'ı `<VeribenimProvider>` (domain verilmişse) ya da sitenin kendi
 * script etiketi yükler; bileşen yalnızca `VeribenimReady`'i bekler.
 *
 * @example
 * <VeribenimBundleForm slug="iletisim" lang="tr" onSuccess={() => track()} />
 */
export const VeribenimBundleForm: React.FC<VeribenimBundleFormProps> = ({
  slug,
  lang,
  onSuccess,
  onError,
  timeout,
  className,
  fallback = null,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  // Geri çağrılar her render'da değişebilir; formu yeniden çizdirmesinler.
  const handlers = useRef({ onSuccess, onError });
  handlers.current = { onSuccess, onError };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    setError(null);

    renderBundleForm(slug, el, {
      lang,
      timeout,
      onSuccess: (data) => handlers.current.onSuccess?.(data),
      onError: (err) => {
        if (!cancelled) setError(err.message);
        handlers.current.onError?.(err);
      },
    }).catch(() => {
      /* onError zaten çağrıldı */
    });

    return () => {
      cancelled = true;
      // Bundle'ın kapalı shadow root'unu temizle (yeniden çizimde çift form olmasın).
      el.textContent = '';
    };
  }, [slug, lang, timeout]);

  const ready = useVeribenimReady();

  return (
    <div className={className}>
      {!ready && !error ? fallback : null}
      {error ? <div role="alert">{error}</div> : null}
      <div ref={ref} />
    </div>
  );
};

VeribenimBundleForm.displayName = 'VeribenimBundleForm';

/**
 * Sayfadaki bundle hazır mı? (`VeribenimReady` olayını dinler; SSR'da false.)
 */
export function useVeribenimReady(): boolean {
  const [ready, setReady] = useState<boolean>(() => isBundleReady());
  useEffect(() => onBundleReady(() => setReady(true)), []);
  return ready;
}
