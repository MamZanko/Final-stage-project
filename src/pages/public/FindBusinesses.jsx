import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, StarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { pageTransition, fadeInUp, staggerContainer, staggerItem } from '../../lib/animations';
import api from '../../services/api';
import useSEO from '../../lib/useSEO';

const FindBusinesses = () => {
  useSEO({ title: 'Find Businesses', description: 'Discover verified businesses and service providers on KarBazar.' });

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get('/users', { params: { role: 'business' } });
        setBusinesses(res.data || []);
      } catch {
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filtered = businesses.filter((b) =>
    !search.trim() || b.name?.toLowerCase().includes(search.toLowerCase()) || b.bio?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div {...pageTransition} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div {...fadeInUp} className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-text)] mb-4">Find Businesses</h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">Discover verified businesses and talented professionals.</p>
        <div className="max-w-md mx-auto relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search businesses..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>
      </motion.div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[var(--color-surface)]" />
                <div className="flex-1"><div className="h-4 bg-[var(--color-surface)] rounded w-2/3 mb-2" /><div className="h-3 bg-[var(--color-surface)] rounded w-1/2" /></div>
              </div>
              <div className="h-3 bg-[var(--color-surface)] rounded w-full mb-2" />
              <div className="h-3 bg-[var(--color-surface)] rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-[var(--color-text-secondary)]">{search ? 'No businesses match your search.' : 'No businesses found.'}</p>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((biz) => (
            <motion.div key={biz.id} variants={staggerItem}>
              <Link to={`/profile/${biz.username}`} className="block bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl font-bold text-primary overflow-hidden">
                    {biz.avatar_url ? <img src={biz.avatar_url} alt="" className="w-full h-full object-cover" loading="lazy" /> : biz.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-[var(--color-text)]">{biz.name}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">@{biz.username}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">{biz.bio || 'Professional service provider on KarBazar.'}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                  {biz.avg_rating > 0 && (
                    <span className="flex items-center gap-1"><StarIcon className="w-3.5 h-3.5 text-gold" />{Number(biz.avg_rating).toFixed(1)}</span>
                  )}
                  {biz.gigs_count > 0 && <span>{biz.gigs_count} services</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FindBusinesses;
