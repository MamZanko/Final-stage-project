const StatusBadge = ({ status, size = 'sm' }) => {
  const statusConfig = {
    active: { label: 'Active', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
    banned: { label: 'Banned', bg: 'bg-error/10', text: 'text-error', dot: 'bg-error' },
    completed: { label: 'Completed', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
    in_progress: { label: 'In Progress', bg: 'bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500' },
    placed: { label: 'Placed', bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
    delivered: { label: 'Delivered', bg: 'bg-purple/10', text: 'text-purple', dot: 'bg-purple' },
    cancelled: { label: 'Cancelled', bg: 'bg-gray-500/10', text: 'text-gray-500', dot: 'bg-gray-400' },
    paused: { label: 'Paused', bg: 'bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500' },
    draft: { label: 'Draft', bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
    published: { label: 'Published', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
    unpublished: { label: 'Unpublished', bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
    approved: { label: 'Approved', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
    rejected: { label: 'Rejected', bg: 'bg-error/10', text: 'text-error', dot: 'bg-error' },
    pending: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500' },
    expired: { label: 'Expired', bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
    expiring_soon: { label: 'Expiring Soon', bg: 'bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500' },
    removed: { label: 'Removed', bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
    client: { label: 'Client', bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
    business: { label: 'Business', bg: 'bg-secondary/10', text: 'text-secondary', dot: 'bg-secondary' },
    admin: { label: 'Admin', bg: 'bg-purple/10', text: 'text-purple', dot: 'bg-purple' },
  };

  const config = statusConfig[status] || { label: status, bg: 'bg-gray-500/10', text: 'text-gray-500', dot: 'bg-gray-400' };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'in_progress' || status === 'expiring_soon' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
