/* ============================================
   KarBazar Mock Data — Phase 3 (Business Pages)
   ============================================ */

import { mockGigs, mockBusinesses, categories } from './mockData';
import { mockBusinessProfile } from './mockDataPhase2';

// ---- Avatars (reuse) ----
const avatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
];

// ---- Business User (logged-in owner) ----
export const mockBusinessUser = {
  id: 2,
  name: 'TechFlow Studio',
  username: 'techflow',
  email: 'business@karbazar.com',
  role: 'business',
  avatar: avatars[0],
  bio: mockBusinessProfile.bio,
  location: 'San Francisco, CA',
  memberSince: '2022-06-15',
  isAvailable: true,
};

// ---- Business Gigs (owner's gigs with statuses) ----
export const mockBusinessGigs = [
  {
    id: 1,
    title: 'Professional React Website Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    category: categories[0],
    status: 'active', // active | paused | draft
    rating: 4.8,
    reviewCount: 156,
    views: 3420,
    orders: 89,
    startingPrice: 49,
    pricing: {
      basic: { name: 'Starter', price: 49, deliveryDays: 7, description: 'Perfect for landing pages', revisions: 1, features: ['1 page', 'Responsive design', 'Basic SEO', 'Source code'] },
      standard: { name: 'Professional', price: 99, deliveryDays: 5, description: 'Ideal for business sites', revisions: 3, features: ['Up to 5 pages', 'Responsive design', 'Advanced SEO', 'CMS integration', 'Source code'] },
      premium: { name: 'Enterprise', price: 199, deliveryDays: 3, description: 'Full web applications', revisions: -1, features: ['Unlimited pages', 'Responsive design', 'Full SEO', 'CMS', 'API integration', 'Admin panel', 'Priority support'] },
    },
    discount: {
      percent: 20,
      originalPrice: 49,
      discountedPrice: 39,
      expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
      isActive: true,
    },
    business: { id: 2, name: 'TechFlow Studio', avatar: avatars[0], isTopRated: true },
    isTrending: true,
    isSponsored: false,
    createdAt: '2025-08-12',
  },
  {
    id: 2,
    title: 'Full-Stack E-Commerce Platform',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    category: categories[0],
    status: 'active',
    rating: 4.6,
    reviewCount: 98,
    views: 2180,
    orders: 54,
    startingPrice: 149,
    pricing: {
      basic: { name: 'Basic Store', price: 149, deliveryDays: 14, description: 'Simple online store', revisions: 2, features: ['Product listing', 'Cart & checkout', 'Payment gateway', 'Responsive design'] },
      standard: { name: 'Pro Store', price: 299, deliveryDays: 10, description: 'Feature-rich store', revisions: 4, features: ['Everything in Basic', 'Inventory management', 'Order tracking', 'Email notifications', 'Analytics'] },
      premium: { name: 'Enterprise Store', price: 499, deliveryDays: 7, description: 'Complete e-commerce solution', revisions: -1, features: ['Everything in Pro', 'Multi-vendor', 'Custom themes', 'API access', 'Priority support'] },
    },
    discount: null,
    business: { id: 2, name: 'TechFlow Studio', avatar: avatars[0], isTopRated: true },
    isTrending: false,
    isSponsored: false,
    createdAt: '2025-09-03',
  },
  {
    id: 25,
    title: 'Custom API Development & Integration',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
    category: categories[7],
    status: 'paused',
    rating: 4.3,
    reviewCount: 42,
    views: 890,
    orders: 23,
    startingPrice: 79,
    pricing: {
      basic: { name: 'Simple API', price: 79, deliveryDays: 5, description: 'RESTful API', revisions: 1, features: ['REST endpoints', 'Documentation', 'Basic auth'] },
      standard: { name: 'Advanced API', price: 159, deliveryDays: 7, description: 'Full API solution', revisions: 3, features: ['REST + GraphQL', 'JWT auth', 'Rate limiting', 'Documentation', 'Testing'] },
      premium: { name: 'API Suite', price: 299, deliveryDays: 10, description: 'Enterprise API', revisions: -1, features: ['Microservices', 'OAuth2', 'WebSocket', 'CI/CD', 'Monitoring', 'Documentation'] },
    },
    discount: {
      percent: 15,
      originalPrice: 79,
      discountedPrice: 67,
      expiresAt: null,
      isActive: true,
    },
    business: { id: 2, name: 'TechFlow Studio', avatar: avatars[0], isTopRated: true },
    isTrending: false,
    isSponsored: false,
    createdAt: '2025-10-20',
  },
  {
    id: 26,
    title: 'SaaS Dashboard Development',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    category: categories[0],
    status: 'draft',
    rating: 0,
    reviewCount: 0,
    views: 0,
    orders: 0,
    startingPrice: 199,
    pricing: {
      basic: { name: 'Starter Dashboard', price: 199, deliveryDays: 14, description: 'Basic analytics', revisions: 2, features: ['Charts & graphs', 'Data tables', 'Responsive'] },
      standard: { name: 'Pro Dashboard', price: 399, deliveryDays: 10, description: 'Full dashboard', revisions: 4, features: ['Real-time data', 'Custom widgets', 'Export', 'User roles'] },
      premium: { name: 'Enterprise Dashboard', price: 699, deliveryDays: 7, description: 'Complete SaaS', revisions: -1, features: ['Multi-tenant', 'Custom branding', 'API', 'Webhooks', 'SSO'] },
    },
    discount: null,
    business: { id: 2, name: 'TechFlow Studio', avatar: avatars[0], isTopRated: true },
    isTrending: false,
    isSponsored: false,
    createdAt: '2026-01-15',
  },
];

// Monthly gig counter data
export const mockGigCounter = {
  used: 2,
  limit: 4,
  nextReset: '2026-03-01',
};

// ---- Orders Received (business perspective) ----
export const mockReceivedOrders = [
  {
    id: 5001,
    orderNumber: 'ORD-005001',
    client: { id: 10, name: 'Alice Johnson', username: 'alicej', avatar: avatars[1] },
    gig: { id: 1, title: 'Professional React Website Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
    package: { name: 'Professional', type: 'standard', price: 99, deliveryDays: 5 },
    status: 'pending',
    datePlaced: new Date(Date.now() - 2 * 3600000).toISOString(),
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    requirements: 'I need a portfolio website with 5 pages.',
  },
  {
    id: 5002,
    orderNumber: 'ORD-005002',
    client: { id: 11, name: 'Bob Martinez', username: 'bobm', avatar: avatars[2] },
    gig: { id: 1, title: 'Professional React Website Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
    package: { name: 'Enterprise', type: 'premium', price: 199, deliveryDays: 3 },
    status: 'in_progress',
    datePlaced: new Date(Date.now() - 2 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    requirements: 'Full web app with admin panel, user auth, and dashboard.',
  },
  {
    id: 5003,
    orderNumber: 'ORD-005003',
    client: { id: 12, name: 'Carol Williams', username: 'carolw', avatar: avatars[3] },
    gig: { id: 2, title: 'Full-Stack E-Commerce Platform', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop' },
    package: { name: 'Pro Store', type: 'standard', price: 299, deliveryDays: 10 },
    status: 'in_progress',
    datePlaced: new Date(Date.now() - 5 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    requirements: 'Online clothing store with inventory management.',
  },
  {
    id: 5004,
    orderNumber: 'ORD-005004',
    client: { id: 13, name: 'David Brown', username: 'davidb', avatar: avatars[4] },
    gig: { id: 1, title: 'Professional React Website Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
    package: { name: 'Starter', type: 'basic', price: 49, deliveryDays: 7 },
    status: 'delivered',
    datePlaced: new Date(Date.now() - 8 * 86400000).toISOString(),
    dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    deliveredDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    deliveryMessage: 'Here are the final files. Let me know if you need any changes!',
    deliveryFiles: ['website_final.zip', 'documentation.pdf'],
  },
  {
    id: 5005,
    orderNumber: 'ORD-005005',
    client: { id: 14, name: 'Emily Davis', username: 'emilyd', avatar: avatars[5] },
    gig: { id: 2, title: 'Full-Stack E-Commerce Platform', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop' },
    package: { name: 'Enterprise Store', type: 'premium', price: 499, deliveryDays: 7 },
    status: 'completed',
    datePlaced: new Date(Date.now() - 20 * 86400000).toISOString(),
    dueDate: new Date(Date.now() - 13 * 86400000).toISOString(),
    completedDate: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 5006,
    orderNumber: 'ORD-005006',
    client: { id: 15, name: 'Frank Wilson', username: 'frankw', avatar: avatars[0] },
    gig: { id: 25, title: 'Custom API Development & Integration', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop' },
    package: { name: 'Advanced API', type: 'standard', price: 159, deliveryDays: 7 },
    status: 'cancelled',
    datePlaced: new Date(Date.now() - 15 * 86400000).toISOString(),
    dueDate: new Date(Date.now() - 8 * 86400000).toISOString(),
    cancelledDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    cancelReason: 'Client changed project scope.',
  },
  {
    id: 5007,
    orderNumber: 'ORD-005007',
    client: { id: 16, name: 'Grace Lee', username: 'gracel', avatar: avatars[1] },
    gig: { id: 1, title: 'Professional React Website Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
    package: { name: 'Professional', type: 'standard', price: 99, deliveryDays: 5 },
    status: 'completed',
    datePlaced: new Date(Date.now() - 30 * 86400000).toISOString(),
    dueDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    completedDate: new Date(Date.now() - 24 * 86400000).toISOString(),
  },
];

// Computed order groups
export const newOrders = mockReceivedOrders.filter((o) => o.status === 'pending');
export const inProgressOrders = mockReceivedOrders.filter((o) => o.status === 'in_progress');
export const deliveredOrders = mockReceivedOrders.filter((o) => o.status === 'delivered');
export const completedReceivedOrders = mockReceivedOrders.filter((o) => o.status === 'completed');
export const cancelledReceivedOrders = mockReceivedOrders.filter((o) => o.status === 'cancelled');

// ---- Order detail (business perspective) ----
export const mockReceivedOrderDetail = {
  ...mockReceivedOrders[1],
  chat: [
    { id: 1, sender: 'client', message: 'Hi! I just placed the order. Excited to get started!', date: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 2, sender: 'business', message: 'Thank you for your order! I\'ll review the requirements and begin today.', date: new Date(Date.now() - 2 * 86400000 + 3600000).toISOString() },
    { id: 3, sender: 'business', message: 'Quick question — do you have any brand guidelines or color preferences?', date: new Date(Date.now() - 86400000).toISOString() },
    { id: 4, sender: 'client', message: 'Yes! I\'ll send over the brand kit. Primary color is #2563EB, secondary #F97316.', date: new Date(Date.now() - 86400000 + 1800000).toISOString() },
    { id: 5, sender: 'business', message: 'Perfect, got it! I\'ll have the first draft ready by tomorrow.', date: new Date(Date.now() - 43200000).toISOString() },
  ],
};

// ---- Reviews Received (business perspective) ----
export const mockReceivedReviews = [
  {
    id: 4001,
    reviewer: { id: 10, name: 'Alice Johnson', username: 'alicej', avatar: avatars[1] },
    gig: { id: 1, title: 'Professional React Website Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
    rating: 5,
    comment: 'Absolutely fantastic work! The team delivered beyond my expectations. Communication was excellent throughout the project. Would definitely hire again!',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    isVerifiedBuyer: true,
    isEdited: false,
  },
  {
    id: 4002,
    reviewer: { id: 11, name: 'Bob Martinez', username: 'bobm', avatar: avatars[2] },
    gig: { id: 1, title: 'Professional React Website Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
    rating: 4.5,
    comment: 'Great communication and timely delivery. The end result was professional and polished. Minor revision needed but handled promptly.',
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    isVerifiedBuyer: true,
    isEdited: false,
  },
  {
    id: 4003,
    reviewer: { id: 12, name: 'Carol Williams', username: 'carolw', avatar: avatars[3] },
    gig: { id: 2, title: 'Full-Stack E-Commerce Platform', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop' },
    rating: 5,
    comment: 'This was my third time working with TechFlow and they never disappoint. The e-commerce platform is incredible. Highly recommend!',
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
    isVerifiedBuyer: true,
    isEdited: false,
  },
  {
    id: 4004,
    reviewer: { id: 13, name: 'David Brown', username: 'davidb', avatar: avatars[4] },
    gig: { id: 1, title: 'Professional React Website Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
    rating: 4,
    comment: 'Good work overall. Had a few revision requests but they were handled promptly. The final result was clean.',
    date: new Date(Date.now() - 18 * 86400000).toISOString(),
    isVerifiedBuyer: false,
    isEdited: true,
  },
  {
    id: 4005,
    reviewer: { id: 14, name: 'Emily Davis', username: 'emilyd', avatar: avatars[5] },
    gig: { id: 2, title: 'Full-Stack E-Commerce Platform', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop' },
    rating: 5,
    comment: 'Incredible talent! The store design was creative, modern, and exactly what I envisioned. Performance is outstanding.',
    date: new Date(Date.now() - 25 * 86400000).toISOString(),
    isVerifiedBuyer: true,
    isEdited: false,
  },
  {
    id: 4006,
    reviewer: { id: 16, name: 'Grace Lee', username: 'gracel', avatar: avatars[1] },
    gig: { id: 1, title: 'Professional React Website Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
    rating: 3.5,
    comment: 'Decent quality but delivery took a bit longer than expected. Results were satisfactory in the end.',
    date: new Date(Date.now() - 32 * 86400000).toISOString(),
    isVerifiedBuyer: false,
    isEdited: false,
  },
  {
    id: 4007,
    reviewer: { id: 17, name: 'Henry Taylor', username: 'henryt', avatar: avatars[2] },
    gig: { id: 25, title: 'Custom API Development & Integration', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop' },
    rating: 4.5,
    comment: 'Outstanding API design. Well-documented, clean code structure. Very professional approach throughout.',
    date: new Date(Date.now() - 40 * 86400000).toISOString(),
    isVerifiedBuyer: true,
    isEdited: false,
  },
  {
    id: 4008,
    reviewer: { id: 18, name: 'Iris Chen', username: 'irisc', avatar: avatars[3] },
    gig: { id: 1, title: 'Professional React Website Development', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
    rating: 5,
    comment: 'Exceeded expectations! The final product was clean, efficient, and well-documented. Will return for sure.',
    date: new Date(Date.now() - 48 * 86400000).toISOString(),
    isVerifiedBuyer: true,
    isEdited: false,
  },
];

// Rating breakdown for business reviews
export const mockBusinessRatingBreakdown = {
  average: 4.6,
  total: 156,
  breakdown: { 5: 82, 4: 45, 3: 18, 2: 8, 1: 3 },
};

// ---- Showcase Projects (for owner editing) ----
export const mockShowcaseProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-featured marketplace with payment processing, inventory management, and multi-vendor support.',
    mediaType: 'images',
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
    ],
    video: null,
  },
  {
    id: 2,
    title: 'Analytics Dashboard',
    description: 'Real-time data visualization with interactive charts, custom widgets, and export capabilities.',
    mediaType: 'images',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'],
    video: null,
  },
  {
    id: 3,
    title: 'SaaS Admin Panel',
    description: 'Multi-tenant admin dashboard with role-based access, user management, and reporting.',
    mediaType: 'video',
    images: [],
    video: { url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
  },
];

// ---- Work History (for owner editing) ----
export const mockWorkHistory = [
  { id: 1, position: 'Lead Developer', company: 'TechCorp Inc.', startDate: '2020-01', endDate: '2023-06', isCurrent: false, description: 'Led a team of 8 developers building enterprise SaaS applications. Implemented CI/CD pipelines and mentored junior engineers.' },
  { id: 2, position: 'Senior Full-Stack Developer', company: 'StartupXYZ', startDate: '2018-03', endDate: '2019-12', isCurrent: false, description: 'Built and scaled a marketplace platform serving 50K+ users. Optimized database queries reducing load times by 60%.' },
  { id: 3, position: 'Frontend Developer', company: 'DesignAgency Co.', startDate: '2016-06', endDate: '2018-02', isCurrent: false, description: 'Created responsive websites and web applications for diverse clients including Fortune 500 companies.' },
];

// ---- Business Notification Settings ----
export const mockBusinessNotifications = {
  newOrders: true,
  messages: true,
  reviewNotifications: true,
  dealExpiryReminders: true,
  news: false,
  emailNotifications: true,
};

// ---- Business Settings Data ----
export const mockBusinessSettingsData = {
  businessName: 'TechFlow Studio',
  businessType: 'Web Development Agency',
  bio: mockBusinessProfile.bio,
  email: 'hello@techflow.studio',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  website: 'https://techflow.studio',
  languages: ['English', 'Spanish', 'French'],
  avgPricing: { min: 49, max: 199 },
  responseTime: 'within_2_hours',
  isAvailable: true,
};

// ---- Active Sessions (business) ----
export const mockBusinessSessions = [
  { id: 1, device: 'desktop', browser: 'Chrome', os: 'Windows 11', location: 'San Francisco, CA', lastActive: 'Just now', isCurrent: true },
  { id: 2, device: 'mobile', browser: 'Safari', os: 'iOS 17', location: 'San Francisco, CA', lastActive: '2 hours ago', isCurrent: false },
  { id: 3, device: 'desktop', browser: 'Firefox', os: 'macOS', location: 'Remote VPN', lastActive: '3 days ago', isCurrent: false },
];
