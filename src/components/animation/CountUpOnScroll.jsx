import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

/**
 * CountUpOnScroll - Animated counter that triggers when scrolled into view
 * Used for platform statistics section on homepage
 */
const CountUpOnScroll = ({
  end,
  start = 0,
  duration = 1.5,
  suffix = '',
  prefix = '',
  separator = ',',
  decimals = 0,
  className = '',
  triggerOnce = true,
}) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce });

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp
          start={start}
          end={end}
          duration={duration}
          suffix={suffix}
          prefix={prefix}
          separator={separator}
          decimals={decimals}
        />
      ) : (
        <span>
          {prefix}
          {start}
          {suffix}
        </span>
      )}
    </span>
  );
};

export default CountUpOnScroll;
