import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ChatBubbleLeftEllipsisIcon, UserIcon, BriefcaseIcon, CalendarDaysIcon, CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { mockAdminOrders } from '../../data/mockDataAdmin';
import StatusBadge from '../../components/admin/StatusBadge';
import { fadeInUp, buttonVariants, staggerContainer, staggerItem } from '../../lib/animations';

const statusOptions = ['placed', 'in_progress', 'delivered', 'completed', 'cancelled'];

const mockChat = [
  { id: 1, sender: 'client', name: 'Client', text: 'Hello, I need help with the project requirements.', time: '10:30 AM' },
  { id: 2, sender: 'business', name: 'Business', text: 'Sure! Can you describe what you need in detail?', time: '10:32 AM' },
  { id: 3, sender: 'client', name: 'Client', text: 'I need a full branding package — logo, cards, and social media kit.', time: '10:35 AM' },
  { id: 4, sender: 'business', name: 'Business', text: 'Great, I\'ll prepare the first draft within 3 days.', time: '10:38 AM' },
  { id: 5, sender: 'client', name: 'Client', text: 'Sounds good. Looking forward to it!', time: '10:40 AM' },
];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const order = mockAdminOrders.find(o => o.id === parseInt(id));
  const [status, setStatus] = useState(order?.status || 'placed');
  const [showStatusChange, setShowStatusChange] = useState(false);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-[var(--color-text-secondary)]">Order not found.</p>
        <Link to="/admin/orders" className="mt-4 text-primary hover:underline">← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="p-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
          <ArrowLeftIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </Link>
        <div>
          <h2 className="text-xl font-heading font-bold text-[var(--color-text)]">Order #{order.id}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{order.gig}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={status} size="md" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Info */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate" className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-4">Order Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <div><p className="text-[10px] text-[var(--color-text-secondary)]">Gig</p><p className="text-sm text-[var(--color-text)]">{order.gig}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <div><p className="text-[10px] text-[var(--color-text-secondary)]">Amount</p><p className="text-sm font-semibold text-[var(--color-text)]">${order.price.toLocaleString()}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <div><p className="text-[10px] text-[var(--color-text-secondary)]">Date Placed</p><p className="text-sm text-[var(--color-text)]">{order.date}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <div><p className="text-[10px] text-[var(--color-text-secondary)]">Deadline</p><p className="text-sm text-[var(--color-text)]">{order.dueDate || 'Not set'}</p></div>
              </div>
            </div>
          </motion.div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.05 }} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <UserIcon className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Client</h3>
              </div>
              <p className="text-sm font-medium text-[var(--color-text)]">{order.client.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">@{order.client.username}</p>
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="mt-3 text-xs text-primary hover:underline">Contact Client →</motion.button>
            </motion.div>
            <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <BriefcaseIcon className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Business</h3>
              </div>
              <p className="text-sm font-medium text-[var(--color-text)]">{order.business.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">@{order.business.username}</p>
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="mt-3 text-xs text-secondary hover:underline">Contact Business →</motion.button>
            </motion.div>
          </div>

          {/* Chat Log */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.15 }} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Chat History</h3>
            </div>
            <motion.div variants={staggerContainer(0.05)} initial="initial" animate="animate" className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {mockChat.map(msg => (
                <motion.div key={msg.id} variants={staggerItem} className={`flex ${msg.sender === 'client' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.sender === 'client' ? 'bg-primary/10 text-[var(--color-text)]' : 'bg-secondary/10 text-[var(--color-text)]'}`}>
                    <p className="text-xs font-semibold mb-0.5">{msg.name}</p>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 text-right">{msg.time}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Action Bar */}
        <div className="space-y-4">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 sticky top-20">
            <h3 className="text-sm font-heading font-semibold text-[var(--color-text)] mb-4">Admin Actions</h3>
            <div className="space-y-2.5">
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setShowStatusChange(!showStatusChange)} className="w-full px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold">Change Status</motion.button>

              <AnimatePresence>
                {showStatusChange && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                    {statusOptions.map(s => (
                      <button key={s} onClick={() => { setStatus(s); setShowStatusChange(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${status === s ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-[var(--color-surface)]'}`}>
                        <StatusBadge status={s} size="xs" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {status !== 'cancelled' && (
                <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" onClick={() => setStatus('cancelled')} className="w-full px-4 py-2.5 rounded-xl border border-error text-error text-sm font-semibold hover:bg-error/10">Cancel Order</motion.button>
              )}

              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="w-full px-4 py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/10">Contact Client</motion.button>
              <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="w-full px-4 py-2.5 rounded-xl border border-secondary text-secondary text-sm font-semibold hover:bg-secondary/10">Contact Business</motion.button>
            </div>

            {/* Order Timeline */}
            <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
              <h4 className="text-xs font-semibold text-[var(--color-text)] mb-3">Timeline</h4>
              <div className="space-y-3 relative">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-[var(--color-border)]" />
                {[
                  { label: 'Order Placed', time: order.date, done: true },
                  { label: 'In Progress', time: status !== 'placed' ? order.date : null, done: ['in_progress', 'delivered', 'completed'].includes(status) },
                  { label: 'Delivered', time: status === 'delivered' || status === 'completed' ? order.date : null, done: ['delivered', 'completed'].includes(status) },
                  { label: 'Completed', time: status === 'completed' ? order.date : null, done: status === 'completed' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 relative">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 z-10 ${step.done ? 'bg-success' : 'bg-[var(--color-border)]'}`} />
                    <div>
                      <p className={`text-xs font-medium ${step.done ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>{step.label}</p>
                      {step.time && <p className="text-[10px] text-[var(--color-text-secondary)]">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
