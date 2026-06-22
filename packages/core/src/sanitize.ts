/**
 * HTML sanitization — XSS koruması.
 *
 * DOMPurify ile zengin metin içeriğini (renk, boyut, kalınlık vb.) korurken
 * script/iframe/event handler gibi zararlı içerikleri temizler.
 *
 * WYSIWYG editörden gelen içerik (p, strong, em, h1-h6, table, ul/ol, span, style attr vb.)
 * bozulmadan geçer.
 */

import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
  'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr',
  'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'img', 'figure', 'figcaption',
];

const ALLOWED_ATTR = [
  'href', 'title', 'target', 'rel',
  'src', 'alt', 'width', 'height',
  'class', 'style', 'id',
  'colspan', 'rowspan',
];

/**
 * HTML string'ini sanitize eder.
 * Renk, font-size, font-weight gibi inline CSS korunur.
 * Script, iframe, onerror gibi tehlikeli içerikler kaldırılır.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur', 'onchange'],
  }) as string;
}

/**
 * Plain text olarak render edilecek değerleri güvenli hale getirir.
 * innerHTML'e değil textContent'e verilecek değerler için gereksiz,
 * ama template literal içinde innerHTML kullanılıyorsa bu fonksiyon kullanılır.
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
