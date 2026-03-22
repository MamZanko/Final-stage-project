import DOMPurify from 'dompurify';

/**
 * Sanitize HTML to prevent XSS attacks.
 * Allows only safe formatting tags — no scripts, iframes, event handlers, etc.
 */
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'ul', 'ol', 'li',
  'div', 'span',
  'a',
  'blockquote', 'pre', 'code',
];

const ALLOWED_ATTR = ['class', 'href', 'target', 'rel', 'id'];

/**
 * Sanitize user-supplied HTML content.
 * Strips all dangerous tags/attributes while preserving safe formatting.
 */
export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== 'string') return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    // Force all links to open in new tab safely
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
  });
}

/**
 * Convert markdown-like description text to safe HTML.
 * Used for gig descriptions that may contain basic markdown formatting.
 */
export function markdownToSafeHtml(text) {
  if (!text || typeof text !== 'string') return '';

  const html = text
    .replace(/## (.+)/g, '<h2 class="text-lg font-heading font-bold mt-6 mb-3 text-[var(--color-text)]">$1</h2>')
    .replace(/### (.+)/g, '<h3 class="text-base font-heading font-semibold mt-4 mb-2 text-[var(--color-text)]">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)/gm, '<li class="ml-4 text-[var(--color-text-secondary)]">$1</li>')
    .replace(
      /^\d+\. \*\*(.+?)\*\* — (.+)/gm,
      '<div class="flex gap-2 my-2"><span class="text-primary font-bold">•</span><div><strong>$1</strong> — <span class="text-[var(--color-text-secondary)]">$2</span></div></div>'
    );

  return sanitizeHtml(html);
}

export default sanitizeHtml;
