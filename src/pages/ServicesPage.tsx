import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from '../components/utils/Helmet';
import { Map, Cog, Wrench, Target, Loader2 } from 'lucide-react';
import axios from 'axios';

// TypeScript interface matching your admin structure
interface Service {
  _id: string;
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Icon mapping for dynamic icons
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Map': <Map size={48} />,
      'Cog': <Cog size={48} />,
      'Wrench': <Wrench size={48} />,
      'Target': <Target size={48} />,
      'map': <Map size={48} />,
      'cog': <Cog size={48} />,
      'wrench': <Wrench size={48} />,
      'target': <Target size={48} />,
    };
    
    return iconMap[iconName] || <Target size={48} />; // Default icon
  };

  const fetchServices = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch only active services for public display
      const response = await axios.get<Service[]>('https://anantam-backend-7ezq.onrender.com/api/services');
      
      // Sort services by order field
      const sortedServices = response.data.sort((a, b) => a.order - b.order);
      setServices(sortedServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-dark-900 flex items-center justify-center"
      >
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading our services...</p>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-dark-900 flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchServices}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // No services state
  if (services.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-dark-900 flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-gray-300">No services available at the moment.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet title="Services | Anantam Aerial" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className='absolute inset-0'>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-300">Comprehensive drone and robotics solutions for modern industries.</p>
          </div>
        </div>
      </section>
      
      {/* Services List */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div 
                key={service._id}
                id={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-primary-500 mb-4">
                    {getIconComponent(service.icon)}
                  </div>
                  <h2 className="text-3xl font-bold mb-6">{service.title}</h2>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  
                  {service.features && service.features.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                      <ul className="space-y-2 mb-8">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="w-5 h-5 text-primary-500 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={index % 2 === 1 ? 'lg:col-start-1' : ''}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-xl">
                    <img 
                      src={service.image || 'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                      alt={service.title} 
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-dark-900 opacity-90"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your operations?
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Contact us today to discuss how our services can benefit your business.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="btn-accent">
                Get Started
              </button>
              <button className="btn-outline">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ServicesPage;