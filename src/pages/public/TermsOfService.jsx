import { motion } from 'framer-motion';
import { pageTransition, fadeInUp } from '../../lib/animations';
import useSEO from '../../lib/useSEO';

const TermsOfService = () => {
  useSEO({ title: 'Terms of Service', description: 'Read the KarBazar Terms of Service.' });

  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using KarBazar ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Platform. KarBazar reserves the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.' },
    { title: '2. User Accounts', content: 'You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update it as necessary.' },
    { title: '3. Platform Usage', content: 'KarBazar provides a marketplace platform connecting service providers ("Businesses") with service seekers ("Clients"). KarBazar does not provide the services listed on the platform and is not a party to any agreement between Businesses and Clients. The Platform is provided on an "as is" basis.' },
    { title: '4. Service Listings', content: 'Businesses are solely responsible for the accuracy and legality of their service listings. KarBazar reserves the right to remove any listing that violates these Terms, is misleading, or contains inappropriate content. All pricing must be clearly stated and accurate.' },
    { title: '5. Free Platform Policy', content: 'KarBazar is a 100% free platform. We do not charge any commissions, listing fees, or transaction fees. Optional sponsored placements may be available but are not required to use the Platform.' },
    { title: '6. Reviews & Ratings', content: 'Users may leave reviews and ratings for completed services. Reviews must be honest, fair, and based on actual experience. KarBazar reserves the right to remove reviews that are fraudulent, abusive, or violate our community guidelines.' },
    { title: '7. Messaging & Communication', content: 'The Platform provides a messaging system for communication between users. You agree not to use the messaging system for spam, harassment, solicitation of off-platform transactions, or any illegal purpose.' },
    { title: '8. Intellectual Property', content: 'All content on KarBazar, including the Platform design, logos, and trademarks, are the property of KarBazar. Users retain ownership of their own content but grant KarBazar a non-exclusive license to display it on the Platform.' },
    { title: '9. Prohibited Activities', content: 'Users may not: create fake accounts, manipulate ratings or reviews, engage in fraudulent transactions, harass other users, distribute malware, scrape platform data, or engage in any activity that disrupts the Platform or violates applicable laws.' },
    { title: '10. Limitation of Liability', content: 'KarBazar is not liable for any disputes between users, the quality of services provided by Businesses, or any damages arising from the use of the Platform. Users engage with each other at their own risk.' },
    { title: '11. Contact', content: 'For questions about these Terms of Service, please contact us at legal@karbazar.com or visit our Contact page.' },
  ];

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div {...fadeInUp} className="mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-text)] mb-4">Terms of Service</h1>
        <p className="text-[var(--color-text-secondary)]">Last updated: February 20, 2026</p>
      </motion.div>
      <div className="space-y-8">
        {sections.map((s) => (
          <motion.div key={s.title} {...fadeInUp} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="text-lg font-heading font-semibold text-[var(--color-text)] mb-3">{s.title}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{s.content}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TermsOfService;
