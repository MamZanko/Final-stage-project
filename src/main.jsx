import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { useThemeStore } from './store/themeStore';
import './index.css';

// Theme initializer component
const ThemeInitializer = ({ children }) => {
  const { theme } = useThemeStore();

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeInitializer>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        gutter={12}
        containerStyle={{ margin: '8px' }}
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: 'var(--color-card-bg)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-success)',
            },
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: 'var(--color-card-bg)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-error)',
            },
            iconTheme: {
              primary: 'var(--color-error)',
              secondary: 'white',
            },
          },
          style: {
            fontSize: '14px',
            maxWidth: '400px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'var(--color-card-bg)',
            color: 'var(--color-text)',
          },
        }}
      />
    </ThemeInitializer>
  </React.StrictMode>
);
