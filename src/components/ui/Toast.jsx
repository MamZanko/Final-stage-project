import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Toast type configs
const toastConfig = {
  success: {
    icon: CheckCircleIcon,
    iconColor: 'text-success-500',
    borderColor: 'border-success-500',
    progressColor: 'bg-success-500',
  },
  error: {
    icon: XCircleIcon,
    iconColor: 'text-error-500',
    borderColor: 'border-error-500',
    progressColor: 'bg-error-500',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconColor: 'text-secondary-500',
    borderColor: 'border-secondary-500',
    progressColor: 'bg-secondary-500',
  },
  info: {
    icon: InformationCircleIcon,
    iconColor: 'text-primary-500',
    borderColor: 'border-primary-500',
    progressColor: 'bg-primary-500',
  },
};

// Custom toast renderer with progress bar
const CustomToast = ({ t, type = 'info', title, message, duration = 4000 }) => {
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative max-w-md w-full bg-[var(--color-card-bg)] border ${config.borderColor} rounded-xl shadow-lg overflow-hidden pointer-events-auto`}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {title}
            </p>
          )}
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            {message}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 p-1 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar - draining animation */}
      {t.visible && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 right-0 h-0.5 ${config.progressColor} origin-left`}
        />
      )}
    </motion.div>
  );
};

// Toast utility functions
export const showToast = {
  success: (message, title = 'Success') =>
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="success"
          title={title}
          message={message}
          duration={3000}
        />
      ),
      { duration: 3000 }
    ),

  error: (message, title = 'Error') =>
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="error"
          title={title}
          message={message}
          duration={4000}
        />
      ),
      { duration: 4000 }
    ),

  warning: (message, title = 'Warning') =>
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="warning"
          title={title}
          message={message}
          duration={4000}
        />
      ),
      { duration: 4000 }
    ),

  info: (message, title = 'Info') =>
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="info"
          title={title}
          message={message}
          duration={4000}
        />
      ),
      { duration: 4000 }
    ),
};

export default CustomToast;
