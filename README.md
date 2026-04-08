# Veribenim JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@veribenim/core?style=flat-square&color=1f6feb)](https://www.npmjs.com/package/@veribenim/core)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@veribenim/core?style=flat-square)](https://www.npmjs.com/package/@veribenim/core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@veribenim/core?style=flat-square&label=bundle%20size)](https://bundlephobia.com/package/@veribenim/core)

**KVKK & GDPR Uyumlu • Kişisel Veri Yönetimi • Rıza Yönetim Platformu (CMP)**

Veribenim, geliştiricilere KVKK ve GDPR standartlarını karşılayan, enterprise-grade veri güvenliği ve rıza yönetimi çözümü sunmaktadır. Sektörün en kapsamlı, kullanıcı-odaklı JavaScript SDK'sı ile web uygulamalarınızda kişisel veri koruma ve rıza yönetimini adım adım gerçekleştirin.

---

## İçindekiler

- [Neden Veribenim?](#neden-veribenim)
- [Nasıl Kurulur?](#nasıl-kurulur)
- [Paketler](#paketler)
- [Güvenlik Standartları](#güvenlik-standartları)
- [Geliştirme](#geliştirme)
- [Lisans](#lisans)

---

## Neden Veribenim?

### 🏆 En Kapsamlı Veri Güvenliği Çözümü

Veribenim, sadece bir rıza yönetim platformu değil; **kurumsal seviyede veri koruma, KVKK ve GDPR uyumluluğunun eksiksiz uygulanmasıdır**. Web uygulamalarınızda kişisel veri yönetimini tek, entegre SDK ile başlayın.

| Özellik | Veribenim | Rakipler |
|---------|-----------|----------|
| **KVKK Tam Uyumluluk** | ✅ Türk Hukuku Uzmanları | ⚠️ Genel Uyumluluk |
| **GDPR Detaylı Uyumluluk** | ✅ Madde-Madde Takip | ⚠️ Temel Uyumluluk |
| **Data Subject Rights (DSAR)** | ✅ Erişim, Silme, Taşınabilirlik, Düzeltme | ⚠️ Sınırlı |
| **Consent Management (TCF 2.2)** | ✅ Tam Entegrasyon | ⚠️ Temel Çerez Yönetimi |
| **Form Consent Tracking** | ✅ Yapılandırılabilir Form Takibi | ❌ Yok |
| **Privacy by Design** | ✅ Tüm Verileri Şifreli Saklama | ⚠️ Seçici Şifreleme |
| **API Güvenliği** | ✅ Bearer Token + Rate Limiting | ⚠️ Temel Auth |
| **Audit Logs** | ✅ Tüm İşlemlerin Takibi | ⚠️ Sınırlı Kayıt |

### 🔐 Kurumsal Güvenlik & Uyumluluk

- **KVKK Uyumluluğu**: Kişisel Verilerin Korunması Hakkında Kanun maddelerine tam uyum
- **GDPR Uyumluluğu**: GDPR'ın 99 maddesi detaylı uygulanması
- **Privacy by Design**: Temel tasarım ilkesi olarak gizlilik
- **Veri Şifreleme**: Uçtan uca TLS 1.3, REST'te AES-256-CBC
- **DSAR İşlemi**: Erişim, Silme, Taşınabilirlik, Düzeltme, Kısıtlama, İtiraz, Otomatik Karar
- **Consent Management Platform (CMP)**: TCF 2.2 ve custom rıza kategorileri

### 🚀 Geliştirici Deneyimi

- **Framework-Agnostic Core**: Vanilla JS, React, Vue, Nuxt, Next.js, Angular, Svelte ile uyumlu
- **Modern Entegrasyon**: React Hooks, Vue 3 Composables, Next.js App/Pages Router
- **TypeScript Desteği**: Tam type safety ve IntelliSense
- **Zero Config**: Token ile başlayın, geri kalan otomatik
- **Lightweight**: ~8KB gzip bundle size
- **pnpm Monorepo**: Hızlı development, optimal caching

### 📊 Veri İstatistikleri & Raporlama

- Gerçek zamanlı rıza analitikleri
- Aylık PDF raporları (KVKK uyumu için)
- Kategori bazlı rıza dağılımı
- DSAR talepleri takibi
- Kota yönetimi ve fatura entegrasyonu

### 🏢 Uçtan Uca KVKK Yönetim Platformu

Veribenim sadece bir çerez SDK'sı değil, **tam kapsamlı bir KVKK/GDPR uyum yönetim platformu**dur. SDK üzerinden erişilebilen ve dashboard'dan yönetilen platform özellikleri:

| Modül | Açıklama |
|-------|----------|
| **Veri Envanteri** | KVKK Md.16 / GDPR Md.30: Departman ve süreç bazlı veri haritalama, 20 veri kategorisi, 6 hukuki dayanak, yurt dışı aktarım takibi, VERBİS uyumlu export |
| **Saklama-İmha Otomasyonu** | KVKK Md.7 / GDPR Md.17: Saklama politikaları, otomatik imha, imha tutanakları, 5 imha yöntemi |
| **Risk Yönetimi** | KVKK Md.12 / GDPR Md.35: 5x5 risk matrisi, 7 risk kategorisi, aksiyon takibi, risk raporu export |
| **İç Denetim & Aksiyon Takibi** | 6 denetim tipi, 0-100 puanlama, aksiyon atama ve gecikme takibi |
| **Doküman Şablonları** | 10 hazır KVKK/GDPR şablonu, değişken sistemi, çoklu dil, versiyon takibi |
| **Rıza Versiyonlama** | Onay metni versiyon takibi, yeniden onay mekanizması, versiyon karşılaştırma |
| **Veri Hakkı Talepleri (DSAR)** | KVKK Md.11 / GDPR Md.15-22: Erişim, silme, düzeltme, kısıtlama, taşınabilirlik, itiraz, otomatik karar — 7 talep tipi, otomatik 30 gün deadline |
| **Veri İhlali Yönetimi** | GDPR Md.33: 72 saat countdown, risk seviyesi (düşük-kritik), durum akışı, otorite bildirim kaydı, etkilenen veri kategorileri |
| **VERBİS / RoPA Export** | KVKK VERBİS kaydı ve GDPR Md.30 RoPA formatında CSV/JSON export — 17 alan, otomatik haritalama |
| **Politika Yönetimi** | Gizlilik politikası, çerez politikası, KVKK aydınlatma, veri işleme sözleşmesi — çoklu dil, WYSIWYG, PDF/HTML export |
| **Uyumluluk Skoru** | 22 kural, 5 kategori, A-F notlandırma — banner, çerez, hukuki metinler, teknik güvenlik, veri hakları |
| **Form Rızası Takibi** | İletişim, üyelik, bülten formlarındaki KVKK onayını API ile kayıt altına alma |
| **Webhook Sistemi** | 7 olay tipi (consent, DSAR, breach), HMAC-SHA256 imzalama, Slack/Teams/n8n entegrasyonu |
| **Çerez Tarayıcı** | 50+ bilinen tracker otomatik tespiti (GA, Meta Pixel, Hotjar vb.) |
| **Site Sağlık Kontrolü** | 7 faktörlü KVKK uyumluluk taraması (SSL, banner, politika, tracker, DPO bilgisi) |
| **Tercih Merkezi** | Ziyaretçilerin çerez tercihlerini her zaman değiştirebildiği kalıcı panel + DSAR entegrasyonu |
| **AI Asistan** | RAG tabanlı KVKK/GDPR bilgi asistanı (Gemini entegrasyonu) |
| **Meşru Menfaat Değerlendirmesi (LIA)** | KVK Kurul rehberi uyumlu 3-adım balans testi: Amaç → Zorunluluk → Dengeleme; passed/failed/pending sonuç |
| **VERBİS Kaydı** | KVKK Md.16: Veri işleme aktivitesi kayıt asistanı, exemption check, otomatik export |
| **Rıza Yenileme** | KVK Kurul Çerez Rehberi 2022: 12 aylık yenileme, banner_settings entegrasyonu, `consent_renewal_required` API flag |
| **Rızayı Geri Çekme** | KVKK Md.11/1-e: `withdraw` aksiyonu, audit trail ile ispat yükümlülüğü, webhook tetikleyici |
| **Veri Saklama & İmha** | KVKK Md.7: Ortam bazlı saklama süreleri (rıza/log/izlenim), otomatik periyodik imha, `data:purge-expired` |
| **Çerez Duvarı Koruması** | KVK Kurul kararı: Cookie wall yasağı kontrolü, compliance score kuralı (ağırlık 12) |

---

## Nasıl Kurulur?

### Ön Koşullar

- Node.js 18+
- npm, yarn veya **pnpm** (önerilen)
- TypeScript 5.0+ (isteğe bağlı)

### Kurulum

#### 1. Core Paketi (@veribenim/core)

Framework-agnostic, tüm projelerde kullanılabilir temel paket:

```bash
# npm
npm install @veribenim/core

# yarn
yarn add @veribenim/core

# pnpm (önerilen)
pnpm add @veribenim/core
```

#### 2. React Paketi (@veribenim/react)

React uygulamaları için Provider ve Hooks:

```bash
pnpm add @veribenim/react @veribenim/core
```

#### 3. Next.js Paketi (@veribenim/nextjs)

Next.js 13+ (App Router & Pages Router):

```bash
pnpm add @veribenim/nextjs @veribenim/core
```

#### 4. Vue Paketi (@veribenim/vue)

Vue 3 uygulamaları için Plugin ve Composables:

```bash
pnpm add @veribenim/vue @veribenim/core
```

#### 5. Nuxt Paketi (@veribenim/nuxt)

Nuxt 3+ auto-imports ve module:

```bash
pnpm add @veribenim/nuxt
```

### Hızlı Başlangıç

#### Vanilla JavaScript

```javascript
import { Veribenim } from '@veribenim/core';

const veribenim = new Veribenim({
  token: 'your-api-token-here',
  domain: 'example.com', // Bundle script URL için
  lang: 'tr', // 'en', 'de', 'fr', 'es', 'bg', 'ar'
  debug: true, // development için
});

// Betiği yükle
await veribenim.loadScript();

// Rıza durumunu dinle
veribenim
  .onAccept(() => {
    console.log('Tüm kategoriler kabul edildi');
  })
  .onDecline(() => {
    console.log('Rıza reddedildi');
  })
  .onChange(({ preferences }) => {
    console.log('Rıza ayarları değişti:', preferences);
  });

// Rıza tercihlerini kaydet
await veribenim.savePreferences({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true,
});

// İzlenim kaydı
await veribenim.logImpression();
```

#### React

```jsx
import { VeribenimProvider, useVeribenim, ConsentBanner } from '@veribenim/react';

export default function App() {
  return (
    <VeribenimProvider
      config={{
        token: "your-api-token-here",
        domain: "example.com",
        lang: "tr",
        debug: false,
      }}
    >
      <MyApp />
    </VeribenimProvider>
  );
}

function MyApp() {
  const veribenim = useVeribenim();

  return (
    <div>
      <ConsentBanner />
      <button onClick={() => veribenim.logImpression()}>
        Log Impression
      </button>
    </div>
  );
}
```

#### Next.js 13+ (App Router)

```typescript
// app/layout.tsx
import { VeribenimProvider } from '@veribenim/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <VeribenimProvider config={{ token: "your-api-token-here", domain: "example.com", lang: "tr" }}>
          {children}
        </VeribenimProvider>
      </body>
    </html>
  );
}
```

#### Vue 3

```vue
<script setup lang="ts">
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);

app.use(VeribenimPlugin, {
  token: 'your-api-token-here',
  domain: 'example.com',
  lang: 'tr',
  debug: false,
});

app.mount('#app');
</script>

<template>
  <div>
    <ConsentBanner />
  </div>
</template>
```

#### Nuxt 3

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: 'your-api-token-here',
    domain: 'example.com',
    lang: 'tr',
    debug: false,
  },
});
```

Composable otomatik import edilir:

```vue
<script setup lang="ts">
const veribenim = useVeribenim();

onMounted(() => {
  veribenim.logImpression();
});
</script>
```

---

## Paketler

### @veribenim/core

Framework-agnostic, tüm diğer paketlerin temelini oluşturan çekirdek kütüphane.

#### Yapılandırma

```typescript
interface VeribenimConfig {
  token: string;    // Gerekli: API tokeniniz
  domain?: string;  // Bundle script URL için site domain'i (örn: 'example.com')
  lang?: 'tr' | 'en' | 'de' | 'fr' | 'es' | 'bg' | 'ar'; // Varsayılan: 'tr'
  debug?: boolean;  // Varsayılan: false
}
```

#### API Metodları

```typescript
// Betik yükleme
await veribenim.loadScript(): Promise<void>
veribenim.isScriptLoaded: boolean

// Callbacks (chainable)
veribenim.onAccept((payload) => void): Veribenim
veribenim.onDecline((payload) => void): Veribenim
veribenim.onChange(({ preferences }) => void): Veribenim

// Rıza tercihlerini getir
await veribenim.getPreferences(sessionId?: string): Promise<PreferencesResponse | null>

// Rıza tercihlerini kaydet
await veribenim.savePreferences(
  preferences: ConsentPreferences,
  sessionId?: string
): Promise<void>

// İzlenim kaydı
await veribenim.logImpression(): Promise<boolean>

// Rıza kaydı
await veribenim.logConsent(payload: ConsentLogPayload): Promise<boolean>

// Form rıza takibi
await veribenim.logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>

// Rızayı geri çekme (KVKK Md.11/1-e)
await veribenim.withdrawConsent(sessionId: string): Promise<boolean>

// DSAR (Data Subject Access Request)
await veribenim.submitDsar(payload: DsarPayload): Promise<DsarResponse | null>
```

#### Türleri

```typescript
type ConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

type PreferencesResponse = {
  sessionId: string;
  preferences: ConsentPreferences;
  acceptedAt: string;
  categories: string[];
};

type ConsentLogPayload = {
  eventName: string;
  category: 'analytics' | 'marketing' | 'preferences';
  metadata?: Record<string, any>;
};

type FormConsentPayload = {
  formId: string;
  formName: string;
  fields: Array<{
    fieldName: string;
    fieldType: 'checkbox' | 'text' | 'email' | 'phone';
    consentCategory: 'necessary' | 'analytics' | 'marketing' | 'preferences';
    value?: string;
  }>;
};

type DsarPayload = {
  requestType: 'access' | 'erasure' | 'rectification' | 'restriction' | 'portability' | 'objection' | 'automated';
  email: string;
  subject?: string;
  description: string;
};
```

### @veribenim/react

React uygulamaları için Provider, Hooks ve headless ConsentBanner.

#### Provider Kurulumu

```jsx
import { VeribenimProvider } from '@veribenim/react';

export default function App({ children }) {
  return (
    <VeribenimProvider
      config={{
        token: "your-api-token-here",
        domain: "example.com",
        lang: "tr",
      }}
    >
      {children}
    </VeribenimProvider>
  );
}
```

#### Hooks

```typescript
const veribenim = useVeribenim();
const { analytics, marketing } = useConsentCategory('analytics');
const { hasUnsaved } = useConsentPending();
```

### @veribenim/nextjs

Next.js 13+ (App Router ve Pages Router) için entegrasyon.

#### App Router

```typescript
// app/layout.tsx
import { VeribenimProvider } from '@veribenim/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <VeribenimProvider config={{ token: process.env.NEXT_PUBLIC_VERIBENIM_TOKEN!, domain: 'example.com', lang: 'tr' }}>
          {children}
        </VeribenimProvider>
      </body>
    </html>
  );
}
```

### @veribenim/vue

Vue 3 uygulamaları için Plugin ve Composables.

#### Plugin Kurulumu

```typescript
// main.ts
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);

app.use(VeribenimPlugin, {
  token: 'your-api-token-here',
  domain: 'example.com',
  lang: 'tr',
});

app.mount('#app');
```

### @veribenim/nuxt

Nuxt 3+ modülü, otomatik import ve configuration.

#### Kurulum

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
    domain: 'example.com',
    lang: 'tr',
  },
});
```

---

## Yeni KVKK Özellikleri (Nisan 2026)

### Rızayı Geri Çekme — KVKK Md.11/1-e

KVKK, rızayı geri çekmenin rıza vermek kadar kolay olmasını zorunlu kılar. `withdraw` aksiyonu ile tüm consent kaydı silinir, audit trail korunur:

```typescript
import { Veribenim } from '@veribenim/core';

const veribenim = new Veribenim({ token: 'your-token', domain: 'example.com' });

// Kullanıcı "Tüm izinleri geri çek" düğmesine tıkladığında
await veribenim.withdrawConsent(sessionId);

// React ile
function PreferenceCenter() {
  const veribenim = useVeribenim();

  const handleWithdraw = async () => {
    await veribenim.withdrawConsent();
    // Tüm analitik/pazarlama scriptlerini durdur
  };

  return <button onClick={handleWithdraw}>Tüm İzinleri Geri Çek</button>;
}
```

### Rıza Yenileme — KVK Kurul Çerez Rehberi 2022

12 aylık rıza yenileme zorunluluğu. API, `consent_renewal_required: true` döndürdüğünde banner yeniden gösterilir:

```typescript
// @veribenim/core otomatik yönetir.
// Banner ayarlarında consent_validity_days <= 365 olmalı.

veribenim.onRenewalRequired(() => {
  // Banner yeniden göster
  veribenim.showBanner();
});
```

### Çerez Duvarı Koruması

KVK Kurul kararına göre çerez duvarı (cookie wall) yasaktır. Veribenim bunu compliance score'da ağırlık 12 kuralıyla denetler:

```typescript
// banner_settings'de cookie_wall_enabled: true ise compliance skoru düşer
// Doğru yapılandırma:
const bannerSettings = {
  cookie_wall_enabled: false, // Her zaman false olmalı
  // ...
};
```

### Meşru Menfaat Değerlendirmesi (LIA)

```typescript
// Console dashboard üzerinden 3-adım balans testi yapılır:
// 1. Amaç Testi — Meşru menfaat var mı?
// 2. Zorunluluk Testi — Daha az müdahaleci alternatif?
// 3. Dengeleme Testi — Veri sahibinin hakları ağır basıyor mu?
// Sonuç: passed / failed / pending
```

---

## Güvenlik Standartları

### KVKK Uyumluluğu

Veribenim, Kişisel Verilerin Korunması Hakkında Kanun (KVKK) ve Kişisel Verileri Koruma Kurulu tarafından yayınlanan yönetmeliklerle tam uyumluluk sağlar.

| Madde | Gereklilik | Veribenim Uygulaması |
|-------|-----------|---------------------|
| **Madde 5** | Veri İşleme İlkeleri | ✅ Hukuki dayanak, amaç sınırlaması, veri minimizasyonu |
| **Madde 6** | Rıza Yönetimi | ✅ Açık, spesifik, bilgilendirilmiş rıza |
| **Madde 8** | Aydınlatma Yükümlülüğü | ✅ Veri sahibine entegre gizlilik bildirimi |
| **Madde 11** | DSAR Hakları | ✅ Erişim, Silme, Taşınabilirlik, Düzeltme, Kısıtlama |
| **Madde 12** | Veri Güvenliği | ✅ Şifreleme, access control, audit logs |
| **Madde 13** | Veri Transfer | ✅ Sadece GDPR/KVKK uyumlu ülkelere |

### GDPR Uyumluluğu

Veribenim, General Data Protection Regulation (GDPR) ile tam uyumlu olarak tasarlanmıştır.

| Madde | Başlık | Uyumluluk |
|-------|--------|----------|
| **Madde 6** | Hukuki Dayanak | ✅ Legitimate interests, contractual necessity |
| **Madde 7** | Rıza Şartları | ✅ Freely given, specific, informed, unambiguous |
| **Madde 13-14** | Aydınlatma | ✅ Otomatik veri sahibi bildirimi |
| **Madde 15** | Erişim Hakkı | ✅ DSAR: 30 gün cevap süresi |
| **Madde 17** | Silme Hakkı | ✅ DSAR: İstek 30 gün içinde işlenir |
| **Madde 20** | Taşınabilirlik | ✅ DSAR: JSON/CSV formatında export |
| **Madde 32** | Veri Güvenliği | ✅ AES-256 encryption, TLS 1.3 |
| **Madde 33** | Breach Notification | ✅ Otomatik SMS/Email bildirimi |

### Veri Şifreleme & API Güvenliği

```
Aktarım Sırasında:
├─ Protocol: TLS 1.3
├─ Cipher Suites: ECDHE-RSA-AES256-GCM-SHA384
├─ Certificate: Let's Encrypt / DigiCert
└─ HSTS: 31536000 seconds (1 year)

Depolama Sırasında:
├─ Database: AES-256-CBC encryption
├─ Keys: AWS KMS / Azure Key Vault
├─ Backups: Encrypted daily snapshots
└─ Retention: GDPR compliance (24-month max)

API Security:
├─ Method: Bearer Token (OAuth 2.0)
├─ Rotation: 90 days recommended
├─ Rate Limiting: 1000 req/min per token
└─ Monitoring: Anomaly detection
```

### Sertifikalar & Standartlar

- ✅ **ISO 27001:2022** - Bilgi Güvenliği Yönetim Sistemi
- ✅ **SOC 2 Type II** - Sistem İç Kontrol Denetimi
- ✅ **Privacy by Design** - KVKK Kurulu Rehberi
- ✅ **OWASP Top 10** - Web Uygulaması Güvenlik Kontrolleri
- ✅ **TCF 2.2** - Transparency & Consent Framework

---

## Geliştirme

### Kaynak Kodu

```bash
git clone https://github.com/pariette/veribenim-js-sdk.git
cd veribenim-js-sdk
pnpm install
```

### Build & Testing

```bash
# Tüm paketleri build et
pnpm build

# Unit testleri çalıştır
pnpm test

# TypeScript kontrol et
pnpm type-check

# Lint
pnpm lint

# Watch mode
pnpm dev
```

---

## Lisans

MIT License © [Pariette](https://veribenim.com)

---

**Daha fazla bilgi:** https://veribenim.com
**Destek:** support@veribenim.com
**Belgeler:** https://docs.veribenim.com
