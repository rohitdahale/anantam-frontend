import { motion } from 'framer-motion';
import { Camera, Wrench, ShoppingBag, BookOpen, Cog, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Map size={40} />,
    title: 'Aerial Solutions',
    description: 'Comprehensive aerial mapping, surveying, and data collection services for industries.',
    link: '/services#aerial-solutions'
  },
  {
    icon: <Cog size={40} />,
    title: 'Robotics Systems',
    description: 'Advanced robotics systems with cutting-edge AI and automation capabilities.',
    link: '/services#robotics-systems'
  },
  {
    icon: <ShoppingBag size={40} />,
    title: 'Component Sales',
    description: 'High-quality drone components, parts, and accessories for professionals.',
    link: '/products'
  },
  {
    icon: <Wrench size={40} />,
    title: 'Repair Services',
    description: 'Expert repair and maintenance services for all types of drones and components.',
    link: '/services#repair'
  },
  {
    icon: <BookOpen size={40} />,
    title: 'Workshops',
    description: 'Educational workshops and training programs for drone enthusiasts and professionals.',
    link: '/workshops'
  },
  {
    icon: <Camera size={40} />,
    title: 'Custom Solutions',
    description: 'Tailored drone solutions designed for your specific business requirements.',
    link: '/services#custom'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Services = () => {
  return (
    <section id="services\" className="section-padding bg-dark-800">
      <div className="container-custom">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Our <span className="text-primary-500">Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Comprehensive drone and robotics solutions tailored for diverse industry needs.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              className="card p-6 group"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4 text-primary-500 bg-primary-900/20 w-16 h-16 rounded-lg flex items-center justify-center group-hover:text-white group-hover:bg-primary-600 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-4 flex-grow">{service.description}</p>
                <Link 
                  to={service.link} 
                  className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;