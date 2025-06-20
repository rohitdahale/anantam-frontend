import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-dark-900 opacity-90"></div>
      
      {/* Diagonal pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute h-[200px] w-1 bg-white" 
            style={{ 
              left: `${i * 10}%`, 
              transform: 'rotate(45deg)',
              top: `${Math.random() * 100}%` 
            }}
          ></div>
        ))}
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to elevate your aerial capabilities?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-8"
          >
            Join Anantam Aerials and Robotics today and experience the future of drone technology and services tailored to your specific needs.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/auth" className="btn-accent">
              Sign Up Now
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact Sales Team
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;