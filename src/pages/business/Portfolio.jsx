import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, ArrowUpTrayIcon, XMarkIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { mockBusinessProfile } from '../../data/mockDataPhase2';
import { mockShowcaseProjects } from '../../data/mockDataPhase3';
import ShowcaseProjectCard from '../../components/ui/ShowcaseProjectCard';
import ProjectUploadModal from '../../components/ui/ProjectUploadModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { pageTransition, fadeInUp, staggerContainer, staggerItem, buttonVariants } from '../../lib/animations';

const Portfolio = () => {
  const [portfolioImages, setPortfolioImages] = useState(mockBusinessProfile.portfolio || []);
  const [projects, setProjects] = useState(mockShowcaseProjects);
  const [showUploadProject, setShowUploadProject] = useState(false);
  const [deleteProject, setDeleteProject] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [activeView, setActiveView] = useState('gallery'); // 'gallery' | 'projects'
  const fileInputRef = useRef(null);

  const handleUploadImages = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setPortfolioImages((prev) => [...prev, ...previews]);
    e.target.value = '';
  };

  const handleDeleteImage = (idx) => {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveProject = (data) => {
    setProjects([...projects, { id: Date.now(), ...data, images: data.images?.map((i) => i.preview) || [] }]);
  };

  const handleDeleteProject = () => {
    if (deleteProject) {
      setProjects(projects.filter((p) => p.id !== deleteProject.id));
      setDeleteProject(null);
    }
  };

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[var(--color-text)]">Portfolio</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Showcase your best work</p>
        </div>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUploadImages} />
          <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-primary hover:border-primary transition-colors">
            <ArrowUpTrayIcon className="w-4 h-4" /> Upload Images
          </motion.button>
          {projects.length < 4 && (
            <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setShowUploadProject(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
              <PlusIcon className="w-4 h-4" /> Add Project
            </motion.button>
          )}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'gallery', label: `Gallery (${portfolioImages.length})` },
          { key: 'projects', label: `Projects (${projects.length}/4)` },
        ].map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${activeView === v.key ? 'bg-primary text-white' : 'bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Gallery View */}
      {activeView === 'gallery' && (
        <motion.div variants={staggerContainer(0.03)} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {portfolioImages.map((img, i) => (
            <motion.div key={i} variants={staggerItem} className="relative group aspect-square rounded-xl overflow-hidden bg-[var(--color-surface)] cursor-pointer" onClick={() => { setLightboxIdx(i); setLightboxOpen(true); }}>
              <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              <button onClick={(e) => { e.stopPropagation(); handleDeleteImage(i); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error">
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
          {portfolioImages.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-sm text-[var(--color-text-secondary)]">No portfolio images yet. Upload some!</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Projects View */}
      {activeView === 'projects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ShowcaseProjectCard key={project.id} project={project} isOwner onDelete={(p) => setDeleteProject(p)} />
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-sm text-[var(--color-text-secondary)]">No showcase projects yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setLightboxOpen(false)}>
            <motion.img key={lightboxIdx} src={portfolioImages[lightboxIdx]} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} />
            <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
              <XMarkIcon className="w-6 h-6" />
            </button>
            {portfolioImages.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((p) => (p - 1 + portfolioImages.length) % portfolioImages.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">←</button>
                <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((p) => (p + 1) % portfolioImages.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">→</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ProjectUploadModal isOpen={showUploadProject} onClose={() => setShowUploadProject(false)} onSave={handleSaveProject} />
      <ConfirmModal isOpen={!!deleteProject} onClose={() => setDeleteProject(null)} onConfirm={handleDeleteProject} title="Delete Project" message={`Delete "${deleteProject?.title}"? This cannot be undone.`} confirmText="Delete" variant="danger" />
    </motion.div>
  );
};

export default Portfolio;
