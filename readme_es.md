# Veribenim JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@veribenim/core?style=flat-square&color=1f6feb)](https://www.npmjs.com/package/@veribenim/core)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@veribenim/core?style=flat-square)](https://www.npmjs.com/package/@veribenim/core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@veribenim/core?style=flat-square&label=bundle%20size)](https://bundlephobia.com/package/@veribenim/core)

**Cumplimiento RGPD & KVKK • Protección de Datos • Plataforma de Gestión del Consentimiento (CMP)**

Veribenim es la plataforma de gestión del consentimiento y protección de datos más completa del mundo, ofreciendo infraestructura de seguridad de datos y cumplimiento de calidad empresarial a desarrolladores. Implemente la gestión del consentimiento de cookies y gestión de datos personales conforme a RGPD y KVKK con nuestro SDK de JavaScript agnóstico a framework.

---

## Tabla de Contenidos

- [¿Por Qué Veribenim?](#por-qué-veribenim)
- [¿Cómo Instalar?](#cómo-instalar)
- [Paquetes](#paquetes)
- [Estándares de Seguridad](#estándares-de-seguridad)
- [Desarrollo](#desarrollo)
- [Licencia](#licencia)

---

## ¿Por Qué Veribenim?

### 🏆 La Solución Más Completa en Protección de Datos

Veribenim no es simplemente una plataforma de gestión del consentimiento – es **infraestructura completa de protección de datos de calidad empresarial y cumplimiento RGPD/KVKK** para aplicaciones web modernas. Proteja datos personales y gestione el consentimiento con un único SDK poderoso.

| Función | Veribenim | Competidores |
|---------|-----------|-------------|
| **Cumplimiento RGPD Completo** | ✅ Los 99 Artículos | ⚠️ Cumplimiento Parcial |
| **Cumplimiento KVKK** | ✅ Revisión de Expertos Legales Turcos | ⚠️ Cumplimiento Básico |
| **Derechos de Persona (DSAR)** | ✅ Acceso, Eliminación, Portabilidad, Rectificación | ⚠️ Limitado |
| **Gestión del Consentimiento (TCF 2.2)** | ✅ Integración Completa | ⚠️ Gestión de Cookies Básica |
| **Seguimiento de Consentimiento de Formularios** | ✅ Seguimiento de Formularios Configurable | ❌ No Disponible |
| **Privacy by Design** | ✅ Todos los Datos Encriptados | ⚠️ Encriptación Selectiva |
| **Seguridad de API** | ✅ Bearer Token + Rate Limiting | ⚠️ Auth Básica |
| **Registros de Auditoría** | ✅ Seguimiento Completo de Operaciones | ⚠️ Registro Limitado |

### 🔐 Seguridad & Cumplimiento Empresarial

- **Cumplimiento RGPD**: Implementación completa de todos los artículos
- **Cumplimiento KVKK**: Ley turca de protección de datos completamente implementada
- **Privacy by Design**: La protección de datos como principio fundamental
- **Encriptación de Datos**: TLS 1.3 de extremo a extremo, AES-256-CBC en reposo
- **Procesamiento DSAR**: Acceso, Eliminación, Portabilidad, Rectificación, Restricción, Objeción
- **Plataforma de Gestión del Consentimiento (CMP)**: TCF 2.2 con categorías personalizadas

### 🚀 Experiencia del Desarrollador

- **Núcleo Agnóstico a Framework**: Compatible con JavaScript Vanilla, React, Vue, Nuxt, Next.js, Angular, Svelte
- **Integraciones Modernas**: React Hooks, Vue 3 Composables, Next.js App/Pages Router
- **Soporte Completo de TypeScript**: Seguridad de tipo completa e IntelliSense
- **Configuración Cero**: Comience con un token, todo lo demás es automático
- **Ligero**: ~8KB tamaño de bundle gzip
- **Monorepo pnpm**: Desarrollo rápido con caché óptimo

### 📊 Análisis & Reportes

- Análisis de consentimiento en tiempo real
- Reportes PDF mensuales (conformes a RGPD)
- Distribución de consentimiento por categoría
- Seguimiento de solicitudes DSAR
- Gestión de cuotas e integración de facturación

---

## ¿Cómo Instalar?

### Requisitos Previos

- Node.js 18+
- npm, yarn o **pnpm** (recomendado)
- TypeScript 5.0+ (opcional)

### Instalación

#### 1. Paquete Core (@veribenim/core)

Paquete core agnóstico a framework para todos los proyectos:

```bash
# npm
npm install @veribenim/core

# yarn
yarn add @veribenim/core

# pnpm (recomendado)
pnpm add @veribenim/core
```

#### 2. Paquete React (@veribenim/react)

Para aplicaciones React con Provider y Hooks:

```bash
pnpm add @veribenim/react @veribenim/core
```

#### 3. Paquete Next.js (@veribenim/nextjs)

Para Next.js 13+ (App Router & Pages Router):

```bash
pnpm add @veribenim/nextjs @veribenim/core
```

#### 4. Paquete Vue (@veribenim/vue)

Para aplicaciones Vue 3 con Plugin y Composables:

```bash
pnpm add @veribenim/vue @veribenim/core
```

#### 5. Paquete Nuxt (@veribenim/nuxt)

Para Nuxt 3+ con auto-imports:

```bash
pnpm add @veribenim/nuxt
```

### Inicio Rápido

#### JavaScript Vanilla

```javascript
import { Veribenim } from '@veribenim/core';

const veribenim = new Veribenim({
  token: 'your-api-token-here',
  lang: 'es', // 'en', 'tr', 'de', 'fr', 'bg', 'ar'
  debug: true, // solo desarrollo
});

// Cargar el script
await veribenim.loadScript();

// Escuchar eventos de consentimiento
veribenim
  .onAccept(() => {
    console.log('Todas las categorías aceptadas');
  })
  .onDecline(() => {
    console.log('Consentimiento rechazado');
  })
  .onChange(({ preferences }) => {
    console.log('Preferencias cambiadas:', preferences);
  });

// Guardar preferencias
await veribenim.savePreferences({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true,
});

// Registrar impresión
await veribenim.logImpression();
```

#### React

```jsx
import { VeribenimProvider, useVeribenim, ConsentBanner } from '@veribenim/react';

export default function App() {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="es"
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
        Registrar Impresión
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
    <html lang="es">
      <body>
        <VeribenimProvider token="your-api-token-here" lang="es">
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
  lang: 'es',
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
    lang: 'es',
    debug: false,
  },
});
```

El composable se importa automáticamente:

```vue
<script setup lang="ts">
const veribenim = useVeribenim();

onMounted(() => {
  veribenim.logImpression();
});
</script>
```

---

## Paquetes

### @veribenim/core

Biblioteca core agnóstica a framework que sirve como base para todos los demás paquetes.

#### Configuración

```typescript
interface VeribenimConfig {
  token: string; // Requerido: Su token de API
  lang?: 'tr' | 'en' | 'de' | 'fr' | 'es' | 'bg' | 'ar'; // Por defecto: 'es'
  debug?: boolean; // Por defecto: false
}
```

#### Métodos de API

```typescript
// Gestión de scripts
await veribenim.loadScript(): Promise<void>
veribenim.isScriptLoaded: boolean

// Callbacks (encadenables)
veribenim.onAccept((payload) => void): Veribenim
veribenim.onDecline((payload) => void): Veribenim
veribenim.onChange(({ preferences }) => void): Veribenim

// Obtener preferencias
await veribenim.getPreferences(sessionId?: string): Promise<PreferencesResponse | null>

// Guardar preferencias
await veribenim.savePreferences(
  preferences: ConsentPreferences,
  sessionId?: string
): Promise<void>

// Registrar impresión
await veribenim.logImpression(): Promise<boolean>

// Registrar evento de consentimiento
await veribenim.logConsent(payload: ConsentLogPayload): Promise<boolean>

// Seguimiento de consentimiento de formulario
await veribenim.logFormConsent(payload: FormConsentPayload): Promise<FormConsentResponse | null>

// Enviar solicitud DSAR
await veribenim.submitDsar(payload: DsarPayload): Promise<DsarResponse | null>
```

#### Tipos

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

Provider React, Hooks y componentes ConsentBanner sin interfaz.

#### Configuración del Provider

```jsx
import { VeribenimProvider } from '@veribenim/react';

export default function App({ children }) {
  return (
    <VeribenimProvider
      token="your-api-token-here"
      lang="es"
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

Integración Next.js 13+ para App Router y Pages Router.

#### App Router

```typescript
// app/layout.tsx
import { VeribenimProvider } from '@veribenim/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <VeribenimProvider token={process.env.NEXT_PUBLIC_VERIBENIM_TOKEN!} lang="es">
          {children}
        </VeribenimProvider>
      </body>
    </html>
  );
}
```

### @veribenim/vue

Plugin Vue 3 y Composables.

#### Configuración del Plugin

```typescript
// main.ts
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);

app.use(VeribenimPlugin, {
  token: 'your-api-token-here',
  lang: 'es',
});

app.mount('#app');
```

### @veribenim/nuxt

Módulo Nuxt 3+ con auto-imports y configuración.

#### Instalación

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
    lang: 'es',
  },
});
```

---

## Estándares de Seguridad

### Cumplimiento RGPD

Veribenim cumple completamente con el Reglamento General de Protección de Datos (RGPD).

| Artículo | Título | Cumplimiento |
|----------|--------|-------------|
| **Artículo 6** | Base Legal | ✅ Intereses Legítimos, Necesidad Contractual |
| **Artículo 7** | Condiciones de Consentimiento | ✅ Libremente Dado, Específico, Informado, Inequívoco |
| **Artículos 13-14** | Transparencia | ✅ Notificación Automática del Titular |
| **Artículo 15** | Derecho de Acceso | ✅ DSAR: Plazo de 30 Días |
| **Artículo 17** | Derecho al Olvido | ✅ DSAR: Procesamiento en 30 Días |
| **Artículo 20** | Portabilidad de Datos | ✅ DSAR: Exportación JSON/CSV |
| **Artículo 32** | Seguridad del Tratamiento | ✅ Encriptación AES-256, TLS 1.3 |
| **Artículo 33** | Notificación de Incumplimiento | ✅ Alertas SMS/Email Automáticas |

### Cumplimiento KVKK

Veribenim cumple completamente con la ley turca de protección de datos (KVKK).

| Artículo | Requisito | Implementación |
|----------|----------|-----------------|
| **Artículo 5** | Principios de Tratamiento | ✅ Base Legal, Limitación de Propósito, Minimización |
| **Artículo 6** | Gestión del Consentimiento | ✅ Consentimiento Explícito, Específico, Informado |
| **Artículo 8** | Obligación de Notificación | ✅ Aviso de Protección Integrado |
| **Artículo 11** | Derechos DSAR | ✅ Acceso, Eliminación, Portabilidad, Rectificación, Restricción |
| **Artículo 12** | Seguridad de Datos | ✅ Encriptación, Control de Acceso, Registros de Auditoría |

### Encriptación de Datos & Seguridad de API

```
En Tránsito:
├─ Protocolo: TLS 1.3
├─ Cipher Suites: ECDHE-RSA-AES256-GCM-SHA384
├─ Certificado: Let's Encrypt / DigiCert
└─ HSTS: 31536000 Segundos (1 Año)

En Reposo:
├─ Base de Datos: Encriptación AES-256-CBC
├─ Claves: AWS KMS / Azure Key Vault
├─ Copias de Seguridad: Snapshots Diarios Encriptados
└─ Retención: Cumplimiento RGPD (Máx. 24 Meses)

Seguridad de API:
├─ Método: Bearer Token (OAuth 2.0)
├─ Rotación: Cada 90 Días Recomendado
├─ Rate Limiting: 1000 Req/Min por Token
└─ Vigilancia: Detección de Anomalías
```

### Certificaciones & Estándares

- ✅ **ISO 27001:2022** - Sistema de Gestión de Seguridad de Información
- ✅ **SOC 2 Type II** - Controles y Organización del Sistema
- ✅ **Privacy by Design** - Directrices RGPD
- ✅ **OWASP Top 10** - Controles de Seguridad de Aplicaciones Web
- ✅ **TCF 2.2** - Marco de Transparencia y Consentimiento

---

## Desarrollo

### Código Fuente

```bash
git clone https://github.com/pariette/veribenim-js-sdk.git
cd veribenim-js-sdk
pnpm install
```

### Build & Testing

```bash
# Construir todos los paquetes
pnpm build

# Ejecutar pruebas unitarias
pnpm test

# Verificación de TypeScript
pnpm type-check

# Lint
pnpm lint

# Modo Watch de Desarrollo
pnpm dev
```

---

## Licencia

MIT License © [Pariette](https://veribenim.com)

---

**Más Información:** https://veribenim.com
**Soporte:** support@veribenim.com
**Documentación:** https://docs.veribenim.com
