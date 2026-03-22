import '@testing-library/jest-dom';

// Global framer-motion mock for all tests — avoids animation complexity
function filterMotionProps(props) {
  const {
    initial, animate, exit, transition, whileHover, whileTap, whileFocus,
    whileInView, whileDrag, variants, layout, layoutId, onAnimationComplete,
    onAnimationStart, drag, dragConstraints, dragElastic, dragMomentum,
    ...rest
  } = props;
  return rest;
}

vi.mock('framer-motion', async () => {
  const React = await vi.importActual('react');
  const tags = [
    'div', 'span', 'p', 'a', 'ul', 'ol', 'li', 'button', 'form', 'input',
    'textarea', 'select', 'label', 'img', 'svg', 'path', 'section', 'article',
    'header', 'footer', 'nav', 'main', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  ];
  const motion = {};
  tags.forEach(function(tag) {
    motion[tag] = function MotionProxy(props) {
      var children = props.children;
      var filtered = filterMotionProps(props);
      return React.createElement(tag, filtered, children);
    };
  });
  return {
    motion: motion,
    AnimatePresence: function AnimatePresence(props) { return props.children; },
    useAnimation: function() { return { start: vi.fn(), stop: vi.fn(), set: vi.fn() }; },
    useMotionValue: function(val) { return { get: function() { return val; }, set: vi.fn(), on: vi.fn() }; },
    useTransform: function(val) { return val; },
    useInView: function() { return true; },
    useScroll: function() { return { scrollY: { get: function() { return 0; }, on: vi.fn() }, scrollYProgress: { get: function() { return 0; }, on: vi.fn() } }; },
    useSpring: function(val) { return val; },
    useCycle: function() { return [arguments[0], vi.fn()]; },
    useReducedMotion: function() { return false; },
  };
});

// Mock IntersectionObserver (used by react-intersection-observer)
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = [];
  }
  observe(el) { this.elements.push(el); }
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver;

// Mock matchMedia (used by theme store)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = MockResizeObserver;

// Suppress console.error for act() warnings in tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('act(') || args[0].includes('ReactDOMTestUtils.act'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
