# @veribenim/nuxt

> Veribenim KVKK & GDPR çerez onayı SDK — Nuxt 3

[![npm](https://img.shields.io/npm/v/@veribenim/nuxt)](https://www.npmjs.com/package/@veribenim/nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Kurulum

```bash
npm install @veribenim/nuxt
```

## Kurulum (nuxt.config.ts)

```ts
export default defineNuxtConfig({
  modules: ['@veribenim/nuxt'],
  veribenim: {
    token: process.env.NUXT_PUBLIC_VERIBENIM_TOKEN,
    lang: 'tr',
  },
});
```

## .env

```env
NUXT_PUBLIC_VERIBENIM_TOKEN=buraya_token_yapistirin
```

Token'ı [Veribenim Paneli](https://app.veribenim.com)'nden alın: Siteniz → Entegrasyon.

## Composable (otomatik import)

```vue
<script setup>
const { preferences, accept, decline } = useVeribenim();
</script>

<template>
  <div v-if="!preferences">
    <button @click="accept()">Tümünü Kabul Et</button>
    <button @click="decline">Reddet</button>
  </div>
</template>
```

`useVeribenim` composable'ı Nuxt'un auto-import sistemi sayesinde import'a gerek kalmadan doğrudan kullanılabilir.

## Lisans

MIT © [Pariette](https://veribenim.com)
