import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

const steps = [
  { key: 'placed', label: 'Placed' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'completed', label: 'Completed' },
];

const statusIndex = {
  pending: 0,
  placed: 0,
  in_progress: 1,
  delivered: 2,
  completed: 3,
  cancelled: -1,
  revision: 1,
};

const ProgressTimeline = ({ status }) => {
  const currentIndex = statusIndex[status] ?? 0;
  const isCancelled = status === 'cancelled';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Line behind */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--color-border)]" />
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: isCancelled ? '0%' : `${(currentIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {steps.map((step, i) => {
          const isCompleted = !isCancelled && i <= currentIndex;
          const isCurrent = !isCancelled && i === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary border-primary text-white'
                    : 'bg-[var(--color-card-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
              >
                {isCompleted && i < currentIndex ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{i + 1}</span>
                )}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.div>
              <span className={`mt-2 text-xs font-medium text-center ${
                isCompleted ? 'text-primary' : 'text-[var(--color-text-secondary)]'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-error/10 text-error">
            Order Cancelled
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressTimeline;
