import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  checkUsername: (username) => api.get(`/auth/check-username/${username}`),
};

export const profileService = {
  update: (data) => api.put('/profile', data),
  updateUsername: (username) => api.put('/profile/username', { username }),
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateCover: (file) => {
    const formData = new FormData();
    formData.append('cover', file);
    return api.post('/profile/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateSkills: (skills) => api.put('/profile/skills', { skills }),
  updateLanguages: (languages) => api.put('/profile/languages', { languages }),
  updatePassword: (data) => api.put('/profile/password', data),
};

export const userService = {
  list: (params = {}) => api.get('/users', { params }),
  getProfile: (username) => api.get(`/users/${username}`),
  getSavedBusinesses: (params = {}) => api.get('/users/me/saved', { params }),
  toggleSave: (userId) => api.post(`/users/${userId}/save`),
};

export const gigService = {
  list: (params = {}) => api.get('/gigs', { params }),
  get: (id) => api.get(`/gigs/${id}`),
  myGigs: (params = {}) => api.get('/gigs/my', { params }),
  create: (formData) =>
    api.post('/gigs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/gigs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/gigs/${id}`),
  categories: () => api.get('/categories'),
};

export const discountService = {
  listForGig: (gigId) => api.get(`/gigs/${gigId}/discounts`),
  create: (packageId, data) => api.post(`/packages/${packageId}/discounts`, data),
  update: (id, data) => api.put(`/discounts/${id}`, data),
  delete: (id) => api.delete(`/discounts/${id}`),
};

export const reviewService = {
  listForGig: (gigId, params = {}) => api.get(`/gigs/${gigId}/reviews`, { params }),
  create: (gigId, data) => api.post(`/gigs/${gigId}/reviews`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  report: (id) => api.post(`/reviews/${id}/report`),
};

export const experienceService = {
  list: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const projectService = {
  list: () => api.get('/projects'),
  create: (formData) =>
    api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMedia: (id, formData) =>
    api.post(`/projects/${id}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  removeMedia: (projectId, mediaId) => api.delete(`/projects/${projectId}/media/${mediaId}`),
};

export const orderService = {
  list: (params = {}) => api.get('/orders', { params }),
  get: (id) => api.get(`/orders/${id}`),
  create: (packageId) => api.post('/orders', { package_id: packageId }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  deliver: (id, formData) =>
    api.post(`/orders/${id}/deliver`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  stats: () => api.get('/orders/stats'),
};

export const messageService = {
  getConversations: (params = {}) => api.get('/conversations', { params }),
  startConversation: (recipientId) => api.post('/conversations', { recipient_id: recipientId }),
  getMessages: (conversationId, params = {}) =>
    api.get(`/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, formData) =>
    api.post(`/conversations/${conversationId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  markRead: (messageId) => api.put(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get('/conversations/unread-count'),
};

export const notificationService = {
  list: (params = {}) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const roleRequestService = {
  submit: (data) => api.post('/role-requests', data),
  mine: () => api.get('/role-requests/mine'),
};

export const newsService = {
  list: (params = {}) => api.get('/news', { params }),
  get: (slug) => api.get(`/news/${slug}`),
};

export const adminService = {
  // Dashboard
  dashboard: () => api.get('/admin/dashboard'),

  // Users
  listUsers: (params = {}) => api.get('/admin/users', { params }),
  banUser: (id, data) => api.put(`/admin/users/${id}/ban`, data),
  unbanUser: (id) => api.put(`/admin/users/${id}/unban`),
  toggleTopRated: (id) => api.put(`/admin/users/${id}/top-rated`),
  changeRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),

  // Role requests
  listRoleRequests: (params = {}) => api.get('/admin/role-requests', { params }),
  approveRoleRequest: (id) => api.put(`/admin/role-requests/${id}/approve`),
  rejectRoleRequest: (id, reason) =>
    api.put(`/admin/role-requests/${id}/reject`, { rejection_reason: reason }),

  // Gigs
  listGigs: (params = {}) => api.get('/admin/gigs', { params }),
  updateGigStatus: (id, status) => api.put(`/admin/gigs/${id}/status`, { status }),

  // Sponsorships
  listSponsorships: (params = {}) => api.get('/admin/sponsorships', { params }),
  createSponsorship: (data) => api.post('/admin/sponsorships', data),
  deleteSponsorship: (id) => api.delete(`/admin/sponsorships/${id}`),

  // Reviews
  reportedReviews: () => api.get('/admin/reviews/reported'),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
  dismissReport: (id) => api.put(`/admin/reviews/${id}/dismiss`),

  // Categories
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings) => api.put('/admin/settings', { settings }),

  // News
  listNews: (params = {}) => api.get('/admin/news', { params }),
  createNews: (formData) =>
    api.post('/admin/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateNews: (id, formData) =>
    api.put(`/admin/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteNews: (id) => api.delete(`/admin/news/${id}`),

  // Orders
  listOrders: (params = {}) => api.get('/admin/orders', { params }),
};
