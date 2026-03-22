import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, TrashIcon, StarIcon, ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { mockAdminReviews } from '../../data/mockDataAdmin';
import AdminTable from '../../components/admin/AdminTable';
import StatusBadge from '../../components/admin/StatusBadge';
import StatCard from '../../components/admin/StatCard';
import ConfirmModal from '../../components/ui/ConfirmModal';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState(mockAdminReviews);
  const [search, setSearch] = useState('');
  const [reportedOnly, setReportedOnly] = useState(false);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [deleteReview, setDeleteReview] = useState(null);

  const stats = useMemo(() => ({
    total: reviews.length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    reported: reviews.filter(r => r.reported).length,
    verified: reviews.filter(r => r.verified).length,
  }), [reviews]);

  const filtered = useMemo(() => {
    let r = [...reviews];
    if (search) r = r.filter(rv => rv.reviewer.name.toLowerCase().includes(search.toLowerCase()) || rv.business.toLowerCase().includes(search.toLowerCase()) || rv.comment.toLowerCase().includes(search.toLowerCase()));
    if (reportedOnly) r = r.filter(rv => rv.reported);
    if (verifiedOnly) r = r.filter(rv => rv.verified);
    if (ratingFilter !== 'all') r = r.filter(rv => rv.rating === parseInt(ratingFilter));
    return r;
  }, [reviews, search, reportedOnly, verifiedOnly, ratingFilter]);

  const handleDelete = () => {
    setReviews(reviews.filter(r => r.id !== deleteReview?.id));
    setDeleteReview(null);
  };

  const dismissReport = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, reported: false } : r));
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        i <= rating
          ? <StarSolid key={i} className="w-3.5 h-3.5 text-amber-400" />
          : <StarIcon key={i} className="w-3.5 h-3.5 text-[var(--color-border)]" />
      ))}
    </div>
  );

  const columns = [
    {
      key: 'client', label: 'Reviewer', sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <img src={row.reviewer.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
          <span className="text-sm text-[var(--color-text)]">{row.reviewer.name}</span>
        </div>
      ),
    },
    { key: 'business', label: 'Business', render: (row) => <span className="text-[var(--color-text-secondary)]">{row.business}</span> },
    { key: 'gig', label: 'Gig', render: (row) => <span className="text-xs text-[var(--color-text)] truncate max-w-[150px] block">{row.gig}</span> },
    { key: 'rating', label: 'Rating', sortable: true, render: (row) => renderStars(row.rating) },
    { key: 'comment', label: 'Comment', render: (row) => <p className="text-xs text-[var(--color-text-secondary)] truncate max-w-[200px]">{row.comment}</p> },
    { key: 'date', label: 'Date', sortable: true, render: (row) => <span className="text-xs text-[var(--color-text-secondary)]">{row.date}</span> },
    {
      key: 'flags', label: 'Flags',
      render: (row) => (
        <div className="flex gap-1">
          {row.verified && <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">Verified</span>}
          {row.reported && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-medium flex items-center gap-0.5"><ExclamationTriangleIcon className="w-3 h-3" /> Reported</span>}
        </div>
      ),
    },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (row) => (
        <div className="flex gap-1">
          {row.reported && <button onClick={() => dismissReport(row.id)} className="p-1 rounded hover:bg-success/10 text-success text-[10px] font-medium" title="Dismiss Report">Dismiss</button>}
          <button onClick={() => setDeleteReview(row)} className="p-1 rounded hover:bg-error/10 text-error" title="Delete"><TrashIcon className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  // Custom row class for reported rows
  const rowClassName = (row) => row.reported ? 'bg-amber-500/5' : '';

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={StarIcon} label="Total Reviews" value={stats.total} color="primary" />
        <StatCard icon={StarSolid} label="Avg Rating" value={stats.avgRating} color="amber" />
        <StatCard icon={ExclamationTriangleIcon} label="Reported" value={stats.reported} color="error" pulse={stats.reported > 0} />
        <StatCard icon={ShieldCheckIcon} label="Verified" value={stats.verified} color="success" />
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search client, business, comment..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]">
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={reportedOnly} onChange={(e) => setReportedOnly(e.target.checked)} className="w-4 h-4 rounded border-[var(--color-border)] text-amber-500 focus:ring-amber-500" />
            <span className="text-xs text-[var(--color-text-secondary)]">Reported Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="w-4 h-4 rounded border-[var(--color-border)] text-success focus:ring-success" />
            <span className="text-xs text-[var(--color-text-secondary)]">Verified Only</span>
          </label>
        </div>
      </div>

      <AdminTable columns={columns} data={filtered} pageSize={25} emptyMessage="No reviews found." rowClassName={rowClassName} />

      <ConfirmModal isOpen={!!deleteReview} onClose={() => setDeleteReview(null)} onConfirm={handleDelete} title="Delete Review" message={`Delete review by "${deleteReview?.client}" (${deleteReview?.rating} stars)?`} confirmText="Delete" variant="danger" />
    </div>
  );
};

export default ReviewsManagement;
