import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, EyeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { mockAdminOrders } from '../../data/mockDataAdmin';
import AdminTable from '../../components/admin/AdminTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';

const statusOptions = ['placed', 'in_progress', 'delivered', 'completed', 'cancelled'];

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockAdminOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const filtered = useMemo(() => {
    let r = [...orders];
    if (search) r = r.filter(o => o.id.toString().includes(search) || o.client.name.toLowerCase().includes(search.toLowerCase()) || o.business.name.toLowerCase().includes(search.toLowerCase()) || o.gig.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') r = r.filter(o => o.status === statusFilter);
    if (dateFrom) r = r.filter(o => o.date >= dateFrom);
    if (dateTo) r = r.filter(o => o.date <= dateTo);
    return r;
  }, [orders, search, statusFilter, dateFrom, dateTo]);

  const handleStatusChange = () => {
    if (statusModal && newStatus) {
      setOrders(orders.map(o => o.id === statusModal.id ? { ...o, status: newStatus } : o));
      setStatusModal(null);
      setNewStatus('');
    }
  };

  const handleCancel = () => {
    if (cancelModal) {
      setOrders(orders.map(o => o.id === cancelModal.id ? { ...o, status: 'cancelled' } : o));
      setCancelModal(null);
      setCancelReason('');
    }
  };

  const columns = [
    { key: 'id', label: 'Order #', sortable: true, render: (row) => <span className="font-mono text-xs font-semibold text-primary">#{row.id}</span> },
    { key: 'gig', label: 'Gig', sortable: true, render: (row) => <span className="text-sm text-[var(--color-text)] truncate max-w-[180px] block">{row.gig}</span> },
    { key: 'client', label: 'Client', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.client.name}</span> },
    { key: 'business', label: 'Business', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.business.name}</span> },
    { key: 'price', label: 'Amount', sortable: true, render: (row) => <span className="font-semibold text-[var(--color-text)]">${row.price.toLocaleString()}</span> },
    { key: 'date', label: 'Date', sortable: true, render: (row) => <span className="text-xs text-[var(--color-text-secondary)]">{row.date}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} size="xs" /> },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/admin/orders/${row.id}`} className="p-1 rounded hover:bg-primary/10 text-primary" title="View Details"><EyeIcon className="w-4 h-4" /></Link>
          <button onClick={() => { setStatusModal(row); setNewStatus(row.status); }} className="p-1 rounded hover:bg-secondary/10 text-secondary text-xs font-medium" title="Change Status">Status</button>
          {row.status !== 'cancelled' && row.status !== 'completed' && (
            <button onClick={() => setCancelModal(row)} className="p-1 rounded hover:bg-error/10 text-error" title="Cancel Order"><XCircleIcon className="w-4 h-4" /></button>
          )}
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
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order #, client, business, gig..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]">
            <option value="all">All Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]" />
          <button onClick={() => { setSearch(''); setStatusFilter('all'); setDateFrom(''); setDateTo(''); }} className="px-3 py-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">Clear</button>
        </div>
      </div>

      <AdminTable columns={columns} data={filtered} pageSize={25} emptyMessage="No orders found." />

      {/* Change Status Modal */}
      <AnimatePresence>
        {statusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatusModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="text-lg font-heading font-bold text-[var(--color-text)] mb-1">Change Order Status</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">Order #{statusModal.id}</p>
              <div className="space-y-2 mb-5">
                {statusOptions.map(s => (
                  <label key={s} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${newStatus === s ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-[var(--color-surface)]'}`}>
                    <input type="radio" name="status" value={s} checked={newStatus === s} onChange={(e) => setNewStatus(e.target.value)} className="sr-only" />
                    <StatusBadge status={s} size="sm" />
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStatusModal(null)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">Cancel</button>
                <button onClick={handleStatusChange} className="flex-1 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">Update</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {cancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCancelModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="text-lg font-heading font-bold text-[var(--color-text)] mb-1">Cancel Order</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">Order #{cancelModal.id} — "{cancelModal.gig}"</p>
              <textarea rows={3} placeholder="Reason for cancellation..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setCancelModal(null)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">Back</button>
                <button onClick={handleCancel} className="flex-1 px-4 py-2 rounded-xl bg-error text-white text-sm font-semibold">Cancel Order</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement;
