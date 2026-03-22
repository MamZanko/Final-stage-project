import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon, ChevronRightIcon, EyeIcon, CheckIcon,
  InformationCircleIcon, PhotoIcon, CurrencyDollarIcon,
  DocumentTextIcon, TagIcon,
} from '@heroicons/react/24/outline';
import { categories } from '../../data/mockData';
import RichTextEditor from '../../components/ui/RichTextEditor';
import DragDropUpload from '../../components/ui/DragDropUpload';
import ReorderableThumbnails from '../../components/ui/ReorderableThumbnails';
import GigPreviewModal from '../../components/ui/GigPreviewModal';
import { pageTransition, buttonVariants, tabContent, fadeInUp } from '../../lib/animations';

const steps = [
  { key: 'overview', label: 'Overview', icon: InformationCircleIcon },
  { key: 'media', label: 'Media', icon: PhotoIcon },
  { key: 'pricing', label: 'Pricing', icon: CurrencyDollarIcon },
  { key: 'description', label: 'Description', icon: DocumentTextIcon },
  { key: 'extras', label: 'Tags & FAQ', icon: TagIcon },
];

const CreateGig = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    images: [],
    pricing: {
      basic: { name: 'Basic', price: '', deliveryDays: '', description: '', features: [''], revisions: 1 },
      standard: { name: 'Standard', price: '', deliveryDays: '', description: '', features: [''], revisions: 3 },
      premium: { name: 'Premium', price: '', deliveryDays: '', description: '', features: [''], revisions: -1 },
    },
    tags: [],
    faq: [{ question: '', answer: '' }],
  });

  const [newTag, setNewTag] = useState('');

  const updateForm = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  const updatePricing = (tier, key, val) => setForm((prev) => ({
    ...prev,
    pricing: { ...prev.pricing, [tier]: { ...prev.pricing[tier], [key]: val } },
  }));
  const updateFeature = (tier, idx, val) => {
    const newFeatures = [...form.pricing[tier].features];
    newFeatures[idx] = val;
    updatePricing(tier, 'features', newFeatures);
  };
  const addFeature = (tier) => updatePricing(tier, 'features', [...form.pricing[tier].features, '']);
  const removeFeature = (tier, idx) => updatePricing(tier, 'features', form.pricing[tier].features.filter((_, i) => i !== idx));

  const addTag = () => {
    const t = newTag.trim();
    if (t && !form.tags.includes(t) && form.tags.length < 10) {
      updateForm('tags', [...form.tags, t]);
      setNewTag('');
    }
  };

  const addFaq = () => updateForm('faq', [...form.faq, { question: '', answer: '' }]);
  const updateFaq = (idx, key, val) => {
    const newFaq = [...form.faq];
    newFaq[idx][key] = val;
    updateForm('faq', newFaq);
  };

  const handlePublish = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigate('/my-gigs');
    }, 1500);
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigate('/my-gigs');
    }, 1000);
  };

  const gigPreview = {
    ...form,
    id: 'preview',
    image: form.images[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    startingPrice: form.pricing.basic.price || 0,
    rating: 0,
    reviewCount: 0,
    business: { name: 'Your Business', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  };

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[var(--color-text)]">Create New Gig</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Fill in the details below to create your gig</p>
        </div>
        <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setShowPreview(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-primary hover:border-primary transition-colors">
          <EyeIcon className="w-4 h-4" /> Preview
        </motion.button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          return (
            <button key={step.key} onClick={() => setCurrentStep(i)} className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isActive ? 'bg-primary text-white' : isDone ? 'bg-success text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
              }`}>
                {isDone ? <CheckIcon className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-primary' : 'text-[var(--color-text-secondary)]'}`}>{step.label}</span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${isDone ? 'bg-success' : 'bg-[var(--color-border)]'}`} />}
            </button>
          );
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {/* STEP 1: Overview */}
        {currentStep === 0 && (
          <motion.div key="overview" {...tabContent} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Gig Title <span className="text-error">*</span></label>
              <input type="text" value={form.title} onChange={(e) => updateForm('title', e.target.value)} placeholder="I will..." maxLength={120} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">{form.title.length}/120 characters</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Category <span className="text-error">*</span></label>
                <select value={form.category} onChange={(e) => updateForm('category', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="">Select category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Subcategory</label>
                <input type="text" value={form.subcategory} onChange={(e) => updateForm('subcategory', e.target.value)} placeholder="e.g., Logo Design" className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Media */}
        {currentStep === 1 && (
          <motion.div key="media" {...tabContent} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Gig Images <span className="text-error">*</span></label>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3">Upload up to 5 images. The first image will be your cover.</p>
              <DragDropUpload accept="image/jpeg,image/png,image/webp" maxFiles={5} maxSizeMB={5} onFilesSelected={(files) => {
                const previews = files.map((f) => URL.createObjectURL(f));
                updateForm('images', [...form.images, ...previews].slice(0, 5));
              }} label="Drop images here or click to upload" sublabel="JPG, PNG, WEBP — max 5MB each" />
            </div>
            {form.images.length > 0 && (
              <div className="mt-4">
                <ReorderableThumbnails images={form.images} onChange={(newImages) => updateForm('images', newImages)} maxImages={5} />
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 3: Pricing */}
        {currentStep === 2 && (
          <motion.div key="pricing" {...tabContent} className="space-y-6">
            {['basic', 'standard', 'premium'].map((tier) => (
              <div key={tier} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
                <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] capitalize mb-4">{form.pricing[tier].name} Package</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Package Name</label>
                    <input type="text" value={form.pricing[tier].name} onChange={(e) => updatePricing(tier, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Price ($)</label>
                      <input type="number" value={form.pricing[tier].price} onChange={(e) => updatePricing(tier, 'price', e.target.value)} placeholder="0" min="5" className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Delivery (days)</label>
                      <input type="number" value={form.pricing[tier].deliveryDays} onChange={(e) => updatePricing(tier, 'deliveryDays', e.target.value)} placeholder="1" min="1" className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Revisions</label>
                      <input type="number" value={form.pricing[tier].revisions === -1 ? '' : form.pricing[tier].revisions} onChange={(e) => updatePricing(tier, 'revisions', e.target.value === '' ? -1 : parseInt(e.target.value))} placeholder="∞" min="-1" className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Description</label>
                    <input type="text" value={form.pricing[tier].description} onChange={(e) => updatePricing(tier, 'description', e.target.value)} placeholder="What's included in this package" className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Features</label>
                    {form.pricing[tier].features.map((feat, fi) => (
                      <div key={fi} className="flex gap-2 mb-1.5">
                        <input type="text" value={feat} onChange={(e) => updateFeature(tier, fi, e.target.value)} placeholder={`Feature ${fi + 1}`} className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                        {form.pricing[tier].features.length > 1 && (
                          <button onClick={() => removeFeature(tier, fi)} className="text-error text-xs hover:underline">Remove</button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addFeature(tier)} className="text-xs text-primary hover:text-primary-dark transition-colors mt-1">+ Add Feature</button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* STEP 4: Description */}
        {currentStep === 3 && (
          <motion.div key="description" {...tabContent}>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Gig Description <span className="text-error">*</span></label>
            <p className="text-xs text-[var(--color-text-secondary)] mb-3">Describe your service in detail. Be as specific as possible.</p>
            <RichTextEditor value={form.description} onChange={(val) => updateForm('description', val)} placeholder="Describe your gig..." maxLength={5000} minHeight={280} />
          </motion.div>
        )}

        {/* STEP 5: Tags & FAQ */}
        {currentStep === 4 && (
          <motion.div key="extras" {...tabContent} className="space-y-6">
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Tags ({form.tags.length}/10)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/5 text-primary text-xs rounded-full border border-primary/20">
                    {tag}
                    <button onClick={() => updateForm('tags', form.tags.filter((_, idx) => idx !== i))} className="hover:text-error">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add a tag..." className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <button onClick={addTag} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors">Add</button>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">FAQ</label>
              {form.faq.map((item, i) => (
                <div key={i} className="bg-[var(--color-surface)] rounded-xl p-4 mb-3 space-y-2">
                  <input type="text" value={item.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} placeholder="Question" className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  <textarea value={item.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} placeholder="Answer" rows={2} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                  {form.faq.length > 1 && (
                    <button onClick={() => updateForm('faq', form.faq.filter((_, idx) => idx !== i))} className="text-xs text-error hover:underline">Remove</button>
                  )}
                </div>
              ))}
              <button onClick={addFaq} className="text-xs text-primary hover:text-primary-dark transition-colors">+ Add FAQ</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
        <div>
          {currentStep > 0 && (
            <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setCurrentStep(currentStep - 1)} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
              <ChevronLeftIcon className="w-4 h-4" /> Back
            </motion.button>
          )}
        </div>
        <div className="flex gap-3">
          <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={handleSaveDraft} disabled={saving} className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors disabled:opacity-50">
            Save Draft
          </motion.button>
          {currentStep < steps.length - 1 ? (
            <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setCurrentStep(currentStep + 1)} className="flex items-center gap-1 px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
              Next <ChevronRightIcon className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={handlePublish} disabled={saving} className="flex items-center gap-1 px-5 py-2 rounded-lg bg-success text-white text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckIcon className="w-4 h-4" />}
              Publish Gig
            </motion.button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <GigPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} gig={gigPreview} />
    </motion.div>
  );
};

export default CreateGig;
