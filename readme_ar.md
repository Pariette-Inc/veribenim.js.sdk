<!-- RTL -->

# Veribenim JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@veribenim/core?style=flat-square&color=1f6feb)](https://www.npmjs.com/package/@veribenim/core)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@veribenim/core?style=flat-square)](https://www.npmjs.com/package/@veribenim/core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@veribenim/core?style=flat-square&label=bundle%20size)](https://bundlephobia.com/package/@veribenim/core)

**امتثال GDPR و KVKK • حماية البيانات • منصة إدارة الموافقة (CMP)**

Veribenim هي أكثر منصة شاملة لإدارة الموافقة وحماية البيانات في العالم، وتوفر البنية التحتية لأمان البيانات والامتثال على مستوى المؤسسات للمطورين. قم بتنفيذ إدارة موافقة ملفات تعريف الارتباط وإدارة البيانات الشخصية بما يتوافق مع GDPR و KVKK باستخدام SDK JavaScript الخاص بنا المستقل عن الإطار.

---

## جدول المحتويات

- [لماذا Veribenim؟](#لماذا-veribenim)
- [كيفية التثبيت؟](#كيفية-التثبيت)
- [الحزم](#الحزم)
- [معايير الأمان](#معايير-الأمان)
- [التطوير](#التطوير)
- [الترخيص](#الترخيص)

---

## لماذا Veribenim؟

### 🏆 الحل الأكثر شمولاً لحماية البيانات

Veribenim ليست مجرد منصة لإدارة الموافقة – فهي **البنية التحتية الكاملة لحماية البيانات على مستوى المؤسسات وامتثال GDPR/KVKK** للتطبيقات الويب الحديثة. حماية البيانات الشخصية وإدارة الموافقة باستخدام SDK واحد قوي.

| الميزة | Veribenim | المنافسون |
|--------|----------|----------|
| **امتثال GDPR الكامل** | ✅ جميع المواد الـ 99 | ⚠️ امتثال جزئي |
| **امتثال KVKK** | ✅ مراجعة الخبراء القانونيين الأتراك | ⚠️ امتثال أساسي |
| **حقوق الشخص (DSAR)** | ✅ الوصول والحذف والنقل والتصحيح | ⚠️ محدود |
| **إدارة الموافقة (TCF 2.2)** | ✅ تكامل كامل | ⚠️ إدارة ملفات تعريف أساسية |
| **تتبع موافقة النموذج** | ✅ تتبع النموذج القابل للتكوين | ❌ غير متوفر |
| **Privacy by Design** | ✅ جميع البيانات المشفرة | ⚠️ تشفير انتقائي |
| **أمان API** | ✅ Bearer Token + Rate Limiting | ⚠️ مصادقة أساسية |
| **سجلات التدقيق** | ✅ تتبع العمليات الكامل | ⚠️ تسجيل محدود |

### 🔐 أمان المؤسسات والامتثال

- **امتثال GDPR**: تنفيذ كامل لجميع المواد
- **امتثال KVKK**: قانون حماية البيانات التركي تنفيذ كامل
- **الخصوصية بالتصميم**: الخصوصية كمبدأ أساسي
- **تشفير البيانات**: TLS 1.3 من طرف إلى طرف، AES-256-CBC في الراحة
- **معالجة DSAR**: الوصول والحذف والنقل والتصحيح والتقييد والاعتراض
- **منصة إدارة الموافقة (CMP)**: TCF 2.2 مع فئات مخصصة

### 🚀 تجربة المطور

- **نواة مستقلة عن الإطار**: متوافقة مع JavaScript Vanilla و React و Vue و Nuxt و Next.js و Angular و Svelte
- **التكاملات الحديثة**: React Hooks و Vue 3 Composables و Next.js App/Pages Router
- **دعم TypeScript الكامل**: سلامة النوع الكاملة و IntelliSense
- **تكوين صفري**: ابدأ برمز، كل شيء آخر تلقائي
- **خفيف الوزن**: ~8KB حجم حزمة gzip
- **pnpm Monorepo**: تطوير سريع مع تخزين مؤقت أمثل

### 📊 التحليلات والتقارير

- تحليل الموافقة في الوقت الفعلي
- تقارير PDF شهرية (متوافقة مع GDPR)
- توزيع الموافقة حسب الفئة
- تتبع طلبات DSAR
- إدارة الحصص وتكامل الفواتير

---

## كيفية التثبيت؟

### المتطلبات الأساسية

- Node.js 18+
- npm أو yarn أو **pnpm** (موصى به)
- TypeScript 5.0+ (اختياري)

### التثبيت

#### 1. حزمة Core (@veribenim/core)

حزمة النواة المستقلة عن الإطار لجميع المشاريع:

```bash
# npm
npm install @veribenim/core

# yarn
yarn add @veribenim/core

# pnpm (موصى به)
pnpm add @veribenim/core
```

#### 2. حزمة React (@veribenim/react)

لتطبيقات React مع Provider و Hooks:

```bash
pnpm add @veribenim/react @veribenim/core
```

#### 3. حزمة Next.js (@veribenim/nextjs)

لـ Next.js 13+ (App Router & Pages Router):

```bash
pnpm add @veribenim/nextjs @veribenim/core
```

#### 4. حزمة Vue (@veribenim/vue)

لتطبيقات Vue 3 مع Plugin و Composables:

```bash
pnpm add @veribenim/vue @veribenim/core
```

#### 5. حزمة Nuxt (@veribenim/nuxt)

لـ Nuxt 3+ مع الاستيراد التلقائي:

```bash
pnpm add @veribenim/nuxt
```

### البدء السريع

#### JavaScript Vanilla

```javascript
import { Veribenim } from '@veribenim/core';

const veribenim = new Veribenim({
  token: 'your-api-token-here',
  lang: 'ar', // 'en', 'tr', 'de', 'fr', 'es', 'bg'
  debug: true, // التطوير فقط
});

// تحميل البرنامج النصي
await veribenim.loadScript();

// الاستماع لأحداث الموافقة
veribenim
  .onAccept(() => {
    console.log('تم قبول جميع الفئات');
  })
  .onDecline(() => {
    console.log('تم رفض الموافقة');
  })
  .onChange(({ preferences }) => {
    console.log('تم تغيير التفضيلات:', preferences);
  });

// حفظ التفضيلات
await veribenim.savePreferences({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true,
});

// تسجيل الانطباع
await veribenim.logImpression();
```

#### React

```jsx
import { VeribenimProvider, useVeribenim, ConsentBanner } from '@veribenim/react';

export default function App() {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="ar"
      debug={false}
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
        تسجيل الانطباع
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
    <html lang="ar" dir="rtl">
      <body>
        <VeribenimProvider token="your-api-token-here" lang="ar">
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
  lang: 'ar',
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
    lang: 'ar',
    debug: false,
  },
});
```

يتم استيراد Composable تلقائياً:

```vue
<script setup lang="ts">
const veribenim = useVeribenim();

onMounted(() => {
  veribenim.logImpression();
});
</script>
```

---

## الحزم

### @veribenim/core

مكتبة النواة المستقلة عن الإطار التي تخدم كأساس لجميع الحزم الأخرى.

#### الإعدادات

```typescript
interface VeribenimConfig {
  token: string; // مطلوب: رمز API الخاص بك
  lang?: 'tr' | 'en' | 'de' | 'fr' | 'es' | 'bg' | 'ar'; // الافتراضي: 'ar'
  debug?: boolean; // الافتراضي: false
}
```

#### طرق API

```typescript
// إدارة النصوص البرمجية
await veribenim.loadScript(): Promise<void>
veribenim.isScriptLoaded: boolean

// Callbacks (قابلة للسلسلة)
veribenim.onAccept((payload) => void): Veribenim
veribenim.onDecline((payload) => void): Veribenim
veribenim.onChange(({ preferences }) => void): Veribenim

// احصل على التفضيلات
await veribenim.getPreferences(sessionId?: string): Promise<PreferencesResponse | null>

// حفظ التفضيلات
await veribenim.savePreferences(
  preferences: ConsentPreferences,
  sessionId?: string
): Promise<void>

// تسجيل الانطباع
await veribenim.logImpression(): Promise<boolean>

// تسجيل حدث الموافقة
await veribenim.logConsent(payload: ConsentLogPayload): Promise<boolean>

// تتبع موافقة النموذج
await veribenim.logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>

// تقديم طلب DSAR
await veribenim.submitDsar(payload: DsarPayload): Promise<DsarResponse | null>
```

#### الأنواع

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

مزود React و Hooks ومكونات ConsentBanner بدون واجهة.

#### إعداد المزود

```jsx
import { VeribenimProvider } from '@veribenim/react';

export default function App({ children }) {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="ar"
      debug={false}
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

تكامل Next.js 13+ لـ App Router و Pages Router.

#### App Router

```typescript
// app/layout.tsx
import { VeribenimProvider } from '@veribenim/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <VeribenimProvider token={process.env.NEXT_PUBLIC_VERIBENIM_TOKEN!} lang="ar">
          {children}
        </VeribenimProvider>
      </body>
    </html>
  );
}
```

### @veribenim/vue

Vue 3 Plugin و Composables.

#### إعداد المكون الإضافي

```typescript
// main.ts
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);

app.use(VeribenimPlugin, {
  token: 'your-api-token-here',
  lang: 'ar',
});

app.mount('#app');
```

### @veribenim/nuxt

وحدة Nuxt 3+ مع الاستيراد التلقائي والتكوين.

#### التثبيت

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
    lang: 'ar',
  },
});
```

---

## معايير الأمان

### امتثال GDPR

Veribenim متوافق بالكامل مع اللائحة العامة لحماية البيانات (GDPR).

| المادة | العنوان | الامتثال |
|--------|---------|---------|
| **المادة 6** | الأساس القانوني | ✅ المصالح المشروعة والضرورة التعاقدية |
| **المادة 7** | شروط الموافقة | ✅ مُعطى بحرية وحددة ومعلومة وواضحة |
| **المواد 13-14** | الشفافية | ✅ إخطار تلقائي لصاحب البيانات |
| **المادة 15** | حق الوصول | ✅ DSAR: فترة 30 يوم |
| **المادة 17** | حق النسيان | ✅ DSAR: معالجة في 30 يوم |
| **المادة 20** | نقل البيانات | ✅ DSAR: تصدير JSON/CSV |
| **المادة 32** | أمان المعالجة | ✅ تشفير AES-256 و TLS 1.3 |
| **المادة 33** | إخطار الانتهاك | ✅ تنبيهات SMS/البريد الإلكتروني التلقائية |

### امتثال KVKK

Veribenim متوافق بالكامل مع القانون التركي لحماية البيانات (KVKK).

| المادة | المتطلب | التنفيذ |
|--------|---------|---------|
| **المادة 5** | مبادئ المعالجة | ✅ الأساس القانوني والحد من الغرض والتقليل |
| **المادة 6** | إدارة الموافقة | ✅ موافقة صريحة وحددة ومعلومة |
| **المادة 8** | التزام الإخطار | ✅ إشعار الحماية المدمج |
| **المادة 11** | حقوق DSAR | ✅ الوصول والحذف والنقل والتصحيح والتقييد |
| **المادة 12** | أمان البيانات | ✅ التشفير والتحكم في الوصول وسجلات التدقيق |

### تشفير البيانات وأمان API

```
أثناء النقل:
├─ البروتوكول: TLS 1.3
├─ Cipher Suites: ECDHE-RSA-AES256-GCM-SHA384
├─ الشهادة: Let's Encrypt / DigiCert
└─ HSTS: 31536000 ثانية (سنة واحدة)

في الراحة:
├─ قاعدة البيانات: تشفير AES-256-CBC
├─ المفاتيح: AWS KMS / Azure Key Vault
├─ النسخ الاحتياطية: لقطات يومية مشفرة
└─ الاحتفاظ: امتثال GDPR (الحد الأقصى 24 شهر)

أمان API:
├─ الطريقة: Bearer Token (OAuth 2.0)
├─ التناوب: موصى به كل 90 يوم
├─ Rate Limiting: 1000 طلب/دقيقة لكل رمز
└─ المراقبة: اكتشاف الشذوذ
```

### الشهادات والمعايير

- ✅ **ISO 27001:2022** - نظام إدارة أمان المعلومات
- ✅ **SOC 2 Type II** - نظام التحكم والتنظيم
- ✅ **Privacy by Design** - إرشادات GDPR
- ✅ **OWASP Top 10** - تحكم أمان تطبيقات الويب
- ✅ **TCF 2.2** - إطار الشفافية والموافقة

---

## التطوير

### الكود المصدري

```bash
git clone https://github.com/pariette/veribenim-js-sdk.git
cd veribenim-js-sdk
pnpm install
```

### البناء والاختبار

```bash
# بناء جميع الحزم
pnpm build

# تشغيل اختبارات الوحدة
pnpm test

# فحص TypeScript
pnpm type-check

# Lint
pnpm lint

# وضع المراقبة للتطوير
pnpm dev
```

---

## الترخيص

MIT License © [Pariette](https://veribenim.com)

---

**معلومات أكثر:** https://veribenim.com
**الدعم:** support@veribenim.com
**التوثيق:** https://docs.veribenim.com
