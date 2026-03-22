import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const StarRatingInput = ({ value = 0, onChange, size = 'md' }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };
  const iconClass = sizeMap[size] || sizeMap.md;

  const handleClick = (starIndex, isHalf) => {
    const newVal = isHalf ? starIndex + 0.5 : starIndex + 1;
    onChange(newVal === value ? 0 : newVal);
  };

  const handleMouseMove = (e, starIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverValue(isHalf ? starIndex + 0.5 : starIndex + 1);
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHoverValue(0)}>
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const isFull = displayValue >= starIndex + 1;
        const isHalf = displayValue >= starIndex + 0.5 && displayValue < starIndex + 1;

        return (
          <button
            key={starIndex}
            type="button"
            className={`relative cursor-pointer transition-transform duration-100 hover:scale-110 ${iconClass}`}
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              handleClick(starIndex, x < rect.width / 2);
            }}
          >
            {isFull ? (
              <StarIcon className={`${iconClass} text-gold transition-colors duration-150`} />
            ) : isHalf ? (
              <div className={`relative ${iconClass}`}>
                <StarOutline className={`${iconClass} text-gold absolute top-0 left-0`} />
                <div className="overflow-hidden w-1/2 absolute top-0 left-0">
                  <StarIcon className={`${iconClass} text-gold`} />
                </div>
              </div>
            ) : (
              <StarOutline className={`${iconClass} text-gray-300 dark:text-gray-600 transition-colors duration-150`} />
            )}
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-semibold text-[var(--color-text)]">{value.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRatingInput;
