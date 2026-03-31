import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { VeribenimPlugin } from '@veribenim/vue';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.veribenim;
  nuxtApp.vueApp.use(VeribenimPlugin, config);
});
