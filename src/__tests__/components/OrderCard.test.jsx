import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter, createMockOrder } from '../helpers';
import OrderCard from '../../components/ui/OrderCard';

describe('OrderCard', () => {
  it('renders order gig title', () => {
    const order = createMockOrder({ gig: { id: 1, title: 'Website Development', image: 'test.jpg' } });
    renderWithRouter(<OrderCard order={order} />);
    expect(screen.getByText('Website Development')).toBeInTheDocument();
  });

  it('renders gig image', () => {
    const order = createMockOrder({ gig: { id: 1, title: 'Test Gig', image: 'https://example.com/gig.jpg' } });
    renderWithRouter(<OrderCard order={order} />);
    const img = screen.getByAltText('Test Gig');
    expect(img).toBeInTheDocument();
  });

  it('shows pending status badge', () => {
    const order = createMockOrder({ status: 'pending' });
    renderWithRouter(<OrderCard order={order} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows in progress status badge', () => {
    const order = createMockOrder({ status: 'in_progress' });
    renderWithRouter(<OrderCard order={order} />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('shows completed status badge', () => {
    const order = createMockOrder({ status: 'completed' });
    renderWithRouter(<OrderCard order={order} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows cancelled status badge', () => {
    const order = createMockOrder({ status: 'cancelled' });
    renderWithRouter(<OrderCard order={order} />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('shows delivered status badge', () => {
    const order = createMockOrder({ status: 'delivered' });
    renderWithRouter(<OrderCard order={order} />);
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    const order = createMockOrder({ datePlaced: '2026-01-15T10:00:00.000Z' });
    renderWithRouter(<OrderCard order={order} />);
    // Jan 15, 2026
    expect(screen.getByText(/Jan 15, 2026/)).toBeInTheDocument();
  });

  it('renders price', () => {
    const order = createMockOrder({ package: { id: 1, name: 'Basic', price: 150 } });
    renderWithRouter(<OrderCard order={order} />);
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });
});
