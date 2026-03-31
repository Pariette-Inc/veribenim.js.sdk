# @veribenim/vue

> Veribenim KVKK & GDPR çerez onayı SDK — Vue 3

[![npm](https://img.shields.io/npm/v/@veribenim/vue)](https://www.npmjs.com/package/@veribenim/vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Kurulum

```bash
npm install @veribenim/vue
```

## Kurulum (main.ts)

```ts
import { createApp } from 'vue';
import { VeribenimPlugin } from '@veribenim/vue';
import App from './App.vue';

const app = createApp(App);

app.use(VeribenimPlugin, {
  token: 'BURAYA_TOKEN_YAPISTIRIN',
  lang: 'tr',
});

app.mount('#app');
```

## Composable

```vue
<script setup>
import { useVeribenim } from '@veribenim/vue';

const { preferences, accept, decline, client } = useVeribenim();
</script>

<template>
  <div v-if="!preferences">
    <button @click="accept()">Tümünü Kabul Et</button>
    <button @click="decline">Reddet</button>
  </div>
</template>
```

## Form Rızası

```ts
const { client } = useVeribenim();

await client.logFormConsent({
  formName: 'newsletter',
  consented: true,
  consentText: 'E-posta listesine katılmayı onaylıyorum.',
});
```

## Lisans

MIT © [Pariette](https://veribenim.com)
