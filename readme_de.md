# Veribenim JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@veribenim/core?style=flat-square&color=1f6feb)](https://www.npmjs.com/package/@veribenim/core)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@veribenim/core?style=flat-square)](https://www.npmjs.com/package/@veribenim/core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@veribenim/core?style=flat-square&label=bundle%20size)](https://bundlephobia.com/package/@veribenim/core)

**DSGVO & KVKK konform • Datenschutz • Consent Management Platform (CMP)**

Veribenim ist die umfassendste Datenschutz- und Einwilligungsverwaltungsplattform weltweit und bietet Enterprise-Grade-Datensicherheit und Compliance-Infrastruktur für Entwickler. Implementieren Sie DSGVO- und KVKK-konforme Cookie-Zustimmung und Verwaltung personenbezogener Daten mit unserem Framework-agnostischen JavaScript-SDK.

---

## Inhaltsverzeichnis

- [Warum Veribenim?](#warum-veribenim)
- [Installationsanleitung](#installationsanleitung)
- [Pakete](#pakete)
- [Sicherheitsstandards](#sicherheitsstandards)
- [Entwicklung](#entwicklung)
- [Lizenz](#lizenz)

---

## Warum Veribenim?

### 🏆 Die umfassendste Datenschutzlösung

Veribenim ist nicht nur eine Consent Management Platform – es ist **vollständige Enterprise-Grade-Datenschutzinfrastruktur und DSGVO/KVKK-Compliance** für moderne Web-Anwendungen. Schützen Sie personenbezogene Daten und verwalten Sie Einwilligungen mit einem einzigen, leistungsstarken SDK.

| Funktion | Veribenim | Konkurrenten |
|----------|-----------|-------------|
| **DSGVO Vollständige Konformität** | ✅ Alle 99 Artikel | ⚠️ Teilweise Konformität |
| **KVKK Konformität** | ✅ Türkische Rechtsexperten | ⚠️ Grundlegende Konformität |
| **Datenschutzrechte (DSAR)** | ✅ Zugang, Löschung, Portabilität, Berichtigung | ⚠️ Begrenzt |
| **Consent Management (TCF 2.2)** | ✅ Vollständige Integration | ⚠️ Grundlegende Cookie-Verwaltung |
| **Formularzustimmungs-Tracking** | ✅ Konfigurierbare Formularverfolgung | ❌ Nicht verfügbar |
| **Privacy by Design** | ✅ Alle Daten verschlüsselt | ⚠️ Selektive Verschlüsselung |
| **API-Sicherheit** | ✅ Bearer Token + Rate Limiting | ⚠️ Grundlegende Auth |
| **Audit Logs** | ✅ Vollständige Operationsverfolgung | ⚠️ Begrenzte Protokollierung |

### 🔐 Enterprise-Sicherheit & Compliance

- **DSGVO-Konformität**: Alle 99 Artikel mit detaillierter Anwendung
- **KVKK-Konformität**: Türkisches Datenschutzgesetz vollständig implementiert
- **Privacy by Design**: Datenschutz als Grundprinzip
- **Datenverschlüsselung**: End-to-End TLS 1.3, AES-256-CBC im Ruhezustand
- **DSAR-Verarbeitung**: Zugang, Löschung, Portabilität, Berichtigung, Einschränkung, Widerspruch
- **Consent Management Platform (CMP)**: TCF 2.2 mit benutzerdefinierten Kategorien

### 🚀 Entwickler-Erlebnis

- **Framework-agnostischer Kern**: Kompatibel mit Vanilla JS, React, Vue, Nuxt, Next.js, Angular, Svelte
- **Moderne Integrationen**: React Hooks, Vue 3 Composables, Next.js App/Pages Router
- **Vollständige TypeScript-Unterstützung**: Vollständige Typsicherheit und IntelliSense
- **Nullkonfiguration**: Starten Sie mit einem Token, alles andere ist automatisch
- **Leichtgewicht**: ~8KB gzip Bundle-Größe
- **pnpm Monorepo**: Schnelle Entwicklung mit optimalem Caching

### 📊 Analytik & Berichterstattung

- Echtzeit-Zustimmungsanalysen
- Monatliche PDF-Berichte (DSGVO-konform)
- Kategoriebasierte Zustimmungsverteilung
- DSAR-Anfragen-Tracking
- Quotenverwaltung und Billing-Integration

---

## Installationsanleitung

### Voraussetzungen

- Node.js 18+
- npm, yarn oder **pnpm** (empfohlen)
- TypeScript 5.0+ (optional)

### Installation

#### 1. Core-Paket (@veribenim/core)

Framework-agnostisches Kernpaket für alle Projekte:

```bash
# npm
npm install @veribenim/core

# yarn
yarn add @veribenim/core

# pnpm (empfohlen)
pnpm add @veribenim/core
```

#### 2. React-Paket (@veribenim/react)

Für React-Anwendungen mit Provider und Hooks:

```bash
pnpm add @veribenim/react @veribenim/core
```

#### 3. Next.js-Paket (@veribenim/nextjs)

Für Next.js 13+ (App Router & Pages Router):

```bash
pnpm add @veribenim/nextjs @veribenim/core
```

#### 4. Vue-Paket (@veribenim/vue)

Für Vue 3-Anwendungen mit Plugin und Composables:

```bash
pnpm add @veribenim/vue @veribenim/core
```

#### 5. Nuxt-Paket (@veribenim/nuxt)

Für Nuxt 3+ mit Auto-Imports:

```bash
pnpm add @veribenim/nuxt
```

### Schnelleinstieg

#### Vanilla JavaScript

```javascript
import { Veribenim } from '@veribenim/core';

const veribenim = new Veribenim({
  token: 'your-api-token-here',
  lang: 'de', // 'en', 'tr', 'fr', 'es', 'bg', 'ar'
  debug: true, // nur für Entwicklung
});

// Laden Sie das Skript
await veribenim.loadScript();

// Hören Sie auf Zustimmungsereignisse
veribenim
  .onAccept(() => {
    console.log('Alle Kategorien akzeptiert');
  })
  .onDecline(() => {
    console.log('Zustimmung abgelehnt');
  })
  .onChange(({ preferences }) => {
    console.log('Einstellungen geändert:', preferences);
  });

// Speichern Sie Einstellungen
await veribenim.savePreferences({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true,
});

// Protokollieren Sie Eindruck
await veribenim.logImpression();
```

#### React

```jsx
import { VeribenimProvider, useVeribenim, ConsentBanner } from '@veribenim/react';

export default function App() {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="de"
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
        Eindruck protokollieren
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
    <html lang="de">
      <body>
        <VeribenimProvider token="your-api-token-here" lang="de">
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
  lang: 'de',
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
    lang: 'de',
    debug: false,
  },
});
```

Composable wird automatisch importiert:

```vue
<script setup lang="ts">
const veribenim = useVeribenim();

onMounted(() => {
  veribenim.logImpression();
});
</script>
```

---

## Pakete

### @veribenim/core

Framework-agnostische Kernbibliothek, die als Grundlage für alle anderen Pakete dient.

#### Konfiguration

```typescript
interface VeribenimConfig {
  token: string; // Erforderlich: Ihr API-Token
  lang?: 'tr' | 'en' | 'de' | 'fr' | 'es' | 'bg' | 'ar'; // Standardwert: 'de'
  debug?: boolean; // Standardwert: false
}
```

#### API-Methoden

```typescript
// Skriptverwaltung
await veribenim.loadScript(): Promise<void>
veribenim.isScriptLoaded: boolean

// Callbacks (verkettbar)
veribenim.onAccept((payload) => void): Veribenim
veribenim.onDecline((payload) => void): Veribenim
veribenim.onChange(({ preferences }) => void): Veribenim

// Einstellungen abrufen
await veribenim.getPreferences(sessionId?: string): Promise<PreferencesResponse | null>

// Einstellungen speichern
await veribenim.savePreferences(
  preferences: ConsentPreferences,
  sessionId?: string
): Promise<void>

// Eindruck protokollieren
await veribenim.logImpression(): Promise<boolean>

// Zustimmungsereignis protokollieren
await veribenim.logConsent(payload: ConsentLogPayload): Promise<boolean>

// Formularzustimmung verfolgen
await veribenim.logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>

// DSAR-Anfrage einreichen
await veribenim.submitDsar(payload: DsarPayload): Promise<DsarResponse | null>
```

#### Typen

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

React Provider, Hooks und headless ConsentBanner-Komponenten.

#### Provider-Setup

```jsx
import { VeribenimProvider } from '@veribenim/react';

export default function App({ children }) {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="de"
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

Next.js 13+ Integration für App Router und Pages Router.

#### App Router

```typescript
// app/layout.tsx
import { VeribenimProvider } from '@veribenim/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <VeribenimProvider token={process.env.NEXT_PUBLIC_VERIBENIM_TOKEN!} lang="de">
          {children}
        </VeribenimProvider>
      </body>
    </html>
  );
}
```

### @veribenim/vue

Vue 3 Plugin und Composables.

#### Plugin-Setup

```typescript
// main.ts
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);

app.use(VeribenimPlugin, {
  token: 'your-api-token-here',
  lang: 'de',
});

app.mount('#app');
```

### @veribenim/nuxt

Nuxt 3+ Modul mit Auto-Imports und Konfiguration.

#### Installation

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
    lang: 'de',
  },
});
```

---

## Sicherheitsstandards

### DSGVO-Konformität

Veribenim ist vollständig konform mit der Datenschutz-Grundverordnung (DSGVO).

| Artikel | Titel | Konformität |
|---------|-------|-----------|
| **Artikel 6** | Rechtmäßigkeit der Verarbeitung | ✅ Berechtigte Interessen, Vertragserfordernis |
| **Artikel 7** | Bedingungen für die Einwilligung | ✅ Freiwillig, spezifisch, informiert, unmissverständlich |
| **Artikel 13-14** | Transparenz | ✅ Automatische Benachrichtigung des Betroffenen |
| **Artikel 15** | Auskunftsrecht | ✅ DSAR: 30-Tage-Frist |
| **Artikel 17** | Recht auf Löschung | ✅ DSAR: 30-Tage-Verarbeitung |
| **Artikel 20** | Recht auf Datenportabilität | ✅ DSAR: JSON/CSV-Export |
| **Artikel 32** | Sicherheit der Verarbeitung | ✅ AES-256-Verschlüsselung, TLS 1.3 |
| **Artikel 33** | Meldung von Datenschutzverletzungen | ✅ Automatische SMS/E-Mail-Benachrichtigungen |

### KVKK-Konformität

Veribenim ist vollständig konform mit dem türkischen Datenschutzgesetz (KVKK).

| Artikel | Anforderung | Implementierung |
|---------|-----------|-----------------|
| **Artikel 5** | Grundsätze der Datenverarbeitung | ✅ Rechtliche Grundlage, Zweckbindung, Datenminimierung |
| **Artikel 6** | Einwilligungsverwaltung | ✅ Explizite, spezifische, informierte Einwilligung |
| **Artikel 8** | Benachrichtigungspflicht | ✅ Integrierte Datenschutzmitteilung |
| **Artikel 11** | DSAR-Rechte | ✅ Zugang, Löschung, Portabilität, Berichtigung, Einschränkung |
| **Artikel 12** | Datensicherheit | ✅ Verschlüsselung, Zugriffskontrolle, Audit Logs |

### Datenverschlüsselung & API-Sicherheit

```
Während der Übertragung:
├─ Protokoll: TLS 1.3
├─ Cipher Suites: ECDHE-RSA-AES256-GCM-SHA384
├─ Zertifikat: Let's Encrypt / DigiCert
└─ HSTS: 31536000 Sekunden (1 Jahr)

Im Ruhezustand:
├─ Datenbank: AES-256-CBC-Verschlüsselung
├─ Schlüssel: AWS KMS / Azure Key Vault
├─ Sicherungen: Täglich verschlüsselte Snapshots
└─ Aufbewahrung: DSGVO-Konformität (24 Monate max.)

API-Sicherheit:
├─ Methode: Bearer Token (OAuth 2.0)
├─ Rotation: Alle 90 Tage empfohlen
├─ Rate Limiting: 1000 Anfragen/Minute pro Token
└─ Überwachung: Anomalieerkennung
```

### Zertifizierungen & Standards

- ✅ **ISO 27001:2022** - Informationssicherheitsmanagementsystem
- ✅ **SOC 2 Type II** - System und Organisationskontrolle
- ✅ **Privacy by Design** - DSGVO Best Practices
- ✅ **OWASP Top 10** - Web-Anwendungssicherheitskontrollen
- ✅ **TCF 2.2** - Transparency & Consent Framework

---

## Entwicklung

### Quellcode

```bash
git clone https://github.com/pariette/veribenim-js-sdk.git
cd veribenim-js-sdk
pnpm install
```

### Build & Testing

```bash
# Alle Pakete erstellen
pnpm build

# Unit-Tests ausführen
pnpm test

# TypeScript-Überprüfung
pnpm type-check

# Lint
pnpm lint

# Development Watch-Modus
pnpm dev
```

---

## Lizenz

MIT License © [Pariette](https://veribenim.com)

---

**Weitere Informationen:** https://veribenim.com
**Support:** support@veribenim.com
**Dokumentation:** https://docs.veribenim.com
