import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/**
 * Render a component wrapped in MemoryRouter for components that use react-router hooks.
 */
export function renderWithRouter(ui, { route = '/', ...renderOptions } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>,
    renderOptions
  );
}

/**
 * Create a mock gig object for testing.
 */
export function createMockGig(overrides = {}) {
  return {
    id: 1,
    title: 'Professional Logo Design',
    image: 'https://example.com/gig.jpg',
    images: ['https://example.com/gig.jpg'],
    category: { id: 1, name: 'Design', slug: 'design' },
    business: {
      id: 1,
      name: 'Test Business',
      avatar: 'https://example.com/avatar.jpg',
      isTopRated: false,
    },
    user: {
      id: 1,
      name: 'Test Business',
      username: 'testbiz',
      avatar_url: 'https://example.com/avatar.jpg',
      top_rated: false,
    },
    rating: 4.5,
    reviewCount: 12,
    startingPrice: 50,
    packages: [
      { id: 1, name: 'Basic', price: 50, description: 'Basic logo', delivery_days: 3, revisions: 1 },
      { id: 2, name: 'Standard', price: 100, description: 'Standard logo', delivery_days: 5, revisions: 3 },
      { id: 3, name: 'Premium', price: 200, description: 'Premium logo', delivery_days: 7, revisions: -1 },
    ],
    status: 'active',
    isTrending: false,
    isSponsored: false,
    discount: null,
    ...overrides,
  };
}

/**
 * Create a mock user object for testing.
 */
export function createMockUser(overrides = {}) {
  return {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@karbazar.com',
    role: 'client',
    avatar: 'https://example.com/avatar.jpg',
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    location: 'Test City',
    ...overrides,
  };
}

/**
 * Create a mock order object for testing.
 */
export function createMockOrder(overrides = {}) {
  return {
    id: 1,
    orderNumber: '1001',
    status: 'placed',
    total_price: 50,
    gig: {
      id: 1,
      title: 'Professional Logo Design',
      image: 'https://example.com/gig.jpg',
    },
    package: { id: 1, name: 'Basic', price: 50 },
    client: { id: 2, name: 'Client User', username: 'clientuser' },
    business: { id: 1, name: 'Biz User', username: 'bizuser', avatar: 'https://example.com/biz-avatar.jpg' },
    datePlaced: '2026-01-15T10:00:00.000Z',
    created_at: '2026-01-15T10:00:00.000Z',
    ...overrides,
  };
}

/**
 * Create a mock review object for testing.
 */
export function createMockReview(overrides = {}) {
  return {
    id: 1,
    rating: 5,
    comment: 'Great service!',
    reviewer: {
      id: 2,
      name: 'John Doe',
      username: 'johndoe',
      avatar_url: 'https://example.com/avatar.jpg',
    },
    isVerifiedBuyer: true,
    created_at: '2026-01-20T10:00:00.000Z',
    ...overrides,
  };
}

/**
 * Create a mock business object for testing.
 */
export function createMockBusiness(overrides = {}) {
  return {
    id: 1,
    name: 'TechFlow Studio',
    username: 'techflow',
    avatar: 'https://example.com/avatar.jpg',
    type: 'Design Agency',
    rating: 4.8,
    reviewCount: 24,
    gigCount: 5,
    location: 'New York',
    isAvailable: true,
    isTopRated: false,
    ...overrides,
  };
}
