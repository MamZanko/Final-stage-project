import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useSEO, { SITE_NAME, SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '../../lib/useSEO';

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/test-page']}>{children}</MemoryRouter>
);

describe('useSEO', () => {
  beforeEach(() => {
    // Clean up any SEO tags from previous tests
    document.title = 'Test';
    document
      .querySelectorAll('meta[data-testid], script[data-seo], link[rel="canonical"]')
      .forEach((el) => el.remove());
  });

  afterEach(() => {
    document.title = DEFAULT_TITLE;
  });

  it('exports correct constants', () => {
    expect(SITE_NAME).toBe('KarBazar');
    expect(SITE_URL).toBe('https://karbazar.com');
    expect(DEFAULT_TITLE).toBe('KarBazar — Connect. Grow. Succeed.');
    expect(DEFAULT_DESCRIPTION).toContain('freelancer marketplace');
  });

  it('sets document title with site name suffix', () => {
    renderHook(() => useSEO({ title: 'Browse Services' }), { wrapper });
    expect(document.title).toBe('Browse Services | KarBazar');
  });

  it('uses default title when no title provided', () => {
    renderHook(() => useSEO({}), { wrapper });
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  it('sets meta description', () => {
    renderHook(
      () => useSEO({ title: 'Test', description: 'Custom description' }),
      { wrapper }
    );
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content')).toBe('Custom description');
  });

  it('uses default description when none provided', () => {
    renderHook(() => useSEO({ title: 'Test' }), { wrapper });
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content')).toBe(DEFAULT_DESCRIPTION);
  });

  it('sets Open Graph meta tags', () => {
    renderHook(
      () => useSEO({ title: 'OG Test', description: 'OG Desc' }),
      { wrapper }
    );
    expect(document.querySelector('meta[property="og:title"]')?.content).toBe(
      'OG Test | KarBazar'
    );
    expect(document.querySelector('meta[property="og:description"]')?.content).toBe(
      'OG Desc'
    );
    expect(document.querySelector('meta[property="og:site_name"]')?.content).toBe(
      'KarBazar'
    );
    expect(document.querySelector('meta[property="og:type"]')?.content).toBe(
      'website'
    );
    expect(document.querySelector('meta[property="og:locale"]')?.content).toBe(
      'en_US'
    );
  });

  it('sets custom OG type', () => {
    renderHook(() => useSEO({ title: 'Product', type: 'product' }), {
      wrapper,
    });
    expect(document.querySelector('meta[property="og:type"]')?.content).toBe(
      'product'
    );
  });

  it('sets Twitter Card meta tags', () => {
    renderHook(
      () => useSEO({ title: 'TW Test', description: 'TW Desc' }),
      { wrapper }
    );
    expect(document.querySelector('meta[name="twitter:card"]')?.content).toBe(
      'summary_large_image'
    );
    expect(document.querySelector('meta[name="twitter:title"]')?.content).toBe(
      'TW Test | KarBazar'
    );
    expect(document.querySelector('meta[name="twitter:description"]')?.content).toBe(
      'TW Desc'
    );
  });

  it('sets canonical URL from location', () => {
    renderHook(() => useSEO({ title: 'Test' }), { wrapper });
    const link = document.querySelector('link[rel="canonical"]');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('https://karbazar.com/test-page');
  });

  it('allows custom canonical URL', () => {
    renderHook(
      () => useSEO({ title: 'Test', url: 'https://karbazar.com/custom' }),
      { wrapper }
    );
    const link = document.querySelector('link[rel="canonical"]');
    expect(link.getAttribute('href')).toBe('https://karbazar.com/custom');
  });

  it('sets robots to index,follow by default', () => {
    renderHook(() => useSEO({ title: 'Test' }), { wrapper });
    const meta = document.querySelector('meta[name="robots"]');
    expect(meta?.content).toBe('index,follow');
  });

  it('sets robots to noindex,nofollow when noindex is true', () => {
    renderHook(() => useSEO({ title: 'Private', noindex: true }), {
      wrapper,
    });
    const meta = document.querySelector('meta[name="robots"]');
    expect(meta?.content).toBe('noindex,nofollow');
  });

  it('sets custom OG image', () => {
    renderHook(
      () => useSEO({ title: 'Test', image: 'https://example.com/img.png' }),
      { wrapper }
    );
    expect(document.querySelector('meta[property="og:image"]')?.content).toBe(
      'https://example.com/img.png'
    );
    expect(document.querySelector('meta[name="twitter:image"]')?.content).toBe(
      'https://example.com/img.png'
    );
  });

  it('injects JSON-LD structured data', () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'KarBazar',
    };
    renderHook(() => useSEO({ title: 'Test', structuredData: schema }), {
      wrapper,
    });
    const script = document.querySelector('script[data-seo="useSEO"]');
    expect(script).not.toBeNull();
    expect(script.type).toBe('application/ld+json');
    const parsed = JSON.parse(script.textContent);
    expect(parsed['@type']).toBe('WebSite');
    expect(parsed.name).toBe('KarBazar');
  });

  it('removes JSON-LD on unmount', () => {
    const schema = { '@context': 'https://schema.org', '@type': 'WebSite' };
    const { unmount } = renderHook(
      () => useSEO({ title: 'Test', structuredData: schema }),
      { wrapper }
    );
    expect(document.querySelector('script[data-seo="useSEO"]')).not.toBeNull();
    unmount();
    expect(document.querySelector('script[data-seo="useSEO"]')).toBeNull();
  });

  it('resets title to default on unmount', () => {
    const { unmount } = renderHook(
      () => useSEO({ title: 'Custom Title' }),
      { wrapper }
    );
    expect(document.title).toBe('Custom Title | KarBazar');
    unmount();
    expect(document.title).toBe(DEFAULT_TITLE);
  });
});
