import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon, PencilIcon, TrashIcon, EyeIcon, PauseIcon, PlayIcon,
  TagIcon, MagnifyingGlassIcon, ExclamationTriangleIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { mockBusinessGigs, mockGigCounter } from '../../data/mockDataPhase3';
import MonthlyGigCounter from '../../components/ui/MonthlyGigCounter';
import DiscountModal from '../../components/ui/DiscountModal';
import GigPreviewModal from '../../components/ui/GigPreviewModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { pageTransition, fadeInUp, staggerContainer, staggerItem, buttonVariants } from '../../lib/animations';

const statusConfig = {
  active: { label: 'Active', color: 'bg-success/10 text-success' },
  paused: { label: 'Paused', color: 'bg-secondary/10 text-secondary' },
  draft: { label: 'Draft', color: 'bg-gray-200 dark:bg-gray-700 text-[var(--color-text-secondary)]' },
};

const MyGigs = () => {
  const [gigs, setGigs] = useState(mockBusinessGigs);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [discountGig, setDiscountGig] = useState(null);
  const [previewGig, setPreviewGig] = useState(null);
  const [deleteGig, setDeleteGig] = useState(null);

  const filtered = gigs.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = gigs.filter((g) => g.status === 'active').length;
  const pausedCount = gigs.filter((g) => g.status === 'paused').length;
  const draftCount = gigs.filter((g) => g.status === 'draft').length;

  const toggleGigStatus = (id) => {
    setGigs(gigs.map((g) => g.id === id ? { ...g, status: g.status === 'active' ? 'paused' : 'active' } : g));
  };

  const handleDelete = () => {
    if (deleteGig) {
      setGigs(gigs.filter((g) => g.id !== deleteGig.id));
      setDeleteGig(null);
    }
  };

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[var(--color-text)]">My Gigs</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Manage your services and offerings</p>
        </div>
        <Link to="/gigs/create">
          <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm">
            <PlusIcon className="w-4 h-4" /> Create Gig
          </motion.button>
        </Link>
      </div>

      {/* Gig Counter */}
      <div className="mb-6">
        <MonthlyGigCounter used={mockGigCounter.used} limit={mockGigCounter.limit} nextReset={mockGigCounter.nextReset} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Active', count: activeCount, color: 'text-success' },
          { label: 'Paused', count: pausedCount, color: 'text-secondary' },
          { label: 'Drafts', count: draftCount, color: 'text-[var(--color-text-secondary)]' },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search gigs..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'paused', 'draft'].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${statusFilter === f ? 'bg-primary text-white' : 'bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Gig Cards */}
      <motion.div variants={staggerContainer(0.05)} initial="initial" animate="animate" className="space-y-4">
        <AnimatePresence>
          {filtered.map((gig) => {
            const statusCfg = statusConfig[gig.status] || statusConfig.draft;
            return (
              <motion.div key={gig.id} variants={staggerItem} layout exit={{ opacity: 0, x: -30 }} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-52 h-40 sm:h-auto relative flex-shrink-0 overflow-hidden">
                    <img src={gig.image} alt={gig.title} className="w-full h-full object-cover" loading="lazy" />
                    {gig.discount?.isActive && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-error text-white text-[10px] font-bold rounded-full">−{gig.discount.percent}% OFF</span>
                    )}
                    <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <Link to={`/gigs/${gig.id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-sm font-semibold text-[var(--color-text)] line-clamp-1">{gig.title}</h3>
                      </Link>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">{gig.category}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]"><StarIcon className="w-3.5 h-3.5 text-gold" /> {gig.rating} ({gig.reviewCount})</span>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]"><ShoppingCartIcon className="w-3.5 h-3.5" /> {gig.orders || 0} orders</span>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]"><EyeIcon className="w-3.5 h-3.5" /> {gig.views || 0} views</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-border)]">
                      <div>
                        {gig.discount?.isActive ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-success">${gig.discount.discountedPrice}</span>
                            <span className="text-xs text-[var(--color-text-secondary)] line-through">${gig.discount.originalPrice}</span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-[var(--color-text)]">From ${gig.startingPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setPreviewGig(gig)} className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-primary hover:border-primary transition-colors" title="Preview"><EyeIcon className="w-4 h-4" /></button>
                        <Link to={`/gigs/${gig.id}/edit`}><button className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-primary hover:border-primary transition-colors" title="Edit"><PencilIcon className="w-4 h-4" /></button></Link>
                        <button onClick={() => setDiscountGig(gig)} className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-secondary hover:border-secondary transition-colors" title="Discount"><TagIcon className="w-4 h-4" /></button>
                        <button onClick={() => toggleGigStatus(gig.id)} className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${gig.status === 'active' ? 'border-secondary text-secondary hover:bg-secondary/10' : 'border-success text-success hover:bg-success/10'}`} title={gig.status === 'active' ? 'Pause' : 'Activate'}>
                          {gig.status === 'active' ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setDeleteGig(gig)} className="w-8 h-8 rounded-lg border border-error/30 flex items-center justify-center text-error hover:bg-error/10 transition-colors" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div {...fadeInUp} className="text-center py-16">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-[var(--color-text-secondary)] mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)]">No gigs match your search.</p>
        </motion.div>
      )}

      {/* Modals */}
      <DiscountModal isOpen={!!discountGig} onClose={() => setDiscountGig(null)} gig={discountGig} onApply={() => setDiscountGig(null)} onRemove={() => setDiscountGig(null)} />
      <GigPreviewModal isOpen={!!previewGig} onClose={() => setPreviewGig(null)} gig={previewGig} />
      <ConfirmModal isOpen={!!deleteGig} onClose={() => setDeleteGig(null)} onConfirm={handleDelete} title="Delete Gig" message={`Are you sure you want to delete "${deleteGig?.title}"? This cannot be undone.`} confirmText="Delete" variant="danger" />
    </motion.div>
  );
};

export default MyGigs;
