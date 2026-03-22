import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonthlyGigCounter from '../../components/ui/MonthlyGigCounter';

describe('MonthlyGigCounter', () => {
  it('renders used and limit count', () => {
    render(<MonthlyGigCounter used={2} limit={4} />);
    expect(screen.getByText(/2 of 4/)).toBeInTheDocument();
  });

  it('renders default values when no props', () => {
    render(<MonthlyGigCounter />);
    expect(screen.getByText(/0 of 4/)).toBeInTheDocument();
  });

  it('shows LIMIT REACHED when at limit', () => {
    render(<MonthlyGigCounter used={4} limit={4} />);
    expect(screen.getByText('LIMIT REACHED')).toBeInTheDocument();
  });

  it('does not show LIMIT REACHED when under limit', () => {
    render(<MonthlyGigCounter used={2} limit={4} />);
    expect(screen.queryByText('LIMIT REACHED')).not.toBeInTheDocument();
  });

  it('shows next reset date when provided', () => {
    render(<MonthlyGigCounter used={1} limit={4} nextReset="2026-03-01T00:00:00Z" />);
    expect(screen.getByText(/Next reset:/)).toBeInTheDocument();
    expect(screen.getByText(/March 1/)).toBeInTheDocument();
  });

  it('shows "next month" when no reset date provided', () => {
    render(<MonthlyGigCounter used={1} limit={4} />);
    expect(screen.getByText(/next month/)).toBeInTheDocument();
  });

  it('renders gigs posted this month text', () => {
    render(<MonthlyGigCounter used={3} limit={4} />);
    expect(screen.getByText(/gigs posted this month/)).toBeInTheDocument();
  });

  it('shows LIMIT REACHED when over limit', () => {
    render(<MonthlyGigCounter used={5} limit={4} />);
    expect(screen.getByText('LIMIT REACHED')).toBeInTheDocument();
  });
});
