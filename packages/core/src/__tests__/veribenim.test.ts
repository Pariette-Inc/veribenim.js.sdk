/**
 * Veribenim ana sınıfı testleri — consent state yönetimi, event listener'lar
 * ve Google Consent Mode v2 entegrasyonu.
 */
import Veribenim, { init, createVeribenim } from '../index';
import type { ConsentPreferences } from '../types';

const allGranted: ConsentPreferences = {
  strictly_necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

const allDenied: ConsentPreferences = {
  strictly_necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

describe('Veribenim', () => {
  afterEach(() => {
    delete (globalThis as any).fetch;
    delete (window as any).gtag;
    delete (window as any).dataLayer;
  });

  describe('constructor', () => {
    it('token verilmezse hata fırlatır', () => {
      expect(() => new Veribenim({ token: '' })).toThrow('[Veribenim] token zorunludur');
    });

    it('init factory fonksiyonu Veribenim instance döner', () => {
      const vb = init({ token: 'tok' });
      expect(vb).toBeInstanceOf(Veribenim);
    });

    it('createVeribenim geriye dönük uyumluluk için init ile aynıdır', () => {
      expect(createVeribenim).toBe(init);
    });

    it('constructor events parametresindeki callback\'leri kaydeder', () => {
      const onAccept = jest.fn();
      const onChange = jest.fn();
      const vb = new Veribenim({ token: 'tok' }, { onAccept, onChange });

      vb.emit('accept', allGranted);
      vb.emit('change', allDenied);

      expect(onAccept).toHaveBeenCalledWith(allGranted);
      expect(onChange).toHaveBeenCalledWith(allDenied);
    });
  });

  describe('event listener\'lar', () => {
    it('onAccept/onDecline/onChange zincirlenebilir ve doğru event\'te tetiklenir', () => {
      const onAccept = jest.fn();
      const onDecline = jest.fn();
      const onChange = jest.fn();

      const vb = new Veribenim({ token: 'tok' })
        .onAccept(onAccept)
        .onDecline(onDecline)
        .onChange(onChange);

      vb.emit('accept', allGranted);

      expect(onAccept).toHaveBeenCalledTimes(1);
      expect(onAccept).toHaveBeenCalledWith(allGranted);
      expect(onDecline).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('aynı event\'e birden fazla callback eklenebilir', () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      const vb = new Veribenim({ token: 'tok' }).onDecline(cb1).onDecline(cb2);

      vb.emit('decline', allDenied);

      expect(cb1).toHaveBeenCalledWith(allDenied);
      expect(cb2).toHaveBeenCalledWith(allDenied);
    });

    it('prefs verilmeden emit edilirse callback\'ler çağrılmaz', () => {
      const cb = jest.fn();
      const vb = new Veribenim({ token: 'tok' }).onAccept(cb);

      vb.emit('accept');

      expect(cb).not.toHaveBeenCalled();
    });
  });

  describe('hasConsent', () => {
    function mockPreferences(current: ConsentPreferences | null): void {
      (globalThis as any).fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () =>
          Promise.resolve(
            JSON.stringify({ status: true, categories: [], current_consents: current })
          ),
      });
    }

    it('kategori izni varsa true döner', async () => {
      mockPreferences(allGranted);
      const vb = new Veribenim({ token: 'tok' });

      await expect(vb.hasConsent('analytics', 'sess-1')).resolves.toBe(true);
    });

    it('kategori izni yoksa false döner', async () => {
      mockPreferences(allDenied);
      const vb = new Veribenim({ token: 'tok' });

      await expect(vb.hasConsent('marketing')).resolves.toBe(false);
    });

    it('current_consents null ise false döner', async () => {
      mockPreferences(null);
      const vb = new Veribenim({ token: 'tok' });

      await expect(vb.hasConsent('analytics')).resolves.toBe(false);
    });
  });

  describe('Google Consent Mode v2 entegrasyonu', () => {
    it('googleConsentMode: true ile init edilince default sinyali gönderilir', () => {
      const gtag = jest.fn();
      (window as any).gtag = gtag;

      new Veribenim({ token: 'tok', googleConsentMode: true });

      expect(gtag).toHaveBeenCalledWith(
        'consent',
        'default',
        expect.objectContaining({
          ad_storage: 'denied',
          security_storage: 'granted',
          wait_for_update: 500,
        })
      );
    });

    it('varsayılan olarak (bayrak yokken) GCM sinyali gönderilmez — backward compatible', () => {
      const gtag = jest.fn();
      (window as any).gtag = gtag;

      const vb = new Veribenim({ token: 'tok' });
      vb.emit('accept', allGranted);

      expect(gtag).not.toHaveBeenCalled();
    });

    it('emit ile rıza değişince consent update sinyali gönderilir', () => {
      const gtag = jest.fn();
      (window as any).gtag = gtag;

      const vb = new Veribenim({ token: 'tok', googleConsentMode: true });
      gtag.mockClear(); // default çağrısını temizle
      vb.emit('accept', allGranted);

      expect(gtag).toHaveBeenCalledWith(
        'consent',
        'update',
        expect.objectContaining({
          ad_storage: 'granted',
          analytics_storage: 'granted',
          functionality_storage: 'granted',
        })
      );
    });

    it('savePreferences çağrısı consent update sinyalini tetikler', async () => {
      const gtag = jest.fn();
      (window as any).gtag = gtag;
      (globalThis as any).fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ status: true, message: 'ok' })),
      });

      const vb = new Veribenim({ token: 'tok', googleConsentMode: true });
      gtag.mockClear();
      await vb.savePreferences(allDenied, 'sess-1');

      expect(gtag).toHaveBeenCalledWith(
        'consent',
        'update',
        expect.objectContaining({
          ad_storage: 'denied',
          analytics_storage: 'denied',
          security_storage: 'granted',
        })
      );
    });

    it('gtag yokken googleConsentMode açık olsa da hata fırlatmaz', () => {
      expect(
        () => new Veribenim({ token: 'tok', googleConsentMode: true })
      ).not.toThrow();
    });
  });
});
