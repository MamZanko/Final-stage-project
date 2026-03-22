import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSEO from '../../lib/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import GigCard from '../../components/ui/GigCard';
import useDebounce from '../../lib/useDebounce';
import {
  deliveryTimeOptions,
  ratingOptions,
  sortOptions,
} from '../../data/mockData';
import api from '../../services/api';

const ITEMS_PER_PAGE = 12;

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
   Sidebar Filter Panel
   ============================== */
const FilterSidebar = ({ filters, setFilters, isOpen, onClose, categories }) => {
  const handleCheckbox = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key] || [];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  const handleRadio = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setFilters({
      categories: [],
      priceMin: '',
      priceMax: '',
      deliveryTime: '',
      rating: '',
      level: [],
      search: filters.search,
    });
  };

  const activeFilterCount = [
    filters.categories?.length || 0,
    filters.priceMin || filters.priceMax ? 1 : 0,
    filters.deliveryTime ? 1 : 0,
    filters.rating ? 1 : 0,
    filters.level?.length || 0,
  ].reduce((a, b) => a + b, 0);

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-error-600 hover:text-error-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection title="Category">
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories?.includes(cat.slug) || false}
                onChange={() => handleCheckbox('categories', cat.slug)}
                className="w-4 h-4 rounded border-[var(--color-border)] text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] transition-colors flex-1">
                {categoryIconMap[cat.slug] || '📁'} {cat.name}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                {cat.gigs_count || cat.count || 0}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin || ''}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priceMin: e.target.value }))
            }
            className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <span className="text-[var(--color-text-muted)] text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax || ''}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
            }
            className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </FilterSection>

      {/* Delivery Time */}
      <FilterSection title="Delivery Time">
        <div className="space-y-2">
          {deliveryTimeOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="deliveryTime"
                checked={filters.deliveryTime === opt.value}
                onChange={() => handleRadio('deliveryTime', opt.value)}
                className="w-4 h-4 border-[var(--color-border)] text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Seller Rating">
        <div className="space-y-2">
          {ratingOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.rating === opt.value}
                onChange={() => handleRadio('rating', opt.value)}
                className="w-4 h-4 border-[var(--color-border)] text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Business Level */}
      <FilterSection title="Business Level">
        <div className="space-y-2">
          {['Top Rated', 'Level 2', 'Level 1', 'New'].map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.level?.includes(level) || false}
                onChange={() => handleCheckbox('level', level)}
                className="w-4 h-4 rounded border-[var(--color-border)] text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] transition-colors">
                {level}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="sticky top-24 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-5">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-900/50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[var(--color-card-bg)] z-50 shadow-2xl overflow-y-auto p-5 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-[var(--color-text)]">
                  Filters
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
              <button
                onClick={onClose}
                className="mt-6 w-full btn-primary py-3 rounded-xl font-semibold text-sm"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ==============================
   Filter Section Wrapper
   ============================== */
const FilterSection = ({ title, children }) => (
  <div>
    <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">
      {title}
    </h4>
    {children}
  </div>
);

/* ==============================
   Pagination Component
   ============================== */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors"
          >
            1
          </button>
          {start > 2 && (
            <span className="text-[var(--color-text-muted)]">…</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-primary-600 text-white shadow-sm'
              : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]'
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="text-[var(--color-text-muted)]">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
};

/* ==============================
   Empty State
   ============================== */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-24 h-24 bg-[var(--color-surface)] rounded-full flex items-center justify-center text-4xl mb-6">
      🔍
    </div>
    <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
      No services found
    </h3>
    <p className="text-[var(--color-text-secondary)] max-w-md mb-6">
      Try adjusting your filters or search terms to find what you're looking for.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
    >
      Reset Filters
    </button>
  </div>
);

/* ==============================
   BROWSE GIGS PAGE
   ============================== */
const BrowseGigs = () => {
  useSEO({
    title: 'Browse Services & Gigs',
    description:
      'Explore thousands of professional services on KarBazar. Filter by category, price, delivery time, and ratings to find the perfect freelancer for your project.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Browse Services',
      description:
        'Browse and discover professional freelance services on KarBazar.',
      url: 'https://karbazar.com/browse-gigs',
    },
  });

  const [searchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recommended');
  const [gigs, setGigs] = useState([]);
  const [totalGigs, setTotalGigs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    categories: searchParams.get('category')
      ? [searchParams.get('category')]
      : [],
    priceMin: '',
    priceMax: '',
    deliveryTime: '',
    rating: '',
    level: [],
    search: searchParams.get('search') || '',
  });

  // Debounce search input for better performance
  const debouncedSearch = useDebounce(filters.search, 300);

  // Fetch categories once
  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  // Fetch gigs from API whenever filters/sort/page change
  useEffect(() => {
    setLoading(true);
    const params = { per_page: ITEMS_PER_PAGE, page: currentPage };

    // Search
    if (debouncedSearch) params.search = debouncedSearch;

    // Category — API expects a single slug
    if (filters.categories?.length > 0) params.category = filters.categories[0];

    // Price range
    if (filters.priceMin) params.min_price = filters.priceMin;
    if (filters.priceMax) params.max_price = filters.priceMax;

    // Delivery time
    if (filters.deliveryTime) params.max_delivery_days = filters.deliveryTime;

    // Rating filter
    if (filters.rating) params.min_rating = filters.rating;

    // Sort — send value directly, backend handles it
    if (sortBy && sortBy !== 'recommended') {
      params.sort = sortBy;
    }

    api.get('/gigs', { params })
      .then((res) => {
        setGigs(res.data || []);
        setTotalGigs(res.meta?.total || res.data?.length || 0);
        setTotalPages(res.meta?.last_page || 1);
      })
      .catch(() => {
        setGigs([]);
        setTotalGigs(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters.categories, filters.priceMin, filters.priceMax, filters.deliveryTime, filters.rating, sortBy, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-text)]">
            Browse Services
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Discover professional services from verified businesses
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <FilterSidebar
            filters={filters}
            setFilters={(fn) => {
              setFilters(fn);
              setCurrentPage(1);
            }}
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            categories={categories}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                >
                  <FunnelIcon className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* View toggle */}
                <div className="hidden sm:flex items-center bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]'
                    }`}
                    aria-label="Grid view"
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]'
                    }`}
                    aria-label="List view"
                  >
                    <ListBulletIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Showing{' '}
              <span className="font-semibold text-[var(--color-text)]">
                {gigs.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-[var(--color-text)]">
                {totalGigs}
              </span>{' '}
              services
            </p>

            {/* Gig Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : gigs.length > 0 ? (
              <motion.div
                key={`${sortBy}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'flex flex-col gap-4'
                }
              >
                {gigs.map((gig, i) => (
                  <GigCard key={gig.id} gig={gig} index={i} />
                ))}
              </motion.div>
            ) : (
              <EmptyState />
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseGigs;
