import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter, createMockReview } from '../helpers';
import ReviewCard from '../../components/ui/ReviewCard';

describe('ReviewCard', () => {
  it('renders review comment', () => {
    const review = createMockReview({ comment: 'Excellent work!' });
    renderWithRouter(<ReviewCard review={review} />);
    expect(screen.getByText('Excellent work!')).toBeInTheDocument();
  });

  it('renders reviewer name', () => {
    const review = createMockReview({
      reviewer: { id: 1, name: 'Jane Smith', username: 'janesmith', avatar_url: null },
    });
    renderWithRouter(<ReviewCard review={review} />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows verified buyer badge when isVerifiedBuyer is true', () => {
    const review = createMockReview({ isVerifiedBuyer: true });
    const { container } = renderWithRouter(<ReviewCard review={review} />);
    // Verified buyer reviews have a top gold border
    const card = container.querySelector('.border-t-gold');
    expect(card).toBeInTheDocument();
  });

  it('does not show gold border when not verified buyer', () => {
    const review = createMockReview({ isVerifiedBuyer: false });
    const { container } = renderWithRouter(<ReviewCard review={review} />);
    const card = container.querySelector('.border-t-gold');
    expect(card).not.toBeInTheDocument();
  });

  it('shows gig info when showGigInfo is true and gig data exists', () => {
    const review = createMockReview({
      gig: { id: 1, title: 'Logo Design Service', image: 'https://example.com/img.jpg' },
    });
    renderWithRouter(<ReviewCard review={review} showGigInfo />);
    expect(screen.getByText('Logo Design Service')).toBeInTheDocument();
  });

  it('does not show gig info when showGigInfo is false', () => {
    const review = createMockReview({
      gig: { id: 1, title: 'Logo Design Service', image: 'https://example.com/img.jpg' },
    });
    renderWithRouter(<ReviewCard review={review} showGigInfo={false} />);
    expect(screen.queryByText('Logo Design Service')).not.toBeInTheDocument();
  });
});
