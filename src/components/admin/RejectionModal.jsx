import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalOverlay, modalContent, buttonVariants } from '../../lib/animations';

const RejectionModal = ({ isOpen, onClose, onConfirm, title = 'Reject Request', userName = '' }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) { setError('Please provide a reason — this will be shown to the user.'); return; }
    onConfirm(reason);
    setReason(''); setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div {...modalOverlay} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div {...modalContent} className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-heading font-bold text-[var(--color-text)] text-center mb-1">{title}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] text-center mb-4">
              Reject business account request for <strong>{userName}</strong>
            </p>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Reason *</label>
              <textarea rows={4} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} placeholder="Please provide a reason — this will be shown to the user..." className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-error/40 resize-none" />
              {error && <p className="text-xs text-error mt-1">{error}</p>}
            </div>

            <div className="flex gap-3 mt-5">
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors">Cancel</motion.button>
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={handleConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-error text-white text-sm font-semibold hover:bg-error-light transition-colors">Confirm Reject</motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RejectionModal;
