'use client';

/**
 * @veribenim/nextjs
 *
 * Next.js App Router ve Pages Router desteği.
 * @veribenim/react üzerine kuruludur.
 *
 * @example App Router (app/layout.tsx):
 * import { VeribenimProvider } from '@veribenim/nextjs';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <VeribenimProvider config={{ token: process.env.NEXT_PUBLIC_VERIBENIM_TOKEN }}>
 *           {children}
 *         </VeribenimProvider>
 *       </body>
 *     </html>
 *   );
 * }
 *
 * @example Pages Router (_app.tsx):
 * import { VeribenimProvider } from '@veribenim/nextjs';
 *
 * export default function App({ Component, pageProps }) {
 *   return (
 *     <VeribenimProvider config={{ token: process.env.NEXT_PUBLIC_VERIBENIM_TOKEN }}>
 *       <Component {...pageProps} />
 *     </VeribenimProvider>
 *   );
 * }
 */

// Next.js için 'use client' direktifi ile tüm React bileşenlerini re-export ediyoruz
export {
  VeribenimProvider,
  ConsentBanner,
  useVeribenim,
  useConsentCategory,
  useConsentPending,
  useVeribenimClient,
} from '@veribenim/react';

export type {
  VeribenimProviderProps,
  ConsentBannerProps,
  VeribenimContextValue,
  VeribenimConfig,
  ConsentPreferences,
} from '@veribenim/react';

/**
 * Next.js Script bileşeni ile script yükleme için helper
 * next/script kullanarak banner scriptini yükler
 */
export function getVeribenimScriptProps(token: string, lang: 'tr' | 'en' = 'tr') {
  return {
    src: `https://bundles.veribenim.com/bundle.js?token=${token}&lang=${lang}`,
    strategy: 'afterInteractive' as const,
    'data-veribenim': token,
  };
}
