import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Products from '../components/home/Products';
import CollaborationSection from '../components/home/CollaborationSection';
import TestimonialSection from '../components/home/TestimonialSection';
import CTASection from '../components/home/CTASection';
import { Helmet } from '../components/utils/Helmet';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet title="Anantam Aerial | Advanced Drone Solutions" />
      <Hero />
      <CollaborationSection />
      <Services />
      <Products />
      <TestimonialSection />
      <CTASection />
    </motion.div>
  );
};

export default HomePage;