import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bone as Drone, CheckCircle } from 'lucide-react';
import { Helmet } from '../components/utils/Helmet';

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        // Parse user data
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Store user data if needed
        localStorage.setItem('user', JSON.stringify(user));
        
        // Role-based redirection after a short delay
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 2000);
        
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Redirect to auth page on error
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      }
    } else {
      // No token or user data, redirect to auth page
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 2000);
    }
  }, [searchParams, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-28 pb-16 bg-dark-900"
    >
      <Helmet title="Authentication Success | Anantam Aerial" />
      
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="card p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <img
                src="/src/assets/anantam-logo.png"
                alt="Anantam Aerials and Robotics"
                className="w-12 h-12 mx-auto mb-4"
              />

              <h1 className="text-2xl font-bold mb-2">
                Authentication Successful!
              </h1>
              <p className="text-gray-400 mb-6">
                Welcome to Anantam Aerial. You will be redirected shortly.
              </p>
              
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthSuccess;