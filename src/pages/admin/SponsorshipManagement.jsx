import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, TrashIcon, PlusIcon, SparklesIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { mockAdminSponsorships, mockAdminGigs } from '../../data/mockDataAdmin';
import StatusBadge from '../../components/admin/StatusBadge';
import StatCard from '../../components/admin/StatCard';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { buttonVariants, fadeInUp, staggerContainer, staggerItem } from '../../lib/animations';

const SponsorshipManagement = () => {
  const [sponsorships, setSponsorships] = useState(mockAdminSponsorships);
  const [removeSponsorship, setRemoveSponsorship] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [gigSearch, setGigSearch] = useState('');
  const [selectedGig, setSelectedGig] = useState(null);
  const [duration, setDuration] = useState(7);
  const [amount, setAmount] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const stats = useMemo(() => ({
    active: sponsorships.filter(s => s.status === 'active').length,
    totalRevenue: sponsorships.reduce((sum, s) => sum + (s.amount || 0), 0),
    avgDays: Math.round(sponsorships.reduce((sum, s) => sum + (s.daysRemaining || 0), 0) / (sponsorships.length || 1)),
  }), [sponsorships]);

  const handleSearch = (q) => {
    setGigSearch(q);
    if (q.length >= 2) {
      setSearchResults(mockAdminGigs.filter(g => g.title.toLowerCase().includes(q.toLowerCase()) && !sponsorships.find(s => s.gigId === g.id)).slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleAdd = () => {
    if (!selectedGig) return;
    const newSpon = {
      id: `sp${Date.now()}`,
      gigId: selectedGig.id,
      gigTitle: selectedGig.title,
      business: selectedGig.business,
      image: selectedGig.image,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + duration * 86400000).toISOString().split('T')[0],
      daysRemaining: duration,
      amount: parseInt(amount) || 50,
      position: 'homepage',
    };
    setSponsorships([...sponsorships, newSpon]);
    setSelectedGig(null);
    setGigSearch('');
    setSearchResults([]);
    setDuration(7);
    setAmount('');
    setShowAddForm(false);
  };

  const handleRemove = () => {
    setSponsorships(sponsorships.filter(s => s.id !== removeSponsorship?.id));
    setRemoveSponsorship(null);
  };

  const daysColor = (days) => {
    if (days <= 2) return 'text-error';
    if (days <= 5) return 'text-amber-500';
    return 'text-success';
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={SparklesIcon} label="Active Sponsorships" value={stats.active} color="purple" />
        <StatCard icon={CurrencyDollarIcon} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} color="success" />
        <StatCard icon={ClockIcon} label="Avg Days Left" value={stats.avgDays} color="primary" />
      </div>

      {/* Current Sponsorships Table */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Current Sponsored Gigs ({sponsorships.length})</h3>
          <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold">
            <PlusIcon className="w-3.5 h-3.5" /> Add Sponsorship
          </motion.button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Gig</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Business</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Position</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Start</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">End</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Days Left</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Actions</th>
            </tr></thead>
            <tbody>
              {sponsorships.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">No active sponsorships</td></tr>
              ) : sponsorships.map((sp, i) => (
                <motion.tr key={sp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors ${i % 2 ? 'bg-[var(--color-surface)]/30' : ''}`}>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><img src={sp.image} alt="" className="w-10 h-7 rounded object-cover" /><span className="text-[var(--color-text)] truncate max-w-[150px]">{sp.gigTitle}</span></div></td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{sp.business}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)] capitalize">{sp.position}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">{sp.startDate}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">{sp.endDate}</td>
                  <td className="px-4 py-3"><span className={`text-sm font-bold ${daysColor(sp.daysRemaining)}`}>{sp.daysRemaining}d</span></td>
                  <td className="px-4 py-3 font-medium text-[var(--color-text)]">${sp.amount}</td>
                  <td className="px-4 py-3"><StatusBadge status={sp.status} size="xs" /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setRemoveSponsorship(sp)} className="p-1 rounded hover:bg-error/10 text-error"><TrashIcon className="w-4 h-4" /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sponsorship Form */}
      {showAddForm && (
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Add New Sponsorship</h3>

          {/* Gig Search */}
          <div className="relative">
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Search Gig</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
              <input type="text" value={gigSearch} onChange={(e) => handleSearch(e.target.value)} placeholder="Type to search gigs..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden">
                {searchResults.map(g => (
                  <button key={g.id} onClick={() => { setSelectedGig(g); setGigSearch(g.title); setSearchResults([]); }} className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--color-surface)] transition-colors">
                    <img src={g.image} alt="" className="w-10 h-7 rounded object-cover" />
                    <div>
                      <p className="text-sm text-[var(--color-text)]">{g.title}</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">{g.business} • {g.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedGig && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <img src={selectedGig.image} alt="" className="w-12 h-8 rounded object-cover" />
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{selectedGig.title}</p>
                <p className="text-[10px] text-[var(--color-text-secondary)]">{selectedGig.business}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Duration (days)</label>
              <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)]">
                <option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option><option value={60}>60 days</option><option value={90}>90 days</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Amount ($)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50" className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => { setShowAddForm(false); setSelectedGig(null); setGigSearch(''); }} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">Cancel</button>
            <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={handleAdd} disabled={!selectedGig} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50">Add Sponsorship</motion.button>
          </div>
        </motion.div>
      )}

      <ConfirmModal isOpen={!!removeSponsorship} onClose={() => setRemoveSponsorship(null)} onConfirm={handleRemove} title="Remove Sponsorship" message={`Remove sponsorship for "${removeSponsorship?.gigTitle}"?`} confirmText="Remove" variant="danger" />
    </div>
  );
};

export default SponsorshipManagement;
