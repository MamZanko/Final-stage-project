import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { PencilIcon, TrashIcon, PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { mockAdminCategories } from '../../data/mockDataAdmin';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { buttonVariants, fadeInUp } from '../../lib/animations';

const emptyCategory = { name: '', slug: '', icon: '', description: '', status: 'active' };

const CategoryManagement = () => {
  const [categories, setCategories] = useState(mockAdminCategories);
  const [editing, setEditing] = useState(null); // null = add mode, object = editing
  const [form, setForm] = useState({ ...emptyCategory });
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [saved, setSaved] = useState(false);

  const iconOptions = ['💻', '🎨', '📈', '🎬', '✍️', '📊', '🤖', '📱', '🎵', '📷', '🛒', '🔧', '📐', '🎮', '🌐', '💼'];

  const startEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description, status: cat.status });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ ...emptyCategory });
  };

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = () => {
    if (!form.name.trim()) return;
    const slug = form.slug || autoSlug(form.name);

    if (editing) {
      setCategories(categories.map(c => c.id === editing.id ? { ...c, ...form, slug } : c));
    } else {
      setCategories([...categories, { id: `c${Date.now()}`, ...form, slug, gigCount: 0, order: categories.length + 1 }]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    cancelEdit();
  };

  const handleDelete = () => {
    setCategories(categories.filter(c => c.id !== deleteCategory?.id));
    setDeleteCategory(null);
  };

  const toggleStatus = (id) => {
    setCategories(categories.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left: Table (60%) */}
      <div className="lg:col-span-3">
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Categories ({categories.length})</h3>
          </div>
          <Reorder.Group axis="y" values={categories} onReorder={setCategories} className="divide-y divide-[var(--color-border)]">
            {categories.map((cat) => (
              <Reorder.Item key={cat.id} value={cat} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-surface)] transition-colors cursor-grab active:cursor-grabbing">
                <span className="text-[var(--color-text-muted)] cursor-grab">⠿</span>
                <span className="text-xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)]">{cat.name}</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">/{cat.slug} • {cat.gigCount} gigs</p>
                </div>
                {/* Status toggle */}
                <button
                  onClick={() => toggleStatus(cat.id)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${cat.status === 'active' ? 'bg-success' : 'bg-[var(--color-border)]'}`}
                >
                  <motion.div animate={{ x: cat.status === 'active' ? 16 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(cat)} className="p-1 rounded hover:bg-primary/10 text-primary"><PencilIcon className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteCategory(cat)} className="p-1 rounded hover:bg-error/10 text-error"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>

      {/* Right: Form (40%) */}
      <div className="lg:col-span-2">
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 sticky top-20">
          <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-4">
            {editing ? `Edit Category: ${editing.name}` : 'Add New Category'}
          </h3>

          <div className="space-y-4">
            {/* Icon picker */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Icon</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {iconOptions.map(icon => (
                  <button key={icon} onClick={() => setForm({ ...form, icon })} className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors ${form.icon === icon ? 'bg-primary/20 ring-2 ring-primary' : 'bg-[var(--color-surface)] hover:bg-[var(--color-border)]'}`}>{icon}</button>
                ))}
              </div>
              <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Or type icon/emoji code" className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : autoSlug(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text)]">Status</span>
              <button
                onClick={() => setForm({ ...form, status: form.status === 'active' ? 'inactive' : 'active' })}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.status === 'active' ? 'bg-success' : 'bg-[var(--color-border)]'}`}
              >
                <motion.div animate={{ x: form.status === 'active' ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              {editing && (
                <button onClick={cancelEdit} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors">Cancel</button>
              )}
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={handleSave} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${saved ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary-dark'}`}>
                {saved ? <span className="flex items-center justify-center gap-1"><CheckIcon className="w-4 h-4" /> Saved!</span> : editing ? 'Update Category' : 'Save Category'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={!!deleteCategory} onClose={() => setDeleteCategory(null)} onConfirm={handleDelete} title="Delete Category" message={`Delete "${deleteCategory?.name}"? ${deleteCategory?.gigCount} gigs are in this category.`} confirmText="Delete" variant="danger" />
    </div>
  );
};

export default CategoryManagement;
