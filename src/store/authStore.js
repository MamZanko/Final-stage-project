import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null, // 'admin' | 'business' | 'client' | null
      isAuthenticated: false,

      login: (userData) => {
        set({
          user: userData.user,
          token: userData.token,
          role: userData.user?.role || 'client',
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      getToken: () => get().token,
    }),
    {
      name: 'karbazar-auth',
    }
  )
);

export { useAuthStore };
export default useAuthStore;
