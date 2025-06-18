import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bone as Drone, Home } from 'lucide-react';
import { Helmet } from '../components/utils/Helmet';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center pt-20 pb-20"
    >
      <Helmet title="Page Not Found | Anantam Aerial" />
      
      <div className="container-custom text-center">
        <div className="max-w-md mx-auto">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="text-primary-500 mb-8"
          >
            <Drone size={120} className="mx-auto" />
          </motion.div>
          
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            Sorry, we couldn't find the page you're looking for. It seems our drone has lost its way.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center">
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;