import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { pageTransition, fadeInUp, staggerContainer, staggerItem, buttonVariants } from '../../lib/animations';
import useSEO from '../../lib/useSEO';
import api from '../../services/api';

const Login = () => {
  useSEO({
    title: 'Log In',
    description: 'Log in to your KarBazar account to access your dashboard, manage orders, and connect with freelancers.',
    noindex: true,
  });

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      const user = res.data?.user || res.user;
      const token = res.data?.token || res.token;

      login({ user, token });

      const redirectMap = {
        client: '/profile/' + user.username,
        business: '/business/' + user.username,
        admin: '/admin/dashboard',
      };
      navigate(redirectMap[user.role] || '/');
    } catch (err) {
      const msg = err?.message || err?.errors?.email?.[0] || 'Invalid email or password.';
      setGeneralError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="min-h-[calc(100vh-140px)] flex">
      {/* Left Side — Gradient + Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 text-white text-center max-w-md"
        >
          {/* Illustration */}
          <div className="mb-8">
            <svg className="w-64 h-64 mx-auto opacity-90" viewBox="0 0 400 400" fill="none">
              <rect x="60" y="80" width="280" height="200" rx="16" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
              <rect x="85" y="120" width="230" height="12" rx="6" fill="white" fillOpacity="0.2" />
              <rect x="85" y="148" width="230" height="12" rx="6" fill="white" fillOpacity="0.2" />
              <rect x="85" y="190" width="100" height="36" rx="8" fill="white" fillOpacity="0.3" />
              <circle cx="200" cy="50" r="25" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
              <path d="M190 50 L197 57 L212 43" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="330" cy="320" r="40" fill="#F97316" fillOpacity="0.3" />
              <circle cx="70" cy="300" r="25" fill="#F97316" fillOpacity="0.2" />
            </svg>
          </div>

          <h2 className="text-2xl font-heading font-bold mb-4">Welcome Back to KarBazar</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Your 100% free business marketplace. Connect with top professionals and grow your business.
          </p>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/90 italic text-sm leading-relaxed mb-4">
              "KarBazar transformed how I find clients. The platform is intuitive and the community is amazing. Best of all — it's completely free!"
            </p>
            <div className="flex items-center justify-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face"
                alt="Sarah Chen"
                className="w-10 h-10 rounded-full border-2 border-white/30"
              />
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Sarah Chen</p>
                <p className="text-white/60 text-xs">UI/UX Designer</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-[var(--color-bg)]">
        <motion.div
          {...staggerContainer(0.08)}
          initial="initial"
          animate="animate"
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div {...staggerItem} className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-heading font-extrabold">
                <span className="text-primary">Kar</span>
                <span className="text-secondary">Bazar</span>
              </h1>
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm mt-2">Log in to your account</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-error text-xs mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
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
                  placeholder="Enter your password"
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
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-error text-xs mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember Me + Forgot Password */}
            <motion.div {...staggerItem} className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                    rememberMe ? 'bg-primary border-primary' : 'border-[var(--color-border)] group-hover:border-primary/50'
                  }`}>
                    <motion.svg
                      initial={false}
                      animate={rememberMe ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                      className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none"
                    >
                      <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </div>
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
                Forgot Password?
              </Link>
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
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold font-button flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin-slow w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Logging in...</span>
                  </>
                ) : (
                  'Log In'
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div {...staggerItem} className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </motion.div>

          {/* Social Login Buttons */}
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

          {/* Sign Up Link */}
          <motion.p {...staggerItem} className="text-center text-sm text-[var(--color-text-secondary)] mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-dark font-semibold transition-colors">
              Sign Up Free
            </Link>
          </motion.p>

          {/* Demo credentials hint */}
          <motion.div {...staggerItem} className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-[var(--color-text-secondary)] text-center">
              <span className="font-semibold text-primary">Demo:</span> Use sarah@techflow.io (business) or alex@example.com (client) with password: <span className="font-mono">password</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
