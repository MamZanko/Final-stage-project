import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { HeartIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState, useMemo, memo, useCallback } from 'react';

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

const GigCard = memo(({ gig: rawGig, index = 0, showDiscount = true }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  // Normalize API format → component format
  const gig = useMemo(() => {
    // If gig already has `business` key, it's mock format — use as-is
    if (rawGig.business) return rawGig;

    // Map API response shape → expected component shape
    return {
      ...rawGig,
      image: rawGig.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image',
      business: {
        id: rawGig.user?.id,
        name: rawGig.user?.name,
        avatar: rawGig.user?.avatar_url,
        isTopRated: rawGig.user?.top_rated,
      },
      category: typeof rawGig.category === 'string'
        ? { name: rawGig.category, slug: rawGig.category_slug }
        : rawGig.category,
      rating: rawGig.avg_rating ?? 0,
      reviewCount: rawGig.review_count ?? 0,
      startingPrice: rawGig.starting_price ?? rawGig.startingPrice ?? 0,
      isSponsored: rawGig.is_sponsored ?? false,
      isTrending: rawGig.isTrending ?? false,
      discount: rawGig.discount ?? null,
    };
  }, [rawGig]);

  const hasDiscount = gig.discount && gig.discount.isActive;

  // Calculate time remaining for discount
  const timeRemaining = useMemo(() => {
    if (!hasDiscount || !gig.discount.expiresAt) return null;
    const diff = new Date(gig.discount.expiresAt) - new Date();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  }, [gig.discount, hasDiscount]);

  const [imgError, setImgError] = useState(false);
  const handleImgError = useCallback(() => setImgError(true), []);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } }}
      className={`group bg-[var(--color-card-bg)] border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 will-change-transform ${
        hasDiscount && timeRemaining
          ? 'border-secondary-400 animate-glow-pulse'
          : 'border-[var(--color-border)]'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imgError ? 'https://via.placeholder.com/600x375?text=Image+Unavailable' : gig.image}
          alt={gig.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
          width={600}
          height={375}
          onError={handleImgError}
        />

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {gig.isTrending && (
            <span className="px-2 py-0.5 bg-secondary-500 text-white text-xs font-semibold rounded-full shadow-sm">
              🔥 Trending
            </span>
          )}
          {gig.isSponsored && (
            <span className="px-2 py-0.5 bg-gold-500 text-white text-xs font-semibold rounded-full shadow-sm">
              ⭐ SPONSORED
            </span>
          )}
          {hasDiscount && showDiscount && (
            <span className="discount-badge px-2 py-0.5 text-xs font-bold rounded-full shadow-sm">
              −{gig.discount.percent}% OFF
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-navy-700 transition-colors"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorited ? (
            <HeartSolidIcon className="w-4 h-4 text-error-500" />
          ) : (
            <HeartIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
          )}
        </button>

        {/* Discount expiry timer */}
        {hasDiscount && timeRemaining && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-navy-900/80 text-white text-xs rounded-full backdrop-blur-sm">
            <ClockIcon className="w-3 h-3" />
            <span>Ends in {timeRemaining}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <Link to={`/gigs/${gig.id}`} className="block p-4">
        {/* Business info */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={gig.business.avatar || 'https://via.placeholder.com/48?text=?'}
            alt={gig.business.name}
            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            loading="lazy"
            decoding="async"
          />
          <span className="text-xs text-[var(--color-text-secondary)] truncate">
            {gig.business.name}
          </span>
          {gig.business.isTopRated && (
            <span className="text-xs px-1.5 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded font-medium">
              Top Rated
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-[var(--color-text)] line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors min-h-[40px]">
          {gig.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <StarIcon className="w-4 h-4 text-gold-500" />
          <span className="text-sm font-semibold text-[var(--color-text)]">
            {gig.rating}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)]">
            ({gig.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text-secondary)]">Starting at</span>
          {hasDiscount && showDiscount ? (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)] line-through">
                ${gig.discount.originalPrice}
              </span>
              <span className="text-lg font-bold text-success-600">
                ${gig.discount.discountedPrice}
              </span>
            </div>
          ) : (
            <span className="ml-auto text-lg font-bold text-[var(--color-text)]">
              ${gig.startingPrice}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
});

GigCard.displayName = 'GigCard';

export default GigCard;
