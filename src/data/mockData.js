/* ============================================
   KarBazar Mock Data — Phase 1 Frontend
   ============================================ */

// Categories
export const categories = [
  { id: 1, name: 'Web Development', slug: 'web-development', icon: '💻', count: 1240 },
  { id: 2, name: 'Mobile Apps', slug: 'mobile-apps', icon: '📱', count: 856 },
  { id: 3, name: 'UI/UX Design', slug: 'ui-ux-design', icon: '🎨', count: 1032 },
  { id: 4, name: 'Digital Marketing', slug: 'digital-marketing', icon: '📈', count: 768 },
  { id: 5, name: 'Content Writing', slug: 'content-writing', icon: '✍️', count: 645 },
  { id: 6, name: 'Video Production', slug: 'video-production', icon: '🎬', count: 423 },
  { id: 7, name: 'SEO Services', slug: 'seo-services', icon: '🔍', count: 534 },
  { id: 8, name: 'Data Analytics', slug: 'data-analytics', icon: '📊', count: 312 },
  { id: 9, name: 'Cloud Services', slug: 'cloud-services', icon: '☁️', count: 278 },
  { id: 10, name: 'Cybersecurity', slug: 'cybersecurity', icon: '🔒', count: 189 },
  { id: 11, name: 'AI & Machine Learning', slug: 'ai-ml', icon: '🤖', count: 367 },
  { id: 12, name: 'Consulting', slug: 'consulting', icon: '💼', count: 456 },
];

// Quick category pills (homepage)
export const categoryPills = [
  { id: 1, emoji: '💻', name: 'Web Dev' },
  { id: 2, emoji: '📱', name: 'Mobile' },
  { id: 3, emoji: '🎨', name: 'Design' },
  { id: 4, emoji: '📈', name: 'Marketing' },
  { id: 5, emoji: '✍️', name: 'Writing' },
  { id: 6, emoji: '🎬', name: 'Video' },
  { id: 7, emoji: '🔍', name: 'SEO' },
  { id: 8, emoji: '📊', name: 'Analytics' },
  { id: 9, emoji: '☁️', name: 'Cloud' },
  { id: 10, emoji: '🤖', name: 'AI/ML' },
];

// Mock gig images
const gigImages = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop',
];

const avatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
];

// Gigs
export const mockGigs = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: [
    'Professional React Website Development',
    'Modern UI/UX Design for Web & Mobile',
    'Full-Stack E-Commerce Platform',
    'SEO Optimization & Strategy',
    'Custom Mobile App Development',
    'Brand Identity & Logo Design',
    'Data Analytics Dashboard',
    'Cloud Infrastructure Setup',
    'WordPress Website Development',
    'Social Media Marketing Campaign',
    'Video Editing & Production',
    'Content Writing & Copywriting',
    'AI Chatbot Development',
    'Cybersecurity Audit & Assessment',
    'DevOps & CI/CD Pipeline Setup',
    'Email Marketing Automation',
    'Shopify Store Setup & Customization',
    'Database Design & Optimization',
    'Graphic Design Package',
    'API Development & Integration',
    'Flutter Cross-Platform App',
    'Machine Learning Model Training',
    'Technical Writing & Documentation',
    'Blockchain Smart Contract Development',
  ][i],
  image: gigImages[i % gigImages.length],
  business: {
    id: (i % 8) + 1,
    name: ['TechFlow Studio', 'DesignPeak', 'CodeCraft Labs', 'GrowthHub', 'AppForge', 'BrandSpark', 'DataMinds', 'CloudNine'][i % 8],
    avatar: avatars[i % avatars.length],
    isTopRated: i < 4,
  },
  category: categories[i % categories.length],
  rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
  reviewCount: Math.floor(20 + Math.random() * 200),
  pricing: {
    basic: { name: 'Starter', price: 49 + i * 10, deliveryDays: 7 },
    standard: { name: 'Professional', price: 99 + i * 15, deliveryDays: 5 },
    premium: { name: 'Enterprise', price: 199 + i * 20, deliveryDays: 3 },
  },
  startingPrice: 49 + i * 10,
  isTrending: i < 8,
  isSponsored: i >= 8 && i < 12,
  discount: i % 3 === 0 ? {
    percent: [10, 15, 20, 25, 30, 40, 50][i % 7],
    originalPrice: 49 + i * 10,
    discountedPrice: Math.round((49 + i * 10) * (1 - [10, 15, 20, 25, 30, 40, 50][i % 7] / 100)),
    expiresAt: i % 6 === 0 ? new Date(Date.now() + (24 + Math.random() * 48) * 3600000).toISOString() : null,
    isActive: true,
  } : null,
  views: Math.floor(100 + Math.random() * 5000),
  orders: Math.floor(5 + Math.random() * 200),
}));

// Trending gigs (first 8)
export const trendingGigs = mockGigs.filter(g => g.isTrending);

// Sponsored gigs
export const sponsoredGigs = mockGigs.filter(g => g.isSponsored);

// Discounted gigs (for Deals page)
export const discountedGigs = mockGigs.filter(g => g.discount !== null);

// Business accounts
export const mockBusinesses = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: ['TechFlow Studio', 'DesignPeak', 'CodeCraft Labs', 'GrowthHub', 'AppForge', 'BrandSpark', 'DataMinds', 'CloudNine'][i],
  avatar: avatars[i],
  type: ['Web Development Agency', 'Design Studio', 'Software House', 'Marketing Agency', 'App Development', 'Branding Agency', 'Data Consulting', 'Cloud Solutions'][i],
  rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
  reviewCount: Math.floor(30 + Math.random() * 300),
  skills: [
    ['React', 'Node.js', 'AWS'],
    ['Figma', 'Adobe XD', 'CSS'],
    ['Python', 'Django', 'PostgreSQL'],
    ['Google Ads', 'SEO', 'Analytics'],
    ['Flutter', 'Swift', 'Kotlin'],
    ['Illustrator', 'Photoshop', 'Branding'],
    ['Power BI', 'Tableau', 'Python'],
    ['AWS', 'Docker', 'Kubernetes'],
  ][i],
  startingPrice: [49, 79, 99, 59, 89, 69, 119, 149][i],
  isAvailable: i % 3 !== 2,
  isTopRated: i < 3,
  completedProjects: Math.floor(20 + Math.random() * 200),
  location: ['San Francisco, CA', 'New York, NY', 'London, UK', 'Toronto, CA', 'Berlin, DE', 'Sydney, AU', 'Singapore', 'Dubai, UAE'][i],
}));

// News articles
export const mockNews = [
  {
    id: 1,
    title: 'KarBazar Launches New Deals & Discounts Feature',
    excerpt: 'Discover amazing offers from top-rated businesses with our new dedicated deals page.',
    category: 'Platform Update',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
    date: '2025-12-15',
    slug: 'karbazar-deals-feature',
  },
  {
    id: 2,
    title: 'How to Stand Out as a Business on KarBazar',
    excerpt: 'Top tips for creating a compelling profile and attracting more clients.',
    category: 'Tips & Guides',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
    date: '2025-12-10',
    slug: 'stand-out-business',
  },
  {
    id: 3,
    title: '2025 Freelancing Trends Every Business Should Know',
    excerpt: 'Stay ahead of the curve with these emerging trends in the freelance marketplace.',
    category: 'Industry News',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
    date: '2025-12-05',
    slug: 'freelancing-trends-2025',
  },
];

// Platform statistics
export const platformStats = [
  { label: 'Businesses', value: 15000, suffix: '+' },
  { label: 'Projects', value: 50000, suffix: '+' },
  { label: 'Satisfaction', value: 98, suffix: '%' },
  { label: 'Categories', value: 20, suffix: '+' },
];

// How it works steps
export const howItWorksClients = [
  { step: 1, title: 'Browse & Discover', description: 'Search through thousands of verified business services across 20+ categories.', icon: '🔍' },
  { step: 2, title: 'Choose & Order', description: 'Compare packages, read reviews, and place your order with confidence.', icon: '🛒' },
  { step: 3, title: 'Get Results', description: 'Receive professional deliverables on time. Leave a review to help the community.', icon: '✅' },
];

export const howItWorksBusiness = [
  { step: 1, title: 'Create Your Profile', description: 'Sign up for free and build a professional business profile with your portfolio.', icon: '📝' },
  { step: 2, title: 'Post Your Services', description: 'List up to 4 gigs per month with detailed pricing tiers and descriptions.', icon: '📦' },
  { step: 3, title: 'Grow Your Business', description: 'Receive orders, deliver great work, and build your reputation. 100% free.', icon: '🚀' },
];

// Filter options
export const deliveryTimeOptions = [
  { label: 'Any', value: '' },
  { label: 'Up to 1 day', value: '1' },
  { label: 'Up to 3 days', value: '3' },
  { label: 'Up to 7 days', value: '7' },
  { label: 'Up to 14 days', value: '14' },
  { label: 'Up to 30 days', value: '30' },
];

export const ratingOptions = [
  { label: 'Any Rating', value: '' },
  { label: '4★ & up', value: '4' },
  { label: '4.5★ & up', value: '4.5' },
  { label: '5★ only', value: '5' },
];

export const discountAmountOptions = [
  { label: 'Any Discount', value: '' },
  { label: '10% or more', value: '10' },
  { label: '25% or more', value: '25' },
  { label: '50% or more', value: '50' },
  { label: '75% or more', value: '75' },
];

export const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Lowest Price', value: 'price_asc' },
  { label: 'Highest Price', value: 'price_desc' },
];  // Values match backend GigController sort keys

export const dealsSortOptions = [
  { label: 'Most Discounted', value: 'discount_desc' },
  { label: 'Lowest Price', value: 'price_asc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];
