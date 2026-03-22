import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon, DocumentTextIcon, ShoppingBagIcon, TagIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ArrowDownTrayIcon, ChartBarIcon
} from '@heroicons/react/24/outline';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { mockAnalyticsData } from '../../data/mockDataAdmin';
import StatCard from '../../components/admin/StatCard';
import AdminChartCard from '../../components/admin/AdminChartCard';
import { fadeInUp, buttonVariants, staggerContainer, staggerItem } from '../../lib/animations';

const CHART_COLORS = ['#2563EB', '#F97316', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B'];
const datePresets = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const data = mockAnalyticsData;

  const trendIcon = (trend) => trend > 0
    ? <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-success" />
    : <ArrowTrendingDownIcon className="w-3.5 h-3.5 text-error" />;

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-4 flex flex-wrap items-center gap-3">
        {datePresets.map(preset => (
          <button key={preset.value} onClick={() => setDateRange(preset.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dateRange === preset.value ? 'bg-primary text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}>{preset.label}</button>
        ))}
        <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
        <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setDateRange(''); }} className="px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)]" />
        <span className="text-xs text-[var(--color-text-muted)]">to</span>
        <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setDateRange(''); }} className="px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)]" />

        <div className="ml-auto flex gap-2">
          <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-primary hover:border-primary"><ArrowDownTrayIcon className="w-3.5 h-3.5" /> PDF</motion.button>
          <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] hover:text-primary hover:border-primary"><ArrowDownTrayIcon className="w-3.5 h-3.5" /> CSV</motion.button>
        </div>
      </div>

      {/* Stat Cards with Trends */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={UsersIcon} label="Total Users" value={data.summary.totalUsers} trend={data.summary.usersTrend} color="primary" />
        <StatCard icon={UsersIcon} label="New Users" value={data.summary.newUsers} trend={data.summary.newUsersTrend} color="primary" />
        <StatCard icon={DocumentTextIcon} label="Total Gigs" value={data.summary.totalGigs} trend={data.summary.gigsTrend} color="purple" />
        <StatCard icon={ShoppingBagIcon} label="Total Orders" value={data.summary.totalOrders} trend={data.summary.ordersTrend} color="success" />
        <StatCard icon={TagIcon} label="Active Deals" value={data.summary.activeDeals} trend={data.summary.dealsTrend} color="secondary" />
        <StatCard icon={ChartBarIcon} label="Revenue" value={`$${(data.summary.revenue / 1000).toFixed(0)}K`} trend={data.summary.revenueTrend} color="success" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Growth Line */}
        <AdminChartCard title="User Growth" subtitle="Clients vs Businesses over 12 months">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="clients" stroke="#2563EB" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="businesses" stroke="#F97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </AdminChartCard>

        {/* Gigs by Category Pie */}
        <AdminChartCard title="Gigs by Category" subtitle="Distribution across top categories">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.gigsByCategory} cx="50%" cy="50%" outerRadius={90} innerRadius={35} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 10 }}>
                {data.gigsByCategory.map((entry, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>

        {/* Orders by Status Donut */}
        <AdminChartCard title="Orders by Status" subtitle="Current status distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.ordersByStatus} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 10 }}>
                {data.ordersByStatus.map((entry, i) => <Cell key={i} fill={entry.fill || CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>

        {/* Deals Usage Bar */}
        <AdminChartCard title="Deals Usage" subtitle="Redemptions per category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.dealsUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="redemptions" name="Redemptions" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>

        {/* Weekly Orders Area */}
        <AdminChartCard title="Weekly Orders" subtitle="Last 30 days trend">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.weeklyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="orders" stroke="#10B981" fill="#10B98120" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </AdminChartCard>

        {/* Top Businesses Horizontal Bar */}
        <AdminChartCard title="Top Businesses" subtitle="By total revenue">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart layout="vertical" data={data.topBusinesses}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} width={100} />
              <Tooltip contentStyle={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} formatter={(val) => `$${val.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </div>

      {/* Top Businesses Table */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-sm font-heading font-semibold text-[var(--color-text)]">Top Businesses Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Business</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Revenue</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Orders</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Gigs</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)]">Rating</th>
            </tr></thead>
            <tbody>
              {data.topBusinesses.map((biz, i) => {
                const rankColors = ['text-amber-400', 'text-gray-400', 'text-orange-600'];
                const rankBgs = ['bg-amber-400/10', 'bg-gray-400/10', 'bg-orange-600/10'];
                return (
                  <motion.tr key={biz.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${i < 3 ? `${rankBgs[i]} ${rankColors[i]}` : 'text-[var(--color-text-secondary)]'}`}>
                        {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--color-text)]">{biz.name}</td>
                    <td className="px-4 py-3 font-semibold text-success">${biz.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{biz.orders}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{biz.gigs}</td>
                    <td className="px-4 py-3"><span className="flex items-center gap-1 text-amber-400">⭐ {biz.rating}</span></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
