import { motion } from 'framer-motion';
import { fadeInUp } from '../../lib/animations';

const AdminChartCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">{title}</h3>
        {subtitle && <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{subtitle}</p>}
      </div>
      <div className="w-full">{children}</div>
    </motion.div>
  );
};

export default AdminChartCard;
