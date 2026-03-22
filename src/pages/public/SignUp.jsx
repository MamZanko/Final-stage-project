import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, UserIcon, AtSymbolIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore';
import { pageTransition, staggerContainer, staggerItem, buttonVariants } from '../../lib/animations';
import useSEO from '../../lib/useSEO';
import api from '../../services/api';

// Password strength calculator
const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-error' };
  if (score === 2) return { level: 2, label: 'Fair', color: 'bg-secondary' };
  if (score === 3) return { level: 3, label: 'Strong', color: 'bg-primary' };
  return { level: 4, label: 'Very Strong', color: 'bg-success' };
};

const SignUp = () => {
  useSEO({
    title: 'Create Account',
    description: 'Sign up for KarBazar to start hiring freelancers or offering your services. Free registration for clients and businesses.',
    noindex: true,
  });

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null | 'checking' | 'available' | 'taken'
  const [generalError, setGeneralError] = useState('');

  const passwordStrength = getPasswordStrength(form.password);

  // Debounced username availability check
  useEffect(() => {
    if (!form.username || form.username.length < 2) {
      setUsernameStatus(null);
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/auth/check-username/${form.username}`);
        setUsernameStatus(res.data?.available || res.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('available');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.username]);

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters';
    else if (usernameStatus === 'taken') errs.username = 'This username is already taken';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms) errs.agreeTerms = 'You must agree to the terms and conditions';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (generalError) setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      const res = await api.post('/auth/register', {
        name: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      });

      const user = res.data?.user || res.user;
      const token = res.data?.token || res.token;

      login({ user, token });
      navigate('/profile/' + user.username);
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please try again.';
      if (err?.errors) {
        const fieldErrors = {};
        Object.entries(err.errors).forEach(([key, msgs]) => {
          const fieldMap = { name: 'fullName', password_confirmation: 'confirmPassword' };
          fieldErrors[fieldMap[key] || key] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(fieldErrors);
      } else {
        setGeneralError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const ErrorMessage = ({ error }) => (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -5 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-error text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div {...pageTransition} className="min-h-[calc(100vh-140px)] flex">
      {/* Left Side — Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary to-secondary-dark relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 text-white text-center max-w-md"
        >
          {/* Illustration */}
          <div className="mb-8">
            <svg className="w-64 h-64 mx-auto opacity-90" viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="140" r="55" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
              <circle cx="200" cy="120" r="22" fill="white" fillOpacity="0.2" />
              <path d="M155 185 C155 160 245 160 245 185 L245 200 L155 200 Z" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
              <rect x="100" y="220" width="200" height="120" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" strokeWidth="2" />
              <rect x="125" y="250" width="150" height="10" rx="5" fill="white" fillOpacity="0.2" />
              <rect x="125" y="275" width="150" height="10" rx="5" fill="white" fillOpacity="0.2" />
              <rect x="125" y="300" width="80" height="26" rx="6" fill="white" fillOpacity="0.3" />
              <circle cx="320" cy="100" r="30" fill="white" fillOpacity="0.08" />
              <circle cx="80" cy="300" r="20" fill="white" fillOpacity="0.08" />
              <path d="M345 340 L360 325 L375 340" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <h2 className="text-2xl font-heading font-bold mb-4">Join KarBazar Today</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Create your free account and start connecting with businesses and clients worldwide. No hidden fees, ever.
          </p>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/90 italic text-sm leading-relaxed mb-4">
              "Within a week of signing up, I landed my first three clients. KarBazar makes it so easy to showcase your work!"
            </p>
            <div className="flex items-center justify-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="Marcus Rivera"
                className="w-10 h-10 rounded-full border-2 border-white/30"
              />
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Marcus Rivera</p>
                <p className="text-white/60 text-xs">Full-Stack Developer</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side — Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-[var(--color-bg)]">
        <motion.div
          {...staggerContainer(0.06)}
          initial="initial"
          animate="animate"
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div {...staggerItem} className="text-center mb-6">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-heading font-extrabold">
                <span className="text-primary">Kar</span>
                <span className="text-secondary">Bazar</span>
              </h1>
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm mt-2">Create your free account</p>
          </motion.div>

          {/* General Error */}
          <AnimatePresence>
            {generalError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm">
                  {generalError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <motion.div {...staggerItem}>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 ${
                    errors.fullName ? 'border-error' : 'border-[var(--color-border)]'
                  }`}
                />
              </div>
              <ErrorMessage error={errors.fullName} />
            </motion.div>

            {/* Username */}
            <motion.div {...staggerItem}>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Username</label>
              <div className="relative">
                <AtSymbolIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe123"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 ${
                    errors.username ? 'border-error' : usernameStatus === 'available' ? 'border-success' : usernameStatus === 'taken' ? 'border-error' : 'border-[var(--color-border)]'
                  }`}
                />
                {/* Username status indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <AnimatePresence mode="wait">
                    {usernameStatus === 'checking' && (
                      <motion.div
                        key="checking"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >
                        <svg className="animate-spin w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </motion.div>
                    )}
                    {usernameStatus === 'available' && (
                      <motion.div
                        key="available"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >
                        <CheckCircleIcon className="w-5 h-5 text-success" />
                      </motion.div>
                    )}
                    {usernameStatus === 'taken' && (
                      <motion.div
                        key="taken"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >
                        <XCircleIcon className="w-5 h-5 text-error" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {/* Username availability text */}
              <AnimatePresence mode="wait">
                {usernameStatus === 'available' && (
                  <motion.p
                    key="avail"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-success text-xs mt-1"
                  >
                    ✓ Username available
                  </motion.p>
                )}
                {usernameStatus === 'taken' && (
                  <motion.p
                    key="taken"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-error text-xs mt-1"
                  >
                    ✕ Username already taken
                  </motion.p>
                )}
              </AnimatePresence>
              <ErrorMessage error={errors.username} />
            </motion.div>

            {/* Email */}
            <motion.div {...staggerItem}>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 ${
                    errors.email ? 'border-error' : 'border-[var(--color-border)]'
                  }`}
                />
              </div>
              <ErrorMessage error={errors.email} />
            </motion.div>

            {/* Password */}
            <motion.div {...staggerItem}>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 ${
                    errors.password ? 'border-error' : 'border-[var(--color-border)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {form.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="mt-2"
                >
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 origin-left ${
                          i <= passwordStrength.level ? passwordStrength.color : 'bg-[var(--color-border)]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium transition-colors duration-200 ${
                    passwordStrength.level <= 1 ? 'text-error'
                    : passwordStrength.level === 2 ? 'text-secondary'
                    : passwordStrength.level === 3 ? 'text-primary'
                    : 'text-success'
                  }`}>
                    {passwordStrength.label}
                  </p>
                </motion.div>
              )}
              <ErrorMessage error={errors.password} />
            </motion.div>

            {/* Confirm Password */}
            <motion.div {...staggerItem}>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Confirm Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-error' : 'border-[var(--color-border)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              <ErrorMessage error={errors.confirmPassword} />
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div {...staggerItem}>
              <label className="flex items-start gap-2 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                    form.agreeTerms ? 'bg-primary border-primary' : errors.agreeTerms ? 'border-error' : 'border-[var(--color-border)] group-hover:border-primary/50'
                  }`}>
                    <motion.svg
                      initial={false}
                      animate={form.agreeTerms ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                      className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none"
                    >
                      <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </div>
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>
              <ErrorMessage error={errors.agreeTerms} />
            </motion.div>

            {/* Submit Button */}
            <motion.div {...staggerItem}>
              <motion.button
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                initial="idle"
                whileHover={!isLoading ? 'hover' : undefined}
                whileTap={!isLoading ? 'tap' : undefined}
                className="w-full py-3 rounded-lg bg-secondary text-white font-semibold font-button flex items-center justify-center gap-2 hover:bg-secondary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin-slow w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div {...staggerItem} className="my-5 flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">or sign up with</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </motion.div>

          {/* Social Sign Up */}
          <motion.div {...staggerItem} className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors duration-200 btn-animated">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors duration-200 btn-animated">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </motion.div>

          {/* Login Link */}
          <motion.p {...staggerItem} className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">
              Log In
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignUp;
