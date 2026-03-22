import { memo, useMemo, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

const HIDE_FOOTER_PATHS = ['/messages', '/business/messages'];

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const MainLayout = memo(() => {
  const location = useLocation();
  const hideFooter = useMemo(() => HIDE_FOOTER_PATHS.includes(location.pathname), [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    if (!hideFooter) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, hideFooter]);

  return (
    <div className={`flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200 ${hideFooter ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Header />
      {!hideFooter && <Breadcrumbs />}
      <main className={`flex-1 flex flex-col ${hideFooter ? 'overflow-hidden' : ''}`}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className={`flex-1 flex flex-col ${hideFooter ? 'overflow-hidden' : ''}`}
        >
          <Outlet />
        </motion.div>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
