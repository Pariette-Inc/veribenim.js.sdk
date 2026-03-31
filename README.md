# Veribenim JS SDK

> KVKK & GDPR uyumlu çerez yönetimi için JavaScript / TypeScript SDK monoreposu.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![npm @veribenim/core](https://img.shields.io/npm/v/@veribenim/core?label=%40veribenim%2Fcore)](https://www.npmjs.com/package/@veribenim/core)

---

## Paketler

| Paket | Açıklama |
|---|---|
| [`@veribenim/core`](#veribenimcore) | Framework-agnostic çekirdek — tüm paketlerin temeli |
| [`@veribenim/react`](#veribenimreact) | React bileşenleri ve hook'lar |
| [`@veribenim/nextjs`](#veribenimreact) | Next.js App Router & Pages Router entegrasyonu |
| [`@veribenim/vue`](#veribenimvue) | Vue 3 plugin ve composable |
| [`@veribenim/nuxt`](#veribenimvue) | Nuxt 3 modülü — otomatik `useVeribenim` import |

---

## @veribenim/core

Framework bağımsız çekirdek. Vanilla JS, Node.js veya herhangi bir framework ile kullanılabilir.

### Kurulum

```bash
npm install @veribenim/core
```

### Hızlı Başlangıç

```ts
import { createVeribenim } from '@veribenim/core';

const veribenim = init({
  token: 'ENV_TOKEN_32_CHAR',
  domain: 'https://siteniz.com', // Veribenim paneli > Siteniz > Entegrasyon
  lang: 'tr',                 // 'tr' veya 'en'
});

// Callback'ler
veribenim
  .onAccept((prefs) => {
    if (prefs.analytics) initGA();
    if (prefs.marketing) initFBPixel();
  })
  .onDecline(() => {
    // Sadece zorunlu çerezler aktif
  });
```

### API Referansı

#### `new Veribenim(config, events?)`

| Parametre | Tip | Açıklama |
|---|---|---|
| `token` | `string` | **Zorunlu.** Environment token (32 karakter) |
| `lang` | `'tr' \| 'en'` | Banner dili. Varsayılan: `'tr'` |
| `apiUrl` | `string` | API base URL. Varsayılan: `https://api.veribenim.com` |
| `scriptUrl` | `string` | CDN URL. Varsayılan: `https://bundles.veribenim.com/bundle.js` |
| `autoLoad` | `boolean` | Script otomatik yüklensin mi? Varsayılan: `true` |
| `debug` | `boolean` | Console log aktif. Varsayılan: `false` |

#### Metodlar

```ts
// Script yönetimi
veribenim.loadScript(): Promise<void>
veribenim.isScriptLoaded: boolean

// Callback'ler
veribenim.onAccept(fn: (prefs: ConsentPreferences) => void): this
veribenim.onDecline(fn: (prefs: ConsentPreferences) => void): this
veribenim.onChange(fn: (prefs: ConsentPreferences) => void): this

// Tercih API'si
veribenim.getPreferences(sessionId?: string): Promise<PreferencesResponse | null>
veribenim.savePreferences(prefs: ConsentPreferences, sessionId?: string): Promise<PreferencesResponse | null>

// Loglama
veribenim.logImpression(): Promise<boolean>
veribenim.logConsent(payload: ConsentLogPayload): Promise<boolean>

// Form Rızası — kendi formlarınızdaki KVKK onayı
veribenim.logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>

// DSAR — veri sahibi başvurusu (erişim, silme, taşınabilirlik...)
veribenim.submitDsar(payload: DsarPayload): Promise<DsarResponse | null>
```

### Form Rızası Takibi

İletişim formu, üyelik, bülten gibi kendi formlarınızdaki KVKK onay kutucuklarını Veribenim'e bildirin:

```ts
// Kullanıcı formu gönderdiğinde
document.querySelector('#contact-form').addEventListener('submit', async (e) => {
  const checked = document.querySelector('#kvkk-consent').checked;

  await veribenim.logFormConsent({
    form_name: 'contact',
    consented: checked,
    consent_text: 'KVKK kapsamında kişisel verilerimin işlenmesini onaylıyorum.',
    metadata: {
      page: window.location.pathname,
      form_id: 'contact-form',
    },
  });
});
```

### DSAR Başvurusu

Ziyaretçilerin veri haklarını kullanabilmesi için başvuru formu entegrasyonu:

```ts
await veribenim.submitDsar({
  request_type: 'erasure',      // 'access' | 'erasure' | 'portability' | ...
  full_name: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  description: 'Tüm kişisel verilerimin silinmesini talep ediyorum.',
});

// Desteklenen tipler:
// 'access'        — Verilerime erişim
// 'rectification' — Düzeltme
// 'erasure'       — Silme (unutulma hakkı)
// 'restriction'   — İşleme kısıtlama
// 'portability'   — Taşınabilirlik
// 'objection'     — İtiraz
// 'automated'     — Otomatik karar itirazı
```

---

## @veribenim/react

### Kurulum

```bash
npm install @veribenim/react
```

### Kurulum

```tsx
// app/layout.tsx veya _app.tsx
import { VeribenimProvider } from '@veribenim/react';

export default function RootLayout({ children }) {
  return (
    <VeribenimProvider config={{ token: process.env.NEXT_PUBLIC_VERIBENIM_TOKEN }}>
      {children}
    </VeribenimProvider>
  );
}
```

### Hook'lar

```tsx
import {
  useVeribenim,
  useConsentCategory,
  useConsentPending,
} from '@veribenim/react';

function MyComponent() {
  const { preferences, accept, decline, savePreferences } = useVeribenim();
  const analyticsAllowed = useConsentCategory('analytics');
  const isPending = useConsentPending();

  if (isPending) return <ConsentBanner />;
  return analyticsAllowed ? <AnalyticsDashboard /> : null;
}
```

### ConsentBanner (Headless)

```tsx
import { ConsentBanner } from '@veribenim/react';

<ConsentBanner>
  {({ accept, decline, savePreferences }) => (
    <div className="banner">
      <p>Çerezler hakkında bilgi almak için...</p>
      <button onClick={() => accept()}>Tümünü Kabul Et</button>
      <button onClick={decline}>Reddet</button>
      <button onClick={() => savePreferences({
        necessary: true, analytics: true, marketing: false, preferences: false
      })}>
        Seçimi Kaydet
      </button>
    </div>
  )}
</ConsentBanner>
```

### Form Rızası (React)

```tsx
import { useVeribenimClient } from '@veribenim/react';

function ContactForm() {
  const client = useVeribenimClient();

  const handleSubmit = async (formData) => {
    await client.logFormConsent({
      form_name: 'contact',
      consented: formData.kvkkConsent,
      consent_text: 'KVKK kapsamında verilerimin işlenmesini onaylıyorum.',
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## @veribenim/vue

### Kurulum

```bash
npm install @veribenim/vue
```

```ts
// main.ts
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);
app.use(VeribenimPlugin, { token: import.meta.env.VITE_VERIBENIM_TOKEN });
app.mount('#app');
```

```vue
<!-- MyComponent.vue -->
<script setup>
import { useVeribenim } from '@veribenim/vue';
const { preferences, accept, decline } = useVeribenim();
</script>
```

---

## @veribenim/nuxt

### Kurulum

```bash
npm install @veribenim/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
    lang: 'tr',
  },
});
```

```vue
<!-- Otomatik import — import satırı gerekmez -->
<script setup>
const { preferences, accept, decline } = useVeribenim();
</script>
```

---

## ConsentPreferences Tipi

```ts
interface ConsentPreferences {
  necessary: boolean;    // Her zaman true — kullanıcı değiştiremez
  analytics: boolean;    // Analitik çerezler (GA, Mixpanel vb.)
  marketing: boolean;    // Pazarlama çerezleri (FB Pixel, Ads vb.)
  preferences: boolean;  // Tercih çerezleri (dil, tema vb.)
}
```

---

## Geliştirme

```bash
# Bağımlılıkları kur
npm install

# Build (tüm paketler)
npm run build

# Test
npm run test

# Yeni changeset oluştur (versiyon notları)
npm run changeset
```

## Release

```bash
npm run version-packages   # Versiyonları güncelle
npm run release            # Build + npm publish
```

## Lisans

MIT © [Pariette](https://veribenim.com)
