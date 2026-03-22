import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { UserCircleIcon, ShieldCheckIcon, BellIcon, BriefcaseIcon, TrashIcon, CameraIcon, CheckIcon, EyeIcon, EyeSlashIcon, ComputerDesktopIcon, DevicePhoneMobileIcon, GlobeAltIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { pageTransition, fadeInUp, tabContent, buttonVariants } from '../../lib/animations';

const sidebarItems = [
  { key: 'account', label: 'Account', icon: UserCircleIcon },
  { key: 'security', label: 'Security', icon: ShieldCheckIcon },
  { key: 'notifications', label: 'Notifications', icon: BellIcon },
  { key: 'business', label: 'Become a Business', icon: BriefcaseIcon },
  { key: 'delete', label: 'Delete Account', icon: TrashIcon, danger: true },
];

const passwordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const strengthColors = ['', 'bg-error', 'bg-secondary', 'bg-primary', 'bg-success'];

const deviceIcons = {
  desktop: ComputerDesktopIcon,
  mobile: DevicePhoneMobileIcon,
  tablet: DevicePhoneMobileIcon,
  other: GlobeAltIcon,
};

const ClientSettings = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    const tab = searchParams.get('tab');
    const validTabs = sidebarItems.map(s => s.key);
    return tab && validTabs.includes(tab) ? tab : 'account';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync if query param changes (e.g. navigating from another page)
  useEffect(() => {
    const tab = searchParams.get('tab');
    const validTabs = sidebarItems.map(s => s.key);
    if (tab && validTabs.includes(tab)) {
      setActiveSection(tab);
    }
  }, [searchParams]);

  // Account state
  const [fullName, setFullName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    messages: true,
    promotions: false,
    newsletter: false,
    reviewReminders: true,
  });

  // Business application state
  const [bizForm, setBizForm] = useState({ businessName: '', type: '', description: '', portfolio: '' });
  const [bizLoading, setBizLoading] = useState(false);
  const [bizSubmitted, setBizSubmitted] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Username availability check
  const checkUsername = useCallback((val) => {
    if (val === user?.username) {
      setUsernameAvailable(null);
      return;
    }
    if (val.length < 3) {
      setUsernameAvailable(false);
      setUsernameChecking(false);
      return;
    }
    setUsernameChecking(true);
    setTimeout(() => {
      setUsernameAvailable(val.length >= 5);
      setUsernameChecking(false);
    }, 800);
  }, [user?.username]);

  const handleSaveAccount = () => {
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1200);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setPwdLoading(true);
    setTimeout(() => {
      setPwdLoading(false);
      setPwdSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdSuccess(false), 2000);
    }, 1200);
  };

  const handleSubmitBusiness = (e) => {
    e.preventDefault();
    setBizLoading(true);
    setTimeout(() => {
      setBizLoading(false);
      setBizSubmitted(true);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    setDeleteLoading(true);
    setTimeout(() => {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }, 1500);
  };

  const strength = passwordStrength(newPassword);

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <motion.div {...fadeInUp} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your account preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="lg:w-56 flex-shrink-0">
          {/* Mobile dropdown */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-full flex items-center justify-between p-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl mb-2 text-sm font-medium text-[var(--color-text)]"
          >
            {sidebarItems.find((s) => s.key === activeSection)?.label}
            <svg className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden`}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveSection(item.key); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors ${
                    activeSection === item.key
                      ? 'bg-primary/5 text-primary border-l-2 border-primary'
                      : `text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] border-l-2 border-transparent ${item.danger ? 'hover:text-error' : 'hover:text-[var(--color-text)]'}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {/* ===== ACCOUNT ===== */}
            {activeSection === 'account' && (
              <motion.div key="account" {...tabContent} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6 space-y-6">
                <h2 className="text-base font-heading font-semibold text-[var(--color-text)]">Account Settings</h2>

                {/* Avatar upload */}
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--color-surface)]">
                      <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&size=200`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <CameraIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">Profile Photo</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-sm">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); checkUsername(e.target.value); }}
                        className="w-full pl-7 pr-8 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameChecking && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                        {!usernameChecking && usernameAvailable === true && <CheckIcon className="w-4 h-4 text-success" />}
                        {!usernameChecking && usernameAvailable === false && <span className="text-error text-xs">✕</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={300} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                  <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">{bio.length}/300</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>

                <div className="flex justify-end">
                  <motion.button
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleSaveAccount}
                    disabled={saveLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
                  >
                    {saveLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : saveSuccess ? (
                      <><CheckIcon className="w-4 h-4" /> Saved!</>
                    ) : (
                      'Save Changes'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ===== SECURITY ===== */}
            {activeSection === 'security' && (
              <motion.div key="security" {...tabContent} className="space-y-6">
                {/* Change Password */}
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                  <h2 className="text-base font-heading font-semibold text-[var(--color-text)] mb-4">Change Password</h2>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPwd ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                          {showCurrentPwd ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPwd ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                          {showNewPwd ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Strength indicator */}
                      {newPassword && (
                        <div className="mt-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((bar) => (
                              <motion.div
                                key={bar}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: strength >= bar ? 1 : 0 }}
                                className={`h-1 flex-1 rounded-full origin-left ${strength >= bar ? strengthColors[strength] : 'bg-[var(--color-border)]'}`}
                                transition={{ duration: 0.3, delay: bar * 0.05 }}
                              />
                            ))}
                          </div>
                          <p className={`text-[10px] mt-1 font-medium ${strength <= 1 ? 'text-error' : strength === 2 ? 'text-secondary' : strength === 3 ? 'text-primary' : 'text-success'}`}>
                            {strengthLabels[strength]}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-lg border bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                          confirmPassword && confirmPassword !== newPassword ? 'border-error' : 'border-[var(--color-border)]'
                        }`}
                      />
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-[10px] text-error mt-1">Passwords do not match</p>
                      )}
                    </div>
                    <motion.button
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || pwdLoading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {pwdLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : pwdSuccess ? (
                        <><CheckIcon className="w-4 h-4" /> Updated!</>
                      ) : (
                        'Update Password'
                      )}
                    </motion.button>
                  </form>
                </div>

                {/* Active Sessions */}
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                  <h2 className="text-base font-heading font-semibold text-[var(--color-text)] mb-4">Active Sessions</h2>
                  <div className="space-y-3">
                    {[{ id: 1, device: 'desktop', browser: 'Chrome', os: 'Windows', location: 'Current Location', lastActive: 'Now', isCurrent: true }].map((session) => {
                      const DeviceIcon = deviceIcons[session.device] || GlobeAltIcon;
                      return (
                        <div key={session.id} className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-lg">
                          <DeviceIcon className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-[var(--color-text)]">{session.browser} on {session.os}</span>
                              {session.isCurrent && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-success/10 text-success">Current</span>}
                            </div>
                            <p className="text-[10px] text-[var(--color-text-secondary)]">{session.location} · Last active {session.lastActive}</p>
                          </div>
                          {!session.isCurrent && (
                            <button className="text-xs text-error hover:underline flex items-center gap-1">
                              <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" /> Revoke
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== NOTIFICATIONS ===== */}
            {activeSection === 'notifications' && (
              <motion.div key="notifications" {...tabContent} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                <h2 className="text-base font-heading font-semibold text-[var(--color-text)] mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">Receive notifications about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                      </div>
                      <button
                        onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${value ? 'bg-primary' : 'bg-[var(--color-border)]'}`}
                      >
                        <motion.div
                          animate={{ x: value ? 20 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ===== BECOME A BUSINESS ===== */}
            {activeSection === 'business' && (
              <motion.div key="business" {...tabContent} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                <h2 className="text-base font-heading font-semibold text-[var(--color-text)] mb-1">Become a Business</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">Apply to become a business seller on KarBazar and start offering your services</p>

                {bizSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                      <BriefcaseIcon className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-base font-heading font-semibold text-[var(--color-text)] mb-1">Application Submitted!</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto">
                      Your business application is being reviewed. We'll notify you once it's approved. This usually takes 1-3 business days.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                      Pending Review
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitBusiness} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Business Name</label>
                      <input
                        type="text"
                        required
                        value={bizForm.businessName}
                        onChange={(e) => setBizForm({ ...bizForm, businessName: e.target.value })}
                        placeholder="e.g., Creative Design Studio"
                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-[var(--color-text-secondary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Business Type</label>
                      <select
                        required
                        value={bizForm.type}
                        onChange={(e) => setBizForm({ ...bizForm, type: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        <option value="">Select type...</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="agency">Agency</option>
                        <option value="studio">Studio</option>
                        <option value="individual">Individual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Description</label>
                      <textarea
                        required
                        rows={4}
                        value={bizForm.description}
                        onChange={(e) => setBizForm({ ...bizForm, description: e.target.value })}
                        placeholder="Tell us about your services and experience..."
                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none placeholder:text-[var(--color-text-secondary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Portfolio URL (optional)</label>
                      <input
                        type="url"
                        value={bizForm.portfolio}
                        onChange={(e) => setBizForm({ ...bizForm, portfolio: e.target.value })}
                        placeholder="https://yourportfolio.com"
                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-[var(--color-text-secondary)]"
                      />
                    </div>
                    <motion.button
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      disabled={bizLoading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-60"
                    >
                      {bizLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Submit Application'
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}

            {/* ===== DELETE ACCOUNT ===== */}
            {activeSection === 'delete' && (
              <motion.div key="delete" {...tabContent} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center flex-shrink-0">
                    <TrashIcon className="w-5 h-5 text-error" />
                  </div>
                  <div>
                    <h2 className="text-base font-heading font-semibold text-error">Delete Account</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                      Once you delete your account, there is no going back. All your data, orders, messages and reviews will be permanently removed.
                    </p>
                  </div>
                </div>

                <div className="bg-error/5 border border-error/20 rounded-lg p-4 mb-4">
                  <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                    <li className="flex items-start gap-2"><span className="text-error">•</span> All your order history will be deleted</li>
                    <li className="flex items-start gap-2"><span className="text-error">•</span> Your reviews and ratings will be removed</li>
                    <li className="flex items-start gap-2"><span className="text-error">•</span> Saved favorites and messages will be lost</li>
                    <li className="flex items-start gap-2"><span className="text-error">•</span> This action cannot be undone</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
                    Type <strong className="text-error">DELETE</strong> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full max-w-xs px-3 py-2.5 rounded-lg border border-error/30 bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-error/40"
                  />
                </div>

                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleteConfirmText !== 'DELETE'}
                  className="px-5 py-2.5 rounded-lg bg-error text-white text-sm font-semibold hover:bg-error/90 transition-colors disabled:opacity-40"
                >
                  Delete My Account
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Final Confirmation"
        message="This will permanently delete your KarBazar account. Are you absolutely sure?"
        confirmText="Delete Forever"
        variant="danger"
        isLoading={deleteLoading}
      />
    </motion.div>
  );
};

export default ClientSettings;
