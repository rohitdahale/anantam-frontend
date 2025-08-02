import { motion } from 'framer-motion';
import { Award, Users, Target, Zap, Shield, Globe, Heart, Star } from 'lucide-react';
import { Helmet } from '../components/utils/Helmet';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Interface matching your backend About schema
interface Value {
  title: string;
  description: string;
  icon: string;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

interface AboutData {
  _id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundImage: string;
  story: string[];
  storyImage: string;
  values: Value[];
  team: TeamMember[];
  createdAt?: string;
  updatedAt?: string;
}

const AboutPage = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Icon mapping function
  const getIcon = (iconName: string, size: number = 32) => {
    const iconProps = { size };
    
    switch (iconName) {
      case 'Zap':
        return <Zap {...iconProps} />;
      case 'Award':
        return <Award {...iconProps} />;
      case 'Target':
        return <Target {...iconProps} />;
      case 'Users':
        return <Users {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      case 'Globe':
        return <Globe {...iconProps} />;
      case 'Heart':
        return <Heart {...iconProps} />;
      case 'Star':
        return <Star {...iconProps} />;
      default:
        return <Zap {...iconProps} />;
    }
  };

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<AboutData>('https://anantam-backend-7ezq.onrender.com/api/about');
      setAboutData(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching about data:', err);
      setError('Failed to load about page data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading about page...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !aboutData) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'About page data not found'}</p>
          <button 
            onClick={fetchAboutData}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet title={`${aboutData.heroTitle} | About Us`} />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${aboutData.heroBackgroundImage}')`
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {aboutData.heroTitle}
            </h1>
            <p className="text-xl text-gray-300">
              {aboutData.heroSubtitle}
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              {aboutData.story.map((paragraph, index) => (
                <p key={index} className="text-gray-300 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative">
              <img 
                src={aboutData.storyImage} 
                alt="Our Story" 
                className="rounded-lg shadow-xl w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                }}
              />
              <div className="absolute bottom-4 left-4 bg-primary-600 text-white py-2 px-4 rounded">
                Our journey
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      {aboutData.values.length > 0 && (
        <section className="section-padding bg-dark-900">
          <div className="container-custom">
            <div className="section-title">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The core principles that guide everything we do.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {aboutData.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-primary-500 mb-4">
                    {getIcon(value.icon)}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Team */}
      {aboutData.team.length > 0 && (
        <section className="section-padding bg-dark-800">
          <div className="container-custom">
            <div className="section-title">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Meet the experts behind our innovative solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {aboutData.team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={member.imageUrl || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-primary-400 mb-3">{member.role}</p>
                    <p className="text-gray-400">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default AboutPage;