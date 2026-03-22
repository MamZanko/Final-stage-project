import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { memo } from 'react';

const statusConfig = {
  placed: { label: 'Placed', color: 'bg-secondary/10 text-secondary', pulse: false },
  pending: { label: 'Pending', color: 'bg-secondary/10 text-secondary', pulse: false },
  in_progress: { label: 'In Progress', color: 'bg-primary/10 text-primary', pulse: true },
  delivered: { label: 'Delivered', color: 'bg-purple/10 text-purple', pulse: false },
  completed: { label: 'Completed', color: 'bg-success/10 text-success', pulse: false },
  cancelled: { label: 'Cancelled', color: 'bg-error/10 text-error', pulse: false },
  revision: { label: 'Revision Requested', color: 'bg-gold/10 text-gold', pulse: true },
};

const OrderCard = memo(({ order, index = 0 }) => {
  const status = statusConfig[order.status] || statusConfig.placed;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="sm:w-40 h-32 sm:h-auto flex-shrink-0 bg-[var(--color-surface)]">
          {(order.gig?.images?.[0] || order.gig?.image) ? (
            <img
              src={order.gig?.images?.[0] || order.gig?.image}
              alt={order.gig?.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)] text-xs p-2 text-center">
              {order.gig?.title}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-semibold text-[var(--color-text)] line-clamp-1 group-hover:text-primary transition-colors">
                {order.gig?.title}
              </h3>
              {/* Status Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${status.color}`}>
                {status.pulse && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                )}
                {status.label}
              </span>
            </div>

            {/* Business info */}
            <div className="flex items-center gap-2 mb-2">
              {(order.business?.avatar_url || order.business?.avatar) ? (
                <img
                  src={order.business?.avatar_url || order.business?.avatar}
                  alt={order.business?.name}
                  className="w-5 h-5 rounded-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                  {order.business?.name?.charAt(0)}
                </div>
              )}
              <span className="text-xs text-[var(--color-text-secondary)]">{order.business?.name}</span>
            </div>

            {/* Order details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
              <span>Order #{order.orderNumber || order.id}</span>
              <span>{formatDate(order.datePlaced || order.created_at)}</span>
              {(order.package?.name) && <span className="capitalize">{order.package.name}</span>}
              <span className="font-semibold text-[var(--color-text)]">${order.price ?? order.package?.price ?? 0}</span>
            </div>
          </div>

          {/* Action */}
          <div className="mt-3 flex justify-end">
            <Link
              to={`/orders/${order.id}`}
              className="px-4 py-1.5 text-xs font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200 btn-animated"
            >
              View Order
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OrderCard.displayName = 'OrderCard';

export default OrderCard;
