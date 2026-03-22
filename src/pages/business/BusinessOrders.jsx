import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon, ClockIcon, ExclamationTriangleIcon,
  CheckCircleIcon, XCircleIcon, TruckIcon, InboxIcon,
  ChatBubbleLeftIcon, CurrencyDollarIcon, CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { mockReceivedOrders, newOrders, inProgressOrders, deliveredOrders, completedReceivedOrders, cancelledReceivedOrders } from '../../data/mockDataPhase3';
import { pageTransition, fadeInUp, staggerContainer, staggerItem, buttonVariants } from '../../lib/animations';

const tabs = [
  { key: 'all', label: 'All', count: mockReceivedOrders.length },
  { key: 'pending', label: 'New', count: newOrders.length, icon: InboxIcon },
  { key: 'in_progress', label: 'In Progress', count: inProgressOrders.length, icon: ClockIcon },
  { key: 'delivered', label: 'Delivered', count: deliveredOrders.length, icon: TruckIcon },
  { key: 'completed', label: 'Completed', count: completedReceivedOrders.length, icon: CheckCircleIcon },
  { key: 'cancelled', label: 'Cancelled', count: cancelledReceivedOrders.length, icon: XCircleIcon },
];

const statusColors = {
  pending: 'bg-secondary/10 text-secondary',
  in_progress: 'bg-primary/10 text-primary',
  delivered: 'bg-purple-500/10 text-purple-500',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-error/10 text-error',
};

const BusinessOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const orders = activeTab === 'all' ? mockReceivedOrders : mockReceivedOrders.filter((o) => o.status === activeTab);
  const filtered = orders.filter((o) =>
    o.gig.toLowerCase().includes(search.toLowerCase()) ||
    o.client.name.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toString().includes(search)
  );

  const totalEarnings = mockReceivedOrders.filter((o) => o.status === 'completed').reduce((s, o) => s + o.total, 0);

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[var(--color-text)]">Orders Received</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Manage your client orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{mockReceivedOrders.length}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">Total Orders</p>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-secondary">{newOrders.length}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">Pending</p>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-success">{completedReceivedOrders.length}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">Completed</p>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-success">${totalEarnings.toLocaleString()}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">Earnings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[var(--color-surface)]'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID, gig, or client..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      {/* Orders List */}
      <motion.div variants={staggerContainer(0.04)} initial="initial" animate="animate" className="space-y-3">
        <AnimatePresence>
          {filtered.map((order) => (
            <motion.div key={order.id} variants={staggerItem} layout>
              <Link to={`/business/orders/${order.id}`}>
                <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Client avatar + info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={order.client.avatar} alt={order.client.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-text-secondary)]">#{order.id}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${statusColors[order.status]}`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--color-text)] truncate mt-0.5">{order.gig}</h3>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          by {order.client.name} • {order.package} Package
                        </p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 sm:gap-6 text-xs text-[var(--color-text-secondary)] flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <CurrencyDollarIcon className="w-3.5 h-3.5" />
                        <span className="font-bold text-[var(--color-text)]">${order.total}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-3.5 h-3.5" />
                        <span>{new Date(order.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        <span>{order.deliveryDays}d</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div {...fadeInUp} className="text-center py-16">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-[var(--color-text-secondary)] mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)]">No orders found.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BusinessOrders;
