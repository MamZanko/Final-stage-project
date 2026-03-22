import { memo } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { fadeInUp } from '../../lib/animations';

const StatCard = memo(({ icon: Icon, label, value, subtitle, trend, color = 'primary', pulse = false, delay = 0 }) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error',
    amber: 'bg-amber-500/10 text-amber-500',
    purple: 'bg-purple/10 text-purple',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ${pulse ? 'ring-2 ring-amber-500/30' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.primary} ${pulse ? 'animate-pulse-slow' : ''}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold flex items-center gap-0.5 ${trend >= 0 ? 'text-success' : 'text-error'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-[var(--color-text)]">
          {typeof value === 'number' ? (
            <CountUp end={value} duration={1.5} separator="," />
          ) : (
            value
          )}
        </p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{label}</p>
        {subtitle && <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
