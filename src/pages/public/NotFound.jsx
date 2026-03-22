import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition, buttonVariants } from '../../lib/animations';
import useSEO from '../../lib/useSEO';

const NotFound = () => {
  useSEO({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist or has been moved.',
    noindex: true,
  });

  return (
    <motion.div
      {...pageTransition}
      className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-6 py-16"
    >
      {/* Large 404 */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="text-[120px] sm:text-[160px] font-heading font-extrabold text-primary leading-none select-none"
      >
        404
      </motion.h1>

      {/* Animated SVG Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-72 h-48 my-6"
      >
        <svg viewBox="0 0 400 250" fill="none" className="w-full h-full">
          {/* Ground */}
          <motion.path
            d="M50 200 Q200 180 350 200"
            stroke="var(--color-border)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Lost person */}
          <motion.g
            animate={{ x: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            {/* Body */}
            <circle cx="200" cy="110" r="20" fill="var(--color-primary)" fillOpacity="0.2" stroke="var(--color-primary)" strokeWidth="2" />
            {/* Eyes */}
            <circle cx="193" cy="108" r="2.5" fill="var(--color-primary)" />
            <circle cx="207" cy="108" r="2.5" fill="var(--color-primary)" />
            {/* Confused mouth */}
            <path d="M193 118 Q200 122 207 116" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Body */}
            <line x1="200" y1="130" x2="200" y2="170" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
            {/* Arms */}
            <path d="M200 145 L175 155" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M200 145 L225 135" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
            {/* Question marks above */}
            <motion.text
              x="215"
              y="85"
              fill="var(--color-secondary)"
              fontSize="18"
              fontWeight="bold"
              animate={{ y: [85, 80, 85], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ?
            </motion.text>
            <motion.text
              x="230"
              y="75"
              fill="var(--color-primary)"
              fontSize="14"
              fontWeight="bold"
              animate={{ y: [75, 70, 75], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            >
              ?
            </motion.text>
            {/* Legs */}
            <line x1="200" y1="170" x2="185" y2="195" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
            <line x1="200" y1="170" x2="215" y2="195" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
          </motion.g>

          {/* Map / sign post */}
          <rect x="300" y="140" width="4" height="60" fill="var(--color-border)" rx="2" />
          <motion.rect
            x="280"
            y="130"
            width="44"
            height="24"
            rx="4"
            fill="var(--color-secondary)"
            fillOpacity="0.2"
            stroke="var(--color-secondary)"
            strokeWidth="1.5"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
          <text x="290" y="147" fill="var(--color-secondary)" fontSize="10" fontWeight="600">404</text>

          {/* Bushes */}
          <circle cx="80" cy="195" r="15" fill="var(--color-success)" fillOpacity="0.15" />
          <circle cx="95" cy="190" r="12" fill="var(--color-success)" fillOpacity="0.2" />
          <circle cx="330" cy="192" r="10" fill="var(--color-success)" fillOpacity="0.15" />
          <circle cx="340" cy="188" r="8" fill="var(--color-success)" fillOpacity="0.2" />
        </svg>
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-text)] text-center mb-3"
      >
        Page Not Found
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-[var(--color-text-secondary)] text-center max-w-md mb-8"
      >
        Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-semibold font-button hover:bg-primary-dark transition-colors duration-200 text-center"
          >
            Go Home
          </Link>
        </motion.div>
        <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
          <Link
            to="/browse-gigs"
            className="inline-block px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold font-button hover:bg-primary hover:text-white transition-colors duration-200 text-center"
          >
            Browse Gigs
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
