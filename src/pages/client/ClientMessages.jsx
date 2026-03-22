import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon,
  ArrowLeftIcon, EllipsisVerticalIcon, DocumentIcon, XMarkIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { pageTransition, buttonVariants } from '../../lib/animations';

const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:8000';

const ClientMessages = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const shouldScrollRef = useRef(true);
  const prevMsgCountRef = useRef(0);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const inputRef = useRef(null);

  /* ─── Data fetching ─── */
  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/conversations');
      setConversations(res.data || []);
    } catch {
      setConversations([]);
    } finally {
      setLoadingConvos(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Poll conversations every 10s to update unread badges & new messages in sidebar
  useEffect(() => {
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Fetch messages for selected conversation
  const fetchChatMessages = useCallback(async (convoId, showLoader = true) => {
    if (!convoId) return;
    if (showLoader) setLoadingMessages(true);
    try {
      const res = await api.get(`/conversations/${convoId}/messages`);
      const data = res.data || [];
      setChatMessages(Array.isArray(data) ? [...data].reverse() : []);
    } catch {
      if (showLoader) setChatMessages([]);
    } finally {
      if (showLoader) setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedConvo) return;
    fetchChatMessages(selectedConvo.id, true);
    // Also refresh conversation list to clear unread badge
    fetchConversations();
  }, [selectedConvo?.id, fetchChatMessages, fetchConversations]);

  // Poll for new messages every 5s when a conversation is open
  useEffect(() => {
    if (!selectedConvo?.id) return;
    const interval = setInterval(() => {
      fetchChatMessages(selectedConvo.id, false);
      fetchConversations();
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedConvo?.id, fetchChatMessages, fetchConversations]);

  // Smart scroll: only auto-scroll if user is near bottom or message count changed while at bottom
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    chatEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const isNearBottom = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  useEffect(() => {
    const prevCount = prevMsgCountRef.current;
    const newCount = chatMessages.length;
    prevMsgCountRef.current = newCount;

    // Always scroll on conversation switch (prevCount was 0 or different convo)
    if (prevCount === 0 && newCount > 0) {
      setTimeout(() => scrollToBottom('instant'), 50);
      return;
    }

    // Scroll if new messages arrived AND user is near bottom (or sent a message)
    if (newCount > prevCount && (shouldScrollRef.current || isNearBottom())) {
      scrollToBottom('smooth');
    }
  }, [chatMessages, scrollToBottom, isNearBottom]);

  // Reset scroll flag when switching conversations
  useEffect(() => {
    shouldScrollRef.current = true;
    prevMsgCountRef.current = 0;
  }, [selectedConvo?.id]);

  /* ─── Helpers ─── */
  const filteredConversations = conversations.filter((c) =>
    !searchQuery.trim() || c.other_participant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileUrl = (url) => (!url ? '' : url.startsWith('http') ? url : `${API_ROOT}/storage/${url}`);

  /* ─── File handling ─── */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
    e.target.value = '';
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (filePreview) { URL.revokeObjectURL(filePreview); setFilePreview(null); }
  };

  /* ─── Send ─── */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !selectedFile) || !selectedConvo || sending) return;
    const body = message.trim();
    const file = selectedFile;
    setSending(true);
    setMessage('');
    clearFile();

    const tempMsg = { id: Date.now(), sender: { id: user?.id }, body, created_at: new Date().toISOString(), is_read: false, file_name: file?.name };
    shouldScrollRef.current = true;
    setChatMessages((prev) => [...prev, tempMsg]);

    try {
      const formData = new FormData();
      if (body) formData.append('body', body);
      if (file) formData.append('file', file);
      const res = await api.post(`/conversations/${selectedConvo.id}/messages`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setChatMessages((prev) => prev.map((m) => (m.id === tempMsg.id ? (res.data || res) : m)));
      fetchConversations();
    } catch {
      // keep optimistic message
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  /* ─── Group messages by date ─── */
  const groupedMessages = chatMessages.reduce((groups, msg) => {
    const d = new Date(msg.created_at || msg.date);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    let label;
    if (d.toDateString() === today.toDateString()) label = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(msg);
    return groups;
  }, {});

  /* ─── Render ─── */
  return (
    <motion.div {...pageTransition} className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">

        {/* ═══════════ SIDEBAR ═══════════ */}
        <div className={`w-full md:w-[380px] lg:w-[420px] flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>

          {/* Header */}
          <div className="px-5 lg:px-6 pt-5 pb-4 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-heading font-bold text-[var(--color-text)]">Messages</h1>
              {conversations.length > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-secondary)]">
                  {conversations.length}
                </span>
              )}
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-[var(--color-text-secondary)] transition-all"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {loadingConvos ? (
              <div className="p-3 space-y-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-4 animate-pulse rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-surface)]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[var(--color-surface)] rounded-lg w-2/3" />
                      <div className="h-3 bg-[var(--color-surface)] rounded-lg w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center mb-5">
                  <ChatBubbleLeftRightIcon className="w-10 h-10 text-[var(--color-text-secondary)] opacity-60" />
                </div>
                <p className="text-base font-medium text-[var(--color-text)] mb-1">
                  {searchQuery ? 'No results found' : 'No messages yet'}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] text-center max-w-[220px]">
                  {searchQuery ? 'Try a different keyword' : 'Start a conversation with a freelancer'}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredConversations.map((convo) => {
                  const active = selectedConvo?.id === convo.id;
                  return (
                    <button
                      key={convo.id}
                      onClick={() => setSelectedConvo(convo)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-150 mb-0.5 ${
                        active
                          ? 'bg-primary/10 shadow-sm'
                          : 'hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-base font-bold ${active ? 'ring-2 ring-primary ring-offset-2 ring-offset-[var(--color-card-bg)]' : ''} bg-gradient-to-br from-primary/20 to-secondary/20 text-primary`}>
                          {convo.other_participant?.avatar_url ? (
                            <img src={convo.other_participant.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            convo.other_participant?.name?.charAt(0)?.toUpperCase() || '?'
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[15px] truncate ${convo.unread_count ? 'font-bold text-[var(--color-text)]' : 'font-medium text-[var(--color-text)]'}`}>
                            {convo.other_participant?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-[var(--color-text-secondary)] flex-shrink-0 ml-3">
                            {formatTime(convo.last_message_at)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate pr-2 ${convo.unread_count ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-text-secondary)]'}`}>
                            {convo.last_message?.body || 'No messages yet'}
                          </p>
                          {convo.unread_count > 0 && (
                            <span className="flex-shrink-0 min-w-[24px] h-[24px] rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center px-1.5">
                              {convo.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════ CHAT AREA ═══════════ */}
        <div className={`flex-1 flex flex-col min-w-0 ${selectedConvo ? 'flex' : 'hidden md:flex'}`}>
          {selectedConvo ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-4 px-5 lg:px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-card-bg)] flex-shrink-0">
                <button
                  onClick={() => setSelectedConvo(null)}
                  className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 text-[var(--color-text)]" />
                </button>
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-base font-bold text-primary">
                    {selectedConvo.other_participant?.avatar_url ? (
                      <img src={selectedConvo.other_participant.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      selectedConvo.other_participant?.name?.charAt(0)?.toUpperCase() || '?'
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-[var(--color-card-bg)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-[var(--color-text)] truncate">
                    {selectedConvo.other_participant?.name || 'Unknown'}
                  </h2>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
                <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors">
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Messages list */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 scroll-smooth"
                style={{
                  backgroundImage: 'radial-gradient(circle, var(--color-border) 0.5px, transparent 0.5px)',
                  backgroundSize: '20px 20px',
                }}
              >
                {loadingMessages ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-[var(--color-text-secondary)]">Loading messages...</p>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <ChatBubbleLeftRightIcon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Start the conversation</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] max-w-xs text-center">
                      Send a message to {selectedConvo.other_participant?.name || 'this freelancer'} to get started.
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
                    <div key={dateLabel}>
                      {/* Date separator */}
                      <div className="flex items-center justify-center my-6 first:mt-0">
                        <div className="px-4 py-1.5 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
                          {dateLabel}
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="space-y-3">
                        {msgs.map((msg, i) => {
                          const isMe = msg.sender?.id === user?.id || msg.sender_id === user?.id;
                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
                              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                              {/* Other user avatar */}
                              {!isMe && (
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary">
                                  {selectedConvo.other_participant?.avatar_url ? (
                                    <img src={selectedConvo.other_participant.avatar_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    selectedConvo.other_participant?.name?.charAt(0)?.toUpperCase() || '?'
                                  )}
                                </div>
                              )}

                              {/* Bubble */}
                              <div className="max-w-[70%] lg:max-w-[60%]">
                                <div
                                  className={`px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                                    isMe
                                      ? 'bg-primary text-white rounded-2xl rounded-br-md'
                                      : 'bg-[var(--color-card-bg)] text-[var(--color-text)] rounded-2xl rounded-bl-md border border-[var(--color-border)]'
                                  }`}
                                >
                                  {/* Image */}
                                  {msg.file_url && msg.file_type === 'image' && (
                                    <a href={getFileUrl(msg.file_url)} target="_blank" rel="noopener noreferrer" className="block mb-2">
                                      <img src={getFileUrl(msg.file_url)} alt={msg.file_name || 'image'} className="max-w-full rounded-xl max-h-72 object-cover hover:opacity-90 transition-opacity" />
                                    </a>
                                  )}
                                  {/* File */}
                                  {msg.file_url && msg.file_type !== 'image' && (
                                    <a
                                      href={getFileUrl(msg.file_url)} target="_blank" rel="noopener noreferrer"
                                      className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-colors ${isMe ? 'bg-white/10 hover:bg-white/20' : 'bg-[var(--color-surface)] hover:bg-[var(--color-border)]'}`}
                                    >
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isMe ? 'bg-white/15' : 'bg-primary/10'}`}>
                                        <DocumentIcon className={`w-5 h-5 ${isMe ? 'text-white' : 'text-primary'}`} />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{msg.file_name || 'File'}</p>
                                        {msg.file_size && <p className={`text-xs mt-0.5 ${isMe ? 'text-white/60' : 'text-[var(--color-text-secondary)]'}`}>{formatFileSize(msg.file_size)}</p>}
                                      </div>
                                    </a>
                                  )}
                                  {/* Text */}
                                  {(msg.body || msg.message) && <p className="leading-relaxed">{msg.body || msg.message}</p>}
                                </div>
                                {/* Time & status */}
                                <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMe ? 'justify-end' : ''}`}>
                                  <span className="text-[11px] text-[var(--color-text-secondary)]">
                                    {new Date(msg.created_at || msg.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                  </span>
                                  {isMe && (
                                    <span className={`flex ${msg.is_read ? 'text-primary' : 'text-[var(--color-text-secondary)]'}`}>
                                      <CheckIcon className="w-3.5 h-3.5" />
                                      {msg.is_read && <CheckIcon className="w-3.5 h-3.5 -ml-2" />}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* File preview */}
              <AnimatePresence>
                {selectedFile && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[var(--color-border)] bg-[var(--color-card-bg)] overflow-hidden flex-shrink-0"
                  >
                    <div className="px-5 lg:px-6 py-3">
                      <div className="flex items-center gap-4 bg-[var(--color-surface)] rounded-xl p-3 border border-[var(--color-border)]">
                        {filePreview ? (
                          <img src={filePreview} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <DocumentIcon className="w-7 h-7 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-text)] truncate">{selectedFile.name}</p>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button type="button" onClick={clearFile} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors">
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input area */}
              <div className="border-t border-[var(--color-border)] bg-[var(--color-card-bg)] flex-shrink-0">
                <form onSubmit={handleSendMessage} className="px-4 sm:px-5 lg:px-6 py-4">
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt,.csv" onChange={handleFileSelect} />
                  <input type="file" ref={imageInputRef} className="hidden" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileSelect} />

                  <div className="flex items-end gap-2 sm:gap-3">
                    {/* Attachment buttons */}
                    <div className="flex items-center gap-0.5 pb-0.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-primary transition-all"
                        title="Attach file"
                      >
                        <PaperClipIcon className="w-[22px] h-[22px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-primary transition-all"
                        title="Send image"
                      >
                        <PhotoIcon className="w-[22px] h-[22px]" />
                      </button>
                    </div>

                    {/* Text input */}
                    <div className="flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-5 py-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[15px] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 placeholder:text-[var(--color-text-secondary)] transition-all"
                      />
                    </div>

                    {/* Send */}
                    <div className="pb-0.5">
                      <motion.button
                        type="submit"
                        variants={buttonVariants}
                        initial="idle"
                        whileHover="hover"
                        whileTap="tap"
                        disabled={(!message.trim() && !selectedFile) || sending}
                        className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 disabled:shadow-none"
                      >
                        {sending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <PaperAirplaneIcon className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            /* No conversation selected */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-24 h-24 rounded-3xl bg-primary/5 flex items-center justify-center mb-6">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-xl font-heading font-bold text-[var(--color-text)] mb-2">Your Messages</h2>
              <p className="text-base text-[var(--color-text-secondary)] max-w-sm">
                Select a conversation from the sidebar to start chatting with freelancers.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClientMessages;
