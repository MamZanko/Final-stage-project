import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { pageTransition, buttonVariants, fadeInUp } from '../../lib/animations';
import useSEO from '../../lib/useSEO';

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

const stepVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2, ease: 'easeIn' } },
};

const ForgotPassword = () => {
  useSEO({
    title: 'Reset Password',
    description: 'Reset your KarBazar password. Enter your email to receive a password reset link.',
    noindex: true,
  });

  const [step, setStep] = useState(1); // 1: enter email, 2: check email, 3: reset password
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset password form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetErrors, setResetErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email address');
      return;
    }

    setIsLoading(true);
    setEmailError('');
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPassword) errs.newPassword = 'Password is required';
    else if (newPassword.length < 6) errs.newPassword = 'Password must be at least 6 characters';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) {
      setResetErrors(errs);
      return;
    }

    setIsLoading(true);
    setResetErrors({});
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setResetSuccess(true);
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
    <motion.div {...pageTransition} className="min-h-[calc(100vh-140px)] flex items-center justify-center p-6 bg-[var(--color-bg)]">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              animate={{
                scale: step === s ? 1 : 0.8,
                backgroundColor: step >= s ? 'var(--color-primary)' : 'var(--color-border)',
              }}
              transition={{ duration: 0.2 }}
              className="w-2.5 h-2.5 rounded-full"
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <LockClosedIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-[var(--color-text)] mb-2">Forgot Password?</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSendResetLink} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email Address</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 ${
                        emailError ? 'border-error' : 'border-[var(--color-border)]'
                      }`}
                    />
                  </div>
                  <ErrorMessage error={emailError} />
                </div>

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
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </form>

              <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                  Log In
                </Link>
              </p>
            </motion.div>
          )}

          {/* STEP 2: Check Email */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm text-center"
            >
              {/* Envelope Illustration */}
              <div className="mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-4"
                >
                  <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
                    <circle cx="48" cy="48" r="48" fill="var(--color-primary)" fillOpacity="0.1" />
                    <rect x="18" y="28" width="60" height="40" rx="6" fill="var(--color-primary)" fillOpacity="0.15" stroke="var(--color-primary)" strokeWidth="2" />
                    <path d="M18 34 L48 54 L78 34" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
                    <motion.circle
                      cx="68"
                      cy="28"
                      r="10"
                      fill="var(--color-success)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 400 }}
                    />
                    <motion.path
                      d="M63 28 L66.5 31.5 L73 25"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.7, duration: 0.3 }}
                    />
                  </svg>
                </motion.div>

                <h2 className="text-2xl font-heading font-bold text-[var(--color-text)] mb-2">Check Your Email</h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  We've sent a password reset link to{' '}
                  <span className="font-semibold text-[var(--color-text)]">{email}</span>.
                  <br />
                  Check your inbox and click the link to reset your password.
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-lg p-4 mb-6">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setStep(1)}
                    className="text-primary hover:underline font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>

              {/* For demo: skip to reset password */}
              <motion.button
                onClick={() => setStep(3)}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold font-button hover:bg-primary-dark transition-colors duration-200"
              >
                Open Reset Form (Demo)
              </motion.button>

              <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
                <Link to="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                  ← Back to Login
                </Link>
              </p>
            </motion.div>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && !resetSuccess && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <LockClosedIcon className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-[var(--color-text)] mb-2">Reset Password</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Create a new strong password for your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">New Password</label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (resetErrors.newPassword) setResetErrors((prev) => ({ ...prev, newPassword: '' }));
                      }}
                      placeholder="Create a new password"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 ${
                        resetErrors.newPassword ? 'border-error' : 'border-[var(--color-border)]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                    >
                      {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="mt-2"
                    >
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                              i <= passwordStrength.level ? passwordStrength.color : 'bg-[var(--color-border)]'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${
                        passwordStrength.level <= 1 ? 'text-error'
                        : passwordStrength.level === 2 ? 'text-secondary'
                        : passwordStrength.level === 3 ? 'text-primary'
                        : 'text-success'
                      }`}>{passwordStrength.label}</p>
                    </motion.div>
                  )}
                  <ErrorMessage error={resetErrors.newPassword} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (resetErrors.confirmPassword) setResetErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      placeholder="Confirm new password"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 ${
                        resetErrors.confirmPassword ? 'border-error' : 'border-[var(--color-border)]'
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
                  <ErrorMessage error={resetErrors.confirmPassword} />
                </div>

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
                      <span>Resetting...</span>
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* STEP 3 — Success */}
          {step === 3 && resetSuccess && (
            <motion.div
              key="step3-success"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center"
              >
                <CheckCircleIcon className="w-12 h-12 text-success" />
              </motion.div>

              <h2 className="text-2xl font-heading font-bold text-[var(--color-text)] mb-2">Password Reset!</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-8">
                Your password has been reset successfully. You can now log in with your new password.
              </p>

              <Link
                to="/login"
                className="inline-block w-full py-3 rounded-lg bg-primary text-white font-semibold font-button text-center hover:bg-primary-dark transition-colors duration-200 btn-animated"
              >
                Back to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
