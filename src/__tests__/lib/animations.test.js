import { describe, it, expect } from 'vitest';
import {
  pageTransition,
  modalOverlay,
  modalContent,
  dropdown,
  cardHover,
  fadeInUp,
  staggerContainer,
  staggerItem,
} from '../../lib/animations';

describe('Animation Variants', () => {
  it('pageTransition has initial, animate, and exit', () => {
    expect(pageTransition).toHaveProperty('initial');
    expect(pageTransition).toHaveProperty('animate');
    expect(pageTransition).toHaveProperty('exit');
  });

  it('pageTransition starts with opacity 0', () => {
    expect(pageTransition.initial.opacity).toBe(0);
  });

  it('pageTransition animates to opacity 1', () => {
    expect(pageTransition.animate.opacity).toBe(1);
  });

  it('modalOverlay has initial, animate, and exit', () => {
    expect(modalOverlay).toHaveProperty('initial');
    expect(modalOverlay).toHaveProperty('animate');
    expect(modalOverlay).toHaveProperty('exit');
  });

  it('modalContent starts invisible', () => {
    expect(modalContent.initial.opacity).toBe(0);
  });

  it('dropdown has all animation states', () => {
    expect(dropdown).toHaveProperty('initial');
    expect(dropdown).toHaveProperty('animate');
    expect(dropdown).toHaveProperty('exit');
  });

  it('cardHover has rest, hover, and tap states', () => {
    expect(cardHover).toHaveProperty('rest');
    expect(cardHover).toHaveProperty('hover');
    expect(cardHover).toHaveProperty('tap');
  });

  it('cardHover hover moves card up (negative y)', () => {
    expect(cardHover.hover.y).toBeLessThan(0);
  });

  it('fadeInUp starts with y offset', () => {
    expect(fadeInUp.initial.y).toBeGreaterThan(0);
    expect(fadeInUp.initial.opacity).toBe(0);
  });

  it('staggerContainer is a function that returns animation config', () => {
    expect(staggerContainer).toBeDefined();
    expect(typeof staggerContainer).toBe('function');
    const result = staggerContainer();
    expect(result).toHaveProperty('initial');
    expect(result).toHaveProperty('animate');
  });

  it('staggerItem has initial and animate', () => {
    expect(staggerItem).toHaveProperty('initial');
    expect(staggerItem).toHaveProperty('animate');
  });
});
