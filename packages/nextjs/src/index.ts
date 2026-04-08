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
  VeribenimForm,
  ConsentBanner,
  useVeribenim,
  useConsentCategory,
  useConsentPending,
  useVeribenimClient,
} from '@veribenim/react';

export type {
  VeribenimProviderProps,
  VeribenimFormProps,
  ConsentBannerProps,
  VeribenimContextValue,
  VeribenimConfig,
  ConsentPreferences,
} from '@veribenim/react';

/**
 * Next.js Script bileşeni ile script yükleme için helper
 * next/script kullanarak banner scriptini yükler
 */
export function getVeribenimScriptProps(src: string) {
  return {
    src,
    strategy: 'afterInteractive' as const,
  };
}
