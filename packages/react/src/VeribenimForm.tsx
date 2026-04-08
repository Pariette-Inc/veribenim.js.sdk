import React, { useEffect, useRef, useState } from 'react';

export interface VeribenimFormProps {
  token: string;
  slug: string;
  apiUrl?: string;
  debug?: boolean;
  theme?: {
    primaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
  };
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  locale?: 'tr' | 'en';
  /** Form label/placeholder dili. Belirtilmezse environment dilini kullanır. */
  lang?: string;
  className?: string;
}

/**
 * VeriBenim Form Component
 *
 * @example
 * <VeribenimForm
 *   token="ENV_TOKEN"
 *   slug="contact-form"
 *   theme={{ primaryColor: '#6366f1' }}
 *   onSuccess={(data) => console.log('Success', data)}
 * />
 */
export const VeribenimForm: React.FC<VeribenimFormProps> = ({
  token,
  slug,
  apiUrl = 'https://live.veribenim.com',
  debug = false,
  theme,
  onSuccess,
  onError,
  locale,
  lang,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // SSR güvenliği
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // Container'a unique id verir (render olmamışsa)
    if (!containerRef.current.id) {
      containerRef.current.id = `vb-form-${slug}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const containerId = containerRef.current.id;

    // Dynamic import to avoid SSR issues and circular dep problems
    (async () => {
      try {
        const { VeribenimApiClient } = await import('@veribenim/core');
        const client = new VeribenimApiClient({
          token,
          apiUrl,
          debug,
          lang: locale || 'tr',
        } as any);

        await (client as any).renderForm(slug, `#${containerId}`, {
          theme,
          onSuccess: (data: any) => {
            onSuccess?.(data);
          },
          onError: (err: Error) => {
            setError(err.message);
            onError?.(err);
          },
          locale,
          lang,
        });
        // Form başarıyla render edildi — spinner'ı kaldır
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Form yüklenemedi');
        setLoading(false);
        onError?.(err);
      }
    })();
  }, [token, slug, apiUrl, debug, theme, onSuccess, onError, locale, lang, mounted]);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className={className}>
      {/* Spinner ve hata mesajı: React tarafından yönetilen ayrı div */}
      {loading && (
        <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Yükleniyor...
        </div>
      )}
      {error && !loading && (
        <div style={{ padding: 24, color: '#ef4444', textAlign: 'center' }}>
          {error}
        </div>
      )}
      {/* Form container: form-renderer tarafından yönetilir, React bu div'e child render etmez */}
      <div ref={containerRef} />
    </div>
  );
};

VeribenimForm.displayName = 'VeribenimForm';
