import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { mobileDrawer, dropdown } from '../../lib/animations';
import api from '../../services/api';

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch unread message count
  const fetchUnread = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/conversations/unread-count');
      setUnreadCount(res.data?.unread_count ?? 0);
    } catch { /* ignore */ }
  }, [isAuthenticated]);

  useEffect(() => { fetchUnread(); }, [fetchUnread]);

  // Poll unread count every 15s
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnread]);

  // Scroll listener for compact header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse-gigs', label: 'Browse Gigs' },
    { to: '/deals', label: 'Deals', badge: '🔖', hasDot: true },
    { to: '/find-businesses', label: 'Find Businesses' },
    { to: '/how-it-works', label: 'How It Works' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--color-border)] backdrop-blur-sm transition-all duration-200 ${
        scrolled
          ? 'bg-[var(--color-card-bg)]/95 shadow-md'
          : 'bg-[var(--color-card-bg)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-200 ${
            scrolled ? 'h-[60px]' : 'h-16 md:h-[72px]'
          }`}
        >
          {/* Logo — full reload so the page refreshes */}
          <a
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-heading font-bold text-primary-600"
            >
              Kar<span className="text-secondary-500">Bazar</span>
            </motion.span>
          </a>

          {/* Center - Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                  isActive(link.to)
                    ? 'text-primary-600 font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                <span className="flex items-center gap-1">
                  {link.label}
                  {link.badge && <span className="text-xs">{link.badge}</span>}
                  {link.hasDot && (
                    <span className="w-1.5 h-1.5 bg-secondary-500 rounded-full" />
                  )}
                </span>
                {/* Animated underline - slides in from left */}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 transition-transform duration-200 origin-left ${
                    isActive(link.to)
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {/* Theme Toggle - animated sun/moon */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </motion.div>
            </button>

            {isAuthenticated ? (
              <>
                {/* Messages */}
                <Link
                  to={user?.role === 'business' ? '/business/messages' : '/messages'}
                  className="relative p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                  aria-label="Messages"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span key={unreadCount} className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1 bg-error-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <Link
                  to={user?.role === 'business' ? '/business/messages' : '/messages'}
                  className="relative p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                  aria-label="Notifications"
                >
                  <BellIcon className="w-5 h-5" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setProfileDropdownOpen(!profileDropdownOpen)
                    }
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-semibold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform duration-200 ${
                        profileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        {...dropdown}
                        className="absolute right-0 top-full mt-2 w-64 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-[var(--color-border)]">
                          <p className="font-semibold text-sm text-[var(--color-text)]">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                            {user?.role === 'business'
                              ? '🏢 Business Account'
                              : user?.role === 'admin'
                              ? '🛡️ Admin'
                              : '👤 Client'}
                          </p>
                        </div>

                        {/* Menu items with stagger */}
                        <div className="py-1">
                          {[
                            {
                              icon: UserCircleIcon,
                              label: 'View Profile',
                              to: `/profile/${user?.username || 'me'}`,
                            },
                            {
                              icon: Cog6ToothIcon,
                              label: 'Settings',
                              to: '/settings',
                            },
                            ...(user?.role === 'client'
                              ? [
                                  {
                                    icon: BuildingStorefrontIcon,
                                    label: 'Become a Business',
                                    to: '/settings?tab=business',
                                    highlight: true,
                                  },
                                ]
                              : []),
                          ].map((item, i) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                            >
                              <Link
                                to={item.to}
                                onClick={() =>
                                  setProfileDropdownOpen(false)
                                }
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                  item.highlight
                                    ? 'text-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-900/10'
                                    : 'text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                                }`}
                              >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>

                        {/* Theme toggle in dropdown */}
                        <div className="border-t border-[var(--color-border)] py-1">
                          <button
                            onClick={toggleTheme}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                          >
                            {theme === 'light' ? (
                              <MoonIcon className="w-4 h-4" />
                            ) : (
                              <SunIcon className="w-4 h-4" />
                            )}
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                          </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-[var(--color-border)] py-1">
                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-900/10 transition-colors"
                          >
                            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Logged out: Login + Sign Up */
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:text-primary-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary px-4 py-2 text-sm font-semibold rounded-lg"
                >
                  Sign Up Free
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar - Slide down */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[var(--color-border)]"
          >
            <div className="max-w-3xl mx-auto px-4 py-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, businesses, categories..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setSearchOpen(false);
                      navigate(`/browse-gigs?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery('');
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            {...mobileDrawer}
            className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-card-bg)] max-h-[calc(100vh-64px)] overflow-y-auto"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                    }`}
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-xs">{link.badge}</span>
                    )}
                    {link.hasDot && (
                      <span className="w-1.5 h-1.5 bg-secondary-500 rounded-full" />
                    )}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={`/profile/${user?.username || 'me'}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-semibold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          View Profile
                        </p>
                      </div>
                    </Link>
                    <Link
                      to={user?.role === 'business' ? '/business/messages' : '/messages'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      Messages
                      {unreadCount > 0 && (
                        <span key={unreadCount} className="ml-auto min-w-[22px] h-[22px] px-1.5 bg-error-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-900/10 transition-colors"
                    >
                      <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 text-sm font-medium text-[var(--color-text)] hover:text-primary-600 transition-colors rounded-lg border border-[var(--color-border)]"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center btn-primary px-4 py-3 text-sm font-semibold rounded-lg"
                    >
                      Sign Up Free
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
