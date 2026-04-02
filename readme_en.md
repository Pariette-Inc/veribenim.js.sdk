# Veribenim JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@veribenim/core?style=flat-square&color=1f6feb)](https://www.npmjs.com/package/@veribenim/core)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@veribenim/core?style=flat-square)](https://www.npmjs.com/package/@veribenim/core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@veribenim/core?style=flat-square&label=bundle%20size)](https://bundlephobia.com/package/@veribenim/core)

**KVKK & GDPR Compliant • Data Privacy • Consent Management Platform (CMP)**

Veribenim is the world's most comprehensive Data Privacy and Consent Management Platform, delivering enterprise-grade data security and compliance infrastructure to developers worldwide. Implement KVKK and GDPR-compliant cookie consent and personal data management with our framework-agnostic JavaScript SDK.

---

## Table of Contents

- [Why Veribenim?](#why-veribenim)
- [How to Install](#how-to-install)
- [Packages](#packages)
- [Security Standards](#security-standards)
- [Development](#development)
- [License](#license)

---

## Why Veribenim?

### 🏆 The Most Comprehensive Data Privacy Solution

Veribenim isn't just a Consent Management Platform—it's **complete enterprise-grade data protection and KVKK/GDPR compliance infrastructure** for modern web applications. Protect personal data and manage consent with a single, powerful SDK.

| Feature | Veribenim | Competitors |
|---------|-----------|------------|
| **KVKK Full Compliance** | ✅ Turkish Legal Expert Review | ⚠️ Basic Compliance |
| **GDPR Article Mapping** | ✅ All 99 Articles Tracked | ⚠️ Partial Coverage |
| **Data Subject Rights (DSAR)** | ✅ Access, Erasure, Portability, Rectification | ⚠️ Limited |
| **Consent Management (TCF 2.2)** | ✅ Full Integration | ⚠️ Basic Cookie Consent |
| **Form Consent Tracking** | ✅ Configurable Form Tracking | ❌ Not Available |
| **Privacy by Design** | ✅ All Data Encrypted at Rest | ⚠️ Selective Encryption |
| **API Security** | ✅ Bearer Token + Rate Limiting | ⚠️ Basic Auth |
| **Audit Logs** | ✅ Complete Operation Tracking | ⚠️ Limited Logging |

### 🔐 Enterprise Security & Compliance

- **KVKK Compliance**: Turkish Data Protection Act full implementation
- **GDPR Compliance**: All 99 articles with detailed application
- **Privacy by Design**: Privacy as a foundational principle
- **Data Encryption**: End-to-end TLS 1.3, AES-256-CBC at rest
- **DSAR Processing**: Access, Erasure, Portability, Rectification, Restriction, Objection
- **Consent Management Platform (CMP)**: TCF 2.2 with custom categories

### 🚀 Developer Experience

- **Framework-Agnostic Core**: Compatible with Vanilla JS, React, Vue, Nuxt, Next.js, Angular, Svelte
- **Modern Integrations**: React Hooks, Vue 3 Composables, Next.js App/Pages Router
- **Full TypeScript Support**: Complete type safety and IntelliSense
- **Zero Configuration**: Start with a token, everything else is automatic
- **Lightweight**: ~8KB gzip bundle size
- **pnpm Monorepo**: Fast development with optimal caching

### 📊 Analytics & Reporting

- Real-time consent analytics
- Monthly PDF reports (KVKK compliant)
- Category-based consent distribution
- DSAR request tracking
- Quota management and billing integration

---

## How to Install

### Prerequisites

- Node.js 18+
- npm, yarn, or **pnpm** (recommended)
- TypeScript 5.0+ (optional)

### Installation

#### 1. Core Package (@veribenim/core)

Framework-agnostic core package for all projects:

```bash
# npm
npm install @veribenim/core

# yarn
yarn add @veribenim/core

# pnpm (recommended)
pnpm add @veribenim/core
```

#### 2. React Package (@veribenim/react)

For React applications with Provider and Hooks:

```bash
pnpm add @veribenim/react @veribenim/core
```

#### 3. Next.js Package (@veribenim/nextjs)

For Next.js 13+ (App Router & Pages Router):

```bash
pnpm add @veribenim/nextjs @veribenim/core
```

#### 4. Vue Package (@veribenim/vue)

For Vue 3 applications with Plugin and Composables:

```bash
pnpm add @veribenim/vue @veribenim/core
```

#### 5. Nuxt Package (@veribenim/nuxt)

For Nuxt 3+ with auto-imports:

```bash
pnpm add @veribenim/nuxt
```

### Quick Start

#### Vanilla JavaScript

```javascript
import { Veribenim } from '@veribenim/core';

const veribenim = new Veribenim({
  token: 'your-api-token-here',
  lang: 'en', // 'tr', 'de', 'fr', 'es', 'bg', 'ar'
  debug: true, // development only
});

// Load the script
await veribenim.loadScript();

// Listen for consent events
veribenim
  .onAccept(() => {
    console.log('All categories accepted');
  })
  .onDecline(() => {
    console.log('Consent declined');
  })
  .onChange(({ preferences }) => {
    console.log('Preferences changed:', preferences);
  });

// Save preferences
await veribenim.savePreferences({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true,
});

// Log impression
await veribenim.logImpression();
```

#### React

```jsx
import { VeribenimProvider, useVeribenim, ConsentBanner } from '@veribenim/react';

export default function App() {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="en"
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
    <html lang="en">
      <body>
        <VeribenimProvider token="your-api-token-here" lang="en">
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
  lang: 'en',
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
    lang: 'en',
    debug: false,
  },
});
```

Composable is auto-imported:

```vue
<script setup lang="ts">
const veribenim = useVeribenim();

onMounted(() => {
  veribenim.logImpression();
});
</script>
```

---

## Packages

### @veribenim/core

Framework-agnostic core library that serves as the foundation for all other packages.

#### Configuration

```typescript
interface VeribenimConfig {
  token: string; // Required: Your API token
  lang?: 'tr' | 'en' | 'de' | 'fr' | 'es' | 'bg' | 'ar'; // Default: 'en'
  debug?: boolean; // Default: false
}
```

#### API Methods

```typescript
// Script management
await veribenim.loadScript(): Promise<void>
veribenim.isScriptLoaded: boolean

// Callbacks (chainable)
veribenim.onAccept((payload) => void): Veribenim
veribenim.onDecline((payload) => void): Veribenim
veribenim.onChange(({ preferences }) => void): Veribenim

// Get preferences
await veribenim.getPreferences(sessionId?: string): Promise<PreferencesResponse | null>

// Save preferences
await veribenim.savePreferences(
  preferences: ConsentPreferences,
  sessionId?: string
): Promise<void>

// Log impression
await veribenim.logImpression(): Promise<boolean>

// Log consent event
await veribenim.logConsent(payload: ConsentLogPayload): Promise<boolean>

// Track form consent
await veribenim.logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>

// Submit DSAR request
await veribenim.submitDsar(payload: DsarPayload): Promise<DsarResponse | null>
```

#### Types

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

React Provider, Hooks, and headless ConsentBanner components.

#### Provider Setup

```jsx
import { VeribenimProvider } from '@veribenim/react';

export default function App({ children }) {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="en"
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

Next.js 13+ integration for both App Router and Pages Router.

#### App Router

```typescript
// app/layout.tsx
import { VeribenimProvider } from '@veribenim/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VeribenimProvider token={process.env.NEXT_PUBLIC_VERIBENIM_TOKEN!} lang="en">
          {children}
        </VeribenimProvider>
      </body>
    </html>
  );
}
```

### @veribenim/vue

Vue 3 Plugin and Composables.

#### Plugin Setup

```typescript
// main.ts
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);

app.use(VeribenimPlugin, {
  token: 'your-api-token-here',
  lang: 'en',
});

app.mount('#app');
```

### @veribenim/nuxt

Nuxt 3+ module with auto-imports and configuration.

#### Installation

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
    lang: 'en',
  },
});
```

---

## Security Standards

### KVKK Compliance

Veribenim is fully compliant with the Turkish Personal Data Protection Act (KVKK) and all regulations issued by the Personal Data Protection Authority.

| Article | Requirement | Veribenim Implementation |
|---------|------------|-------------------------|
| **Article 5** | Data Processing Principles | ✅ Legal basis, purpose limitation, data minimization |
| **Article 6** | Consent Management | ✅ Explicit, specific, informed consent |
| **Article 8** | Notification Obligation | ✅ Integrated privacy notice |
| **Article 11** | DSAR Rights | ✅ Access, Erasure, Portability, Rectification, Restriction |
| **Article 12** | Data Security | ✅ Encryption, access control, audit logs |
| **Article 13** | Data Transfer | ✅ Only to GDPR/KVKK compliant countries |

### GDPR Compliance

Veribenim is architected for full General Data Protection Regulation compliance.

| Article | Title | Compliance |
|---------|-------|-----------|
| **Article 6** | Legal Basis | ✅ Legitimate interests, contractual necessity |
| **Article 7** | Consent Conditions | ✅ Freely given, specific, informed, unambiguous |
| **Articles 13-14** | Transparency | ✅ Automatic data subject notification |
| **Article 15** | Right of Access | ✅ DSAR: 30-day response deadline |
| **Article 17** | Right to Erasure | ✅ DSAR: 30-day processing |
| **Article 20** | Data Portability | ✅ DSAR: JSON/CSV export format |
| **Article 32** | Data Security | ✅ AES-256 encryption, TLS 1.3 |
| **Article 33** | Breach Notification | ✅ Automatic SMS/Email alerts |

### Data Encryption & API Security

```
In Transit:
├─ Protocol: TLS 1.3
├─ Cipher Suites: ECDHE-RSA-AES256-GCM-SHA384
├─ Certificate: Let's Encrypt / DigiCert
└─ HSTS: 31536000 seconds (1 year)

At Rest:
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

### Certifications & Standards

- ✅ **ISO 27001:2022** - Information Security Management System
- ✅ **SOC 2 Type II** - System and Organization Controls
- ✅ **Privacy by Design** - KVKK Authority Guidelines
- ✅ **OWASP Top 10** - Web Application Security Controls
- ✅ **TCF 2.2** - Transparency & Consent Framework

---

## Development

### Source Code

```bash
git clone https://github.com/pariette/veribenim-js-sdk.git
cd veribenim-js-sdk
pnpm install
```

### Build & Testing

```bash
# Build all packages
pnpm build

# Run unit tests
pnpm test

# TypeScript check
pnpm type-check

# Lint
pnpm lint

# Development watch mode
pnpm dev
```

---

## License

MIT License © [Pariette](https://veribenim.com)

---

**Learn More:** https://veribenim.com
**Support:** support@veribenim.com
**Documentation:** https://docs.veribenim.com
