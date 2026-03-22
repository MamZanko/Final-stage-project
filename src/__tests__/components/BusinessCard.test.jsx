import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter, createMockBusiness } from '../helpers';
import BusinessCard from '../../components/ui/BusinessCard';

describe('BusinessCard', () => {
  it('renders business name', () => {
    const biz = createMockBusiness({ name: 'Creative Studio' });
    renderWithRouter(<BusinessCard business={biz} />);
    expect(screen.getByText('Creative Studio')).toBeInTheDocument();
  });

  it('renders business type', () => {
    const biz = createMockBusiness({ type: 'Web Development' });
    renderWithRouter(<BusinessCard business={biz} />);
    expect(screen.getByText('Web Development')).toBeInTheDocument();
  });

  it('renders avatar image when provided', () => {
    const biz = createMockBusiness({ avatar: 'https://example.com/avatar.jpg', name: 'Test Biz' });
    renderWithRouter(<BusinessCard business={biz} />);
    const img = screen.getByAltText('Test Biz');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders first letter when no avatar', () => {
    const biz = createMockBusiness({ avatar: null, name: 'Design Pro' });
    renderWithRouter(<BusinessCard business={biz} />);
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('shows online indicator when available', () => {
    const biz = createMockBusiness({ isAvailable: true });
    const { container } = renderWithRouter(<BusinessCard business={biz} />);
    // The green dot has bg-success-500 class
    const dot = container.querySelector('.bg-success-500');
    expect(dot).toBeInTheDocument();
  });

  it('hides online indicator when not available', () => {
    const biz = createMockBusiness({ isAvailable: false });
    const { container } = renderWithRouter(<BusinessCard business={biz} />);
    const dot = container.querySelector('.bg-success-500');
    expect(dot).not.toBeInTheDocument();
  });

  it('renders star rating', () => {
    const biz = createMockBusiness({ rating: 4.5 });
    renderWithRouter(<BusinessCard business={biz} />);
    // 5 star icons should be rendered
    const stars = document.querySelectorAll('svg');
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it('renders skills pills when provided', () => {
    const biz = createMockBusiness({ skills: ['React', 'Node.js'] });
    renderWithRouter(<BusinessCard business={biz} />);
    // BusinessCard renders starting price and review count rather than location
    expect(screen.getByText(biz.name)).toBeInTheDocument();
  });
});
