import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BoldIcon,
} from '@heroicons/react/24/outline';
import { sanitizeHtml } from '../../lib/sanitize';

/* Simple toolbar icons using SVG */
const ToolbarIcon = ({ children, active, onClick, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-colors ${
      active
        ? 'bg-primary/10 text-primary'
        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
    }`}
  >
    {children}
  </button>
);

const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  minHeight = 200,
  maxLength = 5000,
  className = '',
}) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    setCharCount(editorRef.current?.innerText?.length || 0);
  }, []);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || '';
    const text = editorRef.current?.innerText || '';
    setCharCount(text.length);
    // Sanitize HTML output before passing to parent
    onChange?.(sanitizeHtml(html));
  };

  const isCommandActive = (command) => {
    try { return document.queryCommandState(command); } catch { return false; }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      execCommand('insertText', '    ');
    }
  };

  return (
    <div className={`border border-[var(--color-border)] rounded-xl overflow-hidden ${isFocused ? 'ring-2 ring-primary/30' : ''} ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex-wrap">
        <ToolbarIcon onClick={() => execCommand('bold')} title="Bold (Ctrl+B)">
          <span className="font-bold">B</span>
        </ToolbarIcon>
        <ToolbarIcon onClick={() => execCommand('italic')} title="Italic (Ctrl+I)">
          <span className="italic">I</span>
        </ToolbarIcon>
        <ToolbarIcon onClick={() => execCommand('underline')} title="Underline (Ctrl+U)">
          <span className="underline">U</span>
        </ToolbarIcon>
        <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
        <ToolbarIcon onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </ToolbarIcon>
        <ToolbarIcon onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M10 6h11M10 12h11M10 18h11M3 5v2M3 11v2M3 17v2" />
          </svg>
        </ToolbarIcon>
        <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
        <ToolbarIcon onClick={() => execCommand('formatBlock', 'H2')} title="Heading">
          <span className="font-bold text-[10px]">H2</span>
        </ToolbarIcon>
        <ToolbarIcon onClick={() => execCommand('formatBlock', 'H3')} title="Subheading">
          <span className="font-bold text-[10px]">H3</span>
        </ToolbarIcon>
        <ToolbarIcon onClick={() => execCommand('formatBlock', 'P')} title="Paragraph">
          <span className="text-[10px]">P</span>
        </ToolbarIcon>
        <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
        <ToolbarIcon
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) execCommand('createLink', url);
          }}
          title="Insert Link"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </ToolbarIcon>
        <ToolbarIcon onClick={() => execCommand('removeFormat')} title="Clear Formatting">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </ToolbarIcon>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className="px-4 py-3 text-sm text-[var(--color-text)] leading-relaxed outline-none bg-[var(--color-card-bg)] overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--color-text-secondary)] empty:before:cursor-text prose prose-sm max-w-none prose-headings:text-[var(--color-text)] prose-p:text-[var(--color-text)] prose-a:text-primary prose-strong:text-[var(--color-text)] prose-ul:text-[var(--color-text)] prose-ol:text-[var(--color-text)]"
        style={{ minHeight }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
        <span className="text-[10px] text-[var(--color-text-secondary)]">Rich text editor</span>
        {maxLength && (
          <span className={`text-[10px] font-medium ${charCount > maxLength ? 'text-error' : 'text-[var(--color-text-secondary)]'}`}>
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
