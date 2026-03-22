import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, createMockGig } from '../helpers';
import GigCard from '../../components/ui/GigCard';

describe('GigCard', () => {
  it('renders gig title', () => {
    const gig = createMockGig({ title: 'My Amazing Gig' });
    renderWithRouter(<GigCard gig={gig} />);
    expect(screen.getByText('My Amazing Gig')).toBeInTheDocument();
  });

  it('renders gig image with alt text', () => {
    const gig = createMockGig({ title: 'Logo Design' });
    renderWithRouter(<GigCard gig={gig} />);
    const img = screen.getByAltText('Logo Design');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });

  it('renders starting price', () => {
    const gig = createMockGig({ startingPrice: 75 });
    renderWithRouter(<GigCard gig={gig} />);
    expect(screen.getByText(/75/)).toBeInTheDocument();
  });

  it('renders trending badge when gig is trending', () => {
    const gig = createMockGig({ isTrending: true });
    renderWithRouter(<GigCard gig={gig} />);
    expect(screen.getByText(/Trending/)).toBeInTheDocument();
  });

  it('renders sponsored badge when gig is sponsored', () => {
    const gig = createMockGig({ isSponsored: true });
    renderWithRouter(<GigCard gig={gig} />);
    expect(screen.getByText(/SPONSORED/)).toBeInTheDocument();
  });

  it('does not render trending badge when not trending', () => {
    const gig = createMockGig({ isTrending: false });
    renderWithRouter(<GigCard gig={gig} />);
    expect(screen.queryByText(/Trending/)).not.toBeInTheDocument();
  });

  it('renders discount badge when discount is active', () => {
    const gig = createMockGig({
      discount: {
        isActive: true,
        percent: 25,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      },
    });
    renderWithRouter(<GigCard gig={gig} />);
    expect(screen.getByText(/25% OFF/)).toBeInTheDocument();
  });

  it('does not render discount badge when showDiscount is false', () => {
    const gig = createMockGig({
      discount: { isActive: true, percent: 30, expiresAt: new Date(Date.now() + 86400000).toISOString() },
    });
    renderWithRouter(<GigCard gig={gig} showDiscount={false} />);
    expect(screen.queryByText(/30% OFF/)).not.toBeInTheDocument();
  });

  it('has a favorite button with correct aria-label', () => {
    const gig = createMockGig();
    renderWithRouter(<GigCard gig={gig} />);
    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument();
  });

  it('toggles favorite state on click', async () => {
    const user = userEvent.setup();
    const gig = createMockGig();
    renderWithRouter(<GigCard gig={gig} />);

    const favBtn = screen.getByLabelText('Add to favorites');
    await user.click(favBtn);
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Remove from favorites'));
    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument();
  });

  it('renders a link to the gig detail page', () => {
    const gig = createMockGig({ id: 42 });
    renderWithRouter(<GigCard gig={gig} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/gigs/42');
  });
});
