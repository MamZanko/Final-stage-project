import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressTimeline from '../../components/ui/ProgressTimeline';

describe('ProgressTimeline', () => {
  it('renders all 4 step labels', () => {
    render(<ProgressTimeline status="placed" />);
    expect(screen.getByText('Placed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders correctly for in_progress status', () => {
    const { container } = render(<ProgressTimeline status="in_progress" />);
    expect(container).toBeInTheDocument();
  });

  it('renders correctly for delivered status', () => {
    const { container } = render(<ProgressTimeline status="delivered" />);
    expect(container).toBeInTheDocument();
  });

  it('renders correctly for completed status', () => {
    const { container } = render(<ProgressTimeline status="completed" />);
    expect(container).toBeInTheDocument();
  });

  it('renders correctly for cancelled status', () => {
    const { container } = render(<ProgressTimeline status="cancelled" />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Placed')).toBeInTheDocument();
  });

  it('handles pending status', () => {
    const { container } = render(<ProgressTimeline status="pending" />);
    expect(container).toBeInTheDocument();
  });
});
