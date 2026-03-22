import { motion, AnimatePresence } from 'framer-motion';
import { modalOverlay, modalContent, buttonVariants } from '../../lib/animations';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary' | 'warning'
  isLoading = false,
}) => {
  const variantColors = {
    danger: 'bg-error hover:bg-error-light',
    primary: 'bg-primary hover:bg-primary-dark',
    warning: 'bg-secondary hover:bg-secondary-dark',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            {...modalOverlay}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            {...modalContent}
            className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl"
          >
            {/* Icon */}
            {variant === 'danger' && (
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
            )}

            <h3 className="text-lg font-heading font-bold text-[var(--color-text)] text-center mb-2">{title}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">{message}</p>

            <div className="flex gap-3">
              <motion.button
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-semibold font-button hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
              >
                {cancelText}
              </motion.button>
              <motion.button
                variants={buttonVariants}
                initial="idle"
                whileHover={!isLoading ? 'hover' : undefined}
                whileTap={!isLoading ? 'tap' : undefined}
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 py-2.5 rounded-lg text-white font-semibold font-button transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${variantColors[variant]}`}
              >
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
