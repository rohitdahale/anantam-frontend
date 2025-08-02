import { motion } from 'framer-motion';
import { Helmet } from '../components/utils/Helmet';
import { Truck, Package, Clock, MapPin, AlertCircle, Shield } from 'lucide-react';

const ShippingPolicyPage = () => {
  const sections = [
    {
      icon: <MapPin size={24} />,
      title: "Shipping Coverage",
      content: [
        {
          subtitle: "Domestic Shipping (India)",
          items: [
            "Free shipping on orders above ₹5,000 within India",
            "Standard shipping charges: ₹150 for orders below ₹5,000",
            "Express shipping available for ₹300 (1-2 business days)",
            "Coverage across all major cities and remote locations"
          ]
        },
        {
          subtitle: "International Shipping",
          items: [
            "International shipping available to select countries",
            "Shipping costs calculated based on weight, dimensions, and destination",
            "Customer responsible for customs duties and import taxes",
            "Some drone models may be restricted for international shipping"
          ]
        }
      ]
    },
    {
      icon: <Clock size={24} />,
      title: "Processing and Delivery Times",
      content: [
        {
          subtitle: "Order Processing",
          items: [
            "In-stock items: 1-2 business days processing time",
            "Custom drone builds: 7-15 business days processing time",
            "Drone parts and accessories: Same day processing (if ordered before 2 PM)",
            "Orders placed on weekends processed on next business day"
          ]
        },
        {
          subtitle: "Delivery Timeframes",
          items: [
            "Metro cities: 2-4 business days (standard), 1-2 days (express)",
            "Tier 2 cities: 3-6 business days (standard), 2-3 days (express)",
            "Remote locations: 5-10 business days",
            "International: 7-21 business days depending on destination"
          ]
        }
      ]
    },
    {
      icon: <Package size={24} />,
      title: "Packaging and Handling",
      content: [
        {
          subtitle: "Drone Packaging",
          items: [
            "All drones packed in original manufacturer packaging with additional protective materials",
            "Custom foam inserts and shock-absorbent materials for fragile components",
            "Waterproof packaging for protection against moisture during transit",
            "Tamper-evident sealing for security and authenticity verification"
          ]
        },
        {
          subtitle: "Parts and Accessories",
          items: [
            "Small parts securely packed in anti-static bags where applicable",
            "Fragile components wrapped individually with bubble wrap",
            "All packages labeled with handling instructions (Fragile, This Side Up, etc.)",
            "Eco-friendly packaging materials used wherever possible"
          ]
        }
      ]
    },
    {
      icon: <Truck size={24} />,
      title: "Shipping Partners and Tracking",
      content: [
        {
          subtitle: "Courier Partners",
          items: [
            "Blue Dart for express and high-value shipments",
            "Delhivery for standard domestic deliveries",
            "India Post for remote location deliveries",
            "FedEx and DHL for international shipments"
          ]
        },
        {
          subtitle: "Order Tracking",
          items: [
            "Tracking number provided via email within 24 hours of dispatch",
            "Real-time tracking available on our website and courier partner apps",
            "SMS updates for key delivery milestones",
            "Customer support available for tracking assistance"
          ]
        }
      ]
    },
    {
      icon: <AlertCircle size={24} />,
      title: "Special Shipping Considerations",
      content: [
        {
          subtitle: "Drone-Specific Requirements",
          items: [
            "Lithium batteries shipped separately when required by regulations",
            "Large drones may require special handling and longer delivery times",
            "Documentation support provided for customs and regulatory compliance",
            "Some drone models require signature confirmation upon delivery"
          ]
        },
        {
          subtitle: "Restricted Items",
          items: [
            "High-powered drone jammers not shipped to certain regions",
            "Military-grade components subject to export control regulations",
            "Age-restricted items require adult signature for delivery",
            "Hazardous materials shipped according to applicable safety regulations"
          ]
        }
      ]
    },
    {
      icon: <Shield size={24} />,
      title: "Delivery Issues and Resolution",
      content: [
        {
          subtitle: "Failed Delivery Attempts",
          items: [
            "Up to 3 delivery attempts made at the provided address",
            "Customer notified via call/SMS before each delivery attempt",
            "Package held at local facility for 7 days after final attempt",
            "Redelivery can be scheduled at customer's convenience"
          ]
        },
        {
          subtitle: "Damage and Loss Protection",
          items: [
            "All shipments insured against loss and damage during transit",
            "Photo evidence required for damage claims within 48 hours of delivery",
            "Replacement or refund processed within 7-10 business days for valid claims",
            "Original packaging must be retained for 15 days after delivery"
          ]
        },
        {
          subtitle: "Address Changes",
          items: [
            "Address changes possible before order dispatch (no additional charge)",
            "Address changes after dispatch subject to courier partner policies and charges",
            "Incorrect addresses may result in delivery delays and additional charges",
            "PO Box addresses not accepted for drone deliveries"
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
      <Helmet title="Shipping Policy | Anantam Aerials and Robotics" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className='absolute inset-0'>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-black opacity-80"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <Truck className="text-primary-500 mr-4" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold">Shipping Policy</h1>
            </div>
            <p className="text-xl text-gray-300 mb-4">
              Fast, secure, and reliable shipping for all your drone and robotics needs across India and internationally.
            </p>
            <div className="bg-primary-600/20 border border-primary-500/30 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <strong>Free Shipping:</strong> On orders above ₹5,000 within India | <strong>Express Delivery:</strong> Available in major cities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="card p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-primary-400">Our Shipping Commitment</h2>
            <p className="text-gray-300 leading-relaxed">
              At <strong className="text-primary-400">Anantam Aerials and Robotics</strong>, we understand the importance of getting your drone equipment safely and quickly. Our comprehensive shipping policy ensures your products are delivered with the utmost care and professionalism.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              We partner with leading courier services and follow strict packaging protocols to ensure your drones, parts, and accessories arrive in perfect condition. All shipments are fully insured and trackable from dispatch to delivery.
            </p>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card p-6 text-center">
              <Package className="text-primary-500 mx-auto mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-300 text-sm">On orders above ₹5,000 across India</p>
            </div>
            <div className="card p-6 text-center">
              <Clock className="text-primary-500 mx-auto mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-300 text-sm">1-2 days for in-stock items</p>
            </div>
            <div className="card p-6 text-center">
              <Shield className="text-primary-500 mx-auto mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">Fully Insured</h3>
              <p className="text-gray-300 text-sm">All shipments protected against loss</p>
            </div>
          </div>

          {/* Shipping Sections */}
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

          {/* Contact and Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card p-8 mt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-primary-400">Shipping Support</h3>
                <p className="text-gray-300 mb-4">
                  Need help with your shipment or have questions about delivery?
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Email:</strong> shipping@anantamaerialsandrobotics.com</p>
                  <p><strong>Phone:</strong> +91-79222 29737</p>
                  <p><strong>Support Hours:</strong> Mon-Fri 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-primary-400">Important Notes</h3>
                <div className="space-y-3">
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      <strong>Customs & Duties:</strong> International customers are responsible for all customs duties and import taxes.
                    </p>
                  </div>
                  <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      <strong>Battery Shipping:</strong> Lithium batteries may be shipped separately due to safety regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ShippingPolicyPage;