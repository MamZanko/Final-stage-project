import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { pageTransition, fadeInUp, staggerContainer, staggerItem, buttonVariants } from '../../lib/animations';
import api from '../../services/api';
import useSEO from '../../lib/useSEO';

const Contact = () => {
  useSEO({
    title: 'Contact Us',
    description: 'Get in touch with the KarBazar team. We\'re here to help with questions, feedback, partnerships, and support.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact KarBazar',
      description: 'Get in touch with the KarBazar team.',
      url: 'https://karbazar.com/contact',
    },
  });

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: EnvelopeIcon, label: 'Email', value: 'support@karbazar.com', href: 'mailto:support@karbazar.com' },
    { icon: PhoneIcon, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPinIcon, label: 'Address', value: 'San Francisco, CA 94105', href: null },
  ];

  return (
    <motion.div {...pageTransition} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div {...fadeInUp} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-text)] mb-4">Get in Touch</h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Have a question, feedback, or need help? We'd love to hear from you.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="lg:col-span-1 space-y-4">
          {contactInfo.map((info) => (
            <motion.div key={info.label} variants={staggerItem} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <info.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{info.label}</p>
                {info.href ? (
                  <a href={info.href} className="text-[var(--color-text)] font-medium hover:text-primary transition-colors">{info.value}</a>
                ) : (
                  <p className="text-[var(--color-text)] font-medium">{info.value}</p>
                )}
              </div>
            </motion.div>
          ))}
          <motion.div variants={staggerItem} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
            <h3 className="font-heading font-semibold text-[var(--color-text)] mb-3">Office Hours</h3>
            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <div className="flex justify-between"><span>Monday — Friday</span><span className="font-medium text-[var(--color-text)]">9 AM — 6 PM</span></div>
              <div className="flex justify-between"><span>Saturday</span><span className="font-medium text-[var(--color-text)]">10 AM — 4 PM</span></div>
              <div className="flex justify-between"><span>Sunday</span><span className="text-error">Closed</span></div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div {...fadeInUp} className="lg:col-span-2">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6 md:p-8">
            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <CheckCircleIcon className="w-16 h-16 text-success mx-auto mb-4" />
                <h2 className="text-2xl font-heading font-bold text-[var(--color-text)] mb-2">Message Sent!</h2>
                <p className="text-[var(--color-text-secondary)] mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSuccess(false)} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">Send Another Message</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-heading font-bold text-[var(--color-text)] mb-2">Send us a message</h2>
                {error && <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">{error}</div>}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Full Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Subject *</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?"
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us more..."
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none" />
                </div>
                <motion.button type="submit" disabled={loading} variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap"
                  className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-semibold font-button rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <PaperAirplaneIcon className="w-5 h-5" />}
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
