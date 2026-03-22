import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { CheckIcon, ExclamationTriangleIcon, Cog6ToothIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { mockPlatformSettings, mockAdminCategories } from '../../data/mockDataAdmin';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { buttonVariants, fadeInUp } from '../../lib/animations';

const PlatformSettings = () => {
  const [settings, setSettings] = useState(mockPlatformSettings);
  const [categories, setCategories] = useState(mockAdminCategories);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [maintenanceModal, setMaintenanceModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const update = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const toggleMaintenance = () => {
    if (!settings.maintenanceMode) {
      setMaintenanceModal(true);
    } else {
      update('maintenanceMode', false);
    }
  };

  const confirmMaintenance = () => {
    update('maintenanceMode', true);
    setMaintenanceModal(false);
  };

  const Section = ({ title, children }) => (
    <motion.div variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--color-border)]">
        <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </motion.div>
  );

  const Field = ({ label, description, children }) => (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <label className="text-sm font-medium text-[var(--color-text)]">{label}</label>
        {description && <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );

  const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-success' : 'bg-[var(--color-border)]'}`}>
      <motion.div animate={{ x: value ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
    </button>
  );

  const Input = ({ value, onChange, type = 'text', suffix, ...props }) => (
    <div className="flex items-center gap-1">
      <input type={type} value={value} onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)} className="w-32 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] text-right focus:outline-none focus:ring-2 focus:ring-primary/40" {...props} />
      {suffix && <span className="text-xs text-[var(--color-text-muted)]">{suffix}</span>}
    </div>
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Site Identity */}
      <Section title="Site Identity">
        <Field label="Site Name" description="Displayed in header, emails, and meta tags">
          <Input value={settings.siteName} onChange={(v) => update('siteName', v)} />
        </Field>
        <Field label="Tagline" description="Short description below the site name">
          <input type="text" value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] text-right focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </Field>
        <Field label="Contact Email" description="Primary admin/support email">
          <input type="email" value={settings.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} className="w-64 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] text-right focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </Field>
        <Field label="Site Logo" description="Upload a new logo image">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-secondary)] cursor-pointer hover:bg-[var(--color-border)] transition-colors">
            <PhotoIcon className="w-4 h-4" /> Choose File
            <input type="file" className="sr-only" />
          </label>
        </Field>
      </Section>

      {/* Content Limits */}
      <Section title="Content Limits">
        <Field label="Max Gig Title Length" description="Character limit for gig titles">
          <Input type="number" value={settings.maxGigTitleLength} onChange={(v) => update('maxGigTitleLength', v)} suffix="chars" />
        </Field>
        <Field label="Max Gig Description" description="Character limit for gig descriptions">
          <Input type="number" value={settings.maxGigDescLength} onChange={(v) => update('maxGigDescLength', v)} suffix="chars" />
        </Field>
        <Field label="Max Gig Images" description="Maximum images per gig">
          <Input type="number" value={settings.maxGigImages} onChange={(v) => update('maxGigImages', v)} suffix="images" />
        </Field>
        <Field label="Max Review Length" description="Character limit for reviews">
          <Input type="number" value={settings.maxReviewLength} onChange={(v) => update('maxReviewLength', v)} suffix="chars" />
        </Field>
        <Field label="Max Portfolio Items" description="Per business account">
          <Input type="number" value={settings.maxPortfolioItems} onChange={(v) => update('maxPortfolioItems', v)} suffix="items" />
        </Field>
      </Section>

      {/* File Sizes */}
      <Section title="File Size Limits">
        <Field label="Max Image Size" description="Maximum upload size for images">
          <Input type="number" value={settings.maxImageSizeMB} onChange={(v) => update('maxImageSizeMB', v)} suffix="MB" />
        </Field>
        <Field label="Max Avatar Size" description="Maximum avatar upload size">
          <Input type="number" value={settings.maxAvatarSizeMB} onChange={(v) => update('maxAvatarSizeMB', v)} suffix="MB" />
        </Field>
        <Field label="Allowed Image Formats" description="Accepted formats">
          <input type="text" value={settings.allowedImageFormats} onChange={(e) => update('allowedImageFormats', e.target.value)} className="w-48 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] text-right focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </Field>
      </Section>

      {/* Platform Controls */}
      <Section title="Platform Controls">
        <Field label="Maintenance Mode" description="Take site offline for maintenance. Users see a maintenance page.">
          <div className="flex items-center gap-2">
            {settings.maintenanceMode && <span className="text-[10px] px-2 py-0.5 rounded-full bg-error/10 text-error font-medium animate-pulse">ACTIVE</span>}
            <Toggle value={settings.maintenanceMode} onChange={toggleMaintenance} />
          </div>
        </Field>
        <Field label="Allow Registration" description="Enable/disable new user sign-ups">
          <Toggle value={settings.allowRegistration} onChange={(v) => update('allowRegistration', v)} />
        </Field>
        <Field label="Allow Business Registration" description="Enable client → business role requests">
          <Toggle value={settings.allowBusinessRegistration} onChange={(v) => update('allowBusinessRegistration', v)} />
        </Field>
        <Field label="Enable Reviews" description="Allow clients to leave reviews">
          <Toggle value={settings.enableReviews} onChange={(v) => update('enableReviews', v)} />
        </Field>
        <Field label="Enable Deals" description="Allow businesses to create discounts">
          <Toggle value={settings.enableDeals} onChange={(v) => update('enableDeals', v)} />
        </Field>
        <Field label="Enable Sponsorships" description="Allow gig sponsorship feature">
          <Toggle value={settings.enableSponsorships} onChange={(v) => update('enableSponsorships', v)} />
        </Field>
        <Field label="Default Currency" description="Platform-wide currency">
          <select value={settings.defaultCurrency} onChange={(e) => update('defaultCurrency', e.target.value)} className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40">
            <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="IQD">IQD (ع.د)</option>
          </select>
        </Field>
      </Section>

      {/* Homepage Category Order */}
      <Section title="Homepage Category Display Order">
        <p className="text-xs text-[var(--color-text-secondary)] mb-3">Drag categories to reorder how they appear on the homepage.</p>
        <Reorder.Group axis="y" values={categories} onReorder={(newOrder) => { setCategories(newOrder); setHasChanges(true); }} className="space-y-1">
          {categories.map((cat, i) => (
            <Reorder.Item key={cat.id} value={cat} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] cursor-grab active:cursor-grabbing hover:border-primary transition-colors">
              <span className="text-xs text-[var(--color-text-muted)] w-5 text-center">{i + 1}</span>
              <span className="text-[var(--color-text-muted)]">⠿</span>
              <span className="text-base">{cat.icon}</span>
              <span className="text-sm text-[var(--color-text)] flex-1">{cat.name}</span>
              <span className="text-[10px] text-[var(--color-text-muted)]">{cat.gigCount} gigs</span>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </Section>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 lg:pl-[276px]">
        <div className={`max-w-4xl mx-auto flex items-center justify-between p-3 rounded-2xl border transition-all ${hasChanges ? 'bg-[var(--color-card-bg)] border-primary shadow-xl' : 'bg-[var(--color-card-bg)] border-[var(--color-border)] shadow-lg'}`}>
          <div className="flex items-center gap-2">
            {hasChanges ? (
              <>
                <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-[var(--color-text)]">You have unsaved changes</span>
              </>
            ) : saved ? (
              <>
                <CheckIcon className="w-4 h-4 text-success" />
                <span className="text-sm text-success">Settings saved successfully</span>
              </>
            ) : (
              <>
                <Cog6ToothIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="text-sm text-[var(--color-text-secondary)]">Platform Settings</span>
              </>
            )}
          </div>
          <motion.button
            variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${hasChanges ? 'bg-primary text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'}`}
          >
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save All Settings'}
          </motion.button>
        </div>
      </div>

      {/* Maintenance Mode Confirmation */}
      <ConfirmModal isOpen={maintenanceModal} onClose={() => setMaintenanceModal(false)} onConfirm={confirmMaintenance} title="Enable Maintenance Mode" message="This will make the site inaccessible to all users. Only admins can access the dashboard. Are you sure?" confirmText="Enable Maintenance" variant="warning" />
    </div>
  );
};

export default PlatformSettings;
