import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { memo } from 'react';

const BusinessCard = memo(({ business, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } }}
      className="group bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 text-center will-change-transform"
    >
      {/* Avatar with online indicator */}
      <div className="relative inline-block mb-3">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto group-hover:ring-2 group-hover:ring-primary-400 transition-all duration-200">
          {business.avatar ? (
            <img
              src={business.avatar}
              alt={business.name}
              className="w-full h-full rounded-full object-cover"
              loading="lazy"
              width={64}
              height={64}
            />
          ) : (
            business.name?.charAt(0)
          )}
        </div>
        {business.isAvailable && (
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-success-500 border-2 border-[var(--color-card-bg)] rounded-full" />
        )}
      </div>

      {/* Name & Type */}
      <h3 className="font-semibold text-[var(--color-text)] text-sm mb-0.5 group-hover:text-primary-600 transition-colors">
        {business.name}
      </h3>
      <p className="text-xs text-[var(--color-text-secondary)] mb-2">
        {business.type}
      </p>

      {/* Rating */}
      <div className="flex items-center justify-center gap-1 mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(business.rating)
                  ? 'text-gold-500'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-[var(--color-text-secondary)]">
          ({business.reviewCount})
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap justify-center gap-1 mb-4">
        {business.skills?.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 bg-[var(--color-bg)] text-[var(--color-text-secondary)] text-[10px] rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Starting price + CTA */}
      <div className="pt-3 border-t border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-secondary)] mb-2">
          Starting at{' '}
          <span className="font-bold text-[var(--color-text)]">
            ${business.startingPrice}
          </span>
        </p>
        <Link
          to={`/business/${business.name?.toLowerCase().replace(/\s+/g, '-')}`}
          className="inline-block w-full px-4 py-2 text-xs font-semibold text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
});

BusinessCard.displayName = 'BusinessCard';

export default BusinessCard;
