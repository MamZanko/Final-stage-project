import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { mockOrders, activeOrders, completedOrders, cancelledOrders } from '../../data/mockDataPhase2';
import OrderCard from '../../components/ui/OrderCard';
import { pageTransition, tabContent, fadeInUp, staggerContainer } from '../../lib/animations';

const statusTabs = [
  { key: 'active', label: 'Active', count: activeOrders.length },
  { key: 'completed', label: 'Completed', count: completedOrders.length },
  { key: 'cancelled', label: 'Cancelled', count: cancelledOrders.length },
  { key: 'all', label: 'All Orders', count: mockOrders.length },
];

const ITEMS_PER_PAGE = 6;

const ClientOrders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const ordersByTab = {
    active: activeOrders,
    completed: completedOrders,
    cancelled: cancelledOrders,
    all: mockOrders,
  };

  const filteredOrders = useMemo(() => {
    let orders = ordersByTab[activeTab] || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.gig.title.toLowerCase().includes(q) ||
          o.business.name.toLowerCase().includes(q) ||
          o.orderNumber?.toLowerCase().includes(q)
      );
    }
    orders = [...orders].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'price-low') return a.price - b.price;
      return 0;
    });
    return orders;
  }, [activeTab, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div {...fadeInUp} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-[var(--color-text)]">My Orders</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Track and manage all your orders</p>
      </motion.div>

      {/* Status Tabs */}
      <div className="border-b border-[var(--color-border)] mb-6">
        <div className="flex gap-0 overflow-x-auto scrollbar-thin">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.key ? 'text-primary' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-primary text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="orders-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search orders by gig title, business, or order number..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-[var(--color-text-secondary)]"
          />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
        </div>
      </div>

      {/* Order List */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab + searchQuery + sortBy} {...tabContent}>
          {paginatedOrders.length > 0 ? (
            <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible" className="space-y-4">
              {paginatedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl"
            >
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-base font-heading font-semibold text-[var(--color-text)] mb-1">
                {searchQuery ? 'No matching orders' : 'No orders yet'}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {searchQuery ? 'Try adjusting your search query' : 'Start exploring gigs to place your first order'}
              </p>
              {!searchQuery && (
                <Link to="/browse-gigs" className="inline-flex items-center gap-1 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                  Browse Gigs
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text)] disabled:opacity-40 hover:bg-[var(--color-surface)] transition-colors"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page ? 'bg-primary text-white' : 'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text)] disabled:opacity-40 hover:bg-[var(--color-surface)] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ClientOrders;
