# @veribenim/react

> Veribenim KVKK & GDPR çerez onayı SDK — React

[![npm](https://img.shields.io/npm/v/@veribenim/react)](https://www.npmjs.com/package/@veribenim/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Kurulum

```bash
npm install @veribenim/react
```

## Kurulum

Uygulamanızın kök bileşenine `VeribenimProvider` ekleyin:

```tsx
import { VeribenimProvider } from '@veribenim/react';

export default function App() {
  return (
    <VeribenimProvider config={{ token: 'BURAYA_TOKEN_YAPISTIRIN' }}>
      <YourApp />
    </VeribenimProvider>
  );
}
```

## Hooks

### `useVeribenim()`

```tsx
import { useVeribenim } from '@veribenim/react';

function CookieBanner() {
  const { preferences, accept, decline, savePreferences } = useVeribenim();

  if (preferences) return null; // Zaten karar verilmiş

  return (
    <div>
      <button onClick={() => accept()}>Tümünü Kabul Et</button>
      <button onClick={decline}>Reddet</button>
    </div>
  );
}
```

### `useConsentCategory(category)`

```tsx
import { useConsentCategory } from '@veribenim/react';

function Analytics() {
  const analyticsAllowed = useConsentCategory('analytics');
  if (!analyticsAllowed) return null;
  return <GoogleAnalytics />;
}
```

### `useVeribenimClient()`

Form rızası ve DSAR işlemleri için doğrudan API client'a erişin:

```tsx
import { useVeribenimClient } from '@veribenim/react';

function ContactForm() {
  const client = useVeribenimClient();

  const handleSubmit = async (e) => {
    await client.logFormConsent({
      formName: 'contact',
      consented: true,
      consentText: 'KVKK kapsamında verilerimin işlenmesini onaylıyorum.',
    });
  };
}
```

## Lisans

MIT © [Pariette](https://veribenim.com)
