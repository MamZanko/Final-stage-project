import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'KarBazar';
const SITE_URL = 'https://karbazar.com';
const DEFAULT_TITLE = 'KarBazar — Connect. Grow. Succeed.';
const DEFAULT_DESCRIPTION =
  'KarBazar is a freelancer marketplace connecting businesses with talented professionals. Find services, post gigs, and grow your business.';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

/**
 * Custom hook for managing SEO meta tags, Open Graph, Twitter Cards,
 * canonical URLs, and JSON-LD structured data.
 *
 * @param {Object} options
 * @param {string}  options.title        - Page title (will be suffixed with " | KarBazar")
 * @param {string}  options.description  - Meta description (max ~160 chars)
 * @param {string}  [options.image]      - OG/Twitter image URL
 * @param {string}  [options.url]        - Canonical URL override
 * @param {string}  [options.type]       - OG type (default "website")
 * @param {boolean} [options.noindex]    - If true, adds noindex,nofollow
 * @param {Object}  [options.structuredData] - JSON-LD structured data object
 */
export default function useSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false,
  structuredData,
} = {}) {
  const location = useLocation();
  const canonicalUrl = url || `${SITE_URL}${location.pathname}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const ogImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    // ── Title ───────────────────────────────────────────
    document.title = fullTitle;

    // ── Helper: set or create meta tag ──────────────────
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // ── Basic meta ──────────────────────────────────────
    setMeta('name', 'description', metaDescription);
    setMeta(
      'name',
      'robots',
      noindex ? 'noindex,nofollow' : 'index,follow'
    );

    // ── Open Graph ──────────────────────────────────────
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', metaDescription);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', 'en_US');

    // ── Twitter Card ────────────────────────────────────
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', metaDescription);
    setMeta('name', 'twitter:image', ogImage);

    // ── Canonical URL ───────────────────────────────────
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // ── JSON-LD Structured Data ─────────────────────────
    // Remove previous SEO JSON-LD (we tag ours with a data attribute)
    const oldJsonLd = document.querySelector(
      'script[data-seo="useSEO"]'
    );
    if (oldJsonLd) oldJsonLd.remove();

    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'useSEO');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // ── Cleanup ─────────────────────────────────────────
    return () => {
      // Reset title on unmount so the next page can set its own
      document.title = DEFAULT_TITLE;

      // Remove JSON-LD on unmount
      const jsonLd = document.querySelector(
        'script[data-seo="useSEO"]'
      );
      if (jsonLd) jsonLd.remove();
    };
  }, [fullTitle, metaDescription, ogImage, canonicalUrl, type, noindex, structuredData]);
}

export { SITE_NAME, SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION };
