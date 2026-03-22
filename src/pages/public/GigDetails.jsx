import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { StarIcon, ClockIcon, FireIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import StarRatingInput from '../../components/ui/StarRatingInput';
import StarRatingDisplay from '../../components/ui/StarRatingDisplay';
import ReviewCard from '../../components/ui/ReviewCard';
import { pageTransition, tabContent, staggerContainer, staggerItem, buttonVariants, fadeInUp, modalOverlay, modalContent } from '../../lib/animations';
import { markdownToSafeHtml } from '../../lib/sanitize';
import useSEO from '../../lib/useSEO';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [contacting, setContacting] = useState(false);

  // Fetch gig from API
  useEffect(() => {
    const fetchGig = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/gigs/${id}`);
        const raw = res.data || res;

        // Build packages map: { basic: {...}, standard: {...}, premium: {...} }
        const packagesArr = raw.packages || [];
        const pricing = {};
        packagesArr.forEach((pkg) => {
          pricing[pkg.type] = {
            name: pkg.name,
            price: pkg.price,
            finalPrice: pkg.final_price,
            deliveryDays: pkg.delivery_days,
            description: pkg.description || '',
            features: pkg.features || [],
            discountPercent: pkg.discount_percent || 0,
          };
        });

        // Build reviews array for ReviewCard
        const reviews = (raw.reviews || []).map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          reviewer: r.reviewer ? {
            name: r.reviewer.name,
            username: r.reviewer.username,
            avatar: r.reviewer.avatar_url,
          } : { name: 'Anonymous', avatar: '' },
          isVerifiedBuyer: r.is_verified_buyer || false,
          createdAt: r.created_at,
        }));

        // Compute rating breakdown from reviews
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => { const s = Math.round(r.rating); if (breakdown[s] !== undefined) breakdown[s]++; });
        const totalReviews = reviews.length;
        const avgRating = raw.avg_rating || (totalReviews > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) : 0);

        // Find highest discount
        const maxDiscount = packagesArr.reduce((max, p) => Math.max(max, p.discount_percent || 0), 0);

        const transformed = {
          id: raw.id,
          title: raw.title,
          description: raw.description || '',
          images: raw.images?.length ? raw.images : ['https://placehold.co/800x500?text=No+Image'],
          category: raw.category,
          categorySlug: raw.category_slug,
          business: {
            id: raw.user?.id,
            name: raw.user?.name || 'Unknown',
            displayName: raw.user?.name || 'Unknown',
            username: raw.user?.username || '',
            avatar: raw.user?.avatar_url || '',
            topRated: raw.user?.top_rated || false,
            location: raw.user?.location,
            responseTime: raw.user?.response_time,
            availability: raw.user?.availability,
            skills: raw.user?.skills || [],
            languages: raw.user?.languages || [],
            createdAt: raw.user?.created_at,
          },
          pricing,
          rating: parseFloat(avgRating) || 0,
          reviewCount: raw.review_count || totalReviews,
          reviews,
          ratingBreakdown: { average: parseFloat(avgRating).toFixed(1), total: totalReviews, breakdown },
          discount: maxDiscount > 0 ? { percent: maxDiscount, isActive: true } : null,
          startingPrice: raw.starting_price,
          isSponsored: raw.is_sponsored,
        };

        setGig(transformed);
      } catch (err) {
        console.error('Failed to load gig:', err);
        setError(err?.message || 'Gig not found');
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  useSEO({
    title: gig?.title || 'Loading...',
    description: gig ? `${gig.title} — Professional service by ${gig.business?.displayName || 'KarBazar freelancer'}. Starting at $${gig.pricing?.basic?.price || gig.startingPrice || ''}. ${gig.rating ? `★ ${gig.rating}` : ''}` : '',
    image: gig?.images?.[0],
    url: `https://karbazar.com/gigs/${id}`,
    type: 'product',
  });

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [activePricing, setActivePricing] = useState('standard');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Review form
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewErrors, setReviewErrors] = useState({});
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Discount
  const hasDiscount = gig?.discount && gig.discount.isActive;

  // Pick first available pricing tab
  const pricingTabs = gig ? ['basic', 'standard', 'premium'].filter((t) => gig.pricing[t]) : [];
  useEffect(() => {
    if (gig && pricingTabs.length && !gig.pricing[activePricing]) {
      setActivePricing(pricingTabs[0]);
    }
  }, [gig]);

  const pricing = gig?.pricing?.[activePricing] || {};
  const isOwner = isAuthenticated && user?.id === gig?.business?.id;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!reviewRating) errs.rating = 'Please select a rating';
    if (!reviewComment.trim()) errs.comment = 'Please write a comment';
    else if (reviewComment.trim().length < 10) errs.comment = 'Comment must be at least 10 characters';
    if (Object.keys(errs).length) { setReviewErrors(errs); return; }

    setReviewSubmitting(true);
    try {
      await api.post(`/gigs/${id}/reviews`, { rating: reviewRating, comment: reviewComment.trim() });
      setReviewSubmitted(true);
    } catch (err) {
      setReviewErrors({ comment: err?.message || 'Failed to submit review. Please try again.' });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleOrderNow = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setOrdering(true);
    try {
      const res = await api.post('/orders', { gig_id: Number(id), package_type: activePricing });
      navigate(`/orders/${res.data?.id || ''}`);
    } catch (err) {
      alert(err?.message || 'Failed to place order.');
    } finally {
      setOrdering(false);
    }
  };

  const handleContactSeller = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setContacting(true);
    try {
      const res = await api.post('/conversations', { recipient_id: gig.business.id, message: `Hi! I\'m interested in your service: ${gig.title}` });
      navigate('/messages');
    } catch (err) {
      alert(err?.message || 'Failed to start conversation.');
    } finally {
      setContacting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !gig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-heading font-bold text-[var(--color-text)] mb-2">Service Not Found</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">{error || 'The service you are looking for does not exist.'}</p>
          <Link to="/browse-gigs" className="btn-primary px-6 py-2.5 rounded-lg font-semibold">Browse Services</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN (65%) */}
        <div className="lg:w-[65%]">
          {/* Image Carousel */}
          <div className="relative rounded-xl overflow-hidden mb-6 bg-[var(--color-surface)]">
            <motion.div className="aspect-[16/9] relative cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={gig.images[activeImage]}
                  alt={`${gig.title} - Image ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Prev/Next */}
            {gig.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((prev) => (prev - 1 + gig.images.length) % gig.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImage((prev) => (prev + 1) % gig.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {gig.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    i === activeImage ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail row */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin pb-2">
            {gig.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeImage ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          {/* Gig Title */}
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-text)] mb-4">{gig.title}</h1>

          {/* Business info bar */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--color-border)]">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary">
              {gig.business.avatar ? (
                <img src={gig.business.avatar} alt={gig.business.name} className="w-full h-full object-cover" />
              ) : (
                gig.business.name?.charAt(0) || '?'
              )}
            </div>
            <div>
              <Link to={`/profile/${gig.business.username || gig.business.id}`} className="text-sm font-semibold text-[var(--color-text)] hover:text-primary transition-colors">
                {gig.business.name}
              </Link>
              <div className="flex items-center gap-2">
                <StarRatingDisplay rating={gig.rating} size="xs" reviewCount={gig.reviewCount} />
              </div>
            </div>
            <Link
              to={`/profile/${gig.business.username || gig.business.id}`}
              className="ml-auto text-xs text-primary hover:text-primary-dark font-medium transition-colors"
            >
              View Profile →
            </Link>
          </div>

          {/* Content Tabs */}
          <div className="border-b border-[var(--color-border)] mb-6">
            <div className="flex gap-0">
              {['description', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab ? 'text-primary' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {tab === 'reviews' ? `Reviews (${gig.ratingBreakdown?.total || 0})` : tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="gig-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* DESCRIPTION TAB */}
            {activeTab === 'description' && (
              <motion.div key="desc" {...tabContent} className="prose prose-sm max-w-none text-[var(--color-text)] dark:prose-invert">
                <div className="whitespace-pre-line text-sm leading-relaxed" dangerouslySetInnerHTML={{
                  __html: markdownToSafeHtml(gig.description)
                }} />
              </motion.div>
            )}

            {/* FAQ TAB — removed, no FAQ data from API */}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <motion.div key="reviews" {...tabContent} className="space-y-6">
                {/* Rating Summary */}
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[var(--color-text)]">{gig.ratingBreakdown.average}</div>
                      <StarRatingDisplay rating={parseFloat(gig.ratingBreakdown.average)} size="md" showNumber={false} />
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">{gig.ratingBreakdown.total} reviews</p>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = gig.ratingBreakdown.breakdown[star] || 0;
                        const pct = gig.ratingBreakdown.total > 0 ? Math.round((count / gig.ratingBreakdown.total) * 100) : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-[var(--color-text-secondary)] w-6">{star}★</span>
                            <div className="flex-1 h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, delay: (5 - star) * 0.1 }}
                                className="h-full bg-gold rounded-full"
                              />
                            </div>
                            <span className="text-xs text-[var(--color-text-secondary)] w-8">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Verified buyer reviews pinned */}
                {gig.reviews.filter((r) => r.isVerifiedBuyer).map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                ))}

                {/* General reviews */}
                {gig.reviews.filter((r) => !r.isVerifiedBuyer).map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                ))}

                {/* Leave a Review Form */}
                {isAuthenticated && !isOwner && !reviewSubmitted && (
                  <motion.div {...fadeInUp} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6 mt-6">
                    <h3 className="text-base font-heading font-semibold text-[var(--color-text)] mb-4">Leave a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Your Rating</label>
                        <StarRatingInput value={reviewRating} onChange={setReviewRating} />
                        <AnimatePresence>
                          {reviewErrors.rating && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-error text-xs mt-1"
                            >
                              {reviewErrors.rating}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Your Comment</label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => {
                            if (e.target.value.length <= 500) setReviewComment(e.target.value);
                            if (reviewErrors.comment) setReviewErrors((prev) => ({ ...prev, comment: '' }));
                          }}
                          rows={4}
                          placeholder="Share your experience with this service..."
                          className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                        />
                        <div className="flex justify-between mt-1">
                          <AnimatePresence>
                            {reviewErrors.comment && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-error text-xs"
                              >
                                {reviewErrors.comment}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          <span className={`text-xs ml-auto transition-colors ${
                            reviewComment.length >= 500 ? 'text-error font-semibold' : reviewComment.length >= 450 ? 'text-secondary' : 'text-[var(--color-text-secondary)]'
                          }`}>
                            {reviewComment.length}/500
                          </span>
                        </div>
                      </div>
                      <motion.button
                        type="submit"
                        disabled={reviewSubmitting}
                        variants={buttonVariants}
                        initial="idle"
                        whileHover={!reviewSubmitting ? 'hover' : undefined}
                        whileTap={!reviewSubmitting ? 'tap' : undefined}
                        className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2"
                      >
                        {reviewSubmitting ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Submitting...
                          </>
                        ) : 'Submit Review'}
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {/* Review submitted success */}
                {reviewSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-success/10 border border-success/30 rounded-xl p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-12 h-12 mx-auto mb-3 rounded-full bg-success/20 flex items-center justify-center"
                    >
                      <CheckIcon className="w-6 h-6 text-success" />
                    </motion.div>
                    <p className="text-sm font-semibold text-success">Review submitted successfully!</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                {...modalOverlay}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                onClick={() => setLightboxOpen(false)}
              >
                <motion.img
                  key={activeImage}
                  src={gig.images[activeImage]}
                  alt=""
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                {gig.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev - 1 + gig.images.length) % gig.images.length); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev + 1) % gig.images.length); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN (35%) — STICKY PRICING CARD */}
        <div className="lg:w-[35%]">
          <div className="lg:sticky lg:top-24">
            {/* Discount Banner */}
            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-t-xl px-4 py-3 flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <FireIcon className="w-4 h-4" />
                🔥 Limited Time Offer — Save {gig.discount.percent}%!
              </motion.div>
            )}

            <div className={`bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-lg ${hasDiscount ? 'rounded-b-xl' : 'rounded-xl'} overflow-hidden`}>
              {/* Pricing Tabs */}
              <div className="flex border-b border-[var(--color-border)]">
                {pricingTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePricing(tab)}
                    className={`flex-1 py-3 text-sm font-medium capitalize transition-colors relative ${
                      activePricing === tab ? 'text-primary bg-primary/5' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {tab}
                    {activePricing === tab && (
                      <motion.div
                        layoutId="pricing-tab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Pricing Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePricing}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-5"
                >
                  <h3 className="text-lg font-heading font-bold text-[var(--color-text)] mb-1">{pricing.name}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-4">{pricing.description}</p>

                  {/* Price */}
                  <div className="mb-4">
                    {hasDiscount ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xl text-[var(--color-text-secondary)] line-through">${pricing.price}</span>
                        <span className="text-3xl font-bold text-success">${Math.round(pricing.price * (1 - gig.discount.percent / 100))}</span>
                        <span className="px-2 py-0.5 bg-error text-white text-xs font-bold rounded-full">−{gig.discount.percent}% OFF</span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-[var(--color-text)]">${pricing.price}</span>
                    )}
                  </div>

                  {/* Countdown */}
                  {hasDiscount && gig.discount.expiresAt && countdown && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-[var(--color-text-secondary)]">
                      <ClockIcon className="w-4 h-4 text-secondary" />
                      <span>Deal ends in: <span className="font-mono font-semibold text-[var(--color-text)]">{countdown}</span></span>
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {pricing.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text)]">
                        <CheckIcon className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Delivery */}
                  <div className="flex items-center gap-2 mb-6 text-sm text-[var(--color-text-secondary)]">
                    <ClockIcon className="w-4 h-4" />
                    Delivered in {pricing.deliveryDays} days
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      onClick={handleOrderNow}
                      disabled={ordering || isOwner}
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      className="w-full py-3 rounded-lg bg-primary text-white font-semibold font-button hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {ordering ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                      {ordering ? 'Placing Order...' : isOwner ? 'Your Service' : 'Order Now'}
                    </motion.button>
                    <motion.button
                      onClick={handleContactSeller}
                      disabled={contacting || isOwner}
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      className="w-full py-3 rounded-lg border-2 border-primary text-primary font-semibold font-button hover:bg-primary/5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {contacting ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : null}
                      {contacting ? 'Starting Chat...' : 'Contact Seller'}
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GigDetails;
