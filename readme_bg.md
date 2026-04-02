# Veribenim JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@veribenim/core?style=flat-square&color=1f6feb)](https://www.npmjs.com/package/@veribenim/core)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@veribenim/core?style=flat-square)](https://www.npmjs.com/package/@veribenim/core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@veribenim/core?style=flat-square&label=bundle%20size)](https://bundlephobia.com/package/@veribenim/core)

**GDPR & KVKK Съответствие • Защита на Данни • Платформа за Управление на Съгласие (CMP)**

Veribenim е най-комплексната платформа за управление на съгласие и защита на данни в света, осигурявайки инфраструктура за сигурност на данни и съответствие с корпоративен стандарт на разработчици. Приложете управление на съгласие за бисквитки и управление на личните данни в съответствие с GDPR и KVKK с нашия SDK на JavaScript, независим от фреймворк.

---

## Съдържание

- [Защо Veribenim?](#защо-veribenim)
- [Как да Инсталирам?](#как-да-инсталирам)
- [Пакети](#пакети)
- [Стандарти за Сигурност](#стандарти-за-сигурност)
- [Разработка](#разработка)
- [Лиценз](#лиценз)

---

## Защо Veribenim?

### 🏆 Най-Комплексното Решение за Защита на Данни

Veribenim не е просто платформа за управление на съгласие – това е **пълна инфраструктура за защита на данни с корпоративен стандарт и GDPR/KVKK съответствие** за съвременни уеб приложения. Защитете личните данни и управлявайте съгласието с един единствен мощен SDK.

| Функция | Veribenim | Конкуренти |
|---------|-----------|-----------|
| **Пълно GDPR Съответствие** | ✅ Всичките 99 Членове | ⚠️ Частично Съответствие |
| **KVKK Съответствие** | ✅ Преглед на Турски Правни Експерти | ⚠️ Базово Съответствие |
| **Права на Лицата (DSAR)** | ✅ Достъп, Изтриване, Преносимост, Коригиране | ⚠️ Ограничено |
| **Управление на Съгласие (TCF 2.2)** | ✅ Пълна Интеграция | ⚠️ Базово Управление на Бисквитки |
| **Проследяване на Съгласие за Форми** | ✅ Конфигурируемо Проследяване на Форми | ❌ Не е Налично |
| **Privacy by Design** | ✅ Всички Данни Шифровани | ⚠️ Селективно Шифроване |
| **Сигурност на API** | ✅ Bearer Token + Rate Limiting | ⚠️ Базична Autентификация |
| **Логове за Одит** | ✅ Пълно Проследяване на Операциите | ⚠️ Ограничено Логване |

### 🔐 Корпоративна Сигурност & Съответствие

- **GDPR Съответствие**: Пълна реализация на всички членове
- **KVKK Съответствие**: Закон на Турция за защита на данни пълно реализация
- **Privacy by Design**: Защита на данни като основен принцип
- **Шифроване на Данни**: TLS 1.3 от край до край, AES-256-CBC в покой
- **DSAR Обработка**: Достъп, Изтриване, Преносимост, Коригиране, Ограничение, Възражане
- **Платформа за Управление на Съгласие (CMP)**: TCF 2.2 с персонализирани категории

### 🚀 Опит на Разработчика

- **Независим Nucleus от Framework**: Съвместимо с Vanilla JS, React, Vue, Nuxt, Next.js, Angular, Svelte
- **Съвременни Интеграции**: React Hooks, Vue 3 Composables, Next.js App/Pages Router
- **Пълна Поддръжка на TypeScript**: Пълна безопасност на типа и IntelliSense
- **Нулева Конфигурация**: Начнете с токен, всичко останало е автоматично
- **Лекотна**: ~8KB размер на gzip bundle
- **pnpm Monorepo**: Бърза разработка с оптимално кеширане

### 📊 Аналитика & Отчети

- Анализ на съгласието в реално време
- Месечни PDF отчети (GDPR съответни)
- Разпределение на съгласието по категория
- Проследяване на DSAR заявки
- Управление на квоти и интеграция на фактуриране

---

## Как да Инсталирам?

### Предварителни Условия

- Node.js 18+
- npm, yarn или **pnpm** (препоръчано)
- TypeScript 5.0+ (opcional)

### Инсталиране

#### 1. Core Пакет (@veribenim/core)

Независим от фреймворк пакет nucleus за всички проекти:

```bash
# npm
npm install @veribenim/core

# yarn
yarn add @veribenim/core

# pnpm (препоръчано)
pnpm add @veribenim/core
```

#### 2. React Пакет (@veribenim/react)

За React приложения с Provider и Hooks:

```bash
pnpm add @veribenim/react @veribenim/core
```

#### 3. Next.js Пакет (@veribenim/nextjs)

За Next.js 13+ (App Router & Pages Router):

```bash
pnpm add @veribenim/nextjs @veribenim/core
```

#### 4. Vue Пакет (@veribenim/vue)

За Vue 3 приложения с Plugin и Composables:

```bash
pnpm add @veribenim/vue @veribenim/core
```

#### 5. Nuxt Пакет (@veribenim/nuxt)

За Nuxt 3+ с auto-imports:

```bash
pnpm add @veribenim/nuxt
```

### Бързо Начало

#### Vanilla JavaScript

```javascript
import { Veribenim } from '@veribenim/core';

const veribenim = new Veribenim({
  token: 'your-api-token-here',
  lang: 'bg', // 'en', 'tr', 'de', 'fr', 'es', 'ar'
  debug: true, // само разработка
});

// Заредете скрипта
await veribenim.loadScript();

// Слушайте за събития на съгласие
veribenim
  .onAccept(() => {
    console.log('Всички категории приети');
  })
  .onDecline(() => {
    console.log('Съгласието е отхвърлено');
  })
  .onChange(({ preferences }) => {
    console.log('Предпочетанията са променени:', preferences);
  });

// Запазете предпочетанията
await veribenim.savePreferences({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true,
});

// Логирайте впечатление
await veribenim.logImpression();
```

#### React

```jsx
import { VeribenimProvider, useVeribenim, ConsentBanner } from '@veribenim/react';

export default function App() {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="bg"
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
        Логирай Впечатление
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
    <html lang="bg">
      <body>
        <VeribenimProvider token="your-api-token-here" lang="bg">
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
  lang: 'bg',
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
    lang: 'bg',
    debug: false,
  },
});
```

Composable автоматично се импортира:

```vue
<script setup lang="ts">
const veribenim = useVeribenim();

onMounted(() => {
  veribenim.logImpression();
});
</script>
```

---

## Пакети

### @veribenim/core

Nucleus библиотека, независима от фреймворк, която служи като основа за всички други пакети.

#### Конфигурация

```typescript
interface VeribenimConfig {
  token: string; // Задължително: Вашият API токен
  lang?: 'tr' | 'en' | 'de' | 'fr' | 'es' | 'bg' | 'ar'; // По подразбиране: 'bg'
  debug?: boolean; // По подразбиране: false
}
```

#### API Методи

```typescript
// Управление на скрипта
await veribenim.loadScript(): Promise<void>
veribenim.isScriptLoaded: boolean

// Callbacks (верижни)
veribenim.onAccept((payload) => void): Veribenim
veribenim.onDecline((payload) => void): Veribenim
veribenim.onChange(({ preferences }) => void): Veribenim

// Получете предпочетанията
await veribenim.getPreferences(sessionId?: string): Promise<PreferencesResponse | null>

// Запазете предпочетанията
await veribenim.savePreferences(
  preferences: ConsentPreferences,
  sessionId?: string
): Promise<void>

// Логирайте впечатление
await veribenim.logImpression(): Promise<boolean>

// Логирайте събитие на съгласие
await veribenim.logConsent(payload: ConsentLogPayload): Promise<boolean>

// Проследяване на съгласие за форма
await veribenim.logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>

// Изпратете DSAR заявка
await veribenim.submitDsar(payload: DsarPayload): Promise<DsarResponse | null>
```

#### Типове

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

React Provider, Hooks и безинтерфейсни компоненти ConsentBanner.

#### Конфигурация на Provider

```jsx
import { VeribenimProvider } from '@veribenim/react';

export default function App({ children }) {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="bg"
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

Интеграция Next.js 13+ за App Router и Pages Router.

#### App Router

```typescript
// app/layout.tsx
import { VeribenimProvider } from '@veribenim/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        <VeribenimProvider token={process.env.NEXT_PUBLIC_VERIBENIM_TOKEN!} lang="bg">
          {children}
        </VeribenimProvider>
      </body>
    </html>
  );
}
```

### @veribenim/vue

Vue 3 Plugin и Composables.

#### Конфигурация на Plugin

```typescript
// main.ts
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);

app.use(VeribenimPlugin, {
  token: 'your-api-token-here',
  lang: 'bg',
});

app.mount('#app');
```

### @veribenim/nuxt

Модул Nuxt 3+ с auto-imports и конфигурация.

#### Инсталиране

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
    lang: 'bg',
  },
});
```

---

## Стандарти за Сигурност

### GDPR Съответствие

Veribenim е напълно съответства на Общото регулиране относно защитата на данни (GDPR).

| Член | Заглавие | Съответствие |
|------|----------|-------------|
| **Член 6** | Законна Основа | ✅ Легитимни Интереси, Договорна Необходимост |
| **Член 7** | Условия за Съгласие | ✅ Свободно Дадено, Специфично, Информирано, Недвусмислено |
| **Членове 13-14** | Прозрачност | ✅ Автоматично Уведомление на Субекта |
| **Член 15** | Право на Достъп | ✅ DSAR: 30-Дневен Период |
| **Член 17** | Право на Забравяне | ✅ DSAR: 30-Дневна Обработка |
| **Член 20** | Преносимост на Данни | ✅ DSAR: JSON/CSV Експорт |
| **Член 32** | Сигурност на Обработката | ✅ AES-256 Шифроване, TLS 1.3 |
| **Член 33** | Уведомление за Нарушение | ✅ Автоматични SMS/Email Предупреждения |

### KVKK Съответствие

Veribenim е напълно съответства на турския закон за защита на данни (KVKK).

| Член | Изискване | Реализация |
|------|-----------|-----------|
| **Член 5** | Принципи на Обработката | ✅ Законна Основа, Ограничение на Целта, Минимизиране |
| **Член 6** | Управление на Съгласие | ✅ Явно, Специфично, Информирано Съгласие |
| **Член 8** | Задължение за Уведомление | ✅ Интегрирано Известие за Защита |
| **Член 11** | DSAR Права | ✅ Достъп, Изтриване, Преносимост, Коригиране, Ограничение |
| **Член 12** | Сигурност на Данни | ✅ Шифроване, Контрол на Достъпа, Логове за Одит |

### Шифроване на Данни & Сигурност на API

```
При Передача:
├─ Протокол: TLS 1.3
├─ Cipher Suites: ECDHE-RSA-AES256-GCM-SHA384
├─ Сертификат: Let's Encrypt / DigiCert
└─ HSTS: 31536000 Секунди (1 Година)

В Покой:
├─ База Данни: AES-256-CBC Шифроване
├─ Ключове: AWS KMS / Azure Key Vault
├─ Резервни Копия: Дневни Шифровани Снимки
└─ Запазване: GDPR Съответствие (Макс. 24 Месеца)

Сигурност на API:
├─ Метод: Bearer Token (OAuth 2.0)
├─ Ротация: Всеки 90 Дни Препоръчано
├─ Rate Limiting: 1000 Заявки/Мин на Токен
└─ Мониторинг: Обнаружение на Аномалии
```

### Сертификати & Стандарти

- ✅ **ISO 27001:2022** - Система за Управление на Информационната Сигурност
- ✅ **SOC 2 Type II** - Контроли и Организация на Система
- ✅ **Privacy by Design** - Насоки на GDPR
- ✅ **OWASP Top 10** - Контроли на Сигурността на Уеб Приложения
- ✅ **TCF 2.2** - Рамка за Прозрачност и Съгласие

---

## Разработка

### Изходен Код

```bash
git clone https://github.com/pariette/veribenim-js-sdk.git
cd veribenim-js-sdk
pnpm install
```

### Build & Testing

```bash
# Изградете всички пакети
pnpm build

# Изпълнете unit тестове
pnpm test

# TypeScript Проверка
pnpm type-check

# Lint
pnpm lint

# Режим на Разработка Watch
pnpm dev
```

---

## Лиценз

MIT License © [Pariette](https://veribenim.com)

---

**Още Информация:** https://veribenim.com
**Поддръжка:** support@veribenim.com
**Документация:** https://docs.veribenim.com
