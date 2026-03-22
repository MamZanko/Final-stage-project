import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAuthStore.setState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    });
  });

  it('starts with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.role).toBeNull();
  });

  it('login sets user, token, role, and isAuthenticated', () => {
    const userData = {
      user: { id: 1, name: 'John', username: 'john', email: 'john@test.com', role: 'client' },
      token: 'test-token-123',
    };

    useAuthStore.getState().login(userData);
    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(userData.user);
    expect(state.token).toBe('test-token-123');
    expect(state.role).toBe('client');
  });

  it('login defaults role to client when user has no role', () => {
    const userData = {
      user: { id: 1, name: 'John' },
      token: 'test-token',
    };

    useAuthStore.getState().login(userData);
    expect(useAuthStore.getState().role).toBe('client');
  });

  it('login correctly sets admin role', () => {
    useAuthStore.getState().login({
      user: { id: 1, name: 'Admin', role: 'admin' },
      token: 'admin-token',
    });

    expect(useAuthStore.getState().role).toBe('admin');
  });

  it('login correctly sets business role', () => {
    useAuthStore.getState().login({
      user: { id: 2, name: 'Biz', role: 'business' },
      token: 'biz-token',
    });

    expect(useAuthStore.getState().role).toBe('business');
  });

  it('logout clears all auth state', () => {
    // First login
    useAuthStore.getState().login({
      user: { id: 1, name: 'John', role: 'client' },
      token: 'test-token',
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Then logout
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.role).toBeNull();
  });

  it('updateUser merges partial user data', () => {
    useAuthStore.getState().login({
      user: { id: 1, name: 'John', email: 'john@test.com', role: 'client' },
      token: 'token',
    });

    useAuthStore.getState().updateUser({ name: 'Johnny', bio: 'Updated bio' });
    const user = useAuthStore.getState().user;

    expect(user.name).toBe('Johnny');
    expect(user.bio).toBe('Updated bio');
    expect(user.email).toBe('john@test.com'); // unchanged
    expect(user.id).toBe(1); // unchanged
  });

  it('getToken returns current token', () => {
    useAuthStore.getState().login({
      user: { id: 1, name: 'John', role: 'client' },
      token: 'my-secret-token',
    });

    expect(useAuthStore.getState().getToken()).toBe('my-secret-token');
  });

  it('getToken returns null when not authenticated', () => {
    expect(useAuthStore.getState().getToken()).toBeNull();
  });
});
