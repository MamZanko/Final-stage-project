import { useState, useCallback, memo } from 'react';

/**
 * OptimizedImage — Lazy loaded image with blur-up placeholder and error fallback.
 * Replaces raw <img> tags for better perceived performance.
 */
const OptimizedImage = memo(({
  src,
  alt = '',
  className = '',
  fallback = 'https://via.placeholder.com/600x400?text=Image+Unavailable',
  width,
  height,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {/* Blur placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-[var(--color-surface)] animate-pulse rounded" />
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 ease-out ${loaded || error ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
