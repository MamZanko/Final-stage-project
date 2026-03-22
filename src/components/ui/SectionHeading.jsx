import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const SectionHeading = ({
  title,
  emoji = '',
  subtitle = '',
  linkText = '',
  linkTo = '',
  className = '',
  align = 'left',
}) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8 ${className}`}
    >
      <div className={align === 'center' ? 'text-center w-full' : ''}>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-text)]">
          {emoji && <span className="mr-2">{emoji}</span>}
          {title}
        </h2>
        {subtitle && (
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {linkText && linkTo && (
        <Link
          to={linkTo}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap flex items-center gap-1 group"
        >
          {linkText}
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      )}
    </motion.div>
  );
};

export default SectionHeading;
