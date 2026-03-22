/* ============================================
   Framer Motion Variants — KarBazar Animation System
   Section 8: Animation & Motion Design System
   ============================================ */

// Check for reduced motion preference
export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Helper to disable animations if reduced motion is preferred
const rm = (variants) => {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.01 } },
      exit: { opacity: 0, transition: { duration: 0.01 } },
    };
  }
  return variants;
};

// ---- Page Transitions (Section 8.2) ----
export const pageTransition = rm({
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
  },
});

// ---- Modal (Section 8.2) ----
export const modalOverlay = rm({
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
});

export const modalContent = rm({
  initial: { opacity: 0, scale: 0.93, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 5,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
});

// ---- Dropdown (Section 8.2) ----
export const dropdown = rm({
  initial: { opacity: 0, scale: 0.98, y: -4 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -4,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
});

// ---- Card animations (Section 8.3) ----
export const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: {
    y: -8,
    boxShadow: '0 25px 50px -8px rgb(0 0 0 / 0.12), 0 10px 20px -4px rgb(0 0 0 / 0.08)',
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  tap: {
    y: -2,
    scale: 0.99,
    transition: { duration: 0.15 },
  },
};

// ---- Fade in on scroll (Section 8.3) ----
export const fadeInUp = rm({
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
});

// ---- Stagger container ----
export const staggerContainer = (staggerDelay = 0.05) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

// ---- Stagger child item ----
export const staggerItem = rm({
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
});

// ---- Slide from left (pills, sidebar) ----
export const slideFromLeft = rm({
  initial: { opacity: 0, x: -24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
});

// ---- Slide from right (toasts, drawer) ----
export const slideFromRight = rm({
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
});

// ---- Mobile drawer (Section 8.6) ----
export const mobileDrawer = rm({
  initial: { x: '-100%' },
  animate: {
    x: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    x: '-100%',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
});

// ---- Button animations (Section 8.4) ----
export const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.96, transition: { duration: 0.1 } },
};

export const buttonSuccess = rm({
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
      duration: 0.3,
    },
  },
});

// ---- Toast notification (Section 8.2) ----
export const toastVariants = rm({
  initial: { opacity: 0, x: 50, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
});

// ---- Hero word stagger (Section 8.7) ----
export const heroWordStagger = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  },
  word: rm({
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  }),
};

// ---- Tab content switch (Section 8.8) ----
export const tabContent = rm({
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
});

// ---- Scale in (general use) ----
export const scaleIn = rm({
  initial: { opacity: 0, scale: 0.93 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
});

// ---- Breadcrumb fade in ----
export const breadcrumbItem = rm({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
});

// ---- Notification badge pulse ----
export const badgePulse = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

// ---- Counter number flip ----
export const numberFlip = rm({
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
});
