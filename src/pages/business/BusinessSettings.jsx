import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon, BellIcon, ShieldCheckIcon, KeyIcon,
  CameraIcon, GlobeAltIcon, MapPinIcon, EnvelopeIcon,
  PhoneIcon, DevicePhoneMobileIcon, ComputerDesktopIcon,
  ArrowRightOnRectangleIcon, ExclamationTriangleIcon,
  TrashIcon, CheckIcon,
} from '@heroicons/react/24/outline';
import { mockBusinessSettingsData, mockBusinessNotifications, mockBusinessSessions, mockBusinessUser } from '../../data/mockDataPhase3';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { pageTransition, buttonVariants, tabContent } from '../../lib/animations';

const tabs = [
  { key: 'profile', label: 'Profile', icon: UserIcon },
  { key: 'notifications', label: 'Notifications', icon: BellIcon },
  { key: 'security', label: 'Security', icon: ShieldCheckIcon },
];

const BusinessSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [showLogoutAll, setShowLogoutAll] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // Profile form
  const [profile, setProfile] = useState({
    name: mockBusinessSettingsData.name,
    email: mockBusinessSettingsData.email,
    phone: mockBusinessSettingsData.phone,
    location: mockBusinessSettingsData.location,
    website: mockBusinessSettingsData.website,
    bio: mockBusinessSettingsData.bio,
    type: mockBusinessSettingsData.type,
  });

  // Notifications
  const [notifications, setNotifications] = useState(mockBusinessNotifications);

  // Security
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  const toggleNotification = (key) => {
    setNotifications(notifications.map((n) => n.key === key ? { ...n, enabled: !n.enabled } : n));
  };

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-heading font-bold text-[var(--color-text)] mb-1">Business Settings</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">Manage your account preferences</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[var(--color-border)] pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'bg-primary text-white' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <motion.div key="profile" {...tabContent} className="space-y-6">
            {/* Avatar section */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img src={mockBusinessUser.avatar} alt="" className="w-20 h-20 rounded-full object-cover" />
                  <button className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <CameraIcon className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{profile.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">@{mockBusinessUser.username}</p>
                  <button className="text-xs text-primary hover:underline mt-1">Change Photo</button>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Business Name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Business Type</label>
                  <input type="text" value={profile.type} onChange={(e) => setProfile({ ...profile, type: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Phone</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                    <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Location</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                    <input type="text" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Website</label>
                  <div className="relative">
                    <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                    <input type="url" value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Bio</label>
                <textarea rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              </div>
              <div className="flex justify-end">
                <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckIcon className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <motion.div key="notifications" {...tabContent}>
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Notification Preferences</h3>
              {notifications.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">{item.label}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{item.description}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(item.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${item.enabled ? 'bg-primary' : 'bg-[var(--color-border)]'}`}
                  >
                    <motion.div
                      animate={{ x: item.enabled ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Preferences'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <motion.div key="security" {...tabContent} className="space-y-6">
            {/* Change Password */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] flex items-center gap-2"><KeyIcon className="w-4 h-4" /> Change Password</h3>
              <div className="space-y-3 max-w-md">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Current Password</label>
                  <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1">New Password</label>
                  <input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Confirm New Password</label>
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
                  Update Password
                </motion.button>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Active Sessions</h3>
                <button onClick={() => setShowLogoutAll(true)} className="text-xs text-error hover:underline">Logout All</button>
              </div>
              {mockBusinessSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
                  <div className="flex items-center gap-3">
                    {session.device === 'Desktop' ? <ComputerDesktopIcon className="w-5 h-5 text-[var(--color-text-secondary)]" /> : <DevicePhoneMobileIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />}
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">{session.browser} — {session.device}</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">{session.location} • {session.lastActive}</p>
                    </div>
                  </div>
                  {session.isCurrent ? (
                    <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded-full">Current</span>
                  ) : (
                    <button className="text-xs text-error hover:underline">Revoke</button>
                  )}
                </div>
              ))}
            </div>

            {/* Danger Zone */}
            <div className="bg-error/5 border border-error/20 rounded-2xl p-6">
              <h3 className="text-sm font-heading font-semibold text-error flex items-center gap-2 mb-2"><ExclamationTriangleIcon className="w-4 h-4" /> Danger Zone</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3">Once you delete your account, there is no going back. Please be certain.</p>
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setShowDeleteAccount(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-error text-error text-sm font-semibold hover:bg-error/10 transition-colors">
                <TrashIcon className="w-4 h-4" /> Delete Account
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ConfirmModal isOpen={showLogoutAll} onClose={() => setShowLogoutAll(false)} onConfirm={() => setShowLogoutAll(false)} title="Logout All Sessions" message="This will log you out of all devices except the current one." confirmText="Logout All" variant="warning" />
      <ConfirmModal isOpen={showDeleteAccount} onClose={() => setShowDeleteAccount(false)} onConfirm={() => setShowDeleteAccount(false)} title="Delete Account" message="This action is permanent. All your gigs, orders, and data will be permanently deleted." confirmText="Delete My Account" variant="danger" />
    </motion.div>
  );
};

export default BusinessSettings;
