import { motion } from 'framer-motion';
import { Helmet } from '../components/utils/Helmet';
import { FileText, Scale, AlertTriangle, Users, Wrench, Plane } from 'lucide-react';

const TermsConditionsPage = () => {
  const sections = [
    {
      icon: <FileText size={24} />,
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          items: [
            "By accessing and using our website, you accept and agree to be bound by these Terms and Conditions",
            "These terms apply to all visitors, users, and customers of Anantam Aerials and Robotics",
            "If you do not agree with any part of these terms, you must not use our services",
            "We reserve the right to update these terms at any time without prior notice"
          ]
        }
      ]
    },
    {
      icon: <Plane size={24} />,
      title: "Products and Services",
      content: [
        {
          subtitle: "Drone Sales and Manufacturing",
          items: [
            "We manufacture and sell high-quality drones for commercial and recreational use",
            "All drones comply with applicable aviation regulations and safety standards",
            "Custom drone solutions available based on specific requirements",
            "Product specifications and availability subject to change without notice"
          ]
        },
        {
          subtitle: "Drone Parts and Components",
          items: [
            "Genuine and compatible drone parts for various drone models",
            "Parts warranty limited to manufacturing defects only",
            "Installation and compatibility guidance provided but not guaranteed",
            "Custom parts manufacturing available upon request"
          ]
        },
        {
          subtitle: "Repair and Maintenance Services",
          items: [
            "Professional drone repair services by certified technicians",
            "Diagnostic services to identify drone issues and malfunctions",
            "Service turnaround time estimates are approximate, not guaranteed",
            "Additional charges may apply for parts and complex repairs"
          ]
        },
        {
          subtitle: "Training and Workshops",
          items: [
            "Comprehensive drone operation and maintenance training programs",
            "Certification courses for commercial drone pilots",
            "Workshop schedules subject to availability and minimum enrollment",
            "Training materials and certificates provided upon successful completion"
          ]
        }
      ]
    },
    {
      icon: <Scale size={24} />,
      title: "Legal Compliance and Regulations",
      content: [
        {
          subtitle: "Aviation Regulations",
          items: [
            "All drone products comply with DGCA (Directorate General of Civil Aviation) regulations",
            "Customers responsible for obtaining necessary licenses and permits for drone operation",
            "Use of drones must comply with local, state, and national aviation laws",
            "We provide guidance but customers are solely responsible for legal compliance"
          ]
        },
        {
          subtitle: "Export and Import Regulations",
          items: [
            "International shipments subject to export control regulations",
            "Customers responsible for import duties, taxes, and customs clearance",
            "Certain products may be restricted for export to specific countries",
            "Documentation support provided for legitimate business purposes"
          ]
        }
      ]
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "User Responsibilities and Prohibited Uses",
      content: [
        {
          subtitle: "Responsible Use",
          items: [
            "Users must operate drones safely and in accordance with manufacturer guidelines",
            "Proper maintenance and regular inspection of drones is user's responsibility",
            "Users must respect privacy rights and property of others when operating drones",
            "Commercial users must obtain appropriate licenses and insurance coverage"
          ]
        },
        {
          subtitle: "Prohibited Activities",
          items: [
            "Using drones for illegal surveillance or invasion of privacy",
            "Operating drones in restricted airspace without proper authorization",
            "Using our products for any unlawful or harmful purposes",
            "Reverse engineering or copying our proprietary designs and technologies"
          ]
        }
      ]
    },
    {
      icon: <Wrench size={24} />,
      title: "Warranties and Disclaimers",
      content: [
        {
          subtitle: "Product Warranties",
          items: [
            "New drones come with 12-month manufacturer warranty against defects",
            "Drone parts have 6-month warranty from date of purchase",
            "Warranty covers manufacturing defects, not damage from misuse or accidents",
            "Refurbished products come with 6-month limited warranty"
          ]
        },
        {
          subtitle: "Service Warranties",
          items: [
            "Repair services guaranteed for 90 days from service completion",
            "Training and workshop services provided 'as-is' without warranty",
            "Warranty void if unauthorized modifications or repairs are performed",
            "Weather-related delays in outdoor training sessions not covered"
          ]
        },
        {
          subtitle: "Disclaimers",
          items: [
            "We disclaim all warranties beyond those expressly stated herein",
            "Products sold 'as-is' except for express written warranties",
            "No warranty against normal wear and tear or user error",
            "Flight performance may vary based on environmental conditions"
          ]
        }
      ]
    },
    {
      icon: <Users size={24} />,
      title: "Limitation of Liability",
      content: [
        {
          subtitle: "Liability Limits",
          items: [
            "Our liability limited to the purchase price of the product or service",
            "Not liable for indirect, consequential, or incidental damages",
            "Not responsible for damages caused by improper use or maintenance",
            "Users assume all risks associated with drone operation"
          ]
        },
        {
          subtitle: "Third Party Claims",
          items: [
            "Users indemnify us against claims arising from drone operation",
            "Not liable for property damage or personal injury caused by user negligence",
            "Users responsible for obtaining adequate insurance coverage",
            "We reserve the right to legal defense in cases of product misuse"
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
      <Helmet title="Terms and Conditions | Anantam Aerials and Robotics" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className='absolute inset-0'>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-black opacity-80"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <FileText className="text-primary-500 mr-4" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold">Terms and Conditions</h1>
            </div>
            <p className="text-xl text-gray-300 mb-4">
              Please read these terms and conditions carefully before using our services or purchasing our products.
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
            <h2 className="text-2xl font-bold mb-4 text-primary-400">Agreement Overview</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to <strong className="text-primary-400">Anantam Aerials and Robotics</strong>. These Terms and Conditions ("Terms") govern your use of our website, products, and services, including drone sales, manufacturing, parts, repair services, and training programs.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              By engaging with our company, you acknowledge that you have read, understood, and agree to be legally bound by these Terms. These Terms constitute a legally binding agreement between you and Anantam Aerials and Robotics.
            </p>
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
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

          {/* Contact and Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card p-8 mt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-primary-400">Governing Law</h3>
                <p className="text-gray-300 mb-4">
                  These Terms are governed by the laws of India and the state of Maharashtra. Any disputes will be resolved in the courts of Pune, Maharashtra.
                </p>
                <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <strong>Important:</strong> Drone operation is subject to DGCA regulations. Users must comply with all applicable aviation laws.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-primary-400">Contact Information</h3>
                <p className="text-gray-300 mb-4">
                  For questions about these Terms and Conditions:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Email:</strong> director@anantamaerialsandrobotics.com</p>
                  <p><strong>Phone:</strong> +91-79222 29737</p>
                  <p><strong>Address:</strong> Anantam Aerials and Robotics, Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default TermsConditionsPage;