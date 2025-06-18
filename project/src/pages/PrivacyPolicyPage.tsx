import { motion } from 'framer-motion';
import { Helmet } from '../components/utils/Helmet';
import { Shield, Eye, Lock, Users, Mail, Globe } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: <Eye size={24} />,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          items: [
            "Name, email address, phone number, and mailing address",
            "Payment information (processed securely through third-party providers)",
            "Account credentials and preferences",
            "Communication records and customer service interactions"
          ]
        },
        {
          subtitle: "Usage Data",
          items: [
            "Pages visited, time spent on our website",
            "Browser type, device information, and IP address",
            "Referral sources and navigation patterns",
            "Technical data for performance optimization"
          ]
        },
        {
          subtitle: "Cookies and Tracking",
          items: [
            "Essential cookies for website functionality",
            "Analytics cookies to understand user behavior",
            "Preference cookies to remember your settings",
            "Marketing cookies for personalized content (with consent)"
          ]
        }
      ]
    },
    {
      icon: <Lock size={24} />,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          items: [
            "Process and fulfill your orders for drones and components",
            "Provide repair services and technical support",
            "Deliver workshop training and educational content",
            "Handle warranty claims and customer service requests"
          ]
        },
        {
          subtitle: "Communication",
          items: [
            "Send order confirmations and shipping updates",
            "Respond to inquiries and support requests",
            "Provide workshop schedules and updates",
            "Share product updates and safety information"
          ]
        },
        {
          subtitle: "Improvement and Marketing",
          items: [
            "Analyze website usage to improve user experience",
            "Develop new products and services based on feedback",
            "Send promotional emails and newsletters (with consent)",
            "Personalize content and recommendations"
          ]
        }
      ]
    },
    {
      icon: <Users size={24} />,
      title: "Information Sharing and Disclosure",
      content: [
        {
          subtitle: "We DO NOT sell your personal information",
          items: [
            "Your data is never sold to third parties for profit",
            "We maintain strict control over data sharing",
            "All sharing is for legitimate business purposes only"
          ]
        },
        {
          subtitle: "Trusted Service Providers",
          items: [
            "Payment processors for secure transaction handling",
            "Shipping partners for order delivery",
            "Cloud service providers for data storage and processing",
            "Analytics tools for website performance monitoring"
          ]
        },
        {
          subtitle: "Legal Requirements",
          items: [
            "Compliance with applicable laws and regulations",
            "Response to legal requests and court orders",
            "Protection of our rights and property",
            "Prevention of fraud and security threats"
          ]
        }
      ]
    },
    {
      icon: <Shield size={24} />,
      title: "Data Security and Protection",
      content: [
        {
          subtitle: "Security Measures",
          items: [
            "Industry-standard encryption for data transmission",
            "Secure servers with regular security updates",
            "Access controls and authentication protocols",
            "Regular security audits and vulnerability assessments"
          ]
        },
        {
          subtitle: "Data Retention",
          items: [
            "Personal data retained only as long as necessary",
            "Account data deleted upon request",
            "Transaction records kept for legal compliance",
            "Analytics data anonymized after processing"
          ]
        }
      ]
    },
    {
      icon: <Globe size={24} />,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Control",
          items: [
            "Request access to your personal information",
            "Correct or update inaccurate data",
            "Delete your account and associated data",
            "Download your data in a portable format"
          ]
        },
        {
          subtitle: "Communication Preferences",
          items: [
            "Opt out of marketing communications at any time",
            "Manage cookie preferences in your browser",
            "Unsubscribe from newsletters and promotional emails",
            "Control notification settings in your account"
          ]
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet title="Privacy Policy | Anantam Aerials and Robotics" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className='absolute inset-0'>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/442584/pexels-photo-442584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-black opacity-80"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <Shield className="text-primary-500 mr-4" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xl text-gray-300 mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="bg-primary-600/20 border border-primary-500/30 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <strong>Effective Date:</strong> January 1, 2024 | <strong>Last Updated:</strong> January 1, 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="card p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-primary-400">Our Commitment to Your Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              At <strong className="text-primary-400">Anantam Aerials and Robotics</strong> ("we", "our", or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, share, and protect your information when you visit our website, use our services, or interact with us in any way.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              By using our website or services, you consent to the collection and use of your information as described in this policy. If you do not agree with our practices, please do not use our services.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="text-primary-500 mr-4">{section.icon}</div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                
                <div className="space-y-6">
                  {section.content.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-lg font-semibold mb-3 text-primary-400">
                        {subsection.subtitle}
                      </h3>
                      <ul className="space-y-2">
                        {subsection.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <svg className="w-5 h-5 text-primary-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card p-8 mt-12"
          >
            <div className="flex items-center mb-6">
              <Mail className="text-primary-500 mr-4" size={24} />
              <h2 className="text-2xl font-bold">Contact Us About Privacy</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary-400">Data Protection Officer</h3>
                <p className="text-gray-300 mb-2">
                  If you have questions about this Privacy Policy or want to exercise your rights, contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Email:</strong> privacy@anantamaerials.com</p>
                  <p><strong>Phone:</strong> +91-79222 29737</p>
                  <p><strong>Address:</strong> Anantam Aerials and Robotics, Pune, Maharashtra, India</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary-400">Response Time</h3>
                <p className="text-gray-300 mb-4">
                  We will respond to your privacy-related inquiries within 30 days of receipt.
                </p>
                <div className="bg-primary-600/20 border border-primary-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>Note:</strong> This policy may be updated periodically. We will notify you of significant changes via email or website notice.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default PrivacyPolicyPage;