import { motion } from 'framer-motion';
import { UserGroupIcon, GlobeAltIcon, ShieldCheckIcon, HeartIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { pageTransition, fadeInUp, staggerContainer, staggerItem } from '../../lib/animations';
import useSEO from '../../lib/useSEO';

const AboutUs = () => {
  useSEO({
    title: 'About Us',
    description: 'Learn about KarBazar — our mission to connect businesses with talented freelancers, our story, and the team behind the platform.',
    structuredData: { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About KarBazar', url: 'https://karbazar.com/about' },
  });

  const values = [
    { icon: HeartIcon, title: '100% Free', desc: 'No commissions, no hidden fees. We believe great connections shouldn\'t cost a fortune.' },
    { icon: ShieldCheckIcon, title: 'Trust & Safety', desc: 'Verified businesses, honest reviews, and secure messaging to protect our community.' },
    { icon: GlobeAltIcon, title: 'Global Reach', desc: 'Connecting talent and businesses across borders, languages, and time zones.' },
    { icon: RocketLaunchIcon, title: 'Innovation', desc: 'Continuously improving our platform with the latest technology and user feedback.' },
    { icon: UserGroupIcon, title: 'Community First', desc: 'Built by the community, for the community. Every feature is driven by user needs.' },
    { icon: SparklesIcon, title: 'Quality', desc: 'We promote excellence through ratings, reviews, and curated top-rated professionals.' },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '5K+', label: 'Services Listed' },
    { value: '25K+', label: 'Orders Completed' },
    { value: '4.8', label: 'Avg. Rating' },
  ];

  return (
    <motion.div {...pageTransition}>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 {...fadeInUp} className="text-3xl md:text-5xl font-heading font-bold mb-6">About KarBazar</motion.h1>
          <motion.p {...fadeInUp} className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            KarBazar is a 100% free marketplace connecting businesses with talented professionals. No commissions. No hidden fees. Just great connections.
          </motion.p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6 text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-heading font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-[var(--color-text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-text)] mb-4">Our Story</h2>
          <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
            <p>KarBazar was born from a simple idea: connecting talented professionals with businesses shouldn't cost a fortune. Traditional platforms charge hefty commissions — sometimes up to 20% — making it harder for freelancers to earn fair wages and for businesses to afford quality services.</p>
            <p>We built KarBazar to change that. Our platform is completely free for everyone — no listing fees, no commissions, no premium tiers. We believe that when you remove financial barriers, amazing things happen: freelancers thrive, businesses grow, and communities flourish.</p>
            <p>Today, KarBazar serves thousands of users worldwide, offering services across dozens of categories. And we're just getting started.</p>
          </div>
        </motion.div>
      </div>

      {/* Values */}
      <div className="bg-[var(--color-surface)] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeInUp} className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-text)] text-center mb-12">Our Values</motion.h2>
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <motion.div key={v.title} variants={staggerItem} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-[var(--color-text)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
