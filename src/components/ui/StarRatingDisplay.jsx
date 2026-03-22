import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const StarRatingDisplay = ({ rating, size = 'sm', showNumber = true, reviewCount = null }) => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  const iconClass = sizeMap[size] || sizeMap.sm;

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStart = hasHalf ? fullStars + 1 : fullStars;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <StarSolid key={i} className={`${iconClass} text-gold`} />;
          }
          if (i === fullStars && hasHalf) {
            return (
              <div key={i} className={`relative ${iconClass}`}>
                <StarOutline className={`${iconClass} text-gold absolute top-0 left-0`} />
                <div className="overflow-hidden w-1/2 absolute top-0 left-0">
                  <StarSolid className={`${iconClass} text-gold`} />
                </div>
              </div>
            );
          }
          return <StarOutline key={i} className={`${iconClass} text-gray-300 dark:text-gray-600`} />;
        })}
      </div>
      {showNumber && (
        <span className={`font-semibold text-[var(--color-text)] ${size === 'xs' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span className={`text-[var(--color-text-secondary)] ${size === 'xs' ? 'text-[10px]' : 'text-xs'}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default StarRatingDisplay;
