import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const AdminTable = ({
  columns,
  data,
  pageSize = 25,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  emptyMessage = 'No data found.',
  sortable = true,
  rowClassName,
}) => {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    if (!sortKey || !sortable) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    return [...data].sort((a, b) => {
      const va = col.accessor ? col.accessor(a) : a[sortKey];
      const vb = col.accessor ? col.accessor(b) : b[sortKey];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [data, sortKey, sortDir, columns, sortable]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const allSelected = paged.length > 0 && paged.every((r) => selectedRows.includes(r.id));
  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange?.(selectedRows.filter((id) => !paged.some((r) => r.id === id)));
    } else {
      const newIds = [...new Set([...selectedRows, ...paged.map((r) => r.id)])];
      onSelectionChange?.(newIds);
    }
  };
  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      onSelectionChange?.(selectedRows.filter((i) => i !== id));
    } else {
      onSelectionChange?.([...selectedRows, id]);
    }
  };

  return (
    <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-[var(--color-border)] text-primary focus:ring-primary/40" />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider whitespace-nowrap ${sortable && col.sortable !== false ? 'cursor-pointer select-none hover:text-[var(--color-text)]' : ''}`}
                  style={col.width ? { width: col.width } : {}}
                  onClick={() => sortable && col.sortable !== false && toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortable && col.sortable !== false && (
                      sortKey === col.key ? (sortDir === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />) : <ChevronUpDownIcon className="w-3 h-3 opacity-40" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paged.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors duration-150 ${i % 2 === 0 ? '' : 'bg-[var(--color-surface)]/30'} ${selectedRows.includes(row.id) ? 'bg-primary/5' : ''} ${rowClassName ? rowClassName(row) : ''}`}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => toggleRow(row.id)} className="rounded border-[var(--color-border)] text-primary focus:ring-primary/40" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-[var(--color-text)] whitespace-nowrap">
                      {col.render ? col.render(row) : (col.accessor ? col.accessor(row) : row[col.key])}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {paged.length === 0 && (
        <div className="py-12 text-center text-sm text-[var(--color-text-secondary)]">{emptyMessage}</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-secondary)]">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] disabled:opacity-30">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pNum = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              return (
                <button key={pNum} onClick={() => setPage(pNum)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === pNum ? 'bg-primary text-white' : 'hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]'}`}>{pNum + 1}</button>
              );
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] disabled:opacity-30">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
