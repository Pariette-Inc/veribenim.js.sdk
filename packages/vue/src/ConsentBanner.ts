import { defineComponent, h } from 'vue';
import { useVeribenim } from './context';

/**
 * Headless-dostu çerez onay banner'ı (Vue 3).
 *
 * Varsayılan olarak yalnızca kullanıcı henüz karar vermediğinde görünür.
 * Özel görünüm için scoped slot kullanın:
 *
 * @example
 * <ConsentBanner v-slot="{ accept, decline, savePreferences }">
 *   <MyBanner @accept="accept" @decline="decline" />
 * </ConsentBanner>
 */
export const ConsentBanner = defineComponent({
  name: 'ConsentBanner',
  props: {
    /** Yalnızca kullanıcı henüz karar vermediyse göster. Varsayılan: true */
    showWhenPending: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    const vb = useVeribenim();

    return () => {
      const pending = !vb.isConsented;
      if (props.showWhenPending && !pending) return null;

      // Özel içerik (scoped slot)
      if (slots.default) {
        return slots.default({
          preferences: vb.preferences.value,
          isConsented: vb.isConsented,
          accept: vb.accept,
          decline: vb.decline,
          savePreferences: vb.savePreferences,
        });
      }

      // Varsayılan minimal banner
      return h(
        'div',
        { class: 'vb-consent-banner', role: 'dialog', 'aria-live': 'polite' },
        [
          h(
            'p',
            { class: 'vb-consent-text' },
            'Bu site deneyiminizi iyileştirmek için çerez kullanır.'
          ),
          h('div', { class: 'vb-consent-actions' }, [
            h(
              'button',
              { type: 'button', class: 'vb-accept', onClick: () => vb.accept() },
              'Tümünü Kabul Et'
            ),
            h(
              'button',
              { type: 'button', class: 'vb-decline', onClick: () => vb.decline() },
              'Reddet'
            ),
          ]),
        ]
      );
    };
  },
});

export default ConsentBanner;
