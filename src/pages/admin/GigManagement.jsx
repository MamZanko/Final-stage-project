import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, EyeIcon, PencilIcon, TrashIcon, PauseIcon, PlayIcon, TagIcon } from '@heroicons/react/24/outline';
import { mockAdminGigs } from '../../data/mockDataAdmin';
import AdminTable from '../../components/admin/AdminTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';

const GigManagement = () => {
  const [gigs, setGigs] = useState(mockAdminGigs);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [discountFilter, setDiscountFilter] = useState('all');
  const [deleteGig, setDeleteGig] = useState(null);
  const [removeDiscount, setRemoveDiscount] = useState(null);

  const categories = [...new Set(mockAdminGigs.map(g => g.category))];

  const filtered = useMemo(() => {
    let r = [...gigs];
    if (search) r = r.filter(g => g.title.toLowerCase().includes(search.toLowerCase()) || g.business.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter !== 'all') r = r.filter(g => g.category === categoryFilter);
    if (statusFilter !== 'all') r = r.filter(g => g.status === statusFilter);
    if (discountFilter === 'yes') r = r.filter(g => g.discount > 0);
    if (discountFilter === 'no') r = r.filter(g => g.discount === 0);
    return r;
  }, [gigs, search, categoryFilter, statusFilter, discountFilter]);

  const toggleStatus = (id) => {
    setGigs(gigs.map(g => g.id === id ? { ...g, status: g.status === 'active' ? 'paused' : 'active' } : g));
  };

  const columns = [
    {
      key: 'title', label: 'Gig', sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img src={row.image} alt="" className="w-12 h-8 rounded object-cover flex-shrink-0" />
          <span className="font-medium text-[var(--color-text)] truncate max-w-[200px]">{row.title}</span>
        </div>
      ),
    },
    { key: 'business', label: 'Business', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.business}</span> },
    { key: 'category', label: 'Category', render: (row) => <span className="text-xs text-[var(--color-text-secondary)]">{row.category}</span> },
    { key: 'price', label: 'Price', render: (row) => <span className="text-xs font-medium text-[var(--color-text)]">{row.price}</span> },
    {
      key: 'discount', label: 'Discount', sortable: true,
      render: (row) => row.discount > 0 ? <span className="discount-badge">−{row.discount}%</span> : <span className="text-xs text-[var(--color-text-muted)]">No discount</span>,
    },
    { key: 'datePosted', label: 'Posted', sortable: true, render: (row) => <span className="text-xs text-[var(--color-text-secondary)]">{row.datePosted}</span> },
    { key: 'views', label: 'Views', sortable: true, render: (row) => <span className="text-xs text-[var(--color-text-secondary)]">{row.views.toLocaleString()}</span> },
    { key: 'orders', label: 'Orders', sortable: true, render: (row) => <span className="text-xs text-[var(--color-text-secondary)]">{row.orders}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} size="xs" /> },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/gigs/${row.id}`} className="p-1 rounded hover:bg-primary/10 text-primary"><EyeIcon className="w-4 h-4" /></Link>
          <Link to={`/gigs/${row.id}/edit`} className="p-1 rounded hover:bg-primary/10 text-primary"><PencilIcon className="w-4 h-4" /></Link>
          <button onClick={() => toggleStatus(row.id)} className="p-1 rounded hover:bg-amber-500/10 text-amber-500" title={row.status === 'active' ? 'Pause' : 'Activate'}>{row.status === 'active' ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}</button>
          {row.discount > 0 && <button onClick={() => setRemoveDiscount(row)} className="p-1 rounded hover:bg-secondary/10 text-secondary" title="Remove Discount"><TagIcon className="w-4 h-4" /></button>}
          <button onClick={() => setDeleteGig(row)} className="p-1 rounded hover:bg-error/10 text-error"><TrashIcon className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search gig title, business name..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]">
            <option value="all">All Status</option><option value="active">Active</option><option value="paused">Paused</option><option value="draft">Draft</option>
          </select>
          <select value={discountFilter} onChange={(e) => setDiscountFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]">
            <option value="all">Has Discount</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
          <button onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); setDiscountFilter('all'); }} className="px-3 py-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">Clear</button>
        </div>
      </div>

      <AdminTable columns={columns} data={filtered} pageSize={25} emptyMessage="No gigs found." />

      <ConfirmModal isOpen={!!deleteGig} onClose={() => setDeleteGig(null)} onConfirm={() => { setGigs(gigs.filter(g => g.id !== deleteGig?.id)); setDeleteGig(null); }} title="Delete Gig" message={`Permanently delete "${deleteGig?.title}"?`} confirmText="Delete" variant="danger" />
      <ConfirmModal isOpen={!!removeDiscount} onClose={() => setRemoveDiscount(null)} onConfirm={() => { setGigs(gigs.map(g => g.id === removeDiscount?.id ? { ...g, discount: 0, discountExpiry: null } : g)); setRemoveDiscount(null); }} title="Remove Discount" message={`Remove the ${removeDiscount?.discount}% discount from "${removeDiscount?.title}"?`} confirmText="Remove" variant="warning" />
    </div>
  );
};

export default GigManagement;
