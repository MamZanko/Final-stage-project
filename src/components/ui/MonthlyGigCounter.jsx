import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDaysIcon, PlusIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { buttonVariants } from '../../lib/animations';

const MonthlyGigCounter = ({ used = 0, limit = 4, nextReset = '' }) => {
  const resetDate = nextReset ? new Date(nextReset).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'next month';
  const atLimit = used >= limit;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${atLimit ? 'bg-secondary/5 border-secondary/30' : 'bg-primary/5 border-primary/20'}`}>
      <CalendarDaysIcon className={`w-5 h-5 flex-shrink-0 ${atLimit ? 'text-secondary' : 'text-primary'}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--color-text)]">
          <span className={`font-bold ${atLimit ? 'text-secondary' : 'text-primary'}`}>{used} of {limit}</span> gigs posted this month.
          <span className="text-[var(--color-text-secondary)]"> Next reset: {resetDate}.</span>
        </p>
      </div>
      {atLimit && (
        <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">
          LIMIT REACHED
        </span>
      )}
    </div>
  );
};

export default MonthlyGigCounter;
