import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { buttonVariants } from '../../lib/animations';

const ShowcaseProjectCard = ({ project, isOwner = false, onDelete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const hasImages = project.images?.length > 0;
  const hasVideo = project.video?.url;
  const totalSlides = hasImages ? project.images.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow"
    >
      {/* Media section */}
      <div className="relative aspect-video overflow-hidden bg-[var(--color-surface)]">
        {hasVideo ? (
          <div className="w-full h-full">
            {project.video.thumbnail ? (
              <div className="relative w-full h-full">
                <img src={project.video.thumbnail} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <PlayCircleIcon className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              </div>
            ) : (
              <video src={project.video.url} className="w-full h-full object-cover" />
            )}
          </div>
        ) : hasImages ? (
          <>
            <motion.img
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={project.images[currentSlide]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {totalSlides > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide((p) => (p - 1 + totalSlides) % totalSlides); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide((p) => (p + 1) % totalSlides); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {project.images.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentSlide ? 'bg-white w-3' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)]">
            <span className="text-sm">No media</span>
          </div>
        )}

        {/* Owner delete */}
        {isOwner && (
          <motion.button
            variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
            onClick={() => onDelete?.(project)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/90"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-[var(--color-text)] line-clamp-1">{project.title}</h4>
        {project.description && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed line-clamp-2">{project.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {hasVideo && (
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-[10px] font-medium rounded-full">Video</span>
          )}
          {hasImages && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">{totalSlides} image{totalSlides !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShowcaseProjectCard;
