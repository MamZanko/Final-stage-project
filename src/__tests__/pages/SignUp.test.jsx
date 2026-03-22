import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../../pages/public/SignUp';
import { useAuthStore } from '../../store/authStore';

function filterMotionProps(props) {
  const { initial, animate, exit, transition, whileHover, whileTap, variants, layout, whileFocus, whileInView, onAnimationComplete, ...rest } = props;
  return rest;
}

// Mock framer-motion
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

const renderSignUp = () => {
  return render(
    <MemoryRouter initialEntries={['/signup']}>
      <SignUp />
    </MemoryRouter>
  );
};

describe('SignUp Page', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    });
  });

  it('renders signup form', () => {
    renderSignUp();
    expect(screen.getByText('Join KarBazar Today')).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    renderSignUp();
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('johndoe123')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('renders create account button', () => {
    renderSignUp();
    const submitBtn = screen.getByRole('button', { name: /create account/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('renders link to login page', () => {
    renderSignUp();
    expect(screen.getByText(/Log In/)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    // Use a string with @ that jsdom accepts but fails the app's email regex (no dot after domain)
    await user.type(emailInput, 'user@invalid');

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('shows error for short password', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    await user.type(passwordInput, '123');

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('shows error for mismatched passwords', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    await user.type(passwordInput, 'password123');
    await user.type(confirmInput, 'different456');

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('shows password strength indicator when typing', async () => {
    const user = userEvent.setup();
    renderSignUp();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    await user.type(passwordInput, 'StrongP@ss1');

    await waitFor(() => {
      // Should show one of: Weak, Fair, Strong, Very Strong
      const strengthEl = screen.queryByText(/Weak|Fair|Strong|Very Strong/);
      expect(strengthEl).toBeInTheDocument();
    });
  });

  it('shows terms agreement checkbox', () => {
    renderSignUp();
    // The checkbox is sr-only but still accessible
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThanOrEqual(1);
  });
});
