import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, FlagIcon, ExclamationTriangleIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { mockReceivedReviews, mockBusinessRatingBreakdown } from '../../data/mockDataPhase3';
import ReviewCard from '../../components/ui/ReviewCard';
import StarRatingDisplay from '../../components/ui/StarRatingDisplay';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { pageTransition, fadeInUp, staggerContainer, staggerItem, buttonVariants } from '../../lib/animations';

const BusinessReviews = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');
  const [reportReview, setReportReview] = useState(null);

  const breakdown = mockBusinessRatingBreakdown;

  let reviews = [...mockReceivedReviews];

  // Filter
  if (filterRating !== 'all') {
    reviews = reviews.filter((r) => r.rating === parseInt(filterRating));
  }
  if (search) {
    reviews = reviews.filter((r) =>
      r.reviewer.name.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.gigTitle?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort
  reviews.sort((a, b) => {
    if (sort === 'highest') return b.rating - a.rating;
    if (sort === 'lowest') return a.rating - b.rating;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-[var(--color-text)]">Reviews Received</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">See what your clients are saying</p>
      </div>

      {/* Rating Summary */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-[var(--color-text)]">{breakdown.average}</div>
            <StarRatingDisplay rating={breakdown.average} size="md" showNumber={false} />
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{breakdown.total} total reviews</p>
          </div>
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = breakdown.breakdown[star];
              const pct = Math.round((count / breakdown.total) * 100);
              return (
                <button key={star} onClick={() => setFilterRating(filterRating === star.toString() ? 'all' : star.toString())} className="flex items-center gap-2 w-full group">
                  <span className="text-xs text-[var(--color-text-secondary)] w-6">{star}★</span>
                  <div className="flex-1 h-2.5 bg-[var(--color-surface)] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: (5 - star) * 0.1 }} className={`h-full rounded-full ${filterRating === star.toString() ? 'bg-primary' : 'bg-gold'}`} />
                  </div>
                  <span className="text-xs text-[var(--color-text-secondary)] w-12 text-right">{count} ({pct}%)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40">
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
        {filterRating !== 'all' && (
          <button onClick={() => setFilterRating('all')} className="px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
            {filterRating}★ only <span className="hover:text-error">×</span>
          </button>
        )}
      </div>

      {/* Reviews List */}
      <motion.div variants={staggerContainer(0.05)} initial="initial" animate="animate" className="space-y-4">
        {reviews.map((review) => (
          <motion.div key={review.id} variants={staggerItem} className="relative group">
            <ReviewCard review={review} showGigInfo />
            {/* Report button */}
            <button
              onClick={() => setReportReview(review)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-error/10 text-[var(--color-text-secondary)] hover:text-error"
              title="Report review"
            >
              <FlagIcon className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {reviews.length === 0 && (
        <motion.div {...fadeInUp} className="text-center py-16">
          <ChatBubbleLeftIcon className="w-12 h-12 mx-auto text-[var(--color-text-secondary)] mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)]">No reviews match your criteria.</p>
        </motion.div>
      )}

      {/* Report Modal */}
      <ConfirmModal
        isOpen={!!reportReview}
        onClose={() => setReportReview(null)}
        onConfirm={() => setReportReview(null)}
        title="Report Review"
        message={`Report this review by ${reportReview?.reviewer?.name}? Our moderation team will review it within 24 hours.`}
        confirmText="Report"
        variant="warning"
      />
    </motion.div>
  );
};

export default BusinessReviews;
