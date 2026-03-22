import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlusIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, StarIcon, ShoppingCartIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { pageTransition, fadeInUp, staggerContainer, staggerItem } from '../../lib/animations';
import useSEO from '../../lib/useSEO';
import { useAuthStore } from '../../store/authStore';

const HowItWorks = () => {
  const { isAuthenticated } = useAuthStore();
  useSEO({ title: 'How It Works', description: 'Learn how KarBazar works — find services, place orders, and grow your business in a few simple steps.' });

  const clientSteps = [
    { icon: UserPlusIcon, title: 'Create an Account', desc: 'Sign up for free in seconds. No credit card required.' },
    { icon: MagnifyingGlassIcon, title: 'Browse Services', desc: 'Explore thousands of services across dozens of categories. Filter by price, rating, and delivery time.' },
    { icon: ChatBubbleLeftRightIcon, title: 'Contact Sellers', desc: 'Message service providers directly to discuss your project before ordering.' },
    { icon: ShoppingCartIcon, title: 'Place an Order', desc: 'Choose a package and place your order. Provide project details and requirements.' },
    { icon: StarIcon, title: 'Review & Repeat', desc: 'Once your order is delivered, leave a review and find your next great service provider.' },
  ];

  const businessSteps = [
    { icon: UserPlusIcon, title: 'Register & Get Verified', desc: 'Create your account and request business role verification.' },
    { icon: RocketLaunchIcon, title: 'List Your Services', desc: 'Create service listings with descriptions, packages, pricing, and portfolio items.' },
    { icon: ChatBubbleLeftRightIcon, title: 'Connect with Clients', desc: 'Receive inquiries and orders from clients. Communicate directly through our messaging system.' },
    { icon: ShoppingCartIcon, title: 'Deliver & Earn', desc: 'Complete orders, deliver your work, and earn — without paying any commissions.' },
    { icon: StarIcon, title: 'Build Your Reputation', desc: 'Collect reviews, build your portfolio, and grow your client base organically.' },
  ];

  const StepList = ({ steps, color }) => (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      {steps.map((step, i) => (
        <motion.div key={step.title} variants={staggerItem} className="flex gap-4 items-start">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${color} flex items-center justify-center relative`}>
            <step.icon className="w-6 h-6 text-white" />
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-card-bg)] border-2 border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] flex items-center justify-center">{i + 1}</span>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-[var(--color-text)] mb-1">{step.title}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <motion.div {...pageTransition}>
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 {...fadeInUp} className="text-3xl md:text-5xl font-heading font-bold mb-4">How KarBazar Works</motion.h1>
          <motion.p {...fadeInUp} className="text-lg text-white/80 max-w-2xl mx-auto">Getting started is easy. Whether you're looking for services or offering them, here's how it works.</motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <motion.h2 {...fadeInUp} className="text-2xl font-heading font-bold text-[var(--color-text)] mb-8 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><MagnifyingGlassIcon className="w-4 h-4 text-primary" /></span> For Clients
            </motion.h2>
            <StepList steps={clientSteps} color="bg-primary" />
          </div>
          <div>
            <motion.h2 {...fadeInUp} className="text-2xl font-heading font-bold text-[var(--color-text)] mb-8 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center"><RocketLaunchIcon className="w-4 h-4 text-secondary" /></span> For Businesses
            </motion.h2>
            <StepList steps={businessSteps} color="bg-secondary" />
          </div>
        </div>

        <motion.div {...fadeInUp} className="mt-16 text-center bg-gradient-to-r from-primary/5 to-secondary/5 border border-[var(--color-border)] rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-heading font-bold text-[var(--color-text)] mb-4">Ready to get started?</h2>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto">Join thousands of users already using KarBazar to connect, collaborate, and grow.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse-gigs" className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">Browse Services</Link>
            {!isAuthenticated && (
              <Link to="/register" className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors">Sign Up Free</Link>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
