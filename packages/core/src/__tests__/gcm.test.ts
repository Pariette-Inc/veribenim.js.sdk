/**
 * Google Consent Mode v2 köprüsü testleri.
 */
import {
  setGcmDefaults,
  emitGcmSignals,
  mapPreferencesToGcm,
  GCM_DEFAULT_STATE,
} from '../gcm';
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

describe('gcm', () => {
  afterEach(() => {
    delete (window as any).gtag;
    delete (window as any).dataLayer;
  });

  describe('setGcmDefaults', () => {
    it('gtag tanımlıysa consent default sinyalini gönderir', () => {
      const gtag = jest.fn();
      (window as any).gtag = gtag;

      setGcmDefaults();

      expect(gtag).toHaveBeenCalledTimes(1);
      expect(gtag).toHaveBeenCalledWith('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 500,
      });
    });

    it('gtag da dataLayer da yoksa sessizce no-op olur', () => {
      expect(() => setGcmDefaults()).not.toThrow();
      expect((window as any).dataLayer).toBeUndefined();
    });

    it('gtag yoksa ama dataLayer varsa shim üzerinden push eder', () => {
      (window as any).dataLayer = [];

      setGcmDefaults();

      const dl = (window as any).dataLayer;
      expect(dl).toHaveLength(1);
      // Klasik gtag shim'i arguments objesi push eder
      expect(dl[0][0]).toBe('consent');
      expect(dl[0][1]).toBe('default');
      expect(dl[0][2]).toMatchObject({
        ad_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 500,
      });
    });
  });

  describe('mapPreferencesToGcm', () => {
    it('marketing=true tüm ad_* sinyallerini granted yapar', () => {
      const state = mapPreferencesToGcm(allGranted);
      expect(state.ad_storage).toBe('granted');
      expect(state.ad_user_data).toBe('granted');
      expect(state.ad_personalization).toBe('granted');
    });

    it('analytics ve functional kendi sinyallerine eşlenir', () => {
      const state = mapPreferencesToGcm({
        strictly_necessary: true,
        functional: true,
        analytics: false,
        marketing: false,
      });
      expect(state.analytics_storage).toBe('denied');
      expect(state.functionality_storage).toBe('granted');
      expect(state.ad_storage).toBe('denied');
    });

    it('security_storage her durumda granted kalır', () => {
      expect(mapPreferencesToGcm(allDenied).security_storage).toBe('granted');
      expect(mapPreferencesToGcm(allGranted).security_storage).toBe('granted');
    });
  });

  describe('emitGcmSignals', () => {
    it('gtag tanımlıysa consent update sinyalini gönderir', () => {
      const gtag = jest.fn();
      (window as any).gtag = gtag;

      emitGcmSignals(allGranted);

      expect(gtag).toHaveBeenCalledWith('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        functionality_storage: 'granted',
        security_storage: 'granted',
      });
    });

    it('reject-all tercihi ad/analytics/functionality sinyallerini denied yapar', () => {
      const gtag = jest.fn();
      (window as any).gtag = gtag;

      emitGcmSignals(allDenied);

      expect(gtag).toHaveBeenCalledWith('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'denied',
        security_storage: 'granted',
      });
    });

    it('gtag da dataLayer da yoksa sessizce no-op olur', () => {
      expect(() => emitGcmSignals(allGranted)).not.toThrow();
    });

    it('dataLayer shim üzerinden update push eder', () => {
      (window as any).dataLayer = [];

      emitGcmSignals(allDenied);

      const dl = (window as any).dataLayer;
      expect(dl).toHaveLength(1);
      expect(dl[0][0]).toBe('consent');
      expect(dl[0][1]).toBe('update');
      expect(dl[0][2].analytics_storage).toBe('denied');
    });

    it('gtag varken dataLayer shim yerine gtag tercih edilir', () => {
      const gtag = jest.fn();
      (window as any).gtag = gtag;
      (window as any).dataLayer = [];

      emitGcmSignals(allGranted);

      expect(gtag).toHaveBeenCalledTimes(1);
      expect((window as any).dataLayer).toHaveLength(0);
    });
  });

  describe('GCM_DEFAULT_STATE', () => {
    it('yalnızca security_storage granted, wait_for_update 500 olmalı', () => {
      expect(GCM_DEFAULT_STATE.security_storage).toBe('granted');
      expect(GCM_DEFAULT_STATE.wait_for_update).toBe(500);
      expect(GCM_DEFAULT_STATE.ad_storage).toBe('denied');
      expect(GCM_DEFAULT_STATE.analytics_storage).toBe('denied');
      expect(GCM_DEFAULT_STATE.ad_user_data).toBe('denied');
      expect(GCM_DEFAULT_STATE.ad_personalization).toBe('denied');
      expect(GCM_DEFAULT_STATE.functionality_storage).toBe('denied');
    });
  });
});
