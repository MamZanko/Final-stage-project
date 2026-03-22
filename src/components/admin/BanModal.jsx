import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalOverlay, modalContent, buttonVariants } from '../../lib/animations';

const BanModal = ({ isOpen, onClose, onConfirm, userName = '' }) => {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('permanent');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) { setError('Please provide a reason.'); return; }
    onConfirm({ reason, duration, expiryDate });
    setReason(''); setDuration('permanent'); setExpiryDate(''); setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div {...modalOverlay} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div {...modalContent} className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <h3 className="text-lg font-heading font-bold text-[var(--color-text)] text-center mb-1">Ban User</h3>
            <p className="text-sm text-[var(--color-text-secondary)] text-center mb-4">Ban <strong>{userName}</strong> from the platform</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Reason *</label>
                <textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} placeholder="Explain why this user is being banned..." className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-error/40 resize-none" />
                {error && <p className="text-xs text-error mt-1">{error}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-2">Duration</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="duration" value="temporary" checked={duration === 'temporary'} onChange={() => setDuration('temporary')} className="text-primary focus:ring-primary/40" />
                    <span className="text-sm text-[var(--color-text)]">Temporary</span>
                  </label>
                  {duration === 'temporary' && (
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="ml-6 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="duration" value="permanent" checked={duration === 'permanent'} onChange={() => setDuration('permanent')} className="text-primary focus:ring-primary/40" />
                    <span className="text-sm text-[var(--color-text)]">Permanent</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors">Cancel</motion.button>
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={handleConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-error text-white text-sm font-semibold hover:bg-error-light transition-colors">Confirm Ban</motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BanModal;
