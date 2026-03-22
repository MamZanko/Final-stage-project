import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PhotoIcon, XMarkIcon, CheckIcon, EyeIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { mockAdminNews } from '../../data/mockDataAdmin';
import { buttonVariants, fadeInUp } from '../../lib/animations';

const newsCategories = ['Update', 'Feature', 'Tips', 'Security', 'Community', 'Announcement'];

const NewsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const existing = isEdit ? mockAdminNews.find(n => n.id === parseInt(id)) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [category, setCategory] = useState(existing?.category || 'Update');
  const [content, setContent] = useState(existing?.content || '');
  const [tags, setTags] = useState(existing?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState(existing?.status || 'draft');
  const [publishDate, setPublishDate] = useState(existing?.publishDate || '');
  const [featuredImage, setFeaturedImage] = useState(existing?.featuredImage || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (t) => setTags(tags.filter(tag => tag !== t));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) setTags(tags.slice(0, -1));
  };

  const handleSave = (draft = true) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      if (!draft) setStatus('published');
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/news" className="p-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
          <ArrowLeftIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </Link>
        <h2 className="text-lg font-heading font-bold text-[var(--color-text)]">{isEdit ? 'Edit Post' : 'Create New Post'}</h2>
        <div className="ml-auto flex items-center gap-2">
          {saved && <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-xs text-success flex items-center gap-1"><CheckIcon className="w-3.5 h-3.5" /> Saved</motion.span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Main Content (65%) */}
        <div className="lg:col-span-3 space-y-4">
          <motion.div variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title..." className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-base text-[var(--color-text)] font-heading font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40">
                {newsCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Content</label>
              {/* Simplified toolbar */}
              <div className="flex gap-1 mb-1 p-1 border border-[var(--color-border)] rounded-t-lg bg-[var(--color-surface)]">
                {['B', 'I', 'U', 'H1', 'H2', '🔗', '📷', '—', '• List', '1. List', '❝'].map(btn => (
                  <button key={btn} className="px-2 py-1 rounded text-xs font-mono text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors">{btn}</button>
                ))}
              </div>
              <textarea rows={16} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post content here..." className="w-full px-4 py-3 rounded-b-xl border border-[var(--color-border)] border-t-0 bg-[var(--color-surface)] text-sm text-[var(--color-text)] leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-body" />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Tags</label>
              <div className="flex flex-wrap gap-1.5 p-2 min-h-[40px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-error"><XMarkIcon className="w-3 h-3" /></button>
                  </span>
                ))}
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleKeyDown} onBlur={addTag} placeholder={tags.length === 0 ? 'Add tags...' : ''} className="flex-1 min-w-[80px] bg-transparent text-sm text-[var(--color-text)] outline-none" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right — Sidebar (35%) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Featured Image */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.05 }} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
            <h3 className="text-xs font-heading font-semibold text-[var(--color-text)] mb-3">Featured Image</h3>
            {featuredImage ? (
              <div className="relative rounded-xl overflow-hidden group">
                <img src={featuredImage} alt="" className="w-full h-40 object-cover" />
                <button onClick={() => setFeaturedImage('')} className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"><XMarkIcon className="w-4 h-4" /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-primary cursor-pointer transition-colors">
                <PhotoIcon className="w-8 h-8 text-[var(--color-text-muted)] mb-1" />
                <span className="text-xs text-[var(--color-text-secondary)]">Click to upload</span>
                <input type="file" className="sr-only" onChange={() => setFeaturedImage('https://picsum.photos/600/300?random=' + Date.now())} />
              </label>
            )}
          </motion.div>

          {/* Publish Settings */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-heading font-semibold text-[var(--color-text)]">Publish Settings</h3>

            {/* Status Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text)]">Status</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-secondary)]">{status === 'published' ? 'Published' : 'Draft'}</span>
                <button
                  onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
                  className={`relative w-11 h-6 rounded-full transition-colors ${status === 'published' ? 'bg-success' : 'bg-[var(--color-border)]'}`}
                >
                  <motion.div animate={{ x: status === 'published' ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1">Publish Date</label>
              <input type="datetime-local" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            {/* Word Count */}
            <div className="pt-2 border-t border-[var(--color-border)]">
              <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.15 }} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 space-y-2.5">
            <motion.button
              variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
            >
              <CloudArrowUpIcon className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Draft'}
            </motion.button>

            <motion.button
              variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
              onClick={() => handleSave(false)}
              disabled={saving || !title.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish Now'}
            </motion.button>

            <motion.button
              variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
            >
              <EyeIcon className="w-4 h-4" /> Preview
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsEditor;
