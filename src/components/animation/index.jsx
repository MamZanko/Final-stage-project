import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeInUp, staggerContainer, staggerItem, scaleIn, slideFromLeft, slideFromRight } from '../../lib/animations';

/**
 * AnimateOnScroll - Wraps children with scroll-triggered animation
 * Uses intersection observer to trigger when element enters viewport
 */
export const AnimateOnScroll = ({
  children,
  variant = 'fadeInUp',
  threshold = 0.1,
  triggerOnce = true,
  delay = 0,
  className = '',
  as = 'div',
  ...props
}) => {
  const [ref, inView] = useInView({ threshold, triggerOnce });
  const MotionComponent = motion[as] || motion.div;

  const variants = {
    fadeInUp,
    scaleIn,
    slideFromLeft,
    slideFromRight,
  };

  const selectedVariant = variants[variant] || fadeInUp;

  return (
    <MotionComponent
      ref={ref}
      initial={selectedVariant.initial}
      animate={inView ? selectedVariant.animate : selectedVariant.initial}
      transition={{
        ...selectedVariant.animate?.transition,
        delay,
      }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * StaggerContainer - Animates children in with stagger effect on scroll
 */
export const StaggerContainer = ({
  children,
  staggerDelay = 0.05,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  as = 'div',
  ...props
}) => {
  const [ref, inView] = useInView({ threshold, triggerOnce });
  const MotionComponent = motion[as] || motion.div;
  const containerVariants = staggerContainer(staggerDelay);

  return (
    <MotionComponent
      ref={ref}
      initial={containerVariants.initial}
      animate={inView ? containerVariants.animate : containerVariants.initial}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * StaggerItem - Child of StaggerContainer, animates with fade-up stagger
 */
export const StaggerItem = ({
  children,
  className = '',
  as = 'div',
  ...props
}) => {
  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      initial={staggerItem.initial}
      animate={staggerItem.animate}
      transition={staggerItem.animate?.transition}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * HoverScale - Adds scale-on-hover effect to any element
 */
export const HoverScale = ({
  children,
  scale = 1.02,
  className = '',
  as = 'div',
  ...props
}) => {
  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      whileHover={{ scale, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * FadeIn - Simple fade-in animation wrapper
 */
export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
  as = 'div',
  ...props
}) => {
  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * SlideIn - Slide in from a direction
 */
export const SlideIn = ({
  children,
  direction = 'left',
  distance = 30,
  delay = 0,
  duration = 0.4,
  className = '',
  as = 'div',
  ...props
}) => {
  const MotionComponent = motion[as] || motion.div;

  const directionMap = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: -distance },
    down: { x: 0, y: distance },
  };

  const offset = directionMap[direction] || directionMap.left;

  return (
    <MotionComponent
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * CountUpOnScroll - Animated number counter that triggers on scroll
 */
export { default as CountUpOnScroll } from './CountUpOnScroll';
