# Veribenim JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@veribenim/core?style=flat-square&color=1f6feb)](https://www.npmjs.com/package/@veribenim/core)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@veribenim/core?style=flat-square)](https://www.npmjs.com/package/@veribenim/core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@veribenim/core?style=flat-square&label=bundle%20size)](https://bundlephobia.com/package/@veribenim/core)

**Conforme au RGPD & KVKK • Protection des Données • Plateforme de Gestion du Consentement (CMP)**

Veribenim est la plateforme de gestion du consentement et de protection des données la plus complète au monde, offrant une infrastructure de sécurité des données et de conformité de qualité entreprise aux développeurs. Mettez en œuvre la gestion du consentement aux cookies et la gestion des données personnelles conformément au RGPD et à la KVKK avec notre SDK JavaScript agnostique en matière de framework.

---

## Table des Matières

- [Pourquoi Veribenim?](#pourquoi-veribenim)
- [Comment Installer?](#comment-installer)
- [Packages](#packages)
- [Normes de Sécurité](#normes-de-sécurité)
- [Développement](#développement)
- [Licence](#licence)

---

## Pourquoi Veribenim?

### 🏆 La Solution la Plus Complète en Matière de Protection des Données

Veribenim n'est pas seulement une plateforme de gestion du consentement – c'est **l'infrastructure complète de protection des données de qualité entreprise et la conformité RGPD/KVKK** pour les applications web modernes. Protégez les données personnelles et gérez le consentement avec un seul SDK puissant.

| Fonction | Veribenim | Concurrents |
|----------|-----------|------------|
| **Conformité RGPD Complète** | ✅ Les 99 Articles | ⚠️ Conformité Partielle |
| **Conformité KVKK** | ✅ Examen des Experts Juridiques Turcs | ⚠️ Conformité Basique |
| **Droits de la Personne (DSAR)** | ✅ Accès, Suppression, Portabilité, Rectification | ⚠️ Limité |
| **Gestion du Consentement (TCF 2.2)** | ✅ Intégration Complète | ⚠️ Gestion des Cookies Basique |
| **Suivi du Consentement aux Formulaires** | ✅ Suivi des Formulaires Configurable | ❌ Non Disponible |
| **Privacy by Design** | ✅ Toutes les Données Chiffrées | ⚠️ Chiffrement Sélectif |
| **Sécurité de l'API** | ✅ Bearer Token + Rate Limiting | ⚠️ Auth Basique |
| **Journaux d'Audit** | ✅ Suivi Complet des Opérations | ⚠️ Journalisation Limitée |

### 🔐 Sécurité & Conformité d'Entreprise

- **Conformité RGPD**: Implémentation complète de tous les articles
- **Conformité KVKK**: Loi turque sur la protection des données entièrement implémentée
- **Privacy by Design**: La protection des données comme principe fondamental
- **Chiffrement des Données**: TLS 1.3 de bout en bout, AES-256-CBC au repos
- **Traitement DSAR**: Accès, Suppression, Portabilité, Rectification, Restriction, Objection
- **Plateforme de Gestion du Consentement (CMP)**: TCF 2.2 avec catégories personnalisées

### 🚀 Expérience Développeur

- **Cœur Agnostique en Matière de Framework**: Compatible avec Vanilla JS, React, Vue, Nuxt, Next.js, Angular, Svelte
- **Intégrations Modernes**: React Hooks, Vue 3 Composables, Next.js App/Pages Router
- **Support TypeScript Complet**: Sécurité de type complète et IntelliSense
- **Configuration Zéro**: Commencez avec un jeton, tout le reste est automatique
- **Léger**: ~8KB taille de bundle gzip
- **Monorepo pnpm**: Développement rapide avec mise en cache optimale

### 📊 Analytique & Rapports

- Analyses de consentement en temps réel
- Rapports PDF mensuels (conformes au RGPD)
- Distribution du consentement par catégorie
- Suivi des demandes DSAR
- Gestion des quotas et intégration de facturation

---

## Comment Installer?

### Prérequis

- Node.js 18+
- npm, yarn ou **pnpm** (recommandé)
- TypeScript 5.0+ (optionnel)

### Installation

#### 1. Package Core (@veribenim/core)

Package core agnostique en matière de framework pour tous les projets:

```bash
# npm
npm install @veribenim/core

# yarn
yarn add @veribenim/core

# pnpm (recommandé)
pnpm add @veribenim/core
```

#### 2. Package React (@veribenim/react)

Pour les applications React avec Provider et Hooks:

```bash
pnpm add @veribenim/react @veribenim/core
```

#### 3. Package Next.js (@veribenim/nextjs)

Pour Next.js 13+ (App Router & Pages Router):

```bash
pnpm add @veribenim/nextjs @veribenim/core
```

#### 4. Package Vue (@veribenim/vue)

Pour les applications Vue 3 avec Plugin et Composables:

```bash
pnpm add @veribenim/vue @veribenim/core
```

#### 5. Package Nuxt (@veribenim/nuxt)

Pour Nuxt 3+ avec auto-imports:

```bash
pnpm add @veribenim/nuxt
```

### Démarrage Rapide

#### JavaScript Vanilla

```javascript
import { Veribenim } from '@veribenim/core';

const veribenim = new Veribenim({
  token: 'your-api-token-here',
  lang: 'fr', // 'en', 'tr', 'de', 'es', 'bg', 'ar'
  debug: true, // développement uniquement
});

// Charger le script
await veribenim.loadScript();

// Écouter les événements de consentement
veribenim
  .onAccept(() => {
    console.log('Toutes les catégories acceptées');
  })
  .onDecline(() => {
    console.log('Consentement refusé');
  })
  .onChange(({ preferences }) => {
    console.log('Préférences modifiées:', preferences);
  });

// Sauvegarder les préférences
await veribenim.savePreferences({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true,
});

// Journaliser l'impression
await veribenim.logImpression();
```

#### React

```jsx
import { VeribenimProvider, useVeribenim, ConsentBanner } from '@veribenim/react';

export default function App() {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="fr"
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
        Journaliser l'Impression
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
    <html lang="fr">
      <body>
        <VeribenimProvider token="your-api-token-here" lang="fr">
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
  lang: 'fr',
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
    lang: 'fr',
    debug: false,
  },
});
```

Le composable est importé automatiquement:

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

Bibliothèque core agnostique en matière de framework servant de base à tous les autres packages.

#### Configuration

```typescript
interface VeribenimConfig {
  token: string; // Requis: Votre jeton API
  lang?: 'tr' | 'en' | 'de' | 'fr' | 'es' | 'bg' | 'ar'; // Par défaut: 'fr'
  debug?: boolean; // Par défaut: false
}
```

#### Méthodes API

```typescript
// Gestion des scripts
await veribenim.loadScript(): Promise<void>
veribenim.isScriptLoaded: boolean

// Callbacks (chaînables)
veribenim.onAccept((payload) => void): Veribenim
veribenim.onDecline((payload) => void): Veribenim
veribenim.onChange(({ preferences }) => void): Veribenim

// Obtenir les préférences
await veribenim.getPreferences(sessionId?: string): Promise<PreferencesResponse | null>

// Sauvegarder les préférences
await veribenim.savePreferences(
  preferences: ConsentPreferences,
  sessionId?: string
): Promise<void>

// Journaliser l'impression
await veribenim.logImpression(): Promise<boolean>

// Journaliser l'événement de consentement
await veribenim.logConsent(payload: ConsentLogPayload): Promise<boolean>

// Suivre le consentement au formulaire
await veribenim.logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>

// Soumettre une demande DSAR
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

Provider React, Hooks et composants ConsentBanner sans interface.

#### Configuration du Provider

```jsx
import { VeribenimProvider } from '@veribenim/react';

export default function App({ children }) {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="fr"
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

Intégration Next.js 13+ pour App Router et Pages Router.

#### App Router

```typescript
// app/layout.tsx
import { VeribenimProvider } from '@veribenim/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <VeribenimProvider token={process.env.NEXT_PUBLIC_VERIBENIM_TOKEN!} lang="fr">
          {children}
        </VeribenimProvider>
      </body>
    </html>
  );
}
```

### @veribenim/vue

Plugin Vue 3 et Composables.

#### Configuration du Plugin

```typescript
// main.ts
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);

app.use(VeribenimPlugin, {
  token: 'your-api-token-here',
  lang: 'fr',
});

app.mount('#app');
```

### @veribenim/nuxt

Module Nuxt 3+ avec auto-imports et configuration.

#### Installation

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
    lang: 'fr',
  },
});
```

---

## Normes de Sécurité

### Conformité RGPD

Veribenim est entièrement conforme au Règlement Général sur la Protection des Données (RGPD).

| Article | Titre | Conformité |
|---------|-------|-----------|
| **Article 6** | Fondement Juridique | ✅ Intérêts Légitimes, Nécessité Contractuelle |
| **Article 7** | Conditions de Consentement | ✅ Librement Donné, Spécifique, Informé, Non Ambigu |
| **Articles 13-14** | Transparence | ✅ Notification Automatique du Responsable |
| **Article 15** | Droit d'Accès | ✅ DSAR: Délai de 30 Jours |
| **Article 17** | Droit à l'Oubli | ✅ DSAR: Traitement en 30 Jours |
| **Article 20** | Portabilité des Données | ✅ DSAR: Export JSON/CSV |
| **Article 32** | Sécurité du Traitement | ✅ Chiffrement AES-256, TLS 1.3 |
| **Article 33** | Notification de Violation | ✅ Alertes SMS/Email Automatiques |

### Conformité KVKK

Veribenim est entièrement conforme à la loi turque sur la protection des données (KVKK).

| Article | Exigence | Implémentation |
|---------|----------|-----------------|
| **Article 5** | Principes de Traitement | ✅ Fondement Juridique, Limitation d'Objectif, Minimisation |
| **Article 6** | Gestion du Consentement | ✅ Consentement Explicite, Spécifique, Informé |
| **Article 8** | Obligation de Notification | ✅ Avis de Protection Intégré |
| **Article 11** | Droits DSAR | ✅ Accès, Suppression, Portabilité, Rectification, Restriction |
| **Article 12** | Sécurité des Données | ✅ Chiffrement, Contrôle d'Accès, Journaux d'Audit |

### Chiffrement des Données & Sécurité de l'API

```
En Transit:
├─ Protocole: TLS 1.3
├─ Cipher Suites: ECDHE-RSA-AES256-GCM-SHA384
├─ Certificat: Let's Encrypt / DigiCert
└─ HSTS: 31536000 Secondes (1 An)

Au Repos:
├─ Base de Données: Chiffrement AES-256-CBC
├─ Clés: AWS KMS / Azure Key Vault
├─ Sauvegardes: Snapshots Quotidiens Chiffrés
└─ Rétention: Conformité RGPD (Max 24 Mois)

Sécurité de l'API:
├─ Méthode: Bearer Token (OAuth 2.0)
├─ Rotation: Tous les 90 Jours Recommandé
├─ Rate Limiting: 1000 Req/Min par Token
└─ Surveillance: Détection d'Anomalies
```

### Certifications & Normes

- ✅ **ISO 27001:2022** - Système de Gestion de la Sécurité de l'Information
- ✅ **SOC 2 Type II** - Contrôles et Organisation du Système
- ✅ **Privacy by Design** - Directives RGPD
- ✅ **OWASP Top 10** - Contrôles de Sécurité des Applications Web
- ✅ **TCF 2.2** - Cadre de Transparence et Consentement

---

## Développement

### Code Source

```bash
git clone https://github.com/pariette/veribenim-js-sdk.git
cd veribenim-js-sdk
pnpm install
```

### Build & Testing

```bash
# Construire tous les packages
pnpm build

# Exécuter les tests unitaires
pnpm test

# Vérification TypeScript
pnpm type-check

# Lint
pnpm lint

# Mode Watch de Développement
pnpm dev
```

---

## Licence

MIT License © [Pariette](https://veribenim.com)

---

**Plus d'Informations:** https://veribenim.com
**Support:** support@veribenim.com
**Documentation:** https://docs.veribenim.com
