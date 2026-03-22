import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ChatBubbleLeftRightIcon, MapPinIcon, CalendarDaysIcon, ClockIcon, GlobeAltIcon, EnvelopeIcon, PhoneIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon, EyeIcon, CameraIcon, PencilIcon, PlusIcon, ArrowUpTrayIcon, FlagIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';
import { mockBusinessProfile, mockGigReviews, mockRatingBreakdown } from '../../data/mockDataPhase2';
import { mockGigs } from '../../data/mockData';
import { mockBusinessUser, mockBusinessGigs, mockGigCounter, mockShowcaseProjects, mockWorkHistory, mockReceivedReviews, mockBusinessRatingBreakdown } from '../../data/mockDataPhase3';
import GigCard from '../../components/ui/GigCard';
import StarRatingDisplay from '../../components/ui/StarRatingDisplay';
import ReviewCard from '../../components/ui/ReviewCard';
import InlineEditBio from '../../components/ui/InlineEditBio';
import SkillsPills from '../../components/ui/SkillsPills';
import WorkHistoryCard from '../../components/ui/WorkHistoryCard';
import ShowcaseProjectCard from '../../components/ui/ShowcaseProjectCard';
import MonthlyGigCounter from '../../components/ui/MonthlyGigCounter';
import ProjectUploadModal from '../../components/ui/ProjectUploadModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { CountUpOnScroll } from '../../components/animation';
import { pageTransition, tabContent, fadeInUp, buttonVariants, modalOverlay } from '../../lib/animations';

const tabsList = [
  { key: 'overview', label: 'Overview' },
  { key: 'gigs', label: 'Gigs / Services' },
  { key: 'experience', label: 'Experience' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'reviews', label: 'Reviews' },
];

const BusinessProfile = () => {
  const { username } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);
  const [reviewSort, setReviewSort] = useState('recent');
  const [projectSliderIndex, setProjectSliderIndex] = useState({});

  // Owner mode state
  const isOwner = isAuthenticated && user?.role === 'business' && (user?.username === username || username === 'techflow');
  const [bio, setBio] = useState(mockBusinessProfile.bio);
  const [skills, setSkills] = useState(mockBusinessProfile.skills || []);
  const [availability, setAvailability] = useState(mockBusinessProfile.isAvailable);
  const [showProjectUpload, setShowProjectUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddWorkForm, setShowAddWorkForm] = useState(false);
  const [workHistory, setWorkHistory] = useState(mockWorkHistory);
  const [showcaseProjects, setShowcaseProjects] = useState(mockShowcaseProjects);
  const [portfolioImages, setPortfolioImages] = useState(mockBusinessProfile.portfolio || []);
  const [reportingReview, setReportingReview] = useState(null);
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  const biz = mockBusinessProfile;
  const bizGigs = isOwner ? mockBusinessGigs : mockGigs.filter((g) => g.business.name === biz.name).slice(0, 4);
  if (!isOwner && bizGigs.length < 4) bizGigs.push(...mockGigs.slice(0, 4 - bizGigs.length));

  // Owner reviews use received reviews
  const ownerReviews = isOwner ? mockReceivedReviews : mockGigReviews;
  const ownerRatingBreakdown = isOwner ? mockBusinessRatingBreakdown : mockRatingBreakdown;

  const openLightbox = (index) => {
    setLightboxImage(index);
    setLightboxOpen(true);
  };

  const sortedReviews = [...ownerReviews].sort((a, b) => {
    if (reviewSort === 'highest') return b.rating - a.rating;
    if (reviewSort === 'lowest') return a.rating - b.rating;
    return new Date(b.date) - new Date(a.date);
  });

  const handleToggleAvailability = () => {
    setAvailability(!availability);
  };

  const handleDeleteWork = (entry) => {
    setWorkHistory(workHistory.filter((w) => w.id !== entry.id));
  };

  const handleDeleteProject = (project) => {
    setShowcaseProjects(showcaseProjects.filter((p) => p.id !== project.id));
  };

  const handleSaveProject = (data) => {
    setShowcaseProjects([...showcaseProjects, { id: Date.now(), ...data, images: data.images?.map((i) => i.preview) || [] }]);
  };

  return (
    <motion.div {...pageTransition}>
      {/* PROFILE HEADER */}
      <div className="relative">
        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="h-48 sm:h-64 relative overflow-hidden"
        >
          {biz.coverImage ? (
            <img src={biz.coverImage} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary to-primary-dark" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Frosted glass stats pill */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-4 left-4 backdrop-blur-md bg-white/15 border border-white/20 rounded-full px-4 py-2 flex items-center gap-3 text-white text-sm"
          >
            <span className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <CountUpOnScroll end={biz.views} duration={1.5} /> views
            </span>
            <span className="w-px h-4 bg-white/30" />
            <span className="flex items-center gap-1">
              ♡ <CountUpOnScroll end={biz.saves} duration={1.5} /> saves
            </span>
          </motion.div>

          {/* Owner: cover edit buttons */}
          {isOwner && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-4 right-4 flex gap-2">
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" />
              <button onClick={() => coverInputRef.current?.click()} className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-white/30 transition-colors">
                <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Upload Cover
              </button>
              <button className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-white/30 transition-colors">
                <PencilIcon className="w-3.5 h-3.5" /> Edit Cover
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Profile info card */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl -mt-16 relative z-10 p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative -mt-16 sm:-mt-20 group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[var(--color-card-bg)] overflow-hidden shadow-xl group-hover:ring-4 group-hover:ring-primary/30 transition-all duration-300 bg-[var(--color-surface)]">
                  <img src={biz.avatar} alt={biz.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                {/* Availability indicator */}
                <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-3 border-[var(--color-card-bg)] ${
                  availability ? 'bg-success animate-pulse' : 'bg-gray-400'
                }`} />
                {/* Owner: camera overlay */}
                {isOwner && (
                  <>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" />
                    <button onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <CameraIcon className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--color-text)]">{biz.name}</h1>
                  {biz.isTopRated && (
                    <motion.span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-gold to-gold-light text-white animate-shimmer"
                      style={{ backgroundSize: '200% 100%' }}
                    >
                      ⭐ Top Rated
                    </motion.span>
                  )}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">{biz.type}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mb-2">@{biz.username}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[var(--color-text-secondary)] mb-3">
                  {biz.location && <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" /> {biz.location}</span>}
                  <span className="flex items-center gap-1"><CalendarDaysIcon className="w-3.5 h-3.5" /> Member since 2022</span>
                  <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> Response: {biz.responseTime}</span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <StarRatingDisplay rating={biz.rating} size="sm" reviewCount={biz.reviewCount} />
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    availability ? 'bg-success/10 text-success' : 'bg-gray-100 dark:bg-gray-800 text-[var(--color-text-secondary)]'
                  }`}>
                    {availability ? (
                      <><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Available</>
                    ) : 'Busy'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                {isOwner ? (
                  <>
                    <motion.button
                      variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                      onClick={handleToggleAvailability}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                        availability ? 'border-success text-success bg-success/10' : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${availability ? 'bg-success' : 'bg-gray-400'}`} />
                      {availability ? 'Available' : 'Set Available'}
                    </motion.button>
                    <Link to="/business/settings">
                      <motion.button
                        variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" /> Edit Profile
                      </motion.button>
                    </Link>
                  </>
                ) : (
                  <>
                    <motion.button
                      variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                      onClick={() => setIsSaved(!isSaved)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                        isSaved ? 'bg-error/10 border-error text-error' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-error hover:border-error'
                      }`}
                    >
                      {isSaved ? <HeartSolid className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                      {isSaved ? 'Saved' : 'Save'}
                    </motion.button>
                    <motion.button
                      variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4" /> Message
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        <div className="border-b border-[var(--color-border)] mb-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-thin">
            {tabsList.map((tab) => (
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
                    layoutId="biz-tab-underline"
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
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div key="overview" {...tabContent} className="flex flex-col lg:flex-row gap-8 pb-12">
              {/* Left 60% */}
              <div className="lg:w-[60%] space-y-6">
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                  <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">About</h3>
                  {isOwner ? (
                    <InlineEditBio value={bio} onSave={(val) => setBio(val)} maxWords={300} />
                  ) : (
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{biz.bio}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                  <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">Skills</h3>
                  <SkillsPills skills={skills} onChange={(s) => setSkills(s)} editable={isOwner} />
                </div>

                {/* Languages */}
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                  <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {biz.languages?.map((lang) => (
                      <span key={lang} className="px-3 py-1.5 bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-xs rounded-full">{lang}</span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {biz.certifications?.length > 0 && (
                  <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Certifications</h3>
                      {isOwner && (
                        <button className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors">
                          <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Upload
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {biz.certifications.map((cert) => (
                        <div key={cert.id} className="group cursor-pointer" onClick={() => openLightbox(0)}>
                          <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-[var(--color-surface)]">
                            <img src={cert.image} alt={cert.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                          </div>
                          <p className="text-xs font-medium text-[var(--color-text)]">{cert.name}</p>
                          <p className="text-[10px] text-[var(--color-text-secondary)]">{cert.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                  <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">Contact</h3>
                  <div className="space-y-2">
                    {biz.website && (
                      <a href={biz.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <GlobeAltIcon className="w-4 h-4" /> {biz.website}
                      </a>
                    )}
                    {biz.email && (
                      <a href={`mailto:${biz.email}`} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-primary transition-colors">
                        <EnvelopeIcon className="w-4 h-4" /> {biz.email}
                      </a>
                    )}
                    {biz.phone && (
                      <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <PhoneIcon className="w-4 h-4" /> {biz.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right 40% */}
              <div className="lg:w-[40%] space-y-4">
                {/* Stats cards */}
                {[
                  { label: 'Profile Views', value: biz.views },
                  { label: 'Saves', value: biz.saves },
                  { label: 'Gigs Posted', value: biz.gigsPosted },
                  { label: 'Avg Response Time', value: biz.avgResponseTime, isText: true },
                  { label: 'Completed Projects', value: biz.completedProjects },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 flex items-center justify-between"
                  >
                    <span className="text-xs text-[var(--color-text-secondary)]">{stat.label}</span>
                    <span className="text-sm font-bold text-[var(--color-text)]">
                      {stat.isText ? stat.value : stat.value?.toLocaleString()}
                    </span>
                  </motion.div>
                ))}

                {/* Avg Pricing */}
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4">
                  <p className="text-xs text-[var(--color-text-secondary)] mb-1">Average Pricing</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">${biz.avgPricing?.min} — ${biz.avgPricing?.max}</p>
                </div>

                {/* Social Links */}
                {biz.socialLinks && (
                  <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4">
                    <p className="text-xs text-[var(--color-text-secondary)] mb-3">Social Links</p>
                    <div className="flex gap-3">
                      {Object.entries(biz.socialLinks).map(([platform, url]) => (
                        <a key={platform} href={url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-primary hover:bg-primary/5 transition-colors">
                          <span className="text-xs font-medium capitalize">{platform.charAt(0).toUpperCase()}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* GIGS / SERVICES */}
          {activeTab === 'gigs' && (
            <motion.div key="gigs" {...tabContent} className="pb-12 space-y-6">
              {/* Owner: Gig counter + Post button */}
              {isOwner && (
                <div className="space-y-4">
                  <MonthlyGigCounter used={mockGigCounter.used} limit={mockGigCounter.limit} nextReset={mockGigCounter.nextReset} />
                  <div className="flex justify-end">
                    <Link to="/gigs/create">
                      <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
                        <PlusIcon className="w-4 h-4" /> Post New Gig
                      </motion.button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bizGigs.map((gig, i) => (
                  <div key={gig.id} className="relative group">
                    <GigCard gig={gig} index={i} />
                    {/* Owner: edit/delete overlay */}
                    {isOwner && (
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Link to={`/gigs/${gig.id}/edit`}>
                          <button className="w-8 h-8 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setShowDeleteConfirm({ type: 'gig', item: gig })}
                          className="w-8 h-8 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-sm flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {/* Owner: status badge */}
                    {isOwner && gig.status && gig.status !== 'active' && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          gig.status === 'paused' ? 'bg-secondary/10 text-secondary' : 'bg-gray-200 dark:bg-gray-700 text-[var(--color-text-secondary)]'
                        }`}>
                          {gig.status.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* EXPERIENCE */}
          {activeTab === 'experience' && (
            <motion.div key="experience" {...tabContent} className="space-y-8 pb-12">
              {/* Work History */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-heading font-semibold text-[var(--color-text)]">Work History</h3>
                  {isOwner && (
                    <motion.button
                      variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                      onClick={() => setShowAddWorkForm(true)}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors font-medium"
                    >
                      <PlusIcon className="w-3.5 h-3.5" /> Add Position
                    </motion.button>
                  )}
                </div>

                {/* Owner: Add work form */}
                <AnimatePresence>
                  {showAddWorkForm && isOwner && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 space-y-3">
                      <input type="text" placeholder="Position title" className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                      <input type="text" placeholder="Company name" className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Start date (e.g. Jan 2022)" className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                        <input type="text" placeholder="End date or Present" className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                      </div>
                      <textarea rows={2} placeholder="Description..." className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setShowAddWorkForm(false)} className="px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">Cancel</button>
                        <button onClick={() => setShowAddWorkForm(false)} className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors">Save</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  {workHistory.map((work, i) => (
                    <WorkHistoryCard
                      key={work.id}
                      entry={work}
                      isOwner={isOwner}
                      onDelete={handleDeleteWork}
                      isLast={i === workHistory.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* Showcase Projects */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-heading font-semibold text-[var(--color-text)]">Showcase Projects</h3>
                  {isOwner && showcaseProjects.length < 4 && (
                    <motion.button
                      variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                      onClick={() => setShowProjectUpload(true)}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors font-medium"
                    >
                      <PlusIcon className="w-3.5 h-3.5" /> Add Project ({showcaseProjects.length}/4)
                    </motion.button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {showcaseProjects.map((project) => (
                    <ShowcaseProjectCard
                      key={project.id}
                      project={project}
                      isOwner={isOwner}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <motion.div key="portfolio" {...tabContent} className="pb-12">
              {/* Owner: upload button */}
              {isOwner && (
                <div className="flex justify-end mb-4">
                  <input ref={portfolioInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const newPreviews = files.map((f) => URL.createObjectURL(f));
                    setPortfolioImages((prev) => [...prev, ...newPreviews]);
                    e.target.value = '';
                  }} />
                  <motion.button
                    variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                    onClick={() => portfolioInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <ArrowUpTrayIcon className="w-4 h-4" /> Upload Images
                  </motion.button>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {portfolioImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer rounded-xl overflow-hidden bg-[var(--color-surface)] aspect-square"
                    onClick={() => openLightbox(i)}
                  >
                    <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover hover:brightness-90 transition-all duration-300" loading="lazy" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <motion.div key="reviews" {...tabContent} className="space-y-6 pb-12">
              {/* Rating Summary */}
              <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[var(--color-text)]">{ownerRatingBreakdown.average}</div>
                    <StarRatingDisplay rating={ownerRatingBreakdown.average} size="md" showNumber={false} />
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">{ownerRatingBreakdown.total} reviews</p>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ownerRatingBreakdown.breakdown[star];
                      const pct = Math.round((count / ownerRatingBreakdown.total) * 100);
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-[var(--color-text-secondary)] w-6">{star}★</span>
                          <div className="flex-1 h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, delay: (5 - star) * 0.1 }}
                              className="h-full bg-gold rounded-full"
                            />
                          </div>
                          <span className="text-xs text-[var(--color-text-secondary)] w-8">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="flex justify-end">
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)] text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>

              {/* Reviews list — owner sees report button on each */}
              {sortedReviews.filter((r) => r.isVerifiedBuyer).map((review, i) => (
                <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="relative group">
                  <ReviewCard review={review} showGigInfo={isOwner} />
                  {isOwner && (
                    <button
                      onClick={() => setReportingReview(review)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-error/10 text-[var(--color-text-secondary)] hover:text-error"
                      title="Report review"
                    >
                      <FlagIcon className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
              {sortedReviews.filter((r) => !r.isVerifiedBuyer).map((review, i) => (
                <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 + 0.2 }} className="relative group">
                  <ReviewCard review={review} showGigInfo={isOwner} />
                  {isOwner && (
                    <button
                      onClick={() => setReportingReview(review)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-error/10 text-[var(--color-text-secondary)] hover:text-error"
                      title="Report review"
                    >
                      <FlagIcon className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            {...modalOverlay}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.img
              key={lightboxImage}
              src={portfolioImages[lightboxImage] || biz.certifications?.[0]?.image}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
            {portfolioImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxImage((prev) => (prev - 1 + portfolioImages.length) % portfolioImages.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxImage((prev) => (prev + 1) % portfolioImages.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Owner: Project Upload Modal */}
      <ProjectUploadModal
        isOpen={showProjectUpload}
        onClose={() => setShowProjectUpload(false)}
        onSave={handleSaveProject}
      />

      {/* Owner: Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => setShowDeleteConfirm(null)}
        title={`Delete ${showDeleteConfirm?.type === 'gig' ? 'Gig' : 'Item'}?`}
        message={`Are you sure you want to delete "${showDeleteConfirm?.item?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Owner: Report Review Modal */}
      <ConfirmModal
        isOpen={!!reportingReview}
        onClose={() => setReportingReview(null)}
        onConfirm={() => setReportingReview(null)}
        title="Report Review"
        message={`Report this review by ${reportingReview?.reviewer?.name}? Our team will review it within 24 hours.`}
        confirmText="Report"
        variant="warning"
      />
    </motion.div>
  );
};

export default BusinessProfile;
