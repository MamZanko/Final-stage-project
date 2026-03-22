import { motion } from 'framer-motion';
import { BriefcaseIcon, TrashIcon, CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { buttonVariants } from '../../lib/animations';

const WorkHistoryCard = ({ entry, isOwner = false, onDelete, isLast = false }) => {
  return (
    <div className="relative flex gap-4">
      {/* Timeline connector */}
      <div className="flex flex-col items-center pt-1">
        <div className="w-3 h-3 rounded-full bg-primary border-2 border-[var(--color-card-bg)] flex-shrink-0 z-10" />
        {!isLast && <div className="w-0.5 flex-1 bg-[var(--color-border)] mt-1" />}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 pb-6 group"
      >
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text)]">{entry.position}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <BuildingOffice2Icon className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                <span className="text-xs text-[var(--color-text-secondary)]">{entry.company}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <CalendarDaysIcon className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {entry.startDate} — {entry.endDate || 'Present'}
                </span>
              </div>
            </div>
            {isOwner && (
              <motion.button
                variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                onClick={() => onDelete?.(entry)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-error/10 text-[var(--color-text-secondary)] hover:text-error"
              >
                <TrashIcon className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          {entry.description && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed">{entry.description}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkHistoryCard;
