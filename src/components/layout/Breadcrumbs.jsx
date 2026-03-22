import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { breadcrumbItem } from '../../lib/animations';

// Map route segments to readable names
const segmentLabels = {
  'browse-gigs': 'Browse Gigs',
  'find-businesses': 'Find Businesses',
  'how-it-works': 'How It Works',
  deals: 'Deals & Discounts',
  about: 'About Us',
  contact: 'Contact',
  faq: 'FAQ',
  login: 'Log In',
  signup: 'Sign Up',
  'forgot-password': 'Forgot Password',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  gigs: 'Gigs',
  profile: 'Profile',
  orders: 'Orders',
  messages: 'Messages',
  reviews: 'Reviews',
  settings: 'Settings',
  favorites: 'Favorites',
  business: 'Business',
  'my-gigs': 'My Gigs',
  create: 'Create',
  edit: 'Edit',
  portfolio: 'Portfolio',
  admin: 'Admin',
  dashboard: 'Dashboard',
  users: 'Users',
  categories: 'Categories',
  analytics: 'Analytics',
  news: 'News',
};

const Breadcrumbs = memo(() => {
  const location = useLocation();

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') return null;

  const pathSegments = location.pathname.split('/').filter(Boolean);

  const crumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;

    // Check if segment is a dynamic param (e.g., UUID or username)
    const isDynamic = segment.match(
      /^[0-9a-f]{8}-|^[0-9]+$|^[a-zA-Z0-9_-]{3,}$/
    );
    const label =
      segmentLabels[segment] ||
      (isDynamic && index > 0
        ? segmentLabels[pathSegments[index - 1]]
          ? 'Details'
          : segment
        : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '));

    return { path, label, isLast, segment };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
    >
      <ol className="flex items-center gap-1 text-sm flex-wrap">
        {/* Home crumb */}
        <motion.li {...breadcrumbItem} className="flex items-center">
          <Link
            to="/"
            className="text-[var(--color-text-secondary)] hover:text-primary-600 transition-colors flex items-center gap-1"
          >
            <HomeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </motion.li>

        {crumbs.map((crumb, i) => (
          <motion.li
            key={crumb.path}
            {...breadcrumbItem}
            transition={{ ...breadcrumbItem.animate?.transition, delay: (i + 1) * 0.05 }}
            className="flex items-center gap-1"
          >
            <ChevronRightIcon className="w-3 h-3 text-[var(--color-text-secondary)] flex-shrink-0" />
            {crumb.isLast ? (
              <span className="text-[var(--color-text)] font-medium truncate max-w-[200px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-[var(--color-text-secondary)] hover:text-primary-600 transition-colors truncate max-w-[200px]"
              >
                {crumb.label}
              </Link>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
