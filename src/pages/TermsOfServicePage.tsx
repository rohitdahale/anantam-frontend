import { motion } from 'framer-motion';
import { Helmet } from '../components/utils/Helmet';
import { FileText, Shield, AlertTriangle, CreditCard, Wrench, GraduationCap, Scale } from 'lucide-react';

const TermsOfServicePage = () => {
  const sections = [
    {
      icon: <FileText size={24} />,
      title: "Services We Provide",
      content: [
        {
          subtitle: "Drone Manufacturing & Sales",
          items: [
            "Custom drone design and manufacturing",
            "Ready-to-fly drone systems and components",
            "Technical specifications and documentation",
            "Warranty coverage for manufactured products"
          ]
        },
        {
          subtitle: "Repair & Maintenance Services",
          items: [
            "Professional diagnosis and troubleshooting",
            "Component replacement and repairs",
            "Firmware updates and calibration services",
            "Preventive maintenance programs"
          ]
        },
        {
          subtitle: "Educational Workshops",
          items: [
            "Drone piloting and safety training",
            "Technical workshops on drone technology",
            "Certification programs and skill development",
            "Custom training for organizations"
          ]
        },
        {
          subtitle: "Consulting Services",
          items: [
            "Aerial solution consulting",
            "Custom system integration",
            "Regulatory compliance guidance",
            "Technical support and consultation"
          ]
        }
      ]
    },
    {
      icon: <Shield size={24} />,
      title: "User Responsibilities",
      content: [
        {
          subtitle: "Lawful Use",
          items: [
            "Use our products and services only for legal purposes",
            "Comply with all applicable drone regulations and laws",
            "Respect privacy rights and no-fly zones",
            "Follow safety guidelines and best practices"
          ]
        },
        {
          subtitle: "Platform Security",
          items: [
            "Maintain the confidentiality of your account credentials",
            "Do not attempt to disrupt or compromise our systems",
            "Report security vulnerabilities responsibly",
            "Avoid unauthorized access to restricted areas"
          ]
        },
        {
          subtitle: "Content and Conduct",
          items: [
            "Provide accurate information in all interactions",
            "Respect intellectual property rights",
            "Maintain professional conduct in communications",
            "Do not engage in harmful or fraudulent activities"
          ]
        }
      ]
    },
    {
      icon: <CreditCard size={24} />,
      title: "Orders, Payments & Refunds",
      content: [
        {
          subtitle: "Order Processing",
          items: [
            "All orders are subject to availability and confirmation",
            "Prices are subject to change without prior notice",
            "Custom orders require advance payment and specifications",
            "Delivery timelines are estimates and may vary"
          ]
        },
        {
          subtitle: "Payment Terms",
          items: [
            "Payment must be made at the time of order placement",
            "We accept major credit cards and digital payment methods",
            "All payments are processed through secure payment gateways",
            "Invoices for corporate clients available upon request"
          ]
        },
        {
          subtitle: "Returns & Refunds",
          items: [
            "Standard products: 30-day return policy for unused items",
            "Custom products: Returns accepted only for manufacturing defects",
            "Refunds processed within 7-10 business days",
            "Return shipping costs are customer's responsibility unless defective"
          ]
        }
      ]
    },
    {
      icon: <Wrench size={24} />,
      title: "Product Warranties & Support",
      content: [
        {
          subtitle: "Warranty Coverage",
          items: [
            "Manufacturing defects covered for 12 months from purchase",
            "Warranty void if product is modified or misused",
            "Repair services include 90-day warranty on work performed",
            "Extended warranty options available for purchase"
          ]
        },
        {
          subtitle: "Technical Support",
          items: [
            "Free technical support for 6 months post-purchase",
            "Remote troubleshooting and guidance available",
            "On-site support available for enterprise customers",
            "Support hours: Monday-Friday, 9 AM - 6 PM IST"
          ]
        }
      ]
    },
    {
      icon: <Scale size={24} />,
      title: "Intellectual Property Rights",
      content: [
        {
          subtitle: "Our Intellectual Property",
          items: [
            "All website content, designs, and media are our property",
            "Trademarks and logos are protected intellectual property",
            "Software and firmware are licensed, not sold",
            "Reverse engineering of our products is prohibited"
          ]
        },
        {
          subtitle: "User Content",
          items: [
            "You retain ownership of content you create",
            "Grant us license to use feedback and suggestions",
            "User-generated content must not infringe on others' rights",
            "We may remove content that violates our policies"
          ]
        }
      ]
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "Limitations & Liability",
      content: [
        {
          subtitle: "Service Limitations",
          items: [
            "Services provided 'as is' without implied warranties",
            "We do not guarantee uninterrupted service availability",
            "Performance may vary based on external factors",
            "Regular maintenance may temporarily affect service access"
          ]
        },
        {
          subtitle: "Liability Limits",
          items: [
            "Our liability is limited to the amount paid for the service",
            "We are not liable for indirect or consequential damages",
            "Users assume responsibility for proper product operation",
            "Force majeure events exempt us from liability"
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
      <Helmet title="Terms of Service | Anantam Aerials and Robotics" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className='absolute inset-0'>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-black opacity-80"></div>

        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <Scale className="text-primary-500 mr-4" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-xl text-gray-300 mb-4">
              These terms govern your use of our website and services. Please read them carefully.
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
            <h2 className="text-2xl font-bold mb-4 text-primary-400">Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and <strong className="text-primary-400">Anantam Aerials and Robotics</strong> ("Company", "we", "our", or "us") regarding your use of our website, products, and services.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              By accessing our website, purchasing our products, or using our services, you agree to be bound by these Terms. If you do not agree with any part of these terms, you may not access our services.
            </p>
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                <p className="text-sm text-gray-300">
                  <strong>Important:</strong> These terms may be updated from time to time. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

          {/* Additional Terms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card p-8 mt-12"
          >
            <div className="flex items-center mb-6">
              <GraduationCap className="text-primary-500 mr-4" size={24} />
              <h2 className="text-2xl font-bold">Additional Terms & Conditions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary-400">Governing Law</h3>
                <p className="text-gray-300 mb-4">
                  These Terms are governed by the laws of India. Any disputes will be resolved in the courts of Nagpur, Maharashtra.
                </p>
                
                <h3 className="text-lg font-semibold mb-3 text-primary-400">Severability</h3>
                <p className="text-gray-300">
                  If any provision of these Terms is found to be invalid, the remaining provisions will continue to be enforced.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary-400">Force Majeure</h3>
                <p className="text-gray-300 mb-4">
                  We are not liable for delays or failures due to circumstances beyond our reasonable control, including natural disasters, government actions, or technical failures.
                </p>
                
                <h3 className="text-lg font-semibold mb-3 text-primary-400">Entire Agreement</h3>
                <p className="text-gray-300">
                  These Terms, along with our Privacy Policy, constitute the entire agreement between you and Anantam Aerials and Robotics.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card p-8 mt-12"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
              <p className="text-gray-300 mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="text-center">
                  <p className="text-primary-400 font-semibold">Email</p>
                  <a href="mailto:legal@anantamaerials.com" className="text-gray-300 hover:text-primary-400 transition-colors">
                    director@anantamaerialsandrobotics.com
                  </a>
                </div>
                
                <div className="text-center">
                  <p className="text-primary-400 font-semibold">Phone</p>
                  <p className="text-gray-300">+91-79722 29737</p>
                </div>
                
                <div className="text-center">
                  <p className="text-primary-400 font-semibold">Address</p>
                  <p className="text-gray-300">Anantam Aerials and Robotics<br />Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default TermsOfServicePage;