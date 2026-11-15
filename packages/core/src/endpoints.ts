/**
 * Veribenim adresleri — tek kaynak.
 *
 * Varsayılanlar bugünkü bulut kurulumudur ve davranış değişmez. Kurum içi
 * (On-Prem) kurulumda `new Veribenim({ token, endpoints: { ... } })` ile
 * yalnızca farklı olan adres verilir.
 */
export interface VeribenimEndpoints {
  /** API tabanı (rıza, form, DSAR, proxy upstream'i). */
  apiUrl: string;
  /** Bundle dosyalarının tabanı: `{bundleBaseUrl}/{temizDomain}.js`. */
  bundleBaseUrl: string;
  /** Panel / web sitesi adresi (form rozeti doğrulama bağlantısı vb.). */
  webUrl: string;
}

export const DEFAULT_ENDPOINTS: Readonly<VeribenimEndpoints> = Object.freeze({
  apiUrl: 'https://live.veribenim.com',
  bundleBaseUrl: 'https://bundles.veribenim.com',
  webUrl: 'https://veribenim.com',
});

const stripSlash = (url: string): string => url.replace(/\/+$/, '');

/**
 * Kısmi adres yapılandırmasını varsayılanlarla birleştirir; boş değerler
 * varsayılana düşer, sondaki "/" atılır.
 */
export function resolveEndpoints(
  overrides?: Partial<VeribenimEndpoints> | null
): VeribenimEndpoints {
  const pick = (key: keyof VeribenimEndpoints): string => {
    const value = overrides?.[key];
    return stripSlash(typeof value === 'string' && value.trim() !== '' ? value.trim() : DEFAULT_ENDPOINTS[key]);
  };
  return { apiUrl: pick('apiUrl'), bundleBaseUrl: pick('bundleBaseUrl'), webUrl: pick('webUrl') };
}
