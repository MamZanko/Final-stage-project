import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      initTheme: () => {
        const stored = get().theme;
        if (stored === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (!stored || stored === 'light') {
          // Check OS preference for guests
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            set({ theme: 'dark' });
            document.documentElement.classList.add('dark');
          }
        }
      },
    }),
    {
      name: 'karbazar-theme',
    }
  )
);

export { useThemeStore };
export default useThemeStore;
