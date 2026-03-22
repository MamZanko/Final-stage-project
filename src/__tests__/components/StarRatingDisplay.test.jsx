import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StarRatingDisplay from '../../components/ui/StarRatingDisplay';

describe('StarRatingDisplay', () => {
  it('renders rating number by default', () => {
    render(<StarRatingDisplay rating={4.5} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('hides rating number when showNumber is false', () => {
    render(<StarRatingDisplay rating={3.0} showNumber={false} />);
    expect(screen.queryByText('3.0')).not.toBeInTheDocument();
  });

  it('renders review count when provided', () => {
    render(<StarRatingDisplay rating={4.0} reviewCount={42} />);
    expect(screen.getByText('(42)')).toBeInTheDocument();
  });

  it('does not render review count when null', () => {
    render(<StarRatingDisplay rating={4.0} />);
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('renders 5 star elements', () => {
    const { container } = render(<StarRatingDisplay rating={3.0} />);
    const stars = container.querySelectorAll('svg');
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it('formats rating to one decimal place', () => {
    render(<StarRatingDisplay rating={4.0} />);
    expect(screen.getByText('4.0')).toBeInTheDocument();
  });
});
