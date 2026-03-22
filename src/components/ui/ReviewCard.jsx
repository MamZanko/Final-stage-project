import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarRatingDisplay from './StarRatingDisplay';
import { staggerItem } from '../../lib/animations';
import { memo } from 'react';

const ReviewCard = memo(({ review, showGigInfo = false, isOwn = false, onEdit }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRelativeTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <motion.div
      {...staggerItem}
      className={`p-4 sm:p-5 rounded-xl border bg-[var(--color-card-bg)] ${
        review.isVerifiedBuyer ? 'border-t-2 border-t-gold border-[var(--color-border)]' : 'border-[var(--color-border)]'
      }`}
    >
      {/* Gig info (for reviews given tab) */}
      {showGigInfo && review.gig && (
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[var(--color-border)]">
          <img
            src={review.gig.image}
            alt={review.gig.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <Link to={`/gigs/${review.gig.id}`} className="text-sm font-medium text-[var(--color-text)] hover:text-primary transition-colors line-clamp-1">
              {review.gig.title}
            </Link>
            {review.business && (
              <Link to={`/business/${review.business.username}`} className="text-xs text-[var(--color-text-secondary)] hover:text-primary transition-colors">
                {review.business.name}
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link
          to={review.reviewer ? `/profile/${review.reviewer.username}` : '#'}
          className="flex-shrink-0"
        >
          <img
            src={review.reviewer?.avatar || review.business?.avatar}
            alt={review.reviewer?.name || review.business?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <Link
              to={review.reviewer ? `/profile/${review.reviewer.username}` : '#'}
              className="text-sm font-semibold text-[var(--color-text)] hover:text-primary transition-colors"
            >
              {review.reviewer?.name || 'You'}
            </Link>

            {review.isVerifiedBuyer && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-purple to-gold text-white">
                ✓ Verified Buyer
              </span>
            )}

            {review.isEdited && (
              <span className="text-[10px] text-[var(--color-text-secondary)] italic">(Edited)</span>
            )}
          </div>

          {/* Rating + Date */}
          <div className="flex items-center gap-3 mb-2">
            <StarRatingDisplay rating={review.rating} size="xs" showNumber={true} />
            <span
              className="text-xs text-[var(--color-text-secondary)] cursor-default"
              title={getRelativeTime(review.date)}
            >
              {formatDate(review.date)}
            </span>
          </div>

          {/* Comment */}
          <p className="text-sm text-[var(--color-text)] leading-relaxed">{review.comment}</p>

          {/* Edit button */}
          {isOwn && onEdit && (
            <button
              onClick={() => onEdit(review)}
              className="mt-2 text-xs text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Edit Review
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;
