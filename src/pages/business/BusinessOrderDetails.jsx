import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon, ClockIcon, CheckCircleIcon, XCircleIcon,
  PaperAirplaneIcon, PaperClipIcon, DocumentIcon,
  CalendarDaysIcon, CurrencyDollarIcon, UserIcon,
  ChatBubbleLeftIcon, TruckIcon,
} from '@heroicons/react/24/outline';
import { mockReceivedOrders, mockReceivedOrderDetail } from '../../data/mockDataPhase3';
import ProgressTimeline from '../../components/ui/ProgressTimeline';
import DeliveryModal from '../../components/ui/DeliveryModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { pageTransition, fadeInUp, staggerContainer, staggerItem, buttonVariants } from '../../lib/animations';

const statusColors = {
  pending: 'bg-secondary/10 text-secondary border-secondary/30',
  in_progress: 'bg-primary/10 text-primary border-primary/30',
  delivered: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  completed: 'bg-success/10 text-success border-success/30',
  cancelled: 'bg-error/10 text-error border-error/30',
};

const timelineSteps = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'completed', label: 'Completed' },
];

const BusinessOrderDetails = () => {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const order = id === '5002' || id === mockReceivedOrderDetail.id.toString()
    ? mockReceivedOrderDetail
    : mockReceivedOrders.find((o) => o.id === parseInt(id));

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">Order not found.</p>
        <Link to="/business/orders" className="text-primary text-sm hover:underline mt-2 inline-block">← Back to Orders</Link>
      </div>
    );
  }

  const currentStepIndex = timelineSteps.findIndex((s) => s.key === order.status);
  const chat = order.chat || [];

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back + Header */}
      <Link to="/business/orders" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-primary mb-4 transition-colors">
        <ArrowLeftIcon className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-[var(--color-text)]">Order #{order.id}</h1>
            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${statusColors[order.status]}`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{order.gig}</p>
        </div>
        <div className="flex gap-2">
          {(order.status === 'in_progress' || order.status === 'pending') && (
            <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setShowDeliveryModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success text-white text-sm font-semibold hover:bg-green-600 transition-colors">
              <TruckIcon className="w-4 h-4" /> Deliver Order
            </motion.button>
          )}
          {order.status === 'pending' && (
            <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setShowCancelConfirm(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-error text-error text-sm font-semibold hover:bg-error/5 transition-colors">
              <XCircleIcon className="w-4 h-4" /> Cancel
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-4">Order Progress</h3>
            <div className="flex items-center gap-2">
              {timelineSteps.map((step, i) => {
                const isActive = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-center gap-2 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isCurrent ? 'bg-primary text-white ring-4 ring-primary/20' : isActive ? 'bg-success text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                    }`}>
                      {isActive && i < currentStepIndex ? <CheckCircleIcon className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-medium hidden sm:block ${isCurrent ? 'text-primary' : isActive ? 'text-success' : 'text-[var(--color-text-secondary)]'}`}>{step.label}</span>
                    {i < timelineSteps.length - 1 && <div className={`flex-1 h-0.5 ${isActive && i < currentStepIndex ? 'bg-success' : 'bg-[var(--color-border)]'}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirements */}
          {order.requirements && (
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-2">Client Requirements</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{order.requirements}</p>
            </div>
          )}

          {/* Delivery files */}
          {order.deliveryFiles && order.deliveryFiles.length > 0 && (
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">Delivered Files</h3>
              <div className="space-y-2">
                {order.deliveryFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-surface)]">
                    <DocumentIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[var(--color-text)] truncate">{file.name}</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">{file.size}</p>
                    </div>
                    <button className="text-xs text-primary hover:underline">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <ChatBubbleLeftIcon className="w-4 h-4" /> Messages
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {chat.length > 0 ? chat.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.sender === 'business' ? 'flex-row-reverse' : ''}`}>
                  <img src={msg.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  <div className={`max-w-[70%] ${msg.sender === 'business' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-3 py-2 rounded-xl text-sm ${
                      msg.sender === 'business' ? 'bg-primary text-white rounded-tr-sm' : 'bg-[var(--color-surface)] text-[var(--color-text)] rounded-tl-sm'
                    }`}>
                      {msg.message}
                    </div>
                    {msg.attachment && (
                      <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-surface)] text-xs text-primary">
                        <PaperClipIcon className="w-3 h-3" /> {msg.attachment}
                      </div>
                    )}
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">{new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                  </div>
                </motion.div>
              )) : (
                <p className="text-sm text-[var(--color-text-secondary)] text-center py-8">No messages yet.</p>
              )}
            </div>

            {/* Message input */}
            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <div className="flex gap-2 border-t border-[var(--color-border)] pt-4">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <button className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-primary transition-colors">
                  <PaperClipIcon className="w-4 h-4" />
                </button>
                <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
                  <PaperAirplaneIcon className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Order Info */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Order Details</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-secondary)]">Package</span>
                <span className="text-xs font-medium text-[var(--color-text)] capitalize">{order.package}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-secondary)]">Amount</span>
                <span className="text-sm font-bold text-[var(--color-text)]">${order.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-secondary)]">Due Date</span>
                <span className="text-xs text-[var(--color-text)]">{new Date(order.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-secondary)]">Delivery</span>
                <span className="text-xs text-[var(--color-text)]">{order.deliveryDays} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-secondary)]">Order Date</span>
                <span className="text-xs text-[var(--color-text)]">{new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">Client</h3>
            <div className="flex items-center gap-3">
              <img src={order.client.avatar} alt={order.client.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{order.client.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">@{order.client.username || 'client'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-3">Quick Actions</h3>
            <Link to={`/gigs/${order.gigId || 1}`} className="block w-full text-left px-3 py-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-colors">
              View Gig →
            </Link>
            <button className="w-full text-left px-3 py-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-colors">
              Contact Support →
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeliveryModal isOpen={showDeliveryModal} onClose={() => setShowDeliveryModal(false)} onSubmit={() => setShowDeliveryModal(false)} orderNumber={order.id.toString()} />
      <ConfirmModal isOpen={showCancelConfirm} onClose={() => setShowCancelConfirm(false)} onConfirm={() => setShowCancelConfirm(false)} title="Cancel Order" message="Are you sure you want to cancel this order? The client will be refunded." confirmText="Cancel Order" variant="danger" />
    </motion.div>
  );
};

export default BusinessOrderDetails;
