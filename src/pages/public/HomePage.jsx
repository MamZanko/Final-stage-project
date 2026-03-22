import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MagnifyingGlassIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import GigCard from '../../components/ui/GigCard';
import BusinessCard from '../../components/ui/BusinessCard';
import SectionHeading from '../../components/ui/SectionHeading';
import { AnimateOnScroll, StaggerContainer, CountUpOnScroll } from '../../components/animation';
import {
  categoryPills,
  mockBusinesses,
  mockNews,
  platformStats,
  howItWorksClients,
  howItWorksBusiness,
} from '../../data/mockData';
import { useState, useEffect } from 'react';
import useSEO from '../../lib/useSEO';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

/* ==============================
   SECTION 1 — Hero Banner
   ============================== */
const HeroSection = ({ isAuthenticated }) => {
  const words = ['Perfect', 'Business', 'for', 'Your', 'Project'];

  return (
    <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-purple-700 text-white overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 min-h-[70vh] flex items-center">
        <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
            >
              <CheckBadgeIcon className="w-5 h-5 text-success-400" />
              Always 100% Free — No Hidden Fees
            </motion.div>

            {/* Headline: words slide up staggered */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              <span className="block">Find the</span>
              <span className="flex flex-wrap justify-center lg:justify-start gap-x-3">
                {words.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    }}
                    className={word === 'Perfect' ? 'text-secondary-400' : ''}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Connect with thousands of verified business professionals worldwide
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="max-w-xl mx-auto lg:mx-0 mb-8"
            >
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder='Try "Web Development", "Logo Design"...'
                  className="w-full pl-12 pr-32 py-4 bg-white/95 backdrop-blur-sm rounded-2xl text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 text-sm md:text-base transition-all shadow-xl"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors">
                  Search
                </button>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                to="/browse-gigs"
                className="px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg"
              >
                Browse Businesses
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl text-sm transition-colors backdrop-blur-sm"
                >
                  List Your Business
                </Link>
              )}
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 pt-8 border-t border-white/10"
            >
              {platformStats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl font-bold">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Illustration placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="hidden lg:flex flex-1 items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Decorative card stack */}
              <div className="absolute -top-4 -right-4 w-48 h-32 bg-white/10 rounded-2xl rotate-6" />
              <div className="absolute -bottom-4 -left-4 w-48 h-32 bg-white/10 rounded-2xl -rotate-3" />
              <div className="relative bg-white/15 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center text-lg">🚀</div>
                  <div>
                    <p className="font-semibold text-sm">Get Started Today</p>
                    <p className="text-xs text-white/60">Join 15,000+ businesses</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['✅ Zero platform fees', '✅ Verified professionals', '✅ Secure messaging'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ==============================
   SECTION 2 — Quick Category Pills (Infinite Auto-Scroll Carousel)
   ============================== */
const CategoryPillsSection = () => {
  // Triple items for seamless infinite loop (enough to always fill screen + overflow)
  const pills = [...categoryPills, ...categoryPills, ...categoryPills];

  return (
    <section className="py-6 bg-[var(--color-bg)] border-b border-[var(--color-border)] overflow-hidden">
      <div className="relative w-full overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />

        {/* Scrolling track */}
        <div className="animate-scroll-left flex w-max gap-3">
          {pills.map((pill, i) => (
            <Link
              key={`${pill.id}-${i}`}
              to={`/browse-gigs?category=${pill.name.toLowerCase()}`}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-full text-sm font-medium text-[var(--color-text)] hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all whitespace-nowrap flex-shrink-0"
            >
              <span>{pill.emoji}</span>
              {pill.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==============================
   SECTION 3 — Browse by Category
   ============================== */
const categoryIconMap = {
  'web-development': '💻',
  'mobile-apps': '📱',
  'graphic-design': '🎨',
  'digital-marketing': '📈',
  'writing': '✍️',
  'video-editing': '🎬',
  'photography': '📷',
  'seo': '🔍',
  'data-analysis': '📊',
  'translation': '🌐',
  'consulting': '💼',
  'it-support': '🔧',
  'cloud-services': '☁️',
  'cybersecurity': '🔒',
  'ai-ml': '🤖',
};

/* ==============================
   SECTION 3 — Browse by Category
   ============================== */
const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategories(res.data || []);
    }).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  if (loaded && categories.length === 0) return null;

  return (
    <section className="py-16 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Browse by Category"
          subtitle={`Explore services across ${categories.length || ''}+ professional categories`}
          linkText="View All Categories"
          linkTo="/browse-gigs"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!loaded
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-border)] flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 bg-[var(--color-border)] rounded w-24" />
                    <div className="h-2.5 bg-[var(--color-border)] rounded w-16" />
                  </div>
                </div>
              ))
            : categories.map((cat, i) => (
                <AnimateOnScroll key={cat.id} delay={i * 0.03}>
                  <Link
                    to={`/browse-gigs?category=${cat.slug}`}
                    className="group flex items-center gap-4 p-4 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="text-3xl">{categoryIconMap[cat.slug] || '📁'}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-primary-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {(cat.gigs_count || 0).toLocaleString()} services
                      </p>
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))
          }
        </div>
      </div>
    </section>
  );
};

/* ==============================
   SECTION 4 — Trending Gigs
   ============================== */
const GigCardSkeleton = () => (
  <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden animate-pulse shadow-sm">
    {/* Image placeholder */}
    <div className="aspect-[16/10] bg-[var(--color-border)]" />
    {/* Content */}
    <div className="p-4">
      {/* Business info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-[var(--color-border)]" />
        <div className="h-3 w-20 bg-[var(--color-border)] rounded" />
      </div>
      {/* Title — two lines */}
      <div className="space-y-1.5 mb-2 min-h-[40px]">
        <div className="h-3.5 bg-[var(--color-border)] rounded w-full" />
        <div className="h-3.5 bg-[var(--color-border)] rounded w-3/4" />
      </div>
      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <div className="w-4 h-4 rounded bg-[var(--color-border)]" />
        <div className="h-3 w-8 bg-[var(--color-border)] rounded" />
        <div className="h-3 w-6 bg-[var(--color-border)] rounded" />
      </div>
      {/* Price */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
        <div className="h-3 w-16 bg-[var(--color-border)] rounded" />
        <div className="h-5 w-14 bg-[var(--color-border)] rounded" />
      </div>
    </div>
  </div>
);

const TrendingSection = () => {
  const [gigs, setGigs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/gigs', { params: { sort: 'created_at', direction: 'desc', per_page: 8 } })
      .then((res) => setGigs(res.data || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && gigs.length === 0) return null;

  return (
    <section className="py-16 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          emoji="🔥"
          title="Trending This Week"
          subtitle="Most popular services right now"
          linkText="View All"
          linkTo="/browse-gigs?sort=trending"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {!loaded
            ? Array.from({ length: 4 }).map((_, i) => <GigCardSkeleton key={i} />)
            : gigs.map((gig, i) => <GigCard key={gig.id} gig={gig} index={i} />)
          }
        </div>
      </div>
    </section>
  );
};

/* ==============================
   SECTION 5 — Featured Business Accounts
   ============================== */
const FeaturedBusinessesSection = () => {
  return (
    <section className="py-16 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Top Businesses You Can Trust"
          subtitle="Verified professionals with proven track records"
          linkText="View All Businesses"
          linkTo="/find-businesses"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockBusinesses.map((business, i) => (
            <BusinessCard key={business.id} business={business} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==============================
   SECTION 6 — Featured/Sponsored Services
   ============================== */
const SponsoredSection = () => {
  const [gigs, setGigs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/gigs', { params: { sponsored: true, per_page: 8 } })
      .then((res) => setGigs(res.data || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && gigs.length === 0) return null;

  return (
    <section className="py-16 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          emoji="⭐"
          title="Featured Services"
          subtitle="Hand-picked premium services"
        />
        {!loaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <GigCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-2"
          >
            {gigs.map((gig, i) => (
              <SwiperSlide key={gig.id}>
                <GigCard gig={gig} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

/* ==============================
   SECTION 7 — Deals & Discounts Strip
   ============================== */
const DealsStripSection = () => {
  const [gigs, setGigs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/gigs', { params: { discounted: true, per_page: 10 } })
      .then((res) => setGigs(res.data || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && gigs.length === 0) return null;

  // Triple gigs for seamless infinite marquee
  const tripled = loaded ? [...gigs, ...gigs, ...gigs] : [];

  return (
    <section className="py-16 bg-gradient-to-r from-error-50 to-secondary-50 dark:from-error-950/20 dark:to-secondary-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          emoji="🔖"
          title="Current Hot Deals"
          subtitle="Limited time offers from top-rated businesses"
          linkText="View All Deals"
          linkTo="/deals"
        />

        {/* Marquee constrained to container — shows exactly 3 cards */}
        <div className="relative overflow-hidden mt-6">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-error-50 dark:from-[#1a0a0a] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-secondary-50 dark:from-[#0a0a1a] to-transparent" />

          {/* Scrolling track — cards sized to show exactly 3 in the container */}
          <div className="animate-scroll-left-deals flex w-max gap-5">
            {!loaded
              ? Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-[calc((min(100vw-2rem,1280px)-40px)/3)] flex-shrink-0">
                    <GigCardSkeleton />
                  </div>
                ))
              : tripled.map((gig, i) => (
                  <div key={`${gig.id}-${i}`} className="w-[calc((min(100vw-2rem,1280px)-40px)/3)] flex-shrink-0">
                    <GigCard gig={gig} index={i % gigs.length} showDiscount />
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </section>
  );
};

/* ==============================
   SECTION 8 — Platform News
   ============================== */
const NewsSection = () => {
  return (
    <section className="py-16 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          emoji="📰"
          title="Latest News & Updates"
          linkText="View All News"
          linkTo="/news"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockNews.map((news, i) => (
            <AnimateOnScroll key={news.id} delay={i * 0.1}>
              <article className="group bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-medium rounded-full mb-3">
                    {news.category}
                  </span>
                  <h3 className="font-semibold text-[var(--color-text)] mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {new Date(news.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <Link
                      to={`/news/${news.slug}`}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==============================
   SECTION 9 — How It Works
   ============================== */
const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState('clients');

  const steps = activeTab === 'clients' ? howItWorksClients : howItWorksBusiness;

  return (
    <section className="py-16 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="How It Works"
          subtitle="Getting started is easy — and always free"
          align="center"
        />

        {/* Tab toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-[var(--color-bg)] rounded-xl p-1 border border-[var(--color-border)]">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'clients'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              For Clients
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'business'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              For Businesses
            </button>
          </div>
        </div>

        {/* Steps */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.step} delay={i * 0.1} variant="fadeInUp">
              <div className="text-center relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-[var(--color-border)]" />
                )}
                <div className="relative inline-block mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl text-3xl">
                    {step.icon}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full shadow-md ring-2 ring-[var(--color-surface)]">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ==============================
   SECTION 10 — Platform Statistics
   ============================== */
const StatsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section ref={ref} className="py-16 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {platformStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                inView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center p-6 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl"
            >
              <p className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">
                <CountUpOnScroll
                  end={stat.value}
                  suffix={stat.suffix}
                  duration={1.5}
                />
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==============================
   SECTION 11 — Final CTA
   ============================== */
const FinalCTASection = ({ isAuthenticated }) => {
  if (isAuthenticated) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimateOnScroll variant="fadeInUp">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Join Thousands of Businesses and Clients — It's Free
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Start growing your business or find the perfect service provider today. No fees, no commissions — ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-xl text-lg transition-colors shadow-xl"
            >
              Sign Up Free
            </Link>
            <Link
              to="/how-it-works"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl text-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

/* ==============================
   HOMEPAGE — All 11 Sections
   ============================== */
const HomePage = () => {
  useSEO({
    title: 'Find Professional Services & Freelancers',
    description:
      'KarBazar connects you with skilled freelancers and businesses. Browse services, compare prices, read reviews, and hire the perfect professional for your project.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'KarBazar',
      url: 'https://karbazar.com',
      description:
        'KarBazar is a freelancer marketplace connecting businesses with talented professionals.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://karbazar.com/browse-gigs?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  });

  const { isAuthenticated } = useAuthStore();

  return (
    <div>
      {/* Section 1: Hero Banner */}
      <HeroSection isAuthenticated={isAuthenticated} />

      {/* Section 2: Quick Category Pills */}
      <CategoryPillsSection />

      {/* Section 3: Browse by Category */}
      <CategoriesSection />

      {/* Section 4: Trending Gigs */}
      <TrendingSection />

      {/* Section 5: Featured Business Accounts */}
      <FeaturedBusinessesSection />

      {/* Section 6: Featured/Sponsored Services */}
      <SponsoredSection />

      {/* Section 7: Deals & Discounts Strip */}
      <DealsStripSection />

      {/* Section 8: Platform News */}
      <NewsSection />

      {/* Section 9: How It Works */}
      <HowItWorksSection />

      {/* Section 10: Platform Statistics */}
      <StatsSection />

      {/* Section 11: Final CTA */}
      <FinalCTASection isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default HomePage;
