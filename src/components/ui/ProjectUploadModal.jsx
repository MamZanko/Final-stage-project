import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PhotoIcon, VideoCameraIcon, CloudArrowUpIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { modalOverlay, modalContent, buttonVariants } from '../../lib/animations';

const ProjectUploadModal = ({ isOpen, onClose, onSave, maxImages = 10, maxVideoMB = 100 }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState('images'); // 'images' | 'video'
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [saving, setSaving] = useState(false);

  const simulateUpload = (fileName) => {
    const id = fileName;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 10;
      if (progress >= 100) { progress = 100; clearInterval(interval); }
      setUploadProgress((prev) => ({ ...prev, [id]: Math.min(100, Math.round(progress)) }));
    }, 200);
  };

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((f) => f.size <= 5 * 1024 * 1024 && /\.(jpg|jpeg|png|webp)$/i.test(f.name));
    const newImages = validFiles.slice(0, maxImages - images.length).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
    }));
    newImages.forEach((img) => simulateUpload(img.name));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const handleVideoAdd = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= maxVideoMB * 1024 * 1024) {
      setVideo({ file, preview: URL.createObjectURL(file), name: file.name });
      simulateUpload(file.name);
    }
    e.target.value = '';
  };

  const handleSave = () => {
    if (!title.trim()) return;
    setSaving(true);
    setTimeout(() => {
      onSave?.({ title, description, mediaType, images, video });
      setSaving(false);
      setTitle(''); setDescription(''); setImages([]); setVideo(null); setUploadProgress({});
      onClose?.();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div {...modalOverlay} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div {...modalContent} className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-lg shadow-xl my-8">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
              <XMarkIcon className="w-5 h-5" />
            </button>

            <h3 className="text-base font-heading font-semibold text-[var(--color-text)] mb-4">Add Showcase Project</h3>

            {/* Title */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., E-Commerce Platform" className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief project description..." className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
            </div>

            {/* Media type toggle */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--color-text)] mb-2">Media Type</label>
              <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
                <button
                  onClick={() => { setMediaType('images'); setVideo(null); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${mediaType === 'images' ? 'bg-primary text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'}`}
                >
                  <PhotoIcon className="w-4 h-4" /> Images
                </button>
                <button
                  onClick={() => { setMediaType('video'); setImages([]); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${mediaType === 'video' ? 'bg-primary text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'}`}
                >
                  <VideoCameraIcon className="w-4 h-4" /> Video
                </button>
              </div>
            </div>

            {/* Image upload */}
            {mediaType === 'images' && (
              <div className="mb-4">
                <label className="relative border-2 border-dashed border-[var(--color-border)] rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors block">
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={handleImageAdd} className="hidden" />
                  <CloudArrowUpIcon className="w-6 h-6 mx-auto mb-1 text-[var(--color-text-secondary)]" />
                  <p className="text-xs text-[var(--color-text-secondary)]">Drop images or click ({images.length}/{maxImages})</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">JPG, PNG, WEBP — max 5MB each</p>
                </label>
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-[var(--color-surface)]">
                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                        {uploadProgress[img.name] !== undefined && uploadProgress[img.name] < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                            <div className="h-full bg-primary" style={{ width: `${uploadProgress[img.name]}%` }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Video upload */}
            {mediaType === 'video' && (
              <div className="mb-4">
                {!video ? (
                  <label className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors block">
                    <input type="file" accept=".mp4,.mov,.webm" onChange={handleVideoAdd} className="hidden" />
                    <VideoCameraIcon className="w-6 h-6 mx-auto mb-1 text-[var(--color-text-secondary)]" />
                    <p className="text-xs text-[var(--color-text-secondary)]">Drop video or click to upload</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">MP4, MOV, WEBM — max {maxVideoMB}MB</p>
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-black">
                    <video src={video.preview} controls className="w-full max-h-48 object-contain" />
                    <button onClick={() => setVideo(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors">Cancel</button>
              <motion.button
                variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                onClick={handleSave}
                disabled={!title.trim() || saving}
                className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Save Project
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectUploadModal;
