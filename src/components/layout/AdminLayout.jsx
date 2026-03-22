import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarSquareIcon, UsersIcon, DocumentTextIcon, RectangleGroupIcon,
  ShoppingBagIcon, StarIcon, TagIcon, NewspaperIcon, ChartBarIcon,
  ArrowPathIcon, SparklesIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon,
  Bars3Icon, XMarkIcon, SunIcon, MoonIcon, BellIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { mockAdminUser, mockDashboardStats } from '../../data/mockDataAdmin';
import { mobileDrawer, modalOverlay, pageTransition } from '../../lib/animations';

const navLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: ChartBarSquareIcon },
  { path: '/admin/users', label: 'User Management', icon: UsersIcon },
  { path: '/admin/gigs', label: 'Gig Management', icon: DocumentTextIcon },
  { path: '/admin/categories', label: 'Category Management', icon: RectangleGroupIcon },
  { path: '/admin/orders', label: 'Order Management', icon: ShoppingBagIcon },
  { path: '/admin/reviews', label: 'Reviews Management', icon: StarIcon },
  { path: '/admin/deals', label: 'Deals & Discounts', icon: TagIcon },
  { path: '/admin/news', label: 'News Management', icon: NewspaperIcon },
  { path: '/admin/analytics', label: 'Reports & Analytics', icon: ChartBarIcon },
  { path: '/admin/role-requests', label: 'Role Change Requests', icon: ArrowPathIcon, badge: mockDashboardStats.pendingRoleRequests },
  { path: '/admin/sponsorships', label: 'Sponsorship Mgmt', icon: SparklesIcon },
  { path: '/admin/settings', label: 'Platform Settings', icon: Cog6ToothIcon },
];

// Page title map
const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/gigs': 'Gig Management',
  '/admin/categories': 'Category Management',
  '/admin/orders': 'Order Management',
  '/admin/reviews': 'Reviews Management',
  '/admin/deals': 'Deals & Discounts',
  '/admin/news': 'News Management',
  '/admin/analytics': 'Reports & Analytics',
  '/admin/role-requests': 'Role Change Requests',
  '/admin/sponsorships': 'Sponsorship Management',
  '/admin/settings': 'Platform Settings',
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || (currentPath.includes('/admin/orders/') ? 'Order Details' : currentPath.includes('/admin/news/') ? 'News Editor' : 'Admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">K</span>
        </div>
        <div>
          <h1 className="text-white font-heading font-bold text-base leading-tight">KarBazar</h1>
          <p className="text-blue-300 text-[10px]">Admin Panel</p>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-white/60 hover:text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-thin">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.path || (link.path !== '/admin/dashboard' && currentPath.startsWith(link.path));
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => mobile && setSidebarOpen(false)}
              className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-blue-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-light' : ''}`} />
              <span className="truncate">{link.label}</span>
              {link.badge > 0 && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-secondary text-white animate-pulse-slow">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 px-3 py-3">
        <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-error/20 hover:text-error transition-colors duration-150">
          <ArrowRightOnRectangleIcon className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] fixed top-0 left-0 bottom-0 bg-[#0F172A] dark:bg-[#0B1120] z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div {...modalOverlay} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside {...mobileDrawer} className="fixed top-0 left-0 bottom-0 w-[260px] bg-[#0F172A] z-50 lg:hidden">
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-[var(--color-card-bg)] border-b border-[var(--color-border)] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
              <Bars3Icon className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-heading font-bold text-[var(--color-text)]">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors">
              <AnimatePresence mode="wait">
                <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Notification bell */}
            <button className="relative p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-[var(--color-border)] mx-1" />

            {/* Admin Info */}
            <div className="hidden sm:flex items-center gap-2">
              <img src={mockAdminUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-xs font-medium text-[var(--color-text)] leading-tight">{mockAdminUser.name}</p>
                <p className="text-[10px] text-[var(--color-text-secondary)]">Administrator</p>
              </div>
            </div>

            {/* Logout icon (mobile) */}
            <button onClick={handleLogout} className="sm:hidden p-2 rounded-lg hover:bg-error/10 text-[var(--color-text-secondary)] hover:text-error transition-colors">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentPath} {...pageTransition}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
