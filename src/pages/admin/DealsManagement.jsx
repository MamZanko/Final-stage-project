import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, TrashIcon, TagIcon, FireIcon, ClockIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import { mockAdminDeals } from '../../data/mockDataAdmin';
import AdminTable from '../../components/admin/AdminTable';
import StatusBadge from '../../components/admin/StatusBadge';
import StatCard from '../../components/admin/StatCard';
import ConfirmModal from '../../components/ui/ConfirmModal';

const DealsManagement = () => {
  const [deals, setDeals] = useState(mockAdminDeals);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expiringOnly, setExpiringOnly] = useState(false);
  const [discountRange, setDiscountRange] = useState('all');
  const [removeModal, setRemoveModal] = useState(null);
  const [removeReason, setRemoveReason] = useState('');

  const categories = [...new Set(mockAdminDeals.map(d => d.category))];

  const stats = useMemo(() => ({
    active: deals.filter(d => d.status === 'active').length,
    expiring: deals.filter(d => d.status === 'expiring_soon').length,
    expired: deals.filter(d => d.status === 'expired').length,
  }), [deals]);

  const filtered = useMemo(() => {
    let r = [...deals];
    if (categoryFilter !== 'all') r = r.filter(d => d.category === categoryFilter);
    if (expiringOnly) r = r.filter(d => d.status === 'expiring_soon');
    if (discountRange === '0-20') r = r.filter(d => d.discountPercent <= 20);
    if (discountRange === '20-50') r = r.filter(d => d.discountPercent > 20 && d.discountPercent <= 50);
    if (discountRange === '50+') r = r.filter(d => d.discountPercent > 50);
    return r;
  }, [deals, categoryFilter, expiringOnly, discountRange]);

  const handleRemove = () => {
    setDeals(deals.map(d => d.id === removeModal?.id ? { ...d, status: 'removed', discountPercent: 0 } : d));
    setRemoveModal(null);
    setRemoveReason('');
  };

  const columns = [
    { key: 'gigTitle', label: 'Gig', sortable: true, render: (row) => <span className="text-sm text-[var(--color-text)] truncate max-w-[200px] block">{row.gigTitle}</span> },
    { key: 'business', label: 'Business', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.business}</span> },
    { key: 'category', label: 'Category', render: (row) => <span className="text-xs text-[var(--color-text-secondary)]">{row.category}</span> },
    { key: 'discountPercent', label: 'Discount', sortable: true, render: (row) => <span className="discount-badge">−{row.discountPercent}%</span> },
    {
      key: 'originalPrice', label: 'Price',
      render: (row) => (
        <div>
          <span className="line-through text-[10px] text-[var(--color-text-muted)]">${row.originalPrice}</span>
          <span className="ml-1 text-sm font-semibold text-[var(--color-text)]">${row.discountedPrice}</span>
        </div>
      ),
    },
    { key: 'expiry', label: 'Expiry', sortable: true, render: (row) => <span className={`text-xs ${row.status === 'expiring_soon' ? 'text-amber-500 font-semibold' : 'text-[var(--color-text-secondary)]'}`}>{row.expiry}</span> },
    { key: 'usageCount', label: 'Used', sortable: true, render: (row) => <span className="text-xs text-[var(--color-text-secondary)]">{row.usageCount} times</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} size="xs" /> },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (row) => row.status !== 'removed' && row.status !== 'expired' ? (
        <button onClick={() => setRemoveModal(row)} className="flex items-center gap-1 p-1 rounded hover:bg-error/10 text-error text-xs"><TrashIcon className="w-3.5 h-3.5" /> Remove</button>
      ) : <span className="text-xs text-[var(--color-text-muted)]">—</span>,
    },
  ];

  const rowClassName = (row) => row.status === 'expiring_soon' ? 'bg-amber-500/5' : row.status === 'expired' ? 'opacity-50' : '';

  return (
    <div className="space-y-4">
      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={FireIcon} label="Active Deals" value={stats.active} color="success" />
        <StatCard icon={ClockIcon} label="Expiring Soon" value={stats.expiring} color="amber" pulse={stats.expiring > 0} />
        <StatCard icon={ArchiveBoxXMarkIcon} label="Expired" value={stats.expired} color="error" />
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={discountRange} onChange={(e) => setDiscountRange(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]">
            <option value="all">Discount Range</option>
            <option value="0-20">0-20%</option>
            <option value="20-50">20-50%</option>
            <option value="50+">50%+</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={expiringOnly} onChange={(e) => setExpiringOnly(e.target.checked)} className="w-4 h-4 rounded border-[var(--color-border)] text-amber-500 focus:ring-amber-500" />
            <span className="text-xs text-[var(--color-text-secondary)]">Expiring Soon</span>
          </label>
          <button onClick={() => { setCategoryFilter('all'); setDiscountRange('all'); setExpiringOnly(false); }} className="px-3 py-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">Clear</button>
        </div>
      </div>

      <AdminTable columns={columns} data={filtered} pageSize={25} emptyMessage="No deals found." rowClassName={rowClassName} />

      {/* Remove Discount Modal */}
      {removeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setRemoveModal(null)} />
          <div className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-heading font-bold text-[var(--color-text)] mb-1">Remove Discount</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">Remove the {removeModal.discountPercent}% discount from "{removeModal.gigTitle}"?</p>
            <textarea rows={2} value={removeReason} onChange={(e) => setRemoveReason(e.target.value)} placeholder="Reason (optional)..." className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setRemoveModal(null)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">Cancel</button>
              <button onClick={handleRemove} className="flex-1 px-4 py-2 rounded-xl bg-error text-white text-sm font-semibold">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsManagement;
