import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { pageTransition, fadeInUp } from '../../lib/animations';
import useSEO from '../../lib/useSEO';

const faqData = [
  { cat: 'General', items: [
    { q: 'What is KarBazar?', a: 'KarBazar is a 100% free marketplace connecting businesses with talented professionals. You can browse services, hire freelancers, and grow your business without any commissions or hidden fees.' },
    { q: 'Is KarBazar really free?', a: 'Yes! KarBazar is completely free for both clients and businesses. There are no listing fees, no commissions on orders, and no premium tiers. We believe great connections shouldn\'t cost a fortune.' },
    { q: 'How does KarBazar make money?', a: 'KarBazar is supported through optional sponsored listings and partnerships. Core functionality will always remain free for all users.' },
  ]},
  { cat: 'For Clients', items: [
    { q: 'How do I find a service provider?', a: 'Browse our marketplace using the search bar or browse by category. You can filter results by rating, price, delivery time, and more. When you find a service you like, click on it to see full details.' },
    { q: 'How do I place an order?', a: 'Once you\'ve found a service, select the package that fits your needs and click "Order Now." You\'ll be able to provide details about your project and communicate directly with the seller.' },
    { q: 'Can I message a seller before ordering?', a: 'Absolutely! Click the "Contact Seller" button on any service page to start a conversation. You can discuss your project requirements before placing an order.' },
    { q: 'How do reviews work?', a: 'After an order is completed, you can leave a review with a star rating and written feedback. Reviews help other users make informed decisions and help sellers build their reputation.' },
  ]},
  { cat: 'For Businesses', items: [
    { q: 'How do I register as a business?', a: 'Click "Sign Up" and create your account. You can then request a business role upgrade from your settings page. Once approved, you can create service listings.' },
    { q: 'How many services can I list?', a: 'There\'s no limit! You can list as many services as you want, completely free of charge.' },
    { q: 'Can I offer discounts on my services?', a: 'Yes! You can create time-limited discounts on any of your service packages. Discounted services get extra visibility on our Deals page.' },
    { q: 'How do I manage orders?', a: 'Your business dashboard shows all incoming orders, their status, and delivery timelines. You can communicate with clients, deliver work, and track your earnings all in one place.' },
  ]},
  { cat: 'Account & Security', items: [
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a password reset link.' },
    { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption, secure authentication tokens, and follow best practices for data protection. Read our Privacy Policy for full details.' },
    { q: 'Can I delete my account?', a: 'Yes. Contact our support team at support@karbazar.com and we\'ll process your account deletion request within 48 hours.' },
  ]},
];

const AccordionItem = ({ item, isOpen, toggle }) => (
  <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
    <button onClick={toggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-[var(--color-card-bg)] hover:bg-[var(--color-surface)] transition-colors">
      <span className="font-medium text-[var(--color-text)] pr-4">{item.q}</span>
      <ChevronDownIcon className={`w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="px-5 py-4 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)] bg-[var(--color-surface)]">{item.a}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  useSEO({ title: 'FAQ', description: 'Find answers to common questions about KarBazar.' });
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div {...fadeInUp} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-text)] mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-[var(--color-text-secondary)]">Find answers to common questions about KarBazar.</p>
      </motion.div>

      <div className="space-y-10">
        {faqData.map((section) => (
          <motion.div key={section.cat} {...fadeInUp}>
            <h2 className="text-xl font-heading font-semibold text-[var(--color-text)] mb-4">{section.cat}</h2>
            <div className="space-y-3">
              {section.items.map((item, i) => {
                const key = `${section.cat}-${i}`;
                return <AccordionItem key={key} item={item} isOpen={!!openItems[key]} toggle={() => toggle(key)} />;
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeInUp} className="mt-12 text-center bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-8">
        <h3 className="text-lg font-heading font-semibold text-[var(--color-text)] mb-2">Still have questions?</h3>
        <p className="text-[var(--color-text-secondary)] mb-4">We're here to help. Reach out to our support team.</p>
        <a href="/contact" className="inline-block px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">Contact Us</a>
      </motion.div>
    </motion.div>
  );
};

export default FAQ;
