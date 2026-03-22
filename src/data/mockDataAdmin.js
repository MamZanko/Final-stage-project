/* ============================================
   KarBazar Mock Data — Phase 4 (Admin Pages)
   ============================================ */

const avatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
];

const gigImages = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=260&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=260&fit=crop',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=260&fit=crop',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=260&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=260&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=260&fit=crop',
];

// ---- ADMIN USER ----
export const mockAdminUser = {
  id: 99,
  name: 'Admin User',
  username: 'admin',
  email: 'admin@karbazar.com',
  role: 'admin',
  avatar: avatars[0],
};

// ---- USERS (20 mix) ----
export const mockAdminUsers = [
  { id: 1, name: 'Sarah Connor', username: 'sarahc', email: 'sarah@example.com', role: 'client', status: 'active', avatar: avatars[1], joinDate: '2025-01-15', orders: 12, gigs: 0 },
  { id: 2, name: 'TechFlow Studio', username: 'techflow', email: 'business@karbazar.com', role: 'business', status: 'active', avatar: avatars[0], joinDate: '2022-06-15', orders: 89, gigs: 4 },
  { id: 3, name: 'James Wilson', username: 'jameswilson', email: 'james@example.com', role: 'client', status: 'active', avatar: avatars[2], joinDate: '2024-11-03', orders: 5, gigs: 0 },
  { id: 4, name: 'Creative Minds Co.', username: 'creativeminds', email: 'info@creativeminds.com', role: 'business', status: 'active', avatar: avatars[3], joinDate: '2023-08-22', orders: 67, gigs: 3 },
  { id: 5, name: 'Emily Chen', username: 'emilychen', email: 'emily@example.com', role: 'client', status: 'banned', avatar: avatars[4], joinDate: '2025-06-01', orders: 1, gigs: 0, banReason: 'Spam activity', bannedAt: '2025-12-10' },
  { id: 6, name: 'PixelForge', username: 'pixelforge', email: 'hello@pixelforge.io', role: 'business', status: 'active', avatar: avatars[5], joinDate: '2024-02-14', orders: 45, gigs: 5 },
  { id: 7, name: 'Michael Brown', username: 'mikebrown', email: 'mike@example.com', role: 'client', status: 'active', avatar: avatars[6], joinDate: '2025-09-20', orders: 3, gigs: 0 },
  { id: 8, name: 'Admin User', username: 'admin', email: 'admin@karbazar.com', role: 'admin', status: 'active', avatar: avatars[0], joinDate: '2022-01-01', orders: 0, gigs: 0 },
  { id: 9, name: 'DataViz Pro', username: 'datavizpro', email: 'contact@dataviz.pro', role: 'business', status: 'active', avatar: avatars[7], joinDate: '2024-05-11', orders: 34, gigs: 2 },
  { id: 10, name: 'Jessica Lee', username: 'jesslee', email: 'jess@example.com', role: 'client', status: 'active', avatar: avatars[1], joinDate: '2025-03-08', orders: 8, gigs: 0 },
  { id: 11, name: 'CodeCraft', username: 'codecraft', email: 'team@codecraft.dev', role: 'business', status: 'banned', avatar: avatars[2], joinDate: '2023-12-01', orders: 23, gigs: 6, banReason: 'Fraudulent gigs', bannedAt: '2026-01-05' },
  { id: 12, name: 'Anna Martinez', username: 'annamtz', email: 'anna@example.com', role: 'client', status: 'active', avatar: avatars[3], joinDate: '2025-07-19', orders: 2, gigs: 0 },
  { id: 13, name: 'DesignHub', username: 'designhub', email: 'info@designhub.co', role: 'business', status: 'active', avatar: avatars[4], joinDate: '2024-09-30', orders: 56, gigs: 4 },
  { id: 14, name: 'Robert Kim', username: 'robkim', email: 'robert@example.com', role: 'client', status: 'active', avatar: avatars[5], joinDate: '2025-11-12', orders: 0, gigs: 0 },
  { id: 15, name: 'Sophia Garcia', username: 'sophiag', email: 'sophia@example.com', role: 'client', status: 'active', avatar: avatars[6], joinDate: '2026-01-02', orders: 1, gigs: 0 },
  { id: 16, name: 'WebWiz Agency', username: 'webwiz', email: 'hi@webwiz.agency', role: 'business', status: 'active', avatar: avatars[7], joinDate: '2023-03-15', orders: 112, gigs: 7 },
  { id: 17, name: 'Daniel Park', username: 'danpark', email: 'dan@example.com', role: 'client', status: 'banned', avatar: avatars[0], joinDate: '2025-04-22', orders: 0, gigs: 0, banReason: 'Abusive behavior', bannedAt: '2025-11-30' },
  { id: 18, name: 'MotionLab', username: 'motionlab', email: 'studio@motionlab.co', role: 'business', status: 'active', avatar: avatars[1], joinDate: '2024-07-08', orders: 38, gigs: 3 },
  { id: 19, name: 'David Thompson', username: 'davidt', email: 'david@example.com', role: 'client', status: 'active', avatar: avatars[2], joinDate: '2025-12-28', orders: 4, gigs: 0 },
  { id: 20, name: 'Super Admin', username: 'superadmin', email: 'super@karbazar.com', role: 'admin', status: 'active', avatar: avatars[3], joinDate: '2022-01-01', orders: 0, gigs: 0 },
];

// ---- GIGS (15 mix) ----
export const mockAdminGigs = [
  { id: 1, title: 'Professional React Website Development', business: 'TechFlow Studio', businessId: 2, category: 'Web Development', image: gigImages[0], status: 'active', price: '$49–$199', discount: 20, discountExpiry: '2026-03-15', views: 3420, orders: 89, datePosted: '2025-08-10', sponsored: true },
  { id: 2, title: 'Modern Logo Design Package', business: 'Creative Minds Co.', businessId: 4, category: 'Graphic Design', image: gigImages[1], status: 'active', price: '$35–$150', discount: 0, discountExpiry: null, views: 2180, orders: 67, datePosted: '2025-06-22', sponsored: false },
  { id: 3, title: 'SEO Optimization & Analysis', business: 'DataViz Pro', businessId: 9, category: 'Digital Marketing', image: gigImages[2], status: 'active', price: '$60–$250', discount: 15, discountExpiry: '2026-02-20', views: 1560, orders: 34, datePosted: '2025-09-14', sponsored: false },
  { id: 4, title: 'Mobile App UI/UX Design', business: 'PixelForge', businessId: 6, category: 'UI/UX Design', image: gigImages[3], status: 'active', price: '$80–$300', discount: 0, discountExpiry: null, views: 2890, orders: 45, datePosted: '2025-04-01', sponsored: true },
  { id: 5, title: 'Video Editing & Motion Graphics', business: 'MotionLab', businessId: 18, category: 'Video & Animation', image: gigImages[4], status: 'paused', price: '$40–$180', discount: 0, discountExpiry: null, views: 1230, orders: 38, datePosted: '2025-07-19', sponsored: false },
  { id: 6, title: 'WordPress Theme Customization', business: 'WebWiz Agency', businessId: 16, category: 'Web Development', image: gigImages[5], status: 'active', price: '$30–$120', discount: 25, discountExpiry: '2026-02-22', views: 4100, orders: 112, datePosted: '2024-12-05', sponsored: true },
  { id: 7, title: 'Social Media Management', business: 'DesignHub', businessId: 13, category: 'Digital Marketing', image: gigImages[0], status: 'active', price: '$50–$200', discount: 0, discountExpiry: null, views: 1890, orders: 56, datePosted: '2025-03-18', sponsored: false },
  { id: 8, title: 'AI Chatbot Development', business: 'TechFlow Studio', businessId: 2, category: 'AI & Machine Learning', image: gigImages[1], status: 'active', price: '$100–$500', discount: 10, discountExpiry: '2026-04-01', views: 980, orders: 12, datePosted: '2025-11-02', sponsored: false },
  { id: 9, title: 'Brand Identity Design', business: 'Creative Minds Co.', businessId: 4, category: 'Graphic Design', image: gigImages[2], status: 'draft', price: '$70–$280', discount: 0, discountExpiry: null, views: 0, orders: 0, datePosted: '2026-01-15', sponsored: false },
  { id: 10, title: 'Database Architecture Consulting', business: 'CodeCraft', businessId: 11, category: 'Data Science', image: gigImages[3], status: 'paused', price: '$90–$350', discount: 0, discountExpiry: null, views: 650, orders: 23, datePosted: '2025-05-20', sponsored: false },
  { id: 11, title: 'E-commerce Store Setup', business: 'WebWiz Agency', businessId: 16, category: 'Web Development', image: gigImages[4], status: 'active', price: '$120–$400', discount: 30, discountExpiry: '2026-02-19', views: 3200, orders: 78, datePosted: '2025-01-10', sponsored: false },
  { id: 12, title: 'Illustration & Character Design', business: 'PixelForge', businessId: 6, category: 'Graphic Design', image: gigImages[5], status: 'active', price: '$45–$180', discount: 0, discountExpiry: null, views: 1450, orders: 29, datePosted: '2025-08-30', sponsored: false },
  { id: 13, title: 'Content Writing & Copywriting', business: 'DesignHub', businessId: 13, category: 'Writing & Translation', image: gigImages[0], status: 'active', price: '$25–$100', discount: 0, discountExpiry: null, views: 2100, orders: 43, datePosted: '2025-06-05', sponsored: false },
  { id: 14, title: 'Data Visualization Dashboard', business: 'DataViz Pro', businessId: 9, category: 'Data Science', image: gigImages[1], status: 'active', price: '$80–$320', discount: 0, discountExpiry: null, views: 890, orders: 15, datePosted: '2025-10-12', sponsored: false },
  { id: 15, title: '3D Product Rendering', business: 'MotionLab', businessId: 18, category: 'Video & Animation', image: gigImages[2], status: 'draft', price: '$60–$250', discount: 0, discountExpiry: null, views: 0, orders: 0, datePosted: '2026-02-01', sponsored: false },
];

// ---- ORDERS (10 mix) ----
export const mockAdminOrders = [
  { id: 5001, client: { name: 'Sarah Connor', avatar: avatars[1], username: 'sarahc' }, business: { name: 'TechFlow Studio', avatar: avatars[0], username: 'techflow' }, gig: 'Professional React Website Development', package: 'premium', price: 199, status: 'completed', date: '2025-12-01', dueDate: '2025-12-10' },
  { id: 5002, client: { name: 'James Wilson', avatar: avatars[2], username: 'jameswilson' }, business: { name: 'TechFlow Studio', avatar: avatars[0], username: 'techflow' }, gig: 'AI Chatbot Development', package: 'standard', price: 250, status: 'in_progress', date: '2026-02-05', dueDate: '2026-02-20' },
  { id: 5003, client: { name: 'Jessica Lee', avatar: avatars[1], username: 'jesslee' }, business: { name: 'Creative Minds Co.', avatar: avatars[3], username: 'creativeminds' }, gig: 'Modern Logo Design Package', package: 'basic', price: 35, status: 'placed', date: '2026-02-18', dueDate: '2026-02-28' },
  { id: 5004, client: { name: 'Michael Brown', avatar: avatars[6], username: 'mikebrown' }, business: { name: 'PixelForge', avatar: avatars[5], username: 'pixelforge' }, gig: 'Mobile App UI/UX Design', package: 'premium', price: 300, status: 'delivered', date: '2026-01-10', dueDate: '2026-01-25' },
  { id: 5005, client: { name: 'Anna Martinez', avatar: avatars[3], username: 'annamtz' }, business: { name: 'WebWiz Agency', avatar: avatars[7], username: 'webwiz' }, gig: 'E-commerce Store Setup', package: 'standard', price: 250, status: 'completed', date: '2025-11-15', dueDate: '2025-11-30' },
  { id: 5006, client: { name: 'Robert Kim', avatar: avatars[5], username: 'robkim' }, business: { name: 'MotionLab', avatar: avatars[1], username: 'motionlab' }, gig: 'Video Editing & Motion Graphics', package: 'basic', price: 40, status: 'cancelled', date: '2026-01-28', dueDate: '2026-02-10' },
  { id: 5007, client: { name: 'David Thompson', avatar: avatars[2], username: 'davidt' }, business: { name: 'DataViz Pro', avatar: avatars[7], username: 'datavizpro' }, gig: 'SEO Optimization & Analysis', package: 'standard', price: 120, status: 'in_progress', date: '2026-02-10', dueDate: '2026-02-25' },
  { id: 5008, client: { name: 'Sophia Garcia', avatar: avatars[6], username: 'sophiag' }, business: { name: 'DesignHub', avatar: avatars[4], username: 'designhub' }, gig: 'Social Media Management', package: 'premium', price: 200, status: 'placed', date: '2026-02-17', dueDate: '2026-03-01' },
  { id: 5009, client: { name: 'Sarah Connor', avatar: avatars[1], username: 'sarahc' }, business: { name: 'WebWiz Agency', avatar: avatars[7], username: 'webwiz' }, gig: 'WordPress Theme Customization', package: 'basic', price: 30, status: 'completed', date: '2025-10-05', dueDate: '2025-10-15' },
  { id: 5010, client: { name: 'James Wilson', avatar: avatars[2], username: 'jameswilson' }, business: { name: 'PixelForge', avatar: avatars[5], username: 'pixelforge' }, gig: 'Illustration & Character Design', package: 'standard', price: 90, status: 'delivered', date: '2026-02-01', dueDate: '2026-02-12' },
];

// ---- REVIEWS (20 mix) ----
export const mockAdminReviews = [
  { id: 301, reviewer: { name: 'Sarah Connor', avatar: avatars[1] }, business: 'TechFlow Studio', gig: 'Professional React Website Development', rating: 5, comment: 'Outstanding work! Delivered ahead of schedule with pixel-perfect implementation. Highly recommend for any web development project.', verified: true, reported: false, date: '2025-12-15', orderId: 5001 },
  { id: 302, reviewer: { name: 'James Wilson', avatar: avatars[2] }, business: 'Creative Minds Co.', gig: 'Modern Logo Design Package', rating: 4, comment: 'Great designs with creative concepts. Minor revision needed but overall excellent service.', verified: true, reported: false, date: '2025-11-28', orderId: 5003 },
  { id: 303, reviewer: { name: 'Emily Chen', avatar: avatars[4] }, business: 'PixelForge', gig: 'Mobile App UI/UX Design', rating: 2, comment: 'The work was mediocre and didn\'t match the description. Very disappointed with the quality.', verified: false, reported: true, date: '2025-10-10', orderId: null },
  { id: 304, reviewer: { name: 'Michael Brown', avatar: avatars[6] }, business: 'MotionLab', gig: 'Video Editing & Motion Graphics', rating: 5, comment: 'Absolutely stunning motion graphics! Will definitely order again.', verified: true, reported: false, date: '2026-01-05', orderId: 5006 },
  { id: 305, reviewer: { name: 'Anna Martinez', avatar: avatars[3] }, business: 'WebWiz Agency', gig: 'WordPress Theme Customization', rating: 4, comment: 'Good communication and decent results. Theme works well on all devices.', verified: true, reported: false, date: '2025-09-22', orderId: 5009 },
  { id: 306, reviewer: { name: 'Jessica Lee', avatar: avatars[1] }, business: 'DataViz Pro', gig: 'SEO Optimization & Analysis', rating: 5, comment: 'My site ranking improved dramatically within weeks! Excellent SEO strategies.', verified: true, reported: false, date: '2025-12-01', orderId: null },
  { id: 307, reviewer: { name: 'Robert Kim', avatar: avatars[5] }, business: 'DesignHub', gig: 'Social Media Management', rating: 3, comment: 'Average experience. Posts were okay but could have been more creative.', verified: false, reported: false, date: '2026-01-18', orderId: null },
  { id: 308, reviewer: { name: 'Sophia Garcia', avatar: avatars[6] }, business: 'TechFlow Studio', gig: 'AI Chatbot Development', rating: 5, comment: 'The chatbot works flawlessly and handles edge cases beautifully. Worth every penny!', verified: true, reported: false, date: '2026-02-02', orderId: 5002 },
  { id: 309, reviewer: { name: 'David Thompson', avatar: avatars[2] }, business: 'Creative Minds Co.', gig: 'Brand Identity Design', rating: 4, comment: 'Beautiful brand guidelines document. Colors and typography are on point.', verified: true, reported: false, date: '2025-11-15', orderId: null },
  { id: 310, reviewer: { name: 'Anonymous User', avatar: avatars[7] }, business: 'WebWiz Agency', gig: 'E-commerce Store Setup', rating: 1, comment: 'SCAM! Never delivered anything. DO NOT USE THIS SERVICE!', verified: false, reported: true, date: '2026-01-25', orderId: null },
  { id: 311, reviewer: { name: 'Sarah Connor', avatar: avatars[1] }, business: 'PixelForge', gig: 'Illustration & Character Design', rating: 5, comment: 'Incredible talent! The character designs exceeded all expectations.', verified: true, reported: false, date: '2026-02-08', orderId: 5010 },
  { id: 312, reviewer: { name: 'James Wilson', avatar: avatars[2] }, business: 'MotionLab', gig: '3D Product Rendering', rating: 4, comment: 'Great 3D renders, very realistic. Took slightly longer than expected.', verified: true, reported: false, date: '2025-10-30', orderId: null },
  { id: 313, reviewer: { name: 'Michael Brown', avatar: avatars[6] }, business: 'DataViz Pro', gig: 'Data Visualization Dashboard', rating: 5, comment: 'The dashboard is beautiful and extremely functional. Best investment for my business.', verified: true, reported: false, date: '2025-12-20', orderId: null },
  { id: 314, reviewer: { name: 'FakeReviewer', avatar: avatars[0] }, business: 'TechFlow Studio', gig: 'Professional React Website Development', rating: 1, comment: 'This is a fake spam review with malicious content. Testing the moderation system.', verified: false, reported: true, date: '2026-02-14', orderId: null },
  { id: 315, reviewer: { name: 'Anna Martinez', avatar: avatars[3] }, business: 'DesignHub', gig: 'Content Writing & Copywriting', rating: 4, comment: 'Well-written copy that increased our conversion rates. Would recommend.', verified: true, reported: false, date: '2026-01-12', orderId: null },
  { id: 316, reviewer: { name: 'Jessica Lee', avatar: avatars[1] }, business: 'WebWiz Agency', gig: 'WordPress Theme Customization', rating: 5, comment: 'Second time ordering, consistent quality. Love the attention to detail!', verified: true, reported: false, date: '2026-02-10', orderId: null },
  { id: 317, reviewer: { name: 'Robert Kim', avatar: avatars[5] }, business: 'Creative Minds Co.', gig: 'Modern Logo Design Package', rating: 3, comment: 'Decent logo but revision process was slow. Communication could improve.', verified: false, reported: true, date: '2025-08-15', orderId: null },
  { id: 318, reviewer: { name: 'Sophia Garcia', avatar: avatars[6] }, business: 'PixelForge', gig: 'Mobile App UI/UX Design', rating: 5, comment: 'The UI design is modern and user-friendly. My app looks professional now!', verified: true, reported: false, date: '2026-01-28', orderId: 5004 },
  { id: 319, reviewer: { name: 'David Thompson', avatar: avatars[2] }, business: 'MotionLab', gig: 'Video Editing & Motion Graphics', rating: 4, comment: 'Smooth video edits with nice transitions. Good value for money.', verified: true, reported: false, date: '2025-11-08', orderId: null },
  { id: 320, reviewer: { name: 'Emily Chen', avatar: avatars[4] }, business: 'DataViz Pro', gig: 'SEO Optimization & Analysis', rating: 2, comment: 'Results were not as promised. Rankings barely moved after 2 months.', verified: false, reported: false, date: '2025-09-05', orderId: null },
];

// ---- ACTIVE DEALS (8) ----
export const mockAdminDeals = [
  { id: 'd1', gigId: 1, gigTitle: 'Professional React Website Development', business: 'TechFlow Studio', originalPrice: 199, discountedPrice: 159, discountPercent: 20, expiry: '2026-03-15', status: 'active', category: 'Web Development', usageCount: 34 },
  { id: 'd2', gigId: 3, gigTitle: 'SEO Optimization & Analysis', business: 'DataViz Pro', originalPrice: 120, discountedPrice: 102, discountPercent: 15, expiry: '2026-02-20', status: 'expiring_soon', category: 'Digital Marketing', usageCount: 12 },
  { id: 'd3', gigId: 6, gigTitle: 'WordPress Theme Customization', business: 'WebWiz Agency', originalPrice: 120, discountedPrice: 90, discountPercent: 25, expiry: '2026-02-22', status: 'expiring_soon', category: 'Web Development', usageCount: 27 },
  { id: 'd4', gigId: 8, gigTitle: 'AI Chatbot Development', business: 'TechFlow Studio', originalPrice: 500, discountedPrice: 450, discountPercent: 10, expiry: '2026-04-01', status: 'active', category: 'AI & Machine Learning', usageCount: 8 },
  { id: 'd5', gigId: 11, gigTitle: 'E-commerce Store Setup', business: 'WebWiz Agency', originalPrice: 400, discountedPrice: 280, discountPercent: 30, expiry: '2026-02-19', status: 'expiring_soon', category: 'Web Development', usageCount: 45 },
  { id: 'd6', gigId: 1, gigTitle: 'Professional React Website Development', business: 'TechFlow Studio', originalPrice: 49, discountedPrice: 39, discountPercent: 20, expiry: '2026-03-15', status: 'active', category: 'Web Development', usageCount: 19 },
  { id: 'd7', gigId: 7, gigTitle: 'Social Media Management', business: 'DesignHub', originalPrice: 100, discountedPrice: 85, discountPercent: 15, expiry: '2026-05-01', status: 'active', category: 'Digital Marketing', usageCount: 6 },
  { id: 'd8', gigId: 12, gigTitle: 'Illustration & Character Design', business: 'PixelForge', originalPrice: 180, discountedPrice: 144, discountPercent: 20, expiry: '2025-12-31', status: 'expired', category: 'Graphic Design', usageCount: 52 },
];

// ---- ROLE REQUESTS (5 pending + 10 history) ----
export const mockRoleRequests = [
  { id: 'rr1', user: { name: 'Sarah Connor', avatar: avatars[1], email: 'sarah@example.com', username: 'sarahc', joinDate: '2025-01-15' }, businessName: 'Sarah\'s Design Studio', category: 'Graphic Design', reason: 'I want to grow my freelance business and reach more clients through your platform.', dateSubmitted: '2026-02-15', status: 'pending', documents: 3 },
  { id: 'rr2', user: { name: 'Michael Brown', avatar: avatars[6], email: 'mike@example.com', username: 'mikebrown', joinDate: '2025-09-20' }, businessName: 'Mike\'s Web Solutions', category: 'Web Development', reason: 'I have been a client on KarBazar and now want to offer my own development services.', dateSubmitted: '2026-02-12', status: 'pending', documents: 2 },
  { id: 'rr3', user: { name: 'Jessica Lee', avatar: avatars[1], email: 'jess@example.com', username: 'jesslee', joinDate: '2025-03-08' }, businessName: 'JessWrite Co.', category: 'Content Writing', reason: 'Looking to monetize my writing skills through gig-based work.', dateSubmitted: '2026-02-10', status: 'pending', documents: 0 },
  { id: 'rr4', user: { name: 'Robert Kim', avatar: avatars[5], email: 'robert@example.com', username: 'robkim', joinDate: '2025-11-12' }, businessName: 'Kim\'s Video Production', category: 'Video Editing', reason: 'I produce YouTube content and want to offer editing services to other creators.', dateSubmitted: '2026-02-08', status: 'pending', documents: 4 },
  { id: 'rr5', user: { name: 'David Thompson', avatar: avatars[2], email: 'david@example.com', username: 'davidt', joinDate: '2025-12-28' }, businessName: 'Thompson Data Analytics', category: 'Data Science', reason: 'Want to offer data consulting and visualization services to businesses on the platform.', dateSubmitted: '2026-02-05', status: 'pending', documents: 1 },
];

export const mockRoleRequestHistory = [
  { id: 'rrh1', user: { name: 'TechFlow Studio', avatar: avatars[0] }, businessName: 'TechFlow Studio', date: '2022-06-12', decision: 'approved', decidedBy: 'Admin User', reason: 'Strong portfolio and relevant experience.' },
  { id: 'rrh2', user: { name: 'Creative Minds Co.', avatar: avatars[3] }, businessName: 'Creative Minds Co.', date: '2023-08-20', decision: 'approved', decidedBy: 'Admin User', reason: 'Excellent design portfolio.' },
  { id: 'rrh3', user: { name: 'John Doe', avatar: avatars[6] }, businessName: 'JD Services', date: '2024-01-07', decision: 'rejected', decidedBy: 'Super Admin', reason: 'Insufficient portfolio. Suggested to build more experience first.' },
  { id: 'rrh4', user: { name: 'PixelForge', avatar: avatars[5] }, businessName: 'PixelForge', date: '2024-02-11', decision: 'approved', decidedBy: 'Admin User', reason: 'Strong UI/UX background.' },
  { id: 'rrh5', user: { name: 'Jane Smith', avatar: avatars[4] }, businessName: 'Jane\'s Crafts', date: '2024-03-22', decision: 'rejected', decidedBy: 'Super Admin', reason: 'Business type not currently supported on platform.' },
  { id: 'rrh6', user: { name: 'DataViz Pro', avatar: avatars[7] }, businessName: 'DataViz Pro', date: '2024-05-09', decision: 'approved', decidedBy: 'Admin User', reason: 'Data science expertise confirmed.' },
  { id: 'rrh7', user: { name: 'Alex Johnson', avatar: avatars[0] }, businessName: 'AlexTech', date: '2024-06-18', decision: 'rejected', decidedBy: 'Admin User', reason: 'Duplicate account detected.' },
  { id: 'rrh8', user: { name: 'WebWiz Agency', avatar: avatars[7] }, businessName: 'WebWiz Agency', date: '2023-03-11', decision: 'approved', decidedBy: 'Super Admin', reason: 'Verified agency with team members.' },
  { id: 'rrh9', user: { name: 'MotionLab', avatar: avatars[1] }, businessName: 'MotionLab', date: '2024-07-03', decision: 'approved', decidedBy: 'Admin User', reason: 'Impressive video portfolio.' },
  { id: 'rrh10', user: { name: 'Sam Wilson', avatar: avatars[2] }, businessName: 'SamEdits', date: '2024-09-15', decision: 'rejected', decidedBy: 'Admin User', reason: 'Application incomplete — missing samples.' },
];

// ---- NEWS POSTS (6) ----
export const mockAdminNews = [
  { id: 'n1', title: 'KarBazar Launches AI-Powered Gig Matching', category: 'Product Update', author: 'Admin User', featuredImage: gigImages[0], status: 'published', date: '2026-02-15', content: 'We are excited to announce our new AI-powered gig matching system that connects clients with the perfect freelancers based on project requirements, budget, and past reviews.', excerpt: 'Our new AI matching system connects clients with the perfect freelancers.', tags: ['AI', 'Product', 'Matching'], views: 2340, publishDate: '2026-02-15T09:00' },
  { id: 'n2', title: 'Top 10 Tips for Freelancers in 2026', category: 'Blog', author: 'Admin User', featuredImage: gigImages[1], status: 'published', date: '2026-02-10', content: 'The freelance landscape is evolving rapidly. Here are our top tips for succeeding as a freelancer in 2026.', excerpt: 'Essential tips for freelancers to thrive in the modern gig economy.', tags: ['Freelancing', 'Tips', 'Career'], views: 1890, publishDate: '2026-02-10T12:00' },
  { id: 'n3', title: 'New Category: AI & Machine Learning', category: 'Announcement', author: 'Super Admin', featuredImage: gigImages[2], status: 'published', date: '2026-01-28', content: 'We have added a new category for AI and ML services to accommodate the growing demand for artificial intelligence solutions.', excerpt: 'A new category for AI and ML services is now live on KarBazar.', tags: ['Categories', 'AI', 'New Feature'], views: 980, publishDate: '2026-01-28T10:00' },
  { id: 'n4', title: 'Platform Maintenance Scheduled for March 1', category: 'Announcement', author: 'Admin User', featuredImage: null, status: 'draft', date: '2026-02-18', content: 'We will be performing scheduled maintenance on March 1st from 2:00 AM to 6:00 AM UTC.', excerpt: 'Scheduled downtime for platform improvements.', tags: ['Maintenance', 'Downtime'], views: 0, publishDate: '' },
  { id: 'n5', title: 'Success Story: How TechFlow Earned $50K on KarBazar', category: 'Success Story', author: 'Admin User', featuredImage: gigImages[3], status: 'published', date: '2026-01-15', content: 'Meet TechFlow Studio, one of our top-earning businesses that has built a thriving web development practice on KarBazar.', excerpt: 'How one agency leveraged KarBazar to build a $50K business.', tags: ['Success', 'Business', 'Inspiration'], views: 3200, publishDate: '2026-01-15T14:00' },
  { id: 'n6', title: 'Holiday Deals Campaign - Coming Soon', category: 'Promotion', author: 'Super Admin', featuredImage: gigImages[4], status: 'draft', date: '2026-02-19', content: 'Get ready for our biggest deals campaign yet with up to 50% off on selected services.', excerpt: 'Our biggest deals campaign is coming soon.', tags: ['Deals', 'Promotion', 'Holiday'], views: 0, publishDate: '' },
];

// ---- CATEGORIES (8) ----
export const mockAdminCategories = [
  { id: 'c1', name: 'Web Development', slug: 'web-development', icon: '💻', description: 'Websites, web apps, and web-based solutions', gigCount: 142, status: 'active', order: 1 },
  { id: 'c2', name: 'Graphic Design', slug: 'graphic-design', icon: '🎨', description: 'Logos, branding, illustrations, and visual design', gigCount: 98, status: 'active', order: 2 },
  { id: 'c3', name: 'Digital Marketing', slug: 'digital-marketing', icon: '📈', description: 'SEO, social media, email marketing, and ads', gigCount: 76, status: 'active', order: 3 },
  { id: 'c4', name: 'Video & Animation', slug: 'video-animation', icon: '🎬', description: 'Video editing, motion graphics, and animation', gigCount: 54, status: 'active', order: 4 },
  { id: 'c5', name: 'Writing & Translation', slug: 'writing-translation', icon: '✍️', description: 'Copywriting, content writing, and translation', gigCount: 89, status: 'active', order: 5 },
  { id: 'c6', name: 'Data Science', slug: 'data-science', icon: '📊', description: 'Data analysis, visualization, and machine learning', gigCount: 31, status: 'active', order: 6 },
  { id: 'c7', name: 'AI & Machine Learning', slug: 'ai-machine-learning', icon: '🤖', description: 'AI chatbots, ML models, and automation', gigCount: 23, status: 'active', order: 7 },
  { id: 'c8', name: 'UI/UX Design', slug: 'ui-ux-design', icon: '📱', description: 'User interface and experience design', gigCount: 67, status: 'active', order: 8 },
];

// ---- SPONSORSHIPS (3) ----
export const mockAdminSponsorships = [
  { id: 'sp1', gigId: 1, gigTitle: 'Professional React Website Development', business: 'TechFlow Studio', image: gigImages[0], startDate: '2026-02-01', endDate: '2026-03-01', daysRemaining: 10, status: 'active', amount: 150, position: 'homepage' },
  { id: 'sp2', gigId: 4, gigTitle: 'Mobile App UI/UX Design', business: 'PixelForge', image: gigImages[3], startDate: '2026-01-15', endDate: '2026-02-28', daysRemaining: 9, status: 'active', amount: 120, position: 'category' },
  { id: 'sp3', gigId: 6, gigTitle: 'WordPress Theme Customization', business: 'WebWiz Agency', image: gigImages[5], startDate: '2026-02-10', endDate: '2026-02-20', daysRemaining: 1, status: 'active', amount: 80, position: 'homepage' },
];

// ---- ANALYTICS DATA ----
export const mockAnalyticsData = {
  summary: {
    totalUsers: 2847,
    newUsers: 186,
    totalGigs: 580,
    totalOrders: 4523,
    activeDeals: 8,
    revenue: 128500,
    usersTrend: 12,
    newUsersTrend: 8,
    gigsTrend: 5,
    ordersTrend: -3,
    dealsTrend: -10,
    revenueTrend: 15,
  },
  userGrowth: [
    { month: 'Mar 25', clients: 1200, businesses: 180 },
    { month: 'Apr 25', clients: 1350, businesses: 195 },
    { month: 'May 25', clients: 1480, businesses: 210 },
    { month: 'Jun 25', clients: 1550, businesses: 228 },
    { month: 'Jul 25', clients: 1700, businesses: 245 },
    { month: 'Aug 25', clients: 1820, businesses: 260 },
    { month: 'Sep 25', clients: 1950, businesses: 278 },
    { month: 'Oct 25', clients: 2050, businesses: 290 },
    { month: 'Nov 25', clients: 2180, businesses: 310 },
    { month: 'Dec 25', clients: 2300, businesses: 325 },
    { month: 'Jan 26', clients: 2500, businesses: 340 },
    { month: 'Feb 26', clients: 2650, businesses: 355 },
  ],
  gigsPosted: [
    { month: 'Sep 25', count: 28 },
    { month: 'Oct 25', count: 35 },
    { month: 'Nov 25', count: 42 },
    { month: 'Dec 25', count: 31 },
    { month: 'Jan 26', count: 38 },
    { month: 'Feb 26', count: 12 },
  ],
  weeklyOrders: [
    { day: 'Jan 20', orders: 45 }, { day: 'Jan 21', orders: 52 }, { day: 'Jan 22', orders: 38 }, { day: 'Jan 23', orders: 61 }, { day: 'Jan 24', orders: 55 }, { day: 'Jan 25', orders: 30 }, { day: 'Jan 26', orders: 28 },
    { day: 'Jan 27', orders: 48 }, { day: 'Jan 28', orders: 56 }, { day: 'Jan 29', orders: 42 }, { day: 'Jan 30', orders: 65 }, { day: 'Jan 31', orders: 58 }, { day: 'Feb 1', orders: 33 }, { day: 'Feb 2', orders: 25 },
    { day: 'Feb 3', orders: 50 }, { day: 'Feb 4', orders: 62 }, { day: 'Feb 5', orders: 44 }, { day: 'Feb 6', orders: 70 }, { day: 'Feb 7', orders: 63 }, { day: 'Feb 8', orders: 38 }, { day: 'Feb 9', orders: 29 },
    { day: 'Feb 10', orders: 53 }, { day: 'Feb 11', orders: 67 }, { day: 'Feb 12', orders: 48 }, { day: 'Feb 13', orders: 72 }, { day: 'Feb 14', orders: 80 }, { day: 'Feb 15', orders: 45 }, { day: 'Feb 16', orders: 35 },
    { day: 'Feb 17', orders: 55 }, { day: 'Feb 18', orders: 60 },
  ],
  dealsByCategory: [
    { name: 'Web Development', value: 3, fill: '#2563EB' },
    { name: 'Digital Marketing', value: 2, fill: '#F97316' },
    { name: 'Graphic Design', value: 1, fill: '#7C3AED' },
    { name: 'AI & ML', value: 1, fill: '#10B981' },
    { name: 'Video & Animation', value: 1, fill: '#F59E0B' },
  ],
  gigsByCategory: [
    { name: 'Web Dev', value: 142, fill: '#2563EB' },
    { name: 'Graphic Design', value: 98, fill: '#F97316' },
    { name: 'Writing', value: 89, fill: '#10B981' },
    { name: 'Marketing', value: 76, fill: '#7C3AED' },
    { name: 'UI/UX', value: 67, fill: '#F59E0B' },
    { name: 'Video', value: 54, fill: '#EF4444' },
    { name: 'Data Science', value: 31, fill: '#06B6D4' },
    { name: 'AI & ML', value: 23, fill: '#EC4899' },
  ],
  ordersByStatus: [
    { name: 'Completed', value: 2890, fill: '#10B981' },
    { name: 'In Progress', value: 520, fill: '#F59E0B' },
    { name: 'Delivered', value: 380, fill: '#7C3AED' },
    { name: 'Cancelled', value: 430, fill: '#EF4444' },
    { name: 'Placed', value: 303, fill: '#2563EB' },
  ],
  dealsUsage: [
    { category: 'Web Dev', redemptions: 45 },
    { category: 'Design', redemptions: 38 },
    { category: 'Marketing', redemptions: 32 },
    { category: 'Video', redemptions: 28 },
    { category: 'Writing', redemptions: 20 },
    { category: 'AI & ML', redemptions: 15 },
  ],
  topBusinesses: [
    { rank: 1, name: 'WebWiz Agency', revenue: 28500, orders: 112, gigs: 15, rating: 4.8 },
    { rank: 2, name: 'TechFlow Studio', revenue: 22300, orders: 89, gigs: 12, rating: 4.7 },
    { rank: 3, name: 'Creative Minds Co.', revenue: 18700, orders: 67, gigs: 9, rating: 4.5 },
    { rank: 4, name: 'DesignHub', revenue: 14200, orders: 56, gigs: 8, rating: 4.3 },
    { rank: 5, name: 'PixelForge', revenue: 11800, orders: 45, gigs: 7, rating: 4.6 },
  ],
};

// ---- PLATFORM STATS (dashboard) ----
export const mockDashboardStats = {
  totalUsers: 2847,
  businessAccounts: 355,
  totalGigs: 580,
  totalOrders: 4523,
  newUsersToday: 18,
  gigsThisMonth: 12,
  activeOrders: 520,
  pendingRoleRequests: 5,
};

// ---- PLATFORM SETTINGS ----
export const mockPlatformSettings = {
  siteName: 'KarBazar',
  tagline: 'Your Marketplace for Professional Services',
  contactEmail: 'admin@karbazar.com',
  logoUrl: null,
  faviconUrl: null,
  maxGigTitleLength: 80,
  maxGigDescLength: 5000,
  maxGigImages: 5,
  maxReviewLength: 1000,
  maxPortfolioItems: 10,
  maxImageSizeMB: 8,
  maxAvatarSizeMB: 5,
  allowedImageFormats: 'jpg, png, webp',
  maintenanceMode: false,
  allowRegistration: true,
  allowBusinessRegistration: true,
  enableReviews: true,
  enableDeals: true,
  enableSponsorships: true,
  defaultCurrency: 'USD',
};
