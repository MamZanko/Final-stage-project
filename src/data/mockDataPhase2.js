/* ============================================
   KarBazar Mock Data — Phase 2 (Client Pages)
   ============================================ */

import { mockGigs, mockBusinesses, categories } from './mockData';

// Avatars
const avatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
];

// Current mock user (client)
export const mockClientUser = {
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  email: 'client@karbazar.com',
  role: 'client',
  avatar: avatars[0],
  bio: 'Passionate entrepreneur and tech enthusiast. Love finding great freelancers for my projects. Based in San Francisco and always looking for innovative solutions.',
  location: 'San Francisco, CA',
  memberSince: '2024-03-15',
  language: 'English',
};

// Mock orders
const orderStatuses = ['pending', 'in_progress', 'delivered', 'completed', 'cancelled', 'revision'];

export const mockOrders = Array.from({ length: 16 }, (_, i) => {
  const gig = mockGigs[i % mockGigs.length];
  const statuses = ['in_progress', 'in_progress', 'delivered', 'completed', 'completed', 'completed', 'completed', 'cancelled', 'pending', 'in_progress', 'completed', 'completed', 'delivered', 'cancelled', 'completed', 'revision'];
  const status = statuses[i];
  const isActive = ['pending', 'in_progress', 'delivered', 'revision'].includes(status);
  const packageType = ['basic', 'standard', 'premium'][i % 3];
  const pkg = gig.pricing[packageType];

  return {
    id: 1001 + i,
    orderNumber: `ORD-${(1001 + i).toString().padStart(6, '0')}`,
    gig: {
      id: gig.id,
      title: gig.title,
      image: gig.image,
    },
    business: {
      id: gig.business.id,
      name: gig.business.name,
      avatar: gig.business.avatar,
      username: gig.business.name.toLowerCase().replace(/\s+/g, ''),
    },
    package: {
      name: pkg.name,
      type: packageType,
      price: pkg.price,
      deliveryDays: pkg.deliveryDays,
    },
    status,
    isActive,
    datePlaced: new Date(Date.now() - (i * 3 + Math.random() * 5) * 86400000).toISOString(),
    dueDate: new Date(Date.now() + (pkg.deliveryDays - i) * 86400000).toISOString(),
    completedDate: status === 'completed' ? new Date(Date.now() - (i * 2) * 86400000).toISOString() : null,
    cancelledDate: status === 'cancelled' ? new Date(Date.now() - (i * 2) * 86400000).toISOString() : null,
    hasReview: status === 'completed' && i % 2 === 0,
  };
});

export const activeOrders = mockOrders.filter((o) => o.isActive);
export const completedOrders = mockOrders.filter((o) => o.status === 'completed');
export const cancelledOrders = mockOrders.filter((o) => o.status === 'cancelled');

// Mock reviews (given by the client)
export const mockReviewsGiven = Array.from({ length: 10 }, (_, i) => {
  const gig = mockGigs[i % mockGigs.length];
  return {
    id: 2001 + i,
    gig: {
      id: gig.id,
      title: gig.title,
      image: gig.image,
    },
    business: {
      id: gig.business.id,
      name: gig.business.name,
      avatar: gig.business.avatar,
      username: gig.business.name.toLowerCase().replace(/\s+/g, ''),
    },
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    comment: [
      'Absolutely fantastic work! The team delivered beyond my expectations. Communication was excellent throughout the project.',
      'Good quality service. Delivered on time with minor revisions needed. Would use again.',
      'Outstanding professionalism. Every detail was perfect. Highly recommended!',
      'Great experience overall. The final result was exactly what I was looking for.',
      'Excellent work and very responsive to feedback. Will definitely hire again for future projects.',
      'Very professional approach. The deliverables were clean and well-organized.',
      'Impressive attention to detail. The project was completed ahead of schedule.',
      'Solid work with great communication. Made the revision process smooth and easy.',
      'Top-notch quality. The business really understood my requirements from the start.',
      'Wonderful experience. Creative solutions and timely delivery. Five stars!',
    ][i],
    date: new Date(Date.now() - (i * 5 + 2) * 86400000).toISOString(),
    isVerifiedBuyer: i % 3 === 0,
    isEdited: i === 3,
  };
});

// Mock reviews for a gig (left by various users)
export const mockGigReviews = Array.from({ length: 15 }, (_, i) => ({
  id: 3001 + i,
  reviewer: {
    id: 100 + i,
    name: ['Alice Johnson', 'Bob Martinez', 'Carol Williams', 'David Brown', 'Emily Davis', 'Frank Wilson', 'Grace Lee', 'Henry Taylor', 'Iris Chen', 'Jack Miller', 'Kate Anderson', 'Leo Thomas', 'Mia Jackson', 'Noah White', 'Olivia Harris'][i],
    username: ['alicej', 'bobm', 'carolw', 'davidb', 'emilyd', 'frankw', 'gracel', 'henryt', 'irisc', 'jackm', 'katea', 'leot', 'miaj', 'noahw', 'oliviah'][i],
    avatar: avatars[i % avatars.length],
  },
  rating: [5, 4.5, 5, 4, 5, 3.5, 5, 4.5, 4, 5, 4.5, 3, 5, 4, 4.5][i],
  comment: [
    'Absolutely stunning work! The attention to detail was remarkable. Every aspect of the project exceeded my expectations.',
    'Great communication and timely delivery. The end result was professional and polished.',
    'This was my third time working with this business and they never disappoint. Highly recommend!',
    'Good work overall. Had a few revision requests but they were handled promptly.',
    'Incredible talent! The design was creative, modern, and exactly what I envisioned.',
    'Decent quality but delivery took a bit longer than expected. Results were satisfactory.',
    'Outstanding service from start to finish. Will definitely return for future projects.',
    'Very professional approach. They took the time to understand requirements thoroughly.',
    'Solid work with good attention to detail. Communication could have been a bit better.',
    'Exceeded expectations! The final product was clean, efficient, and well-documented.',
    'Really impressed with the quality. Fast turnaround and great customer service.',
    'Average experience. The work was okay but nothing exceptional.',
    'Phenomenal results! They went above and beyond what was asked for.',
    'Good experience. Delivered on time and the work was of high quality.',
    'Excellent collaboration. Responsive, creative, and professional throughout.',
  ][i],
  date: new Date(Date.now() - (i * 4 + 1) * 86400000).toISOString(),
  isVerifiedBuyer: i % 2 === 0,
  isEdited: i === 5,
}));

// Rating breakdown for gig reviews
export const mockRatingBreakdown = {
  average: 4.5,
  total: 128,
  breakdown: {
    5: 68,
    4: 35,
    3: 15,
    2: 7,
    1: 3,
  },
};

// Mock FAQ for gig details
export const mockGigFAQ = [
  { id: 1, question: 'What technologies do you use?', answer: 'We primarily work with React, Next.js, Node.js, and Python. We can also work with Vue.js, Angular, and other modern frameworks based on project requirements.' },
  { id: 2, question: 'Do you offer ongoing maintenance?', answer: 'Yes! We offer maintenance packages after project completion. This includes bug fixes, minor updates, and performance monitoring.' },
  { id: 3, question: 'How do revisions work?', answer: 'Each package includes a set number of revision rounds. Basic includes 1 revision, Standard includes 3, and Premium includes unlimited revisions within the project scope.' },
  { id: 4, question: 'Can you work with existing codebases?', answer: 'Absolutely! We regularly work with existing projects and can help refactor, optimize, or add new features to your current codebase.' },
  { id: 5, question: 'What is your availability?', answer: 'We typically respond within 2-4 hours during business hours (9 AM - 6 PM EST). For Premium package clients, we offer priority support with 1-hour response times.' },
];

// Mock gig detail extended data
export const mockGigDetail = {
  ...mockGigs[0],
  images: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop',
  ],
  description: `
## Professional React Website Development

We create modern, high-performance websites using **React** and **Next.js** that drive results for your business.

### What You'll Get:
- Custom responsive design tailored to your brand
- Clean, maintainable, well-documented code
- SEO-optimized structure
- Performance optimization (90+ Lighthouse score)
- Cross-browser compatibility
- Mobile-first approach

### Our Process:
1. **Discovery** — We understand your requirements and goals
2. **Design** — UI/UX wireframes and mockups for approval
3. **Development** — Clean, modern code with best practices
4. **Testing** — Thorough QA across devices and browsers
5. **Delivery** — Deployed and ready to launch

### Technologies:
React 18+, Next.js 14, TailwindCSS, Framer Motion, TypeScript, Node.js
  `,
  pricing: {
    basic: {
      name: 'Starter',
      price: 49,
      description: 'Perfect for landing pages and simple sites',
      deliveryDays: 7,
      revisions: 1,
      features: ['1 page', 'Responsive design', 'Basic SEO', 'Source code', '1 revision'],
    },
    standard: {
      name: 'Professional',
      price: 99,
      description: 'Ideal for business websites and portfolios',
      deliveryDays: 5,
      revisions: 3,
      features: ['Up to 5 pages', 'Responsive design', 'Advanced SEO', 'Source code', 'CMS integration', '3 revisions', 'Performance optimization'],
    },
    premium: {
      name: 'Enterprise',
      price: 199,
      description: 'Complete web applications with all the bells and whistles',
      deliveryDays: 3,
      revisions: -1,
      features: ['Unlimited pages', 'Responsive design', 'Full SEO suite', 'Source code', 'CMS integration', 'Unlimited revisions', 'Performance optimization', 'API integration', 'Admin dashboard', 'Priority support'],
    },
  },
};

// Mock favorite businesses
export const mockFavoriteBusinesses = mockBusinesses.slice(0, 6);

// Mock conversations
export const mockConversations = [
  {
    id: 1,
    participant: {
      id: 2,
      name: 'TechFlow Studio',
      username: 'techflow',
      avatar: avatars[2],
      isOnline: true,
    },
    lastMessage: 'Sure, I can start working on that right away. Let me review the requirements one more time.',
    lastMessageAt: new Date(Date.now() - 300000).toISOString(),
    unreadCount: 2,
  },
  {
    id: 2,
    participant: {
      id: 3,
      name: 'DesignPeak',
      username: 'designpeak',
      avatar: avatars[1],
      isOnline: true,
    },
    lastMessage: 'The mockups are ready for review. I\'ve attached them as a ZIP file.',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0,
  },
  {
    id: 3,
    participant: {
      id: 4,
      name: 'CodeCraft Labs',
      username: 'codecraft',
      avatar: avatars[3],
      isOnline: false,
    },
    lastMessage: 'Thanks for the feedback! I\'ll implement those changes by tomorrow.',
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 1,
  },
  {
    id: 4,
    participant: {
      id: 5,
      name: 'GrowthHub',
      username: 'growthhub',
      avatar: avatars[4],
      isOnline: false,
    },
    lastMessage: 'The campaign report is looking great. Here are the key metrics...',
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 0,
  },
  {
    id: 5,
    participant: {
      id: 6,
      name: 'AppForge',
      username: 'appforge',
      avatar: avatars[5],
      isOnline: true,
    },
    lastMessage: 'I\'ve pushed the latest build to the staging server for testing.',
    lastMessageAt: new Date(Date.now() - 172800000).toISOString(),
    unreadCount: 0,
  },
];

// Mock messages for conversation 1
export const mockMessages = [
  {
    id: 1,
    conversationId: 1,
    senderId: 1, // current user
    text: 'Hi! I saw your React development gig and I\'m interested in a custom dashboard project.',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 2,
    text: 'Hello John! Thanks for reaching out. I\'d love to help with your dashboard project. Could you share more details about your requirements?',
    timestamp: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 1,
    text: 'Sure! I need a real-time analytics dashboard with charts, data tables, and user management. Here\'s a rough spec document.',
    timestamp: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: 4,
    conversationId: 1,
    senderId: 1,
    text: null,
    timestamp: new Date(Date.now() - 86400000 + 3700000).toISOString(),
    isRead: true,
    type: 'file',
    file: {
      name: 'project-spec.zip',
      size: 2450000,
      mimeType: 'application/zip',
    },
  },
  {
    id: 5,
    conversationId: 1,
    senderId: 2,
    text: 'Great, I\'ve reviewed the spec. This looks like a solid project! I\'d recommend the Premium package for this scope. It includes unlimited revisions and priority support.',
    timestamp: new Date(Date.now() - 86400000 + 7200000).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: 6,
    conversationId: 1,
    senderId: 1,
    text: 'That sounds good. Can you share some examples of similar dashboards you\'ve built?',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: 7,
    conversationId: 1,
    senderId: 2,
    text: 'Of course! Here\'s a screenshot from a recent project:',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: 8,
    conversationId: 1,
    senderId: 2,
    text: null,
    timestamp: new Date(Date.now() - 3600000 * 4 + 60000).toISOString(),
    isRead: true,
    type: 'image',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    id: 9,
    conversationId: 1,
    senderId: 1,
    text: 'This looks fantastic! Very clean and modern. I\'d like to proceed with the Premium package.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: 10,
    conversationId: 1,
    senderId: 2,
    text: 'Sure, I can start working on that right away. Let me review the requirements one more time.',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    isRead: false,
    type: 'text',
  },
];

// Mock business profile (extended for visitor view)
export const mockBusinessProfile = {
  ...mockBusinesses[0],
  username: 'techflow',
  coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
  bio: 'We are a passionate web development studio specializing in modern, high-performance applications. With 5+ years of experience, we\'ve delivered 200+ projects for clients worldwide. Our focus is on creating clean, scalable, and user-friendly digital experiences.',
  languages: ['English', 'Spanish', 'French'],
  website: 'https://techflow.studio',
  email: 'hello@techflow.studio',
  phone: '+1 (555) 123-4567',
  responseTime: '< 2 hours',
  views: 1234,
  saves: 89,
  gigsPosted: 4,
  avgResponseTime: '1.5 hours',
  socialLinks: {
    twitter: 'https://twitter.com/techflow',
    linkedin: 'https://linkedin.com/company/techflow',
    github: 'https://github.com/techflow',
  },
  certifications: [
    { id: 1, name: 'AWS Certified Developer', image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&h=200&fit=crop', year: 2024 },
    { id: 2, name: 'Google Cloud Professional', image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&h=200&fit=crop', year: 2023 },
  ],
  workHistory: [
    { id: 1, position: 'Lead Developer', company: 'TechCorp Inc.', startDate: '2020-01', endDate: '2023-06', description: 'Led a team of 8 developers building enterprise SaaS applications.' },
    { id: 2, position: 'Senior Full-Stack Developer', company: 'StartupXYZ', startDate: '2018-03', endDate: '2019-12', description: 'Built and scaled a marketplace platform serving 50K+ users.' },
    { id: 3, position: 'Frontend Developer', company: 'DesignAgency Co.', startDate: '2016-06', endDate: '2018-02', description: 'Created responsive websites and web applications for diverse clients.' },
  ],
  showcaseProjects: [
    { id: 1, title: 'E-Commerce Platform', description: 'Full-featured marketplace with payment processing', images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop'] },
    { id: 2, title: 'Analytics Dashboard', description: 'Real-time data visualization with interactive charts', images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'] },
    { id: 3, title: 'SaaS Admin Panel', description: 'Multi-tenant admin dashboard with role-based access', images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'] },
  ],
  portfolio: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop',
  ],
  avgPricing: { min: 49, max: 199, currency: 'USD' },
};

// Mock order detail with chat messages
export const mockOrderDetail = {
  ...mockOrders[0],
  chat: [
    { id: 1, senderId: 1, text: 'Hi! I just placed the order. Looking forward to working with you!', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), isRead: true },
    { id: 2, senderId: 2, text: 'Thank you for your order! I\'ve reviewed the requirements and will begin right away.', timestamp: new Date(Date.now() - 86400000 * 3 + 3600000).toISOString(), isRead: true },
    { id: 3, senderId: 2, text: 'Quick update — I\'ve completed the initial wireframes. Would you like to review them?', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), isRead: true },
    { id: 4, senderId: 1, text: 'Yes please! Send them over.', timestamp: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(), isRead: true },
    { id: 5, senderId: 2, text: 'Here they are. Let me know if you have any feedback!', timestamp: new Date(Date.now() - 86400000).toISOString(), isRead: true },
    { id: 6, senderId: 1, text: 'These look great! I love the layout. Just one small change — can you make the header sticky?', timestamp: new Date(Date.now() - 43200000).toISOString(), isRead: true },
    { id: 7, senderId: 2, text: 'Absolutely! I\'ll have that updated shortly.', timestamp: new Date(Date.now() - 36000000).toISOString(), isRead: false },
  ],
};

// Notification settings
export const mockNotificationSettings = {
  messages: true,
  orderUpdates: true,
  reviewReplies: false,
  newsAnnouncements: true,
  emailNotifications: true,
};

// Active sessions
export const mockActiveSessions = [
  { id: 1, device: 'Chrome on Windows', location: 'San Francisco, CA', lastActive: new Date(Date.now() - 300000).toISOString(), isCurrent: true },
  { id: 2, device: 'Safari on iPhone', location: 'San Francisco, CA', lastActive: new Date(Date.now() - 7200000).toISOString(), isCurrent: false },
  { id: 3, device: 'Firefox on MacOS', location: 'New York, NY', lastActive: new Date(Date.now() - 86400000 * 3).toISOString(), isCurrent: false },
];

// Business application status
export const mockBusinessApplicationStatus = null; // null | 'pending' | 'rejected' | 'approved'
