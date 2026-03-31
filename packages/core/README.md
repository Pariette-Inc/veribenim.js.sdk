# @veribenim/core

> Veribenim KVKK & GDPR çerez onayı SDK — Framework-agnostic çekirdek

[![npm](https://img.shields.io/npm/v/@veribenim/core)](https://www.npmjs.com/package/@veribenim/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Kurulum

```bash
npm install @veribenim/core
```

## İki Kullanım Yolu

**Sadece banner göstermek istiyorsanız** — SDK'ya gerek yok. Panelden bundle URL'nizi kopyalayın ve HTML'e ekleyin:

```html
<script src="https://bundles.veribenim.com/siteadiniz.js" async></script>
```

**Form rızası, DSAR veya diğer API işlemleri için** SDK'yı kullanın. Token'ı [Veribenim Paneli](https://app.veribenim.com)'nden alın.

## Kullanım

```ts
import { init } from '@veribenim/core';

const veribenim = init({
  token: 'BURAYA_TOKEN_YAPISTIRIN',
  lang: 'tr', // 'tr' | 'en' — varsayılan: 'tr'
});

// Onay kararlarını dinle
veribenim
  .onAccept((prefs) => {
    if (prefs.analytics) initGoogleAnalytics();
    if (prefs.marketing) initFBPixel();
  })
  .onDecline(() => {
    // Yalnızca zorunlu çerezler aktif
  });
```

## Form Rızası Takibi

İletişim formu, üyelik, bülten gibi formlardaki KVKK onayını kaydedin:

```ts
await veribenim.logFormConsent({
  formName: 'contact',
  consented: true,
  consentText: 'KVKK kapsamında verilerimin işlenmesini onaylıyorum.',
  metadata: { email: 'kullanici@example.com' },
});
```

## DSAR (Veri Sahibi Başvurusu)

```ts
await veribenim.submitDsar({
  requestType: 'erasure', // access | rectification | erasure | restriction | portability | objection | automated
  fullName: 'Ad Soyad',
  email: 'kullanici@example.com',
  description: 'Tüm verilerimin silinmesini talep ediyorum.',
});
```

## Tercih Yönetimi

```ts
// Mevcut tercihleri oku
const result = await veribenim.getPreferences();
console.log(result?.preferences); // { necessary, analytics, marketing, preferences }

// Tercihleri kaydet
await veribenim.savePreferences({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true,
});
```

## Framework Paketleri

| Paket | Açıklama |
|---|---|
| [`@veribenim/react`](https://www.npmjs.com/package/@veribenim/react) | React için Provider ve hook'lar |
| [`@veribenim/nextjs`](https://www.npmjs.com/package/@veribenim/nextjs) | Next.js App Router + Pages Router |
| [`@veribenim/vue`](https://www.npmjs.com/package/@veribenim/vue) | Vue 3 plugin ve composable |
| [`@veribenim/nuxt`](https://www.npmjs.com/package/@veribenim/nuxt) | Nuxt 3 modülü |

## Lisans

MIT © [Pariette](https://veribenim.com)
