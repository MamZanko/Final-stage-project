import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { buttonVariants } from '../../lib/animations';

const InlineEditBio = ({ value, onSave, maxWords = 300 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef(null);

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > maxWords;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    if (isOverLimit) return;
    setSaving(true);
    setTimeout(() => {
      onSave?.(draft);
      setSaving(false);
      setIsEditing(false);
    }, 600);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  return (
    <div className="relative group">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed"
              rows={4}
            />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-[10px] font-medium ${isOverLimit ? 'text-error' : 'text-[var(--color-text-secondary)]'}`}>
                {wordCount} / {maxWords} words
              </span>
              <div className="flex gap-2">
                <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={handleCancel} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors">
                  <XMarkIcon className="w-3 h-3" /> Cancel
                </motion.button>
                <motion.button
                  variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                  onClick={handleSave}
                  disabled={isOverLimit || saving}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckIcon className="w-3 h-3" />}
                  {saving ? 'Saving...' : 'Save'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{value || 'Click to add a bio...'}</p>
            <button className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-primary hover:text-primary-dark">
              <PencilIcon className="w-3 h-3" /> Edit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InlineEditBio;
