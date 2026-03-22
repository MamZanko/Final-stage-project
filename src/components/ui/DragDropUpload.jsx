import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';

const DragDropUpload = ({
  onFilesSelected,
  accept = 'image/jpeg,image/png,image/webp',
  maxFiles = 5,
  maxSizeMB = 5,
  multiple = true,
  label = 'Drop files here or click to upload',
  sublabel = '',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateFiles = useCallback((files) => {
    const acceptList = accept.split(',').map((a) => a.trim());
    const valid = [];
    for (const file of files) {
      if (valid.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        break;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`${file.name} exceeds ${maxSizeMB}MB limit`);
        continue;
      }
      const typeMatch = acceptList.some((a) => {
        if (a.includes('*')) return file.type.startsWith(a.split('/')[0]);
        return file.type === a || file.name.endsWith(a.replace('.', ''));
      });
      if (!typeMatch && acceptList[0] !== '*') {
        setError(`${file.name} has unsupported format`);
        continue;
      }
      valid.push(file);
    }
    return valid;
  }, [accept, maxFiles, maxSizeMB]);

  const simulateUpload = useCallback((files) => {
    files.forEach((file) => {
      const id = file.name + Date.now();
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress((prev) => ({ ...prev, [id]: Math.min(100, Math.round(progress)) }));
      }, 200);
    });
    onFilesSelected?.(files);
  }, [onFilesSelected]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');
    const files = validateFiles(Array.from(e.dataTransfer.files));
    if (files.length) simulateUpload(files);
  }, [validateFiles, simulateUpload]);

  const handleChange = useCallback((e) => {
    setError('');
    const files = validateFiles(Array.from(e.target.files));
    if (files.length) simulateUpload(files);
    e.target.value = '';
  }, [validateFiles, simulateUpload]);

  return (
    <div className={className}>
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        animate={{ borderColor: isDragging ? 'var(--color-primary)' : undefined }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-[var(--color-border)] hover:border-primary/50 hover:bg-[var(--color-surface)]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <CloudArrowUpIcon className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? 'text-primary' : 'text-[var(--color-text-secondary)]'}`} />
        <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
        {sublabel && <p className="text-xs text-[var(--color-text-secondary)] mt-1">{sublabel}</p>}
        {!sublabel && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Max {maxFiles} file{maxFiles > 1 ? 's' : ''}, {maxSizeMB}MB each
          </p>
        )}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-error mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Upload progress */}
      {Object.entries(uploadProgress).length > 0 && (
        <div className="mt-3 space-y-2">
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="flex items-center gap-2">
              <DocumentIcon className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0" />
              <div className="flex-1 h-1.5 bg-[var(--color-surface)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full rounded-full ${progress === 100 ? 'bg-success' : 'bg-primary'}`}
                />
              </div>
              <span className="text-[10px] text-[var(--color-text-secondary)] w-8">{progress}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
