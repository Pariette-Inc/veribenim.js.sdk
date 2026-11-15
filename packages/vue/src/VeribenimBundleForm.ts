import {
  defineComponent,
  h,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  type PropType,
  type Ref,
} from 'vue';
import {
  renderBundleForm,
  onBundleReady,
  isBundleReady,
  type BundleRenderFormOptions,
} from '@veribenim/core';

/**
 * Sayfadaki bundle hazır mı? (`VeribenimReady` olayını dinler; SSR'da false.)
 *
 * @example
 * const ready = useVeribenimReady();
 */
export function useVeribenimReady(): Readonly<Ref<boolean>> {
  const ready = ref(isBundleReady());
  let off: () => void = () => undefined;
  onMounted(() => {
    off = onBundleReady(() => {
      ready.value = true;
    });
  });
  onBeforeUnmount(() => off());
  return ready;
}

/**
 * Formu sayfadaki Veribenim BUNDLE'ı ile çizer (`veribenim.renderForm`).
 * Bundle'ı yüklemez; `VeribenimReady`'i bekler.
 *
 * @example
 * <VeribenimBundleForm slug="iletisim" lang="tr" @success="..." />
 */
export const VeribenimBundleForm = defineComponent({
  name: 'VeribenimBundleForm',
  props: {
    slug: { type: String, required: true },
    lang: { type: String, default: undefined },
    /** Bundle'ı bekleme süresi (ms). Varsayılan 15000; 0 = süresiz. */
    timeout: { type: Number, default: undefined },
    onSuccess: {
      type: Function as PropType<BundleRenderFormOptions['onSuccess']>,
      default: undefined,
    },
    onError: {
      type: Function as PropType<BundleRenderFormOptions['onError']>,
      default: undefined,
    },
  },
  emits: ['success', 'error'],
  setup(props, { emit }) {
    const el = ref<HTMLElement | null>(null);
    const error = ref<string | null>(null);

    const draw = () => {
      if (!el.value) return;
      error.value = null;
      el.value.textContent = '';
      renderBundleForm(props.slug, el.value, {
        lang: props.lang,
        timeout: props.timeout,
        onSuccess: (data) => {
          props.onSuccess?.(data);
          emit('success', data);
        },
        onError: (err) => {
          error.value = err.message;
          props.onError?.(err);
          emit('error', err);
        },
      }).catch(() => {
        /* onError zaten çağrıldı */
      });
    };

    onMounted(draw);
    watch(() => [props.slug, props.lang], draw);

    return () =>
      h('div', { class: 'vb-bundle-form' }, [
        error.value ? h('div', { class: 'vb-form-error', role: 'alert' }, error.value) : null,
        h('div', { ref: el }),
      ]);
  },
});

export default VeribenimBundleForm;
