import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/public/Login';
import { useAuthStore } from '../../store/authStore';

function filterMotionProps(props) {
  const { initial, animate, exit, transition, whileHover, whileTap, variants, layout, whileFocus, whileInView, onAnimationComplete, ...rest } = props;
  return rest;
}

// Mock framer-motion to avoid animation complexity
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...filterMotionProps(props)}>{children}</div>,
    span: ({ children, ...props }) => <span {...filterMotionProps(props)}>{children}</span>,
    p: ({ children, ...props }) => <p {...filterMotionProps(props)}>{children}</p>,
    svg: ({ children, ...props }) => <svg {...filterMotionProps(props)}>{children}</svg>,
    button: ({ children, onClick, disabled, className, type, ...props }) => (
      <button onClick={onClick} disabled={disabled} className={className} type={type}>{children}</button>
    ),
    form: ({ children, onSubmit, className, ...props }) => (
      <form onSubmit={onSubmit} className={className}>{children}</form>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const renderLogin = () => {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    });
  });

  it('renders login form', () => {
    renderLogin();
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    renderLogin();
    const signInBtn = screen.getByRole('button', { name: /log in/i });
    expect(signInBtn).toBeInTheDocument();
  });

  it('renders link to signup page', () => {
    renderLogin();
    expect(screen.getByText(/Sign Up Free/i)).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    renderLogin();
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
  });

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup();
    renderLogin();

    const submitBtn = screen.getByRole('button', { name: /log in/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for empty password', async () => {
    const user = userEvent.setup();
    renderLogin();

    const submitBtn = screen.getByRole('button', { name: /log in/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    // Use a string with @ that jsdom accepts but fails the app's email regex (no dot after domain)
    await user.type(emailInput, 'user@invalid');

    const submitBtn = screen.getByRole('button', { name: /log in/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, '123');

    const submitBtn = screen.getByRole('button', { name: /log in/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('clears field error when user types', async () => {
    const user = userEvent.setup();
    renderLogin();

    // Submit with empty fields to trigger errors
    await user.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    // Type in email field — error should clear
    const emailInput = screen.getByPlaceholderText('you@example.com');
    await user.type(emailInput, 'test');
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the toggle button (eye icon)
    const toggleBtn = passwordInput.closest('div').querySelector('button');
    if (toggleBtn) {
      await user.click(toggleBtn);
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });
});
