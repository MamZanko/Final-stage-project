import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted so mockApi is available inside vi.mock factory (hoisted above imports)
const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  default: mockApi,
}));

import {
  authService,
  profileService,
  userService,
  gigService,
  discountService,
  reviewService,
  orderService,
  messageService,
  notificationService,
  roleRequestService,
  newsService,
  adminService,
} from '../../services/apiServices';

describe('apiServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Auth Service ──────────────────────────────────────
  describe('authService', () => {
    it('register calls POST /auth/register', () => {
      const data = { name: 'Test', email: 'test@test.com', password: '123456' };
      authService.register(data);
      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', data);
    });

    it('login calls POST /auth/login', () => {
      authService.login({ email: 'test@test.com', password: '123456' });
      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: '123456' });
    });

    it('logout calls POST /auth/logout', () => {
      authService.logout();
      expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('me calls GET /auth/me', () => {
      authService.me();
      expect(mockApi.get).toHaveBeenCalledWith('/auth/me');
    });

    it('checkUsername calls GET with username', () => {
      authService.checkUsername('john');
      expect(mockApi.get).toHaveBeenCalledWith('/auth/check-username/john');
    });

    it('forgotPassword calls POST /auth/forgot-password', () => {
      authService.forgotPassword('test@test.com');
      expect(mockApi.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'test@test.com' });
    });
  });

  // ── Profile Service ───────────────────────────────────
  describe('profileService', () => {
    it('update calls PUT /profile', () => {
      profileService.update({ name: 'New Name' });
      expect(mockApi.put).toHaveBeenCalledWith('/profile', { name: 'New Name' });
    });

    it('updateUsername calls PUT /profile/username', () => {
      profileService.updateUsername('newname');
      expect(mockApi.put).toHaveBeenCalledWith('/profile/username', { username: 'newname' });
    });

    it('updateSkills calls PUT /profile/skills', () => {
      profileService.updateSkills(['PHP', 'React']);
      expect(mockApi.put).toHaveBeenCalledWith('/profile/skills', { skills: ['PHP', 'React'] });
    });

    it('updateLanguages calls PUT /profile/languages', () => {
      profileService.updateLanguages(['English', 'Kurdish']);
      expect(mockApi.put).toHaveBeenCalledWith('/profile/languages', { languages: ['English', 'Kurdish'] });
    });

    it('updatePassword calls PUT /profile/password', () => {
      profileService.updatePassword({ current_password: 'old', password: 'new123', password_confirmation: 'new123' });
      expect(mockApi.put).toHaveBeenCalledWith('/profile/password', {
        current_password: 'old',
        password: 'new123',
        password_confirmation: 'new123',
      });
    });
  });

  // ── User Service ──────────────────────────────────────
  describe('userService', () => {
    it('list calls GET /users', () => {
      userService.list({ page: 1 });
      expect(mockApi.get).toHaveBeenCalledWith('/users', { params: { page: 1 } });
    });

    it('getProfile calls GET /users/:username', () => {
      userService.getProfile('johndoe');
      expect(mockApi.get).toHaveBeenCalledWith('/users/johndoe');
    });

    it('toggleSave calls POST /users/:id/save', () => {
      userService.toggleSave(5);
      expect(mockApi.post).toHaveBeenCalledWith('/users/5/save');
    });
  });

  // ── Gig Service ───────────────────────────────────────
  describe('gigService', () => {
    it('list calls GET /gigs with params', () => {
      gigService.list({ category: 'design' });
      expect(mockApi.get).toHaveBeenCalledWith('/gigs', { params: { category: 'design' } });
    });

    it('get calls GET /gigs/:id', () => {
      gigService.get(1);
      expect(mockApi.get).toHaveBeenCalledWith('/gigs/1');
    });

    it('myGigs calls GET /gigs/my', () => {
      gigService.myGigs();
      expect(mockApi.get).toHaveBeenCalledWith('/gigs/my', { params: {} });
    });

    it('delete calls DELETE /gigs/:id', () => {
      gigService.delete(3);
      expect(mockApi.delete).toHaveBeenCalledWith('/gigs/3');
    });

    it('categories calls GET /categories', () => {
      gigService.categories();
      expect(mockApi.get).toHaveBeenCalledWith('/categories');
    });
  });

  // ── Discount Service ──────────────────────────────────
  describe('discountService', () => {
    it('listForGig calls GET /gigs/:gigId/discounts', () => {
      discountService.listForGig(5);
      expect(mockApi.get).toHaveBeenCalledWith('/gigs/5/discounts');
    });

    it('create calls POST /packages/:id/discounts', () => {
      discountService.create(3, { percent: 20 });
      expect(mockApi.post).toHaveBeenCalledWith('/packages/3/discounts', { percent: 20 });
    });

    it('update calls PUT /discounts/:id', () => {
      discountService.update(1, { percent: 30 });
      expect(mockApi.put).toHaveBeenCalledWith('/discounts/1', { percent: 30 });
    });

    it('delete calls DELETE /discounts/:id', () => {
      discountService.delete(1);
      expect(mockApi.delete).toHaveBeenCalledWith('/discounts/1');
    });
  });

  // ── Review Service ────────────────────────────────────
  describe('reviewService', () => {
    it('listForGig calls GET /gigs/:gigId/reviews', () => {
      reviewService.listForGig(1, { page: 2 });
      expect(mockApi.get).toHaveBeenCalledWith('/gigs/1/reviews', { params: { page: 2 } });
    });

    it('create calls POST /gigs/:gigId/reviews', () => {
      reviewService.create(1, { rating: 5, comment: 'Great' });
      expect(mockApi.post).toHaveBeenCalledWith('/gigs/1/reviews', { rating: 5, comment: 'Great' });
    });

    it('report calls POST /reviews/:id/report', () => {
      reviewService.report(3);
      expect(mockApi.post).toHaveBeenCalledWith('/reviews/3/report');
    });
  });

  // ── Order Service ─────────────────────────────────────
  describe('orderService', () => {
    it('list calls GET /orders', () => {
      orderService.list({ status: 'completed' });
      expect(mockApi.get).toHaveBeenCalledWith('/orders', { params: { status: 'completed' } });
    });

    it('get calls GET /orders/:id', () => {
      orderService.get(10);
      expect(mockApi.get).toHaveBeenCalledWith('/orders/10');
    });

    it('create calls POST /orders with package_id', () => {
      orderService.create(5);
      expect(mockApi.post).toHaveBeenCalledWith('/orders', { package_id: 5 });
    });

    it('updateStatus calls PUT /orders/:id/status', () => {
      orderService.updateStatus(1, 'in_progress');
      expect(mockApi.put).toHaveBeenCalledWith('/orders/1/status', { status: 'in_progress' });
    });

    it('stats calls GET /orders/stats', () => {
      orderService.stats();
      expect(mockApi.get).toHaveBeenCalledWith('/orders/stats');
    });
  });

  // ── Message Service ───────────────────────────────────
  describe('messageService', () => {
    it('getConversations calls GET /conversations', () => {
      messageService.getConversations();
      expect(mockApi.get).toHaveBeenCalledWith('/conversations', { params: {} });
    });

    it('startConversation calls POST /conversations', () => {
      messageService.startConversation(5);
      expect(mockApi.post).toHaveBeenCalledWith('/conversations', { recipient_id: 5 });
    });

    it('markRead calls PUT /messages/:id/read', () => {
      messageService.markRead(10);
      expect(mockApi.put).toHaveBeenCalledWith('/messages/10/read');
    });

    it('getUnreadCount calls GET /conversations/unread-count', () => {
      messageService.getUnreadCount();
      expect(mockApi.get).toHaveBeenCalledWith('/conversations/unread-count');
    });
  });

  // ── Notification Service ──────────────────────────────
  describe('notificationService', () => {
    it('list calls GET /notifications', () => {
      notificationService.list({ page: 1 });
      expect(mockApi.get).toHaveBeenCalledWith('/notifications', { params: { page: 1 } });
    });

    it('markRead calls PUT /notifications/:id/read', () => {
      notificationService.markRead(3);
      expect(mockApi.put).toHaveBeenCalledWith('/notifications/3/read');
    });

    it('markAllRead calls PUT /notifications/read-all', () => {
      notificationService.markAllRead();
      expect(mockApi.put).toHaveBeenCalledWith('/notifications/read-all');
    });

    it('delete calls DELETE /notifications/:id', () => {
      notificationService.delete(2);
      expect(mockApi.delete).toHaveBeenCalledWith('/notifications/2');
    });
  });

  // ── Role Request Service ──────────────────────────────
  describe('roleRequestService', () => {
    it('submit calls POST /role-requests', () => {
      roleRequestService.submit({ business_name: 'My Biz' });
      expect(mockApi.post).toHaveBeenCalledWith('/role-requests', { business_name: 'My Biz' });
    });

    it('mine calls GET /role-requests/mine', () => {
      roleRequestService.mine();
      expect(mockApi.get).toHaveBeenCalledWith('/role-requests/mine');
    });
  });

  // ── News Service ──────────────────────────────────────
  describe('newsService', () => {
    it('list calls GET /news', () => {
      newsService.list();
      expect(mockApi.get).toHaveBeenCalledWith('/news', { params: {} });
    });

    it('get calls GET /news/:slug', () => {
      newsService.get('my-article');
      expect(mockApi.get).toHaveBeenCalledWith('/news/my-article');
    });
  });

  // ── Admin Service ─────────────────────────────────────
  describe('adminService', () => {
    it('dashboard calls GET /admin/dashboard', () => {
      adminService.dashboard();
      expect(mockApi.get).toHaveBeenCalledWith('/admin/dashboard');
    });

    it('banUser calls PUT /admin/users/:id/ban', () => {
      adminService.banUser(3, { reason: 'spam' });
      expect(mockApi.put).toHaveBeenCalledWith('/admin/users/3/ban', { reason: 'spam' });
    });

    it('unbanUser calls PUT /admin/users/:id/unban', () => {
      adminService.unbanUser(3);
      expect(mockApi.put).toHaveBeenCalledWith('/admin/users/3/unban');
    });

    it('approveRoleRequest calls PUT', () => {
      adminService.approveRoleRequest(5);
      expect(mockApi.put).toHaveBeenCalledWith('/admin/role-requests/5/approve');
    });

    it('rejectRoleRequest calls PUT with reason', () => {
      adminService.rejectRoleRequest(5, 'Not qualified');
      expect(mockApi.put).toHaveBeenCalledWith('/admin/role-requests/5/reject', { rejection_reason: 'Not qualified' });
    });

    it('updateGigStatus calls PUT /admin/gigs/:id/status', () => {
      adminService.updateGigStatus(1, 'suspended');
      expect(mockApi.put).toHaveBeenCalledWith('/admin/gigs/1/status', { status: 'suspended' });
    });

    it('createCategory calls POST /admin/categories', () => {
      adminService.createCategory({ name: 'Tech', slug: 'tech' });
      expect(mockApi.post).toHaveBeenCalledWith('/admin/categories', { name: 'Tech', slug: 'tech' });
    });

    it('deleteCategory calls DELETE /admin/categories/:id', () => {
      adminService.deleteCategory(2);
      expect(mockApi.delete).toHaveBeenCalledWith('/admin/categories/2');
    });

    it('getSettings calls GET /admin/settings', () => {
      adminService.getSettings();
      expect(mockApi.get).toHaveBeenCalledWith('/admin/settings');
    });

    it('updateSettings calls PUT /admin/settings', () => {
      adminService.updateSettings({ maintenance_mode: true });
      expect(mockApi.put).toHaveBeenCalledWith('/admin/settings', { settings: { maintenance_mode: true } });
    });

    it('deleteNews calls DELETE /admin/news/:id', () => {
      adminService.deleteNews(5);
      expect(mockApi.delete).toHaveBeenCalledWith('/admin/news/5');
    });

    it('createSponsorship calls POST /admin/sponsorships', () => {
      adminService.createSponsorship({ gig_id: 1, amount: 100 });
      expect(mockApi.post).toHaveBeenCalledWith('/admin/sponsorships', { gig_id: 1, amount: 100 });
    });

    it('deleteSponsorship calls DELETE /admin/sponsorships/:id', () => {
      adminService.deleteSponsorship(3);
      expect(mockApi.delete).toHaveBeenCalledWith('/admin/sponsorships/3');
    });

    it('toggleTopRated calls PUT /admin/users/:id/top-rated', () => {
      adminService.toggleTopRated(7);
      expect(mockApi.put).toHaveBeenCalledWith('/admin/users/7/top-rated');
    });

    it('changeRole calls PUT /admin/users/:id/role', () => {
      adminService.changeRole(4, 'business');
      expect(mockApi.put).toHaveBeenCalledWith('/admin/users/4/role', { role: 'business' });
    });

    it('reportedReviews calls GET /admin/reviews/reported', () => {
      adminService.reportedReviews();
      expect(mockApi.get).toHaveBeenCalledWith('/admin/reviews/reported');
    });

    it('dismissReport calls PUT /admin/reviews/:id/dismiss', () => {
      adminService.dismissReport(8);
      expect(mockApi.put).toHaveBeenCalledWith('/admin/reviews/8/dismiss');
    });
  });
});
