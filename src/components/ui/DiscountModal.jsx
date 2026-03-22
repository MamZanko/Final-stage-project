import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TagIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { modalOverlay, modalContent, buttonVariants } from '../../lib/animations';

const DiscountModal = ({ isOpen, onClose, gig, tier = 'basic', onApply, onRemove }) => {
  const pkg = gig?.pricing?.[tier];
  const existingDiscount = gig?.discount;
  const hasDiscount = existingDiscount && existingDiscount.isActive;

  const [percent, setPercent] = useState(hasDiscount ? existingDiscount.percent : 10);
  const [hasExpiry, setHasExpiry] = useState(!!existingDiscount?.expiresAt);
  const [expiryDate, setExpiryDate] = useState(existingDiscount?.expiresAt ? existingDiscount.expiresAt.slice(0, 16) : '');
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const originalPrice = pkg?.price || gig?.startingPrice || 100;
  const discountedPrice = Math.round(originalPrice * (1 - percent / 100));

  const handleApply = () => {
    setLoading(true);
    setTimeout(() => {
      onApply?.({ percent, expiryDate: hasExpiry ? expiryDate : null });
      setLoading(false);
      onClose?.();
    }, 1000);
  };

  const handleRemove = () => {
    setRemoveLoading(true);
    setTimeout(() => {
      onRemove?.();
      setRemoveLoading(false);
      onClose?.();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div {...modalOverlay} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div {...modalContent} className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md shadow-xl">
            {/* Close button */}
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                <TagIcon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Manage Discount</h3>
                <p className="text-[10px] text-[var(--color-text-secondary)]">{gig?.title} — {pkg?.name || 'Package'}</p>
              </div>
            </div>

            {/* Current status */}
            <div className={`px-3 py-2 rounded-lg text-xs font-medium mb-5 ${hasDiscount ? 'bg-success/10 text-success' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'}`}>
              {hasDiscount ? `Active: −${existingDiscount.percent}% OFF` : 'No discount active'}
            </div>

            {/* Percentage input */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Discount Percentage</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPercent((p) => Math.max(1, p - 5))}
                  className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors text-sm font-bold"
                >−</button>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={percent}
                  onChange={(e) => setPercent(Math.min(90, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center px-2 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-bold text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  onClick={() => setPercent((p) => Math.min(90, p + 5))}
                  className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors text-sm font-bold"
                >+</button>
                <span className="text-sm text-[var(--color-text-secondary)]">%</span>
              </div>
            </div>

            {/* Price preview */}
            <div className="bg-[var(--color-surface)] rounded-xl p-4 mb-4">
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">Original Price</p>
              <p className="text-sm text-[var(--color-text)] line-through">${originalPrice.toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xl font-bold text-success">${discountedPrice.toFixed(2)}</span>
                <span className="px-2 py-0.5 bg-error/10 text-error text-xs font-bold rounded-full">−{percent}% OFF</span>
              </div>
            </div>

            {/* Expiry toggle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <button
                  onClick={() => setHasExpiry(!hasExpiry)}
                  className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${hasExpiry ? 'bg-primary' : 'bg-[var(--color-border)]'}`}
                >
                  <motion.div
                    animate={{ x: hasExpiry ? 16 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
                <span className="text-xs font-medium text-[var(--color-text)]">Set expiry date</span>
              </label>
              <AnimatePresence>
                {hasExpiry && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <input
                      type="datetime-local"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    {expiryDate && (
                      <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 flex items-center gap-1">
                        <CalendarDaysIcon className="w-3 h-3" />
                        Deal ends: {new Date(expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(expiryDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <motion.button
                variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                onClick={handleApply}
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {hasDiscount ? 'Update Discount' : 'Apply Discount'}
              </motion.button>
              {hasDiscount && (
                <motion.button
                  variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                  onClick={handleRemove}
                  disabled={removeLoading}
                  className="w-full py-2.5 rounded-lg border border-error text-error text-sm font-semibold hover:bg-error/5 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {removeLoading && <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />}
                  Remove Discount
                </motion.button>
              )}
              <button onClick={onClose} className="w-full py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DiscountModal;
