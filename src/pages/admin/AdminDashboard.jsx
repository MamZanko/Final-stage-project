import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UsersIcon, BriefcaseIcon, DocumentTextIcon, ShoppingBagIcon,
  UserPlusIcon, FireIcon, ClockIcon, ArrowPathIcon,
  EyeIcon, NoSymbolIcon, TrashIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockDashboardStats, mockAdminUsers, mockAdminGigs, mockRoleRequests, mockAdminDeals, mockAnalyticsData } from '../../data/mockDataAdmin';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminChartCard from '../../components/admin/AdminChartCard';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { staggerContainer, staggerItem, buttonVariants } from '../../lib/animations';

const s = mockDashboardStats;

const AdminDashboard = () => {
  const [confirmAction, setConfirmAction] = useState(null);

  return (
    <div className="space-y-6">
      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={UsersIcon} label="Total Users" value={s.totalUsers} subtitle="Clients + Businesses" color="primary" delay={0} />
        <StatCard icon={BriefcaseIcon} label="Business Accounts" value={s.businessAccounts} color="secondary" delay={0.05} />
        <StatCard icon={DocumentTextIcon} label="Total Gigs" value={s.totalGigs} color="purple" delay={0.1} />
        <StatCard icon={ShoppingBagIcon} label="Total Orders" value={s.totalOrders} color="success" delay={0.15} />
      </div>

      {/* Stat Cards Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={UserPlusIcon} label="New Users Today" value={s.newUsersToday} color="primary" delay={0.2} />
        <StatCard icon={FireIcon} label="Gigs This Month" value={s.gigsThisMonth} color="secondary" delay={0.25} />
        <StatCard icon={ClockIcon} label="Active Orders" value={s.activeOrders} color="amber" delay={0.3} />
        <StatCard icon={ArrowPathIcon} label="Pending Role Requests" value={s.pendingRoleRequests} color="amber" pulse={s.pendingRoleRequests > 0} delay={0.35} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminChartCard title="User Growth" subtitle="Clients vs Businesses — last 12 months">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mockAnalyticsData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="clients" name="Clients" stroke="#2563EB" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="businesses" name="Businesses" stroke="#F97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Gigs Posted" subtitle="Monthly — last 6 months">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockAnalyticsData.gigsPosted}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" name="Gigs" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Weekly Orders" subtitle="Last 30 days">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mockAnalyticsData.weeklyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} dot={false} fill="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Active Deals by Category" subtitle="Top 5 categories with discounts">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={mockAnalyticsData.dealsByCategory} cx="50%" cy="50%" outerRadius={90} innerRadius={40} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 10 }}>
                {mockAnalyticsData.dealsByCategory.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </div>

      {/* Recent Users Table */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Recent Users</h3>
          <Link to="/admin/users" className="text-xs text-primary hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Username</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Joined</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Actions</th>
            </tr></thead>
            <tbody>
              {mockAdminUsers.slice(0, 5).map((u, i) => (
                <tr key={u.id} className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors ${i % 2 ? 'bg-[var(--color-surface)]/30' : ''}`}>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover" /><span className="font-medium text-[var(--color-text)]">{u.name}</span></div></td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">@{u.username}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.role} size="xs" /></td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] text-xs">{u.joinDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} size="xs" /></td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <Link to="/admin/users" className="p-1 rounded hover:bg-primary/10 text-primary"><EyeIcon className="w-4 h-4" /></Link>
                    {u.status !== 'banned' && <button onClick={() => setConfirmAction({ type: 'ban', name: u.name })} className="p-1 rounded hover:bg-error/10 text-error"><NoSymbolIcon className="w-4 h-4" /></button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Gigs Table */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Recent Gigs</h3>
          <Link to="/admin/gigs" className="text-xs text-primary hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Gig</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Business</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Actions</th>
            </tr></thead>
            <tbody>
              {mockAdminGigs.slice(0, 5).map((g, i) => (
                <tr key={g.id} className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors ${i % 2 ? 'bg-[var(--color-surface)]/30' : ''}`}>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><img src={g.image} alt="" className="w-10 h-7 rounded object-cover" /><span className="font-medium text-[var(--color-text)] truncate max-w-[180px]">{g.title}</span></div></td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{g.business}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] text-xs">{g.category}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] text-xs">{g.datePosted}</td>
                  <td className="px-4 py-3"><StatusBadge status={g.status} size="xs" /></td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-primary/10 text-primary"><EyeIcon className="w-4 h-4" /></button>
                    <button onClick={() => setConfirmAction({ type: 'delete', name: g.title })} className="p-1 rounded hover:bg-error/10 text-error"><TrashIcon className="w-4 h-4" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Role Requests */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Pending Role Requests</h3>
          <Link to="/admin/role-requests" className="text-xs text-primary hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Business Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Actions</th>
            </tr></thead>
            <tbody>
              {mockRoleRequests.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">No pending requests</td></tr>
              ) : mockRoleRequests.slice(0, 3).map((r, i) => (
                <tr key={r.id} className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors ${i % 2 ? 'bg-[var(--color-surface)]/30' : ''}`}>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><img src={r.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" /><span className="text-[var(--color-text)]">{r.user.name}</span></div></td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] text-xs">{r.dateSubmitted}</td>
                  <td className="px-4 py-3 text-[var(--color-text)]">{r.businessName}</td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="px-2.5 py-1 rounded-lg bg-success/10 text-success text-xs font-semibold hover:bg-success/20">Approve</motion.button>
                    <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="px-2.5 py-1 rounded-lg bg-error/10 text-error text-xs font-semibold hover:bg-error/20">Reject</motion.button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Deals Table */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Active Deals</h3>
          <Link to="/admin/deals" className="text-xs text-primary hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Gig</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Business</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Discount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Actions</th>
            </tr></thead>
            <tbody>
              {mockAdminDeals.filter(d => d.status !== 'expired').slice(0, 4).map((d, i) => (
                <tr key={d.id} className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors ${d.status === 'expiring_soon' ? 'bg-amber-500/5' : i % 2 ? 'bg-[var(--color-surface)]/30' : ''}`}>
                  <td className="px-4 py-3 text-[var(--color-text)] truncate max-w-[180px]">{d.gigTitle}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{d.business}</td>
                  <td className="px-4 py-3"><span className="discount-badge">−{d.discountPercent}%</span></td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] text-xs">{d.expiry}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} size="xs" /></td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-primary/10 text-primary"><EyeIcon className="w-4 h-4" /></button>
                    <button className="p-1 rounded hover:bg-error/10 text-error"><TrashIcon className="w-4 h-4" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} onConfirm={() => setConfirmAction(null)} title={confirmAction?.type === 'ban' ? 'Ban User' : 'Delete Item'} message={`Are you sure you want to ${confirmAction?.type} "${confirmAction?.name}"?`} confirmText={confirmAction?.type === 'ban' ? 'Ban' : 'Delete'} variant="danger" />
    </div>
  );
};

export default AdminDashboard;
