import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, CalendarDaysIcon, PencilSquareIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import OrderCard from '../../components/ui/OrderCard';
import ReviewCard from '../../components/ui/ReviewCard';
import BusinessCard from '../../components/ui/BusinessCard';
import { pageTransition, tabContent, fadeInUp } from '../../lib/animations';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'active-orders', label: 'Active Orders' },
  { key: 'order-history', label: 'Order History' },
  { key: 'favorites', label: 'Favorite Businesses' },
  { key: 'reviews', label: 'Reviews Given' },
];

const ClientProfile = () => {
  const { username } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [historyFilter, setHistoryFilter] = useState('all');

  const [profileUser, setProfileUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwner = isAuthenticated && user?.username === username;

  // Fetch profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/users/${username}`);
        const d = res.data || res;
        setProfileUser({
          id: d.id, name: d.name, username: d.username, role: d.role,
          avatar: d.avatar_url, bio: d.bio, location: d.location,
          memberSince: d.created_at, website: d.website,
        });
      } catch (err) {
        setError(err?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  // Fetch orders (owner only)
  useEffect(() => {
    if (!isOwner) return;
    api.get('/orders').then((res) => {
      const d = res.data || res;
      setOrders(Array.isArray(d) ? d : d?.data || []);
    }).catch(() => {});
  }, [isOwner]);

  // Fetch saved businesses (owner only)
  useEffect(() => {
    if (!isOwner) return;
    api.get('/users/me/saved').then((res) => {
      const d = res.data || res;
      setFavorites(Array.isArray(d) ? d : d?.data || []);
    }).catch(() => {});
  }, [isOwner]);

  const activeOrders = useMemo(() => orders.filter((o) => ['placed', 'pending', 'in_progress', 'delivered', 'revision'].includes(o.status)), [orders]);
  const filteredHistory = useMemo(() => {
    const history = orders.filter((o) => ['completed', 'cancelled'].includes(o.status));
    if (historyFilter === 'completed') return history.filter((o) => o.status === 'completed');
    if (historyFilter === 'cancelled') return history.filter((o) => o.status === 'cancelled');
    return history;
  }, [orders, historyFilter]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Tabs that are owner-only
  const visibleTabs = isOwner ? tabs : tabs.filter((t) => ['overview', 'favorites', 'reviews'].includes(t.key));

  const EmptyState = ({ icon, title, description, cta }) => (
    <motion.div {...fadeInUp} className="text-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-heading font-semibold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">{description}</p>
      {cta}
    </motion.div>
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-32 sm:h-40 rounded-t-2xl bg-[var(--color-surface)]" />
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] border-t-0 rounded-b-2xl px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[var(--color-surface)] border-4 border-[var(--color-card-bg)]" />
            <div className="flex-1 pt-14 space-y-2">
              <div className="h-6 w-40 bg-[var(--color-surface)] rounded" />
              <div className="h-4 w-24 bg-[var(--color-surface)] rounded" />
              <div className="h-3 w-56 bg-[var(--color-surface)] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-xl font-heading font-bold text-[var(--color-text)] mb-2">Profile Not Found</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">{error || 'This user does not exist.'}</p>
        <Link to="/" className="btn-primary inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* PROFILE HEADER */}
      <div className="relative mb-8">
        <div className="h-32 sm:h-40 rounded-t-2xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />

        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] border-t-0 rounded-b-2xl px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-14">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[var(--color-card-bg)] overflow-hidden bg-[var(--color-surface)] shadow-lg group-hover:ring-4 group-hover:ring-primary/30 transition-all duration-300">
                {profileUser.avatar ? (
                  <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary">
                    {profileUser.name?.charAt(0)}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left pt-2 sm:pb-1">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--color-text)]">{profileUser.name}</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">@{profileUser.username}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-[var(--color-text-secondary)]">
                {profileUser.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5" /> {profileUser.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-3.5 h-3.5" /> Member since {formatDate(profileUser.memberSince)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {isOwner ? (
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors btn-animated"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit Profile
                </Link>
              ) : (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors btn-animated">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Message
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Become a Business prompt (owner only) */}
        {isOwner && profileUser.role === 'client' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Want to offer services?</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">Become a Business account and start posting gigs — it's 100% free!</p>
            </div>
            <Link
              to="/settings"
              className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary-dark transition-colors btn-animated whitespace-nowrap"
            >
              Become a Business
            </Link>
          </motion.div>
        )}
      </div>

      {/* TABS */}
      <div className="border-b border-[var(--color-border)] mb-6">
        <div className="flex gap-0 overflow-x-auto scrollbar-thin">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'text-primary' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="profile-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div key="overview" {...tabContent} className="space-y-6">
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">About</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{profileUser.bio || 'No bio added yet.'}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4">
                <h4 className="text-xs text-[var(--color-text-secondary)] mb-1">Location</h4>
                <p className="text-sm font-medium text-[var(--color-text)]">{profileUser.location || '—'}</p>
              </div>
              <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4">
                <h4 className="text-xs text-[var(--color-text-secondary)] mb-1">Member Since</h4>
                <p className="text-sm font-medium text-[var(--color-text)]">{formatDate(profileUser.memberSince)}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ACTIVE ORDERS TAB */}
        {activeTab === 'active-orders' && isOwner && (
          <motion.div key="active-orders" {...tabContent}>
            {activeOrders.length > 0 ? (
              <div className="space-y-4">
                {activeOrders.map((order, i) => (
                  <OrderCard key={order.id} order={order} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="📋"
                title="No Active Orders"
                description="You don't have any active orders right now. Browse gigs and place your first order!"
                cta={
                  <Link to="/browse-gigs" className="btn-primary inline-block">
                    Browse Gigs
                  </Link>
                }
              />
            )}
          </motion.div>
        )}

        {/* ORDER HISTORY TAB */}
        {activeTab === 'order-history' && isOwner && (
          <motion.div key="order-history" {...tabContent}>
            {/* Filter */}
            <div className="flex gap-2 mb-4">
              {['all', 'completed', 'cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => setHistoryFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    historyFilter === f
                      ? 'bg-primary text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {filteredHistory.length > 0 ? (
              <div className="space-y-4">
                {filteredHistory.map((order, i) => (
                  <OrderCard key={order.id} order={order} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState icon="📦" title="No Orders Found" description="No orders match the selected filter." />
            )}
          </motion.div>
        )}

        {/* FAVORITE BUSINESSES TAB */}
        {activeTab === 'favorites' && (
          <motion.div key="favorites" {...tabContent}>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favorites.map((biz, i) => (
                  <div key={biz.id} className="relative">
                    <BusinessCard business={biz} index={i} />
                    {/* Filled heart since saved */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 + 0.2, type: 'spring' }}
                      className="absolute top-3 right-3"
                    >
                      <HeartSolid className="w-5 h-5 text-error" />
                    </motion.div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="💜"
                title="No Favorites Yet"
                description="Save businesses you love and find them easily here."
                cta={
                  <Link to="/find-businesses" className="btn-primary inline-block">
                    Browse Businesses
                  </Link>
                }
              />
            )}
          </motion.div>
        )}

        {/* REVIEWS GIVEN TAB */}
        {activeTab === 'reviews' && (
          <motion.div key="reviews" {...tabContent}>
            {[].length > 0 ? (
              <div className="space-y-4">
                {[].map((review, i) => (
                  <ReviewCard
                    key={review.id}
                    review={{ ...review, reviewer: { name: profileUser.name, username: profileUser.username, avatar: profileUser.avatar } }}
                    showGigInfo
                    isOwn={isOwner}
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon="⭐" title="No Reviews Yet" description="Complete orders and share your experience by leaving reviews." />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClientProfile;
