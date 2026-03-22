import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// ── Loading fallback ───────────────────────────────────
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const Lazy = (importFn) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
};

/** Lazy-load with auth + optional role guard */
const Protected = (importFn, roles) => {
  const Component = lazy(importFn);
  return (
    <ProtectedRoute roles={roles}>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ProtectedRoute>
  );
};

// AdminLayout is lazy-loaded (separate from MainLayout which is always needed)
const AdminLayout = lazy(() => import('../components/layout/AdminLayout'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // ===== Public Pages =====
      { index: true, element: Lazy(() => import('../pages/public/HomePage')) },
      { path: 'browse-gigs', element: Lazy(() => import('../pages/public/BrowseGigs')) },
      { path: 'deals', element: Lazy(() => import('../pages/public/DealsPage')) },
      { path: 'find-businesses', element: Lazy(() => import('../pages/public/FindBusinesses')) },
      { path: 'about', element: Lazy(() => import('../pages/public/AboutUs')) },
      { path: 'contact', element: Lazy(() => import('../pages/public/Contact')) },
      { path: 'faq', element: Lazy(() => import('../pages/public/FAQ')) },
      { path: 'how-it-works', element: Lazy(() => import('../pages/public/HowItWorks')) },
      { path: 'gigs/:id', element: Lazy(() => import('../pages/public/GigDetails')) },
      { path: 'terms', element: Lazy(() => import('../pages/public/TermsOfService')) },
      { path: 'privacy', element: Lazy(() => import('../pages/public/PrivacyPolicy')) },

      // ===== Auth Pages =====
      { path: 'login', element: Lazy(() => import('../pages/public/Login')) },
      { path: 'signup', element: Lazy(() => import('../pages/public/SignUp')) },
      { path: 'register', element: Lazy(() => import('../pages/public/SignUp')) },
      { path: 'forgot-password', element: Lazy(() => import('../pages/public/ForgotPassword')) },
      { path: 'reset-password', element: Lazy(() => import('../pages/public/ForgotPassword')) },

      // ===== Client Pages (require authentication) =====
      { path: 'profile/:username', element: Lazy(() => import('../pages/client/ClientProfile')) },
      { path: 'orders', element: Protected(() => import('../pages/client/ClientOrders'), ['client', 'business', 'admin']) },
      { path: 'orders/:id', element: Protected(() => import('../pages/client/ClientOrderDetails'), ['client', 'business', 'admin']) },
      { path: 'messages', element: Protected(() => import('../pages/client/ClientMessages'), ['client', 'business', 'admin']) },
      { path: 'reviews', element: Protected(() => import('../pages/client/ClientReviews'), ['client', 'business', 'admin']) },
      { path: 'settings', element: Protected(() => import('../pages/client/ClientSettings'), ['client', 'business', 'admin']) },
      { path: 'favorites', element: Protected(() => import('../pages/client/ClientFavorites'), ['client', 'business', 'admin']) },

      // ===== Business Pages (require business or admin role) =====
      { path: 'business/:username', element: Lazy(() => import('../pages/business/BusinessProfile')) },
      { path: 'my-gigs', element: Protected(() => import('../pages/business/MyGigs'), ['business', 'admin']) },
      { path: 'gigs/create', element: Protected(() => import('../pages/business/CreateGig'), ['business', 'admin']) },
      { path: 'gigs/:id/edit', element: Protected(() => import('../pages/business/EditGig'), ['business', 'admin']) },
      { path: 'business/orders', element: Protected(() => import('../pages/business/BusinessOrders'), ['business', 'admin']) },
      { path: 'business/orders/:id', element: Protected(() => import('../pages/business/BusinessOrderDetails'), ['business', 'admin']) },
      { path: 'business/messages', element: Protected(() => import('../pages/business/BusinessMessages'), ['business', 'admin']) },
      { path: 'business/reviews', element: Protected(() => import('../pages/business/BusinessReviews'), ['business', 'admin']) },
      { path: 'business/settings', element: Protected(() => import('../pages/business/BusinessSettings'), ['business', 'admin']) },
      { path: 'business/portfolio', element: Protected(() => import('../pages/business/Portfolio'), ['business', 'admin']) },

      // ===== 404 =====
      { path: '*', element: Lazy(() => import('../pages/public/NotFound')) },
    ],
  },
  // ===== Admin — Separate Layout (no main header/footer) =====
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <Suspense fallback={<PageLoader />}>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: Lazy(() => import('../pages/admin/AdminDashboard')) },
      { path: 'users', element: Lazy(() => import('../pages/admin/UserManagement')) },
      { path: 'gigs', element: Lazy(() => import('../pages/admin/GigManagement')) },
      { path: 'categories', element: Lazy(() => import('../pages/admin/CategoryManagement')) },
      { path: 'orders', element: Lazy(() => import('../pages/admin/OrderManagement')) },
      { path: 'orders/:id', element: Lazy(() => import('../pages/admin/AdminOrderDetails')) },
      { path: 'reviews', element: Lazy(() => import('../pages/admin/ReviewsManagement')) },
      { path: 'deals', element: Lazy(() => import('../pages/admin/DealsManagement')) },
      { path: 'news', element: Lazy(() => import('../pages/admin/NewsManagement')) },
      { path: 'news/create', element: Lazy(() => import('../pages/admin/NewsEditor')) },
      { path: 'news/:id/edit', element: Lazy(() => import('../pages/admin/NewsEditor')) },
      { path: 'analytics', element: Lazy(() => import('../pages/admin/Analytics')) },
      { path: 'role-requests', element: Lazy(() => import('../pages/admin/RoleRequests')) },
      { path: 'sponsorships', element: Lazy(() => import('../pages/admin/SponsorshipManagement')) },
      { path: 'settings', element: Lazy(() => import('../pages/admin/PlatformSettings')) },
    ],
  },
]);

export { router };
export default router;
