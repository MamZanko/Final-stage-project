import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, ClockIcon, CurrencyDollarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { modalOverlay, modalContent } from '../../lib/animations';
import { sanitizeHtml } from '../../lib/sanitize';

const GigPreviewModal = ({ isOpen, onClose, gig }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('basic');

  if (!gig) return null;

  const images = gig.images || [gig.image];
  const pkg = gig.pricing?.[activeTab];
  const tiers = ['basic', 'standard', 'premium'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div {...modalOverlay} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            {...modalContent}
            className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto my-8"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Image carousel */}
            <div className="relative aspect-video bg-[var(--color-surface)]">
              <img src={images[activeImage]} alt={gig.title} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveImage((p) => (p + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setActiveImage(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? 'bg-white w-4' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
              {gig.discount?.isActive && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-error text-white text-xs font-bold rounded-full">
                  −{gig.discount.percent}% OFF
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title + meta */}
              <h3 className="text-lg font-heading font-semibold text-[var(--color-text)]">{gig.title}</h3>
              <div className="flex items-center gap-3 mt-2">
                {gig.business && (
                  <div className="flex items-center gap-1.5">
                    <img src={gig.business.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-xs text-[var(--color-text-secondary)]">{gig.business.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <StarSolidIcon className="w-4 h-4 text-gold" />
                  <span className="text-xs font-semibold text-[var(--color-text)]">{gig.rating}</span>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">({gig.reviewCount})</span>
                </div>
                {gig.category && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">{gig.category}</span>
                )}
              </div>

              {/* Description */}
              {gig.description && (
                <div className="mt-4 text-sm text-[var(--color-text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(gig.description) }} />
              )}

              {/* Pricing tabs */}
              {gig.pricing && (
                <div className="mt-6">
                  <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden mb-4">
                    {tiers.map((t) => gig.pricing[t] && (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${activeTab === t ? 'bg-primary text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'}`}
                      >
                        {gig.pricing[t].name || t}
                      </button>
                    ))}
                  </div>
                  {pkg && (
                    <div className="bg-[var(--color-surface)] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[var(--color-text)]">${pkg.price}</span>
                        <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                          <ClockIcon className="w-4 h-4" /> {pkg.deliveryDays} day{pkg.deliveryDays !== 1 ? 's' : ''} delivery
                        </div>
                      </div>
                      {pkg.description && <p className="text-xs text-[var(--color-text-secondary)]">{pkg.description}</p>}
                      {pkg.features && (
                        <ul className="space-y-1.5">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-[var(--color-text)]">
                              <CheckIcon className="w-3.5 h-3.5 text-success flex-shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      {pkg.revisions !== undefined && (
                        <p className="text-[10px] text-[var(--color-text-secondary)]">
                          Revisions: {pkg.revisions === -1 ? 'Unlimited' : pkg.revisions}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {gig.tags && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {gig.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] rounded-full">{tag}</span>
                  ))}
                </div>
              )}

              {/* PREVIEW ONLY label */}
              <div className="mt-6 py-2 text-center text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface)] rounded-lg">
                This is a preview — not published yet.
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GigPreviewModal;
