import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Play, Users, Cog, Camera, MapPin } from 'lucide-react';
import { Helmet } from '../components/utils/Helmet';

const Portfolio = () => {
  const projects = [
    {
      title: 'Autonomous Delivery Drone System',
      category: 'Commercial Solutions',
      description: 'Developed a complete autonomous delivery ecosystem for urban logistics, featuring GPS waypoint navigation, obstacle avoidance, and automated package drop mechanisms.',
      image: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      technologies: ['Pixhawk', 'ArduPilot', 'LiDAR', 'Computer Vision'],
      client: 'Urban Logistics Co.',
      duration: '6 months',
      status: 'Completed'
    },
    {
      title: 'Precision Agriculture Monitoring',
      category: 'Agriculture',
      description: 'Multi-spectral imaging drone system for crop health monitoring, automated pesticide spraying, and yield prediction across 500+ acre farms.',
      image: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      technologies: ['NDVI Sensors', 'RTK GPS', 'Automated Spraying', 'Data Analytics'],
      client: 'Maharashtra Agri Corp',
      duration: '4 months',
      status: 'Completed'
    },
    {
      title: 'Search & Rescue Drone Fleet',
      category: 'Emergency Services',
      description: 'Thermal imaging equipped drone fleet for emergency response operations, featuring real-time video streaming and GPS coordinate sharing.',
      image: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      technologies: ['Thermal Cameras', 'Live Streaming', 'Emergency Protocols', 'Night Vision'],
      client: 'Nagpur Emergency Services',
      duration: '3 months',
      status: 'Ongoing'
    },
    {
      title: 'FPV Racing Championship Build',
      category: 'Custom Builds',
      description: 'High-performance FPV racing drone optimized for competitive racing with custom frame design and advanced flight controllers.',
      image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      technologies: ['Carbon Fiber Frame', 'High-Speed Motors', 'FPV Goggles', 'Custom Tuning'],
      client: 'Racing Team Alpha',
      duration: '2 months',
      status: 'Completed'
    },
    {
      title: 'Industrial Inspection Quadcopter',
      category: 'Industrial',
      description: 'Ruggedized drone for infrastructure inspection of power lines, towers, and industrial facilities with high-resolution imaging capabilities.',
      image: 'https://images.pexels.com/photos/1592119/pexels-photo-1592119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      technologies: ['4K Gimbal Camera', 'Wind Resistance', 'Long Range', 'Data Logging'],
      client: 'Power Grid Corporation',
      duration: '5 months',
      status: 'In Progress'
    },
    {
      title: 'Cinematography Drone Portfolio',
      category: 'Media & Entertainment',
      description: 'Professional-grade cinematography drone with advanced stabilization for film production and event coverage.',
      image: 'https://images.pexels.com/photos/1034887/pexels-photo-1034887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      technologies: ['3-Axis Gimbal', '8K Recording', 'Follow-Me Mode', 'Professional Controls'],
      client: 'Creative Studios Mumbai',
      duration: '3 months',
      status: 'Completed'
    }
  ];

  const caseStudies = [
    {
      title: 'Farm Automation Revolution',
      challenge: 'A 1000-acre farm needed automated crop monitoring and precise pesticide application to reduce costs and improve yield.',
      solution: 'Deployed autonomous drone fleet with multi-spectral cameras, AI-powered crop analysis, and precision spraying systems.',
      result: '35% reduction in pesticide usage, 20% increase in crop yield, and automated monitoring of entire farm in 2 hours.',
      image: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      title: 'Emergency Response Enhancement',
      challenge: 'City emergency services needed rapid deployment capability for search and rescue operations in difficult terrain.',
      solution: 'Created specialized drone fleet with thermal imaging, real-time communication, and GPS tracking for coordinated rescue efforts.',
      result: '60% faster emergency response times, successful rescue operations in challenging conditions, enhanced situational awareness.',
      image: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];

  const technologies = [
    { name: 'Pixhawk Flight Controllers', category: 'Flight Control' },
    { name: 'ArduPilot/PX4 Firmware', category: 'Software' },
    { name: 'LiDAR Sensors', category: 'Navigation' },
    { name: 'RTK GPS Systems', category: 'Positioning' },
    { name: 'Thermal Imaging', category: 'Sensors' },
    { name: '3D Printing & CAD Design', category: 'Manufacturing' },
    { name: 'Computer Vision AI', category: 'Intelligence' },
    { name: 'Multi-Spectral Cameras', category: 'Imaging' },
    { name: 'Long Range Communication', category: 'Connectivity' },
    { name: 'Carbon Fiber Construction', category: 'Materials' }
  ];

  const mediaGallery = [
    {
      type: 'video',
      title: 'Autonomous Flight Test',
      thumbnail: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      type: 'image',
      title: 'Workshop Assembly Session',
      src: 'https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      type: 'video',
      title: 'FPV Racing Championship',
      thumbnail: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      type: 'image',
      title: 'Field Testing Operations',
      src: 'https://images.pexels.com/photos/1592119/pexels-photo-1592119.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      type: 'image',
      title: 'Team Collaboration',
      src: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      type: 'video',
      title: 'Precision Agriculture Demo',
      thumbnail: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet title="Portfolio | Anantam Aerials and Robotics" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className='absolute inset-0'>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Portfolio</h1>
            <p className="text-xl text-gray-300">Showcasing innovative drone solutions and cutting-edge aerial technology projects that have transformed industries and exceeded client expectations.</p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Here are some of the innovative projects and custom solutions we've delivered for our clients across various industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="card overflow-hidden group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-primary-600 text-white py-1 px-3 rounded-full text-sm">
                    {project.category}
                  </div>
                  <div className={`absolute top-4 right-4 py-1 px-3 rounded-full text-sm ${
                    project.status === 'Completed' ? 'bg-green-600' : 
                    project.status === 'In Progress' ? 'bg-yellow-600' : 'bg-blue-600'
                  } text-white`}>
                    {project.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span key={techIndex} className="bg-dark-700 text-primary-400 py-1 px-2 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="bg-dark-700 text-gray-400 py-1 px-2 rounded text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>Client: {project.client}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cog size={14} />
                      <span>Duration: {project.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Case Studies</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Deep dive into how we solved complex challenges for our clients with innovative drone solutions.
            </p>
          </div>
          
          <div className="space-y-12 mt-12">
            {caseStudies.map((study, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <h3 className="text-2xl font-bold mb-6">{study.title}</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-red-400 mb-2">Challenge</h4>
                      <p className="text-gray-300">{study.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">Solution</h4>
                      <p className="text-gray-300">{study.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-green-400 mb-2">Result</h4>
                      <p className="text-gray-300">{study.result}</p>
                    </div>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="rounded-lg shadow-xl w-full h-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Used */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technologies We Use</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cutting-edge technologies and components that power our drone solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
            {technologies.map((tech, index) => (
              <div key={index} className="card p-4 text-center group hover:bg-primary-600 transition-colors duration-300">
                <div className="text-primary-400 group-hover:text-white mb-2">
                  <Cog size={24} className="mx-auto" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-white">{tech.name}</h3>
                <p className="text-xs text-gray-400 group-hover:text-gray-200">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Media Gallery</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              High-quality photos and videos showcasing our drones in action, workshop sessions, and field testing operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {mediaGallery.map((media, index) => (
              <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg">
                <img 
                  src={media.type === 'video' ? media.thumbnail : media.src}
                  alt={media.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  {media.type === 'video' && (
                    <Play size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  {media.type === 'image' && (
                    <Camera size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h4 className="text-white font-semibold">{media.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can create a custom drone solution tailored to your specific needs and requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="btn-primary inline-flex items-center gap-2"
            >
              <MapPin size={20} />
              Start a Project with Us
            </Link>
            <Link 
              to="/services" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ExternalLink size={20} />
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Portfolio;