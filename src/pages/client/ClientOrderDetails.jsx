import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon, DocumentIcon, ArrowDownTrayIcon, ExclamationTriangleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import ProgressTimeline from '../../components/ui/ProgressTimeline';
import StarRatingDisplay from '../../components/ui/StarRatingDisplay';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { pageTransition, fadeInUp, buttonVariants, tabContent } from '../../lib/animations';

const statusConfig = {
  placed: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Placed' },
  pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending' },
  in_progress: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'In Progress' },
  delivered: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Delivered' },
  completed: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Cancelled' },
  revision: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'Revision Requested' },
};

const ClientOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch order from API
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/orders/${id}`);
        const d = res.data || res;
        setOrder(d);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const status = order ? (statusConfig[order.status] || statusConfig.placed) : statusConfig.placed;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order?.chat]);

  // Determine the other party (if I'm the business, contact the client; if I'm the client, contact the business)
  const otherParty = user?.id === order?.business?.id ? order?.client : order?.business;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !otherParty?.id) return;
    try {
      const convRes = await api.post('/conversations', { recipient_id: otherParty.id });
      const convId = convRes.data?.id || convRes.id;
      await api.post(`/conversations/${convId}/messages`, { body: message.trim() });
      toast.success('Message sent!');
      setMessage('');
      navigate('/messages');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send message');
    }
  };

  const handleAcceptDelivery = async () => {
    setActionLoading('accept');
    try {
      await api.put(`/orders/${id}/status`, { status: 'completed' });
      setOrder((prev) => prev ? { ...prev, status: 'completed' } : prev);
      toast.success('Order marked as completed!');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to accept delivery');
    } finally {
      setActionLoading('');
    }
  };

  const handleRequestRevision = async () => {
    setActionLoading('revision');
    try {
      await api.put(`/orders/${id}/status`, { status: 'in_progress' });
      setOrder((prev) => prev ? { ...prev, status: 'in_progress' } : prev);
      toast.success('Revision requested — order sent back to In Progress');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to request revision');
    } finally {
      setActionLoading('');
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await api.put(`/orders/${id}/status`, { status: 'cancelled' });
      setOrder((prev) => prev ? { ...prev, status: 'cancelled' } : prev);
      setShowCancelModal(false);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to cancel order';
      alert(msg);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-[var(--color-surface)]" /><div className="h-6 w-40 bg-[var(--color-surface)] rounded" /></div>
          <div className="h-32 bg-[var(--color-surface)] rounded-xl" />
          <div className="h-48 bg-[var(--color-surface)] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-xl font-heading font-bold text-[var(--color-text)] mb-2">Order Not Found</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">{error || 'This order does not exist.'}</p>
        <Link to="/" className="btn-primary inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back + Order title */}
      <motion.div {...fadeInUp} className="flex items-center gap-3 mb-6">
        <Link to="/orders" className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors">
          <ArrowLeftIcon className="w-4 h-4 text-[var(--color-text)]" />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-[var(--color-text)]">Order #{order.id}</h1>
          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.color}`}>
            {status.label}
          </span>
        </div>
      </motion.div>

      {/* Two column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column — main content */}
        <div className="lg:w-[60%] space-y-6">
          {/* Gig Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-5"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--color-surface)] flex-shrink-0">
                {order.gig?.images?.[0] ? (
                  <img src={order.gig.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-text-secondary)]">🖼</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/gigs/${order.gig?.id}`} className="text-sm font-semibold text-[var(--color-text)] hover:text-primary transition-colors line-clamp-2">
                  {order.gig?.title}
                </Link>
                <Link to={`/business/${order.business?.username || 'designer'}`} className="text-xs text-primary hover:underline mt-0.5 block">
                  {order.business?.name}
                </Link>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-text-secondary)]">
                  <span>Package: <strong className="text-[var(--color-text)]">{order.package?.name || order.package?.type || '—'}</strong></span>
                  <span>Price: <strong className="text-[var(--color-text)]">${order.price}</strong></span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-5"
          >
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-4">Order Progress</h3>
            <ProgressTimeline status={order.status} />
          </motion.div>

          {/* Action buttons */}
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-3"
            >
              {order.status === 'delivered' && (
                <>
                  <motion.button
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleAcceptDelivery}
                    disabled={actionLoading === 'accept'}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-success text-white text-sm font-semibold hover:bg-success/90 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'accept' ? 'Accepting...' : '✓ Accept Delivery'}
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleRequestRevision}
                    disabled={actionLoading === 'revision'}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'revision' ? 'Requesting...' : '↻ Request Revision'}
                  </motion.button>
                </>
              )}
              <motion.button
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowCancelModal(true)}
                className="py-2.5 px-4 rounded-lg border border-error text-error text-sm font-semibold hover:bg-error/5 transition-colors"
              >
                Cancel Order
              </motion.button>
            </motion.div>
          )}

          {/* Contact Seller */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">{user?.id === order.business?.id ? 'Contact Client' : 'Contact Seller'}</h3>
            </div>

            {/* Quick message form */}
            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <form onSubmit={handleSendMessage} className="p-4 space-y-3">
                <p className="text-xs text-[var(--color-text-secondary)]">Send a quick message to {otherParty?.name || 'the other party'} about this order.</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-[var(--color-text-secondary)]"
                  />
                  <motion.button
                    type="submit"
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    disabled={!message.trim()}
                    className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-dark transition-colors"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </motion.button>
                </div>
                <Link
                  to="/messages"
                  className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Open Full Conversation
                </Link>
              </form>
            )}

            {(order.status === 'completed' || order.status === 'cancelled') && (
              <div className="p-4 text-center">
                <p className="text-xs text-[var(--color-text-secondary)] mb-3">This order is {order.status}.</p>
                <Link
                  to="/messages"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  View Messages
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right column — order details sidebar */}
        <div className="lg:w-[40%] space-y-4">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-5 sticky top-24"
          >
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-4">Order Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Order Number', value: `#${order.id}` },
                { label: 'Package', value: order.package?.name || order.package?.type || '—' },
                { label: 'Order Date', value: formatDate(order.created_at) },
                { label: 'Delivery By', value: formatDate(order.due_date) },
                { label: 'Status', value: status.label },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-1.5 text-xs">
                  <span className="text-[var(--color-text-secondary)]">{row.label}</span>
                  <span className="font-medium text-[var(--color-text)]">{row.value}</span>
                </div>
              ))}
              <div className="border-t border-[var(--color-border)] pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-[var(--color-text)]">Total</span>
                <span className="text-lg font-bold text-primary">${order.price}</span>
              </div>
            </div>
          </motion.div>

          {/* Business info card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-5"
          >
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">Seller</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-surface)]">
                <img src={order.business?.avatar_url || order.business?.avatar || `https://ui-avatars.com/api/?name=${order.business?.name}&background=2563EB&color=fff`} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <Link to={`/business/${order.business?.username || 'designer'}`} className="text-sm font-semibold text-[var(--color-text)] hover:text-primary transition-colors">
                  {order.business?.name}
                </Link>
                <StarRatingDisplay rating={order.business?.rating || 4.8} size="xs" />
              </div>
            </div>
            <Link
              to={`/business/${order.business?.username || 'designer'}`}
              className="block mt-3 text-center py-2 px-4 rounded-lg border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
            >
              View Profile
            </Link>
          </motion.div>

          {/* Delivery files (for delivered/completed) */}
          {(order.status === 'delivered' || order.status === 'completed') && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-5"
            >
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">Delivered Files</h3>
              <div className="space-y-2">
                {(order.delivery_files && order.delivery_files.length > 0 ? order.delivery_files : []).map((file, i) => {
                  const fileName = typeof file === 'string' ? file.split('/').pop() : `File ${i + 1}`;
                  const fileUrl = typeof file === 'string' ? file : '#';
                  return (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-[var(--color-surface)] rounded-lg">
                      <div className="flex items-center gap-2">
                        <DocumentIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <span className="text-xs font-medium text-[var(--color-text)]">{fileName}</span>
                      </div>
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })}
                {(!order.delivery_files || order.delivery_files.length === 0) && (
                  <p className="text-xs text-[var(--color-text-secondary)] text-center py-3">No files delivered yet.</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Cancel confirmation modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel this order?"
        message="Are you sure you want to cancel this order? This action may be subject to our cancellation policy and may not be reversible."
        confirmText="Yes, Cancel Order"
        variant="danger"
        isLoading={cancelLoading}
      />
    </motion.div>
  );
};

export default ClientOrderDetails;
