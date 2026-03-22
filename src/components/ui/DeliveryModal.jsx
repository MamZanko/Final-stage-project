import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PaperClipIcon, PaperAirplaneIcon, CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { modalOverlay, modalContent, buttonVariants } from '../../lib/animations';

const DeliveryModal = ({ isOpen, onClose, onSubmit, orderNumber = '' }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFileAdd = (newFiles) => {
    const fileArray = Array.from(newFiles);
    setFiles((prev) => [...prev, ...fileArray]);
    fileArray.forEach((file) => {
      const id = file.name + Date.now();
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 15;
        if (progress >= 100) { progress = 100; clearInterval(interval); }
        setUploadProgress((prev) => ({ ...prev, [id]: Math.min(100, Math.round(progress)) }));
      }, 200);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileAdd(e.dataTransfer.files);
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!message.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onSubmit?.({ message, files });
      setLoading(false);
      setMessage('');
      setFiles([]);
      setUploadProgress({});
      onClose?.();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div {...modalOverlay} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div {...modalContent} className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
              <XMarkIcon className="w-5 h-5" />
            </button>

            <h3 className="text-base font-heading font-semibold text-[var(--color-text)] mb-1">Deliver Order</h3>
            {orderNumber && <p className="text-xs text-[var(--color-text-secondary)] mb-4">Order #{orderNumber}</p>}

            {/* Message */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Message to Client <span className="text-error">*</span></label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Describe what you're delivering, any instructions, etc..."
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none placeholder:text-[var(--color-text-secondary)]"
              />
            </div>

            {/* File upload */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Attach Files</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-[var(--color-border)] hover:border-primary/50'}`}
              >
                <input ref={inputRef} type="file" multiple onChange={(e) => handleFileAdd(e.target.files)} className="hidden" />
                <CloudArrowUpIcon className="w-6 h-6 mx-auto mb-1 text-[var(--color-text-secondary)]" />
                <p className="text-xs text-[var(--color-text-secondary)]">Drop files here or click to upload</p>
              </div>

              {files.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-2.5 py-1.5 bg-[var(--color-surface)] rounded-lg">
                      <DocumentIcon className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0" />
                      <span className="text-xs text-[var(--color-text)] flex-1 truncate">{file.name}</span>
                      <span className="text-[10px] text-[var(--color-text-secondary)]">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                      <button onClick={() => removeFile(idx)} className="text-[var(--color-text-secondary)] hover:text-error transition-colors">
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors">
                Cancel
              </button>
              <motion.button
                variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                onClick={handleSubmit}
                disabled={!message.trim() || loading}
                className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <PaperAirplaneIcon className="w-4 h-4" />}
                Submit Delivery
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeliveryModal;
