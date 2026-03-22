import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const SkillsPills = ({ skills = [], onChange, editable = false }) => {
  const [newSkill, setNewSkill] = useState('');
  const [showInput, setShowInput] = useState(false);

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange?.([...skills, trimmed]);
      setNewSkill('');
      setShowInput(false);
    }
  };

  const removeSkill = (skill) => {
    onChange?.(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
    if (e.key === 'Escape') { setShowInput(false); setNewSkill(''); }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {skills.map((skill) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/20"
          >
            {skill}
            {editable && (
              <button onClick={() => removeSkill(skill)} className="ml-0.5 hover:text-error transition-colors">
                <XMarkIcon className="w-3 h-3" />
              </button>
            )}
          </motion.span>
        ))}
      </AnimatePresence>

      {editable && (
        <AnimatePresence>
          {showInput ? (
            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="flex items-center">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => { if (!newSkill.trim()) setShowInput(false); }}
                placeholder="Type skill..."
                autoFocus
                className="w-28 px-2.5 py-1.5 text-xs rounded-full border border-primary/40 bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowInput(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-dashed border-primary/30 text-primary text-xs font-medium rounded-full hover:border-primary/60 hover:bg-primary/5 transition-colors"
            >
              <PlusIcon className="w-3 h-3" /> Add Skill
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default SkillsPills;
