# @veribenim/nextjs

> Veribenim KVKK & GDPR çerez onayı SDK — Next.js

[![npm](https://img.shields.io/npm/v/@veribenim/nextjs)](https://www.npmjs.com/package/@veribenim/nextjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Kurulum

```bash
npm install @veribenim/nextjs
```

## App Router (app/layout.tsx)

```tsx
import { VeribenimProvider } from '@veribenim/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <VeribenimProvider config={{
          token: process.env.NEXT_PUBLIC_VERIBENIM_TOKEN!,
        }}>
          {children}
        </VeribenimProvider>
      </body>
    </html>
  );
}
```

## Pages Router (_app.tsx)

```tsx
import { VeribenimProvider } from '@veribenim/nextjs';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <VeribenimProvider config={{
      token: process.env.NEXT_PUBLIC_VERIBENIM_TOKEN!,
    }}>
      <Component {...pageProps} />
    </VeribenimProvider>
  );
}
```

## .env.local

```env
NEXT_PUBLIC_VERIBENIM_TOKEN=buraya_token_yapistirin
```

Token'ı [Veribenim Paneli](https://app.veribenim.com)'nden alın: Siteniz → Entegrasyon.

Tüm hook'lar (`useVeribenim`, `useConsentCategory` vb.) `@veribenim/react`'ten re-export edilir.

## Lisans

MIT © [Pariette](https://veribenim.com)
