import { defineComponent, h, ref, onMounted, type PropType } from 'vue';
import type { RenderFormOptions } from '@veribenim/core';
import { useVeribenim } from './context';

let _seq = 0;

/**
 * Veribenim form bileşeni (Vue 3).
 * Form şemasını çeker ve çekirdek FormRenderer ile container'a basar.
 *
 * @example
 * <VeribenimForm slug="iletisim-formu" :theme="{ primaryColor: '#6366f1' }" />
 */
export const VeribenimForm = defineComponent({
  name: 'VeribenimForm',
  props: {
    /** Form slug'ı (zorunlu) */
    slug: { type: String, required: true },
    theme: {
      type: Object as PropType<RenderFormOptions['theme']>,
      default: undefined,
    },
    lang: { type: String, default: undefined },
    onSuccess: {
      type: Function as PropType<RenderFormOptions['onSuccess']>,
      default: undefined,
    },
    onError: {
      type: Function as PropType<RenderFormOptions['onError']>,
      default: undefined,
    },
  },
  setup(props) {
    const vb = useVeribenim();
    const elId = `vb-form-${++_seq}`;
    const mountError = ref<string | null>(null);

    onMounted(() => {
      vb.client
        .renderForm(props.slug, `#${elId}`, {
          theme: props.theme,
          lang: props.lang,
          onSuccess: props.onSuccess,
          onError: props.onError,
        })
        .catch((e: unknown) => {
          mountError.value = e instanceof Error ? e.message : 'Form yüklenemedi';
        });
    });

    return () =>
      h(
        'div',
        { id: elId, class: 'vb-form-container' },
        mountError.value
          ? h('div', { class: 'vb-form-error' }, mountError.value)
          : undefined
      );
  },
});

export default VeribenimForm;
