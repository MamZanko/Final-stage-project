import { motion } from 'framer-motion';
import { pageTransition, fadeInUp } from '../../lib/animations';
import useSEO from '../../lib/useSEO';

const PrivacyPolicy = () => {
  useSEO({ title: 'Privacy Policy', description: 'Learn how KarBazar collects, uses, and protects your personal data.' });

  const sections = [
    { title: '1. Information We Collect', content: 'We collect information you provide directly to us, including: name, email address, username, profile information, and any content you submit (service listings, reviews, messages). We also automatically collect certain technical information such as IP address, browser type, device information, and usage data through cookies and similar technologies.' },
    { title: '2. How We Use Your Information', content: 'We use the information we collect to: provide and maintain the Platform, process transactions and communications between users, improve and personalize your experience, send service-related notifications, enforce our Terms of Service, and protect against fraud and abuse.' },
    { title: '3. Information Sharing', content: 'We do not sell your personal information to third parties. We may share information with: other users as part of the Platform\'s normal operation (e.g., your public profile), service providers who assist us in operating the Platform, and law enforcement when required by law.' },
    { title: '4. Data Security', content: 'We implement industry-standard security measures including encryption, secure authentication (Sanctum tokens), HTTPS, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.' },
    { title: '5. Cookies', content: 'We use essential cookies for authentication and Platform functionality. We may also use analytics cookies to understand how users interact with the Platform. You can control cookie preferences through your browser settings.' },
    { title: '6. Your Rights', content: 'You have the right to: access your personal data, correct inaccurate data, request deletion of your data, export your data, and opt out of marketing communications. To exercise these rights, contact us at privacy@karbazar.com.' },
    { title: '7. Data Retention', content: 'We retain your personal data for as long as your account is active or as needed to provide you services. If you delete your account, we will remove your personal data within 30 days, except where we need to retain it for legal obligations.' },
    { title: '8. Children\'s Privacy', content: 'KarBazar is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we learn we have collected information from a child under 18, we will promptly delete it.' },
    { title: '9. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.' },
    { title: '10. Contact Us', content: 'If you have questions about this Privacy Policy, please contact us at privacy@karbazar.com or visit our Contact page.' },
  ];

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div {...fadeInUp} className="mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--color-text)] mb-4">Privacy Policy</h1>
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

export default PrivacyPolicy;
