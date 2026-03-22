import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { mockAdminNews } from '../../data/mockDataAdmin';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { buttonVariants, staggerContainer, staggerItem } from '../../lib/animations';

const NewsManagement = () => {
  const [news, setNews] = useState(mockAdminNews);
  const [deletePost, setDeletePost] = useState(null);

  const togglePublish = (id) => {
    setNews(news.map(n => n.id === id ? { ...n, status: n.status === 'published' ? 'draft' : 'published' } : n));
  };

  const handleDelete = () => {
    setNews(news.filter(n => n.id !== deletePost?.id));
    setDeletePost(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">{news.length} posts • {news.filter(n => n.status === 'published').length} published</p>
        <Link to="/admin/news/create">
          <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold">
            <PlusIcon className="w-4 h-4" /> Create Post
          </motion.button>
        </Link>
      </div>

      {/* Posts Grid */}
      <motion.div variants={staggerContainer(0.05)} initial="initial" animate="animate" className="space-y-3">
        {news.map(post => (
          <motion.div key={post.id} variants={staggerItem} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              {post.featuredImage && (
                <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                  <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={post.status} size="xs" />
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{post.category}</span>
                    </div>
                    <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-1 truncate">{post.title}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--color-text-muted)]">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.views.toLocaleString()} views</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Publish Toggle */}
                    <button
                      onClick={() => togglePublish(post.id)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${post.status === 'published' ? 'bg-success' : 'bg-[var(--color-border)]'}`}
                    >
                      <motion.div animate={{ x: post.status === 'published' ? 16 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                    <Link to={`/admin/news/${post.id}/edit`} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary"><PencilIcon className="w-4 h-4" /></Link>
                    <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary"><EyeIcon className="w-4 h-4" /></button>
                    <button onClick={() => setDeletePost(post)} className="p-1.5 rounded-lg hover:bg-error/10 text-error"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-secondary)]">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {news.length === 0 && (
        <div className="text-center py-16 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl">
          <p className="text-[var(--color-text-secondary)]">No news posts yet.</p>
          <Link to="/admin/news/create" className="text-primary text-sm hover:underline mt-2 inline-block">Create your first post →</Link>
        </div>
      )}

      <ConfirmModal isOpen={!!deletePost} onClose={() => setDeletePost(null)} onConfirm={handleDelete} title="Delete Post" message={`Permanently delete "${deletePost?.title}"?`} confirmText="Delete" variant="danger" />
    </div>
  );
};

export default NewsManagement;
