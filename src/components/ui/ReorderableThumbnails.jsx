import { useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

const ReorderableThumbnails = ({ images = [], onChange, maxImages = 10 }) => {
  const [items, setItems] = useState(images.map((src, i) => ({ id: `img-${i}`, src })));

  const handleReorder = useCallback((newOrder) => {
    setItems(newOrder);
    onChange?.(newOrder.map((item) => item.src));
  }, [onChange]);

  const removeImage = useCallback((id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    onChange?.(newItems.map((item) => item.src));
  }, [items, onChange]);

  const addImages = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newItems = files.slice(0, maxImages - items.length).map((f, i) => ({
      id: `img-${Date.now()}-${i}`,
      src: URL.createObjectURL(f),
    }));
    const updated = [...items, ...newItems];
    setItems(updated);
    onChange?.(updated.map((item) => item.src));
    e.target.value = '';
  }, [items, maxImages, onChange]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-[var(--color-text)]">
          Images ({items.length}/{maxImages}) <span className="text-[var(--color-text-secondary)]">— drag to reorder</span>
        </p>
      </div>

      <Reorder.Group axis="x" values={items} onReorder={handleReorder} className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[var(--color-border)] cursor-grab active:cursor-grabbing group"
            whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
          >
            <img src={item.src} alt="" className="w-full h-full object-cover" />
            <button
              onClick={(e) => { e.stopPropagation(); removeImage(item.id); }}
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
            {items.indexOf(item) === 0 && (
              <span className="absolute bottom-0.5 left-0.5 px-1 py-0.5 bg-primary text-white text-[8px] font-bold rounded">
                COVER
              </span>
            )}
          </Reorder.Item>
        ))}

        {items.length < maxImages && (
          <label className="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--color-border)] flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-[var(--color-surface)] transition-colors">
            <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={addImages} className="hidden" />
            <PhotoIcon className="w-6 h-6 text-[var(--color-text-secondary)]" />
          </label>
        )}
      </Reorder.Group>
    </div>
  );
};

export default ReorderableThumbnails;
