import { motion } from 'framer-motion';
import { Helmet } from '../components/utils/Helmet';
import { RotateCcw, CreditCard, XCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const CancellationRefundPage = () => {
  const sections = [
    {
      icon: <XCircle size={24} />,
      title: "Order Cancellation Policy",
      content: [
        {
          subtitle: "Cancellation Window",
          items: [
            "Orders can be cancelled free of charge within 2 hours of placement",
            "Cancellation possible until order dispatch (processing charges may apply)",
            "Custom drone orders can be cancelled within 24 hours with 10% processing fee",
            "Orders in production cannot be cancelled but may be eligible for exchange"
          ]
        },
        {
          subtitle: "How to Cancel",
          items: [
            "Login to your account and navigate to 'My Orders' section",
            "Click 'Cancel Order' button next to the respective order",
            "Call our customer service at +91-79222 29737 for immediate assistance",
            "Email cancellation request to orders@anantamaerialsandrobotics.com"
          ]
        },
        {
          subtitle: "Cancellation Charges",
          items: [
            "No charge for cancellations within 2 hours of order placement",
            "3% processing fee for cancellations after 2 hours but before dispatch",
            "10% fee for custom orders cancelled within 24 hours",
            "No cancellation possible after dispatch - return policy applies"
          ]
        }
      ]
    },
    {
      icon: <RotateCcw size={24} />,
      title: "Return and Exchange Policy",
      content: [
        {
          subtitle: "Return Eligibility",
          items: [
            "30-day return window for unused drones and accessories in original packaging",
            "7-day return window for drone parts and electronic components",
            "Custom-built drones eligible for return only if manufacturing defects exist",
            "All returns must include original packaging, manuals, and accessories"
          ]
        },
        {
          subtitle: "Return Process",
          items: [
            "Contact customer service to initiate return request and receive RMA number",
            "Pack items securely in original packaging with all accessories",
            "Ship items to our return facility using provided prepaid shipping label",
            "Refund processed within 7-10 business days after quality inspection"
          ]
        },
        {
          subtitle: "Exchange Policy",
          items: [
            "Size/model exchanges allowed within 15 days of delivery",
            "Price difference (if any) to be paid or refunded accordingly",
            "Exchanges subject to product availability and condition verification",
            "One-time exchange allowed per order"
          ]
        }
      ]
    },
    {
      icon: <CreditCard size={24} />,
      title: "Refund Processing",
      content: [
        {
          subtitle: "Refund Timeline",
          items: [
            "Credit/Debit Card: 5-7 business days after refund initiation",
            "Net Banking: 7-10 business days after refund initiation",
            "Digital Wallets (Paytm, PhonePe): 2-3 business days",
            "Cash on Delivery orders refunded via bank transfer (7-10 days)"
          ]
        },
        {
          subtitle: "Refund Amount",
          items: [
            "Full refund for returns due to manufacturing defects or wrong product delivery",
            "Refund minus return shipping charges for customer-initiated returns",
            "Partial refund for items returned without original packaging or accessories",
            "Custom orders refunded minus 15% restocking fee if returned within policy terms"
          ]
        },
        {
          subtitle: "Non-Refundable Items",
          items: [
            "Damaged or modified products beyond manufacturer warranty terms",
            "Items used for more than demonstration/testing purposes",
            "Software licenses and digital training materials",
            "Products damaged due to misuse, accidents, or normal wear and tear"
          ]
        }
      ]
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "Special Cases and Exceptions",
      content: [
        {
          subtitle: "Defective Products",
          items: [
            "Immediate replacement or full refund for products with manufacturing defects",
            "Extended 60-day return window for defective items discovered after use",
            "Free return shipping and expedited replacement processing",
            "Additional compensation considered for significant inconvenience caused"
          ]
        },
        {
          subtitle: "Wrong Product Delivered",
          items: [
            "Full refund or free exchange if wrong product delivered",
            "Expedited shipping for correct product at no additional cost",
            "Return shipping arranged and paid by Anantam Aerials and Robotics",
            "Compensation voucher provided for inconvenience"
          ]
        },
        {
          subtitle: "Bulk Orders",
          items: [
            "Special return terms apply for orders above ₹1,00,000",
            "Customized return and exchange policy for institutional purchases",
            "Dedicated account manager for handling bulk order returns",
            "Flexible payment terms for replacement orders"
          ]
        }
      ]
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Quality Assurance and Inspection",
      content: [
        {
          subtitle: "Return Inspection Process",
          items: [
            "All returned items undergo thorough quality inspection",
            "Physical damage assessment and functionality testing performed",
            "Original packaging and accessory completeness verification",
            "Refund amount determined based on inspection results"
          ]
        },
        {
          subtitle: "Restocking Process",
          items: [
            "Returned items cleaned, tested, and repackaged as needed",
            "Items meeting quality standards returned to sellable inventory",
            "Damaged items sent for repair or disposal as appropriate",
            "Customer notified of inspection results and final refund amount"
          ]
        }
      ]
    },
    {
      icon: <Clock size={24} />,
      title: "Warranty and Service Coverage",
      content: [
        {
          subtitle: "Warranty Returns",
          items: [
            "Free repair or replacement during valid warranty period",
            "Extended warranty options available for purchase",
            "Warranty claims processed within 15 business days",
            "Loaner equipment provided for extended repair periods (subject to availability)"
          ]
        },
        {
          subtitle: "Service and Repair Returns",
          items: [
            "90-day warranty on all repair services performed",
            "Free re-service if same issue recurs within warranty period",
            "Return shipping covered for warranty service issues",
            "Service history maintained for all customer products"
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
      <Helmet title="Cancellation & Refund Policy | Anantam Aerials and Robotics" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className='absolute inset-0'>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-black opacity-80"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <RotateCcw className="text-primary-500 mr-4" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold">Cancellation & Refund Policy</h1>
            </div>
            <p className="text-xl text-gray-300 mb-4">
              Hassle-free cancellations and returns with transparent refund processes for your peace of mind.
            </p>
            <div className="bg-primary-600/20 border border-primary-500/30 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <strong>Quick Summary:</strong> 30-day returns | Free cancellation within 2 hours | 5-10 days refund processing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="card p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-primary-400">Customer Satisfaction Guarantee</h2>
            <p className="text-gray-300 leading-relaxed">
              At <strong className="text-primary-400">Anantam Aerials and Robotics</strong>, your satisfaction is our top priority. We stand behind the quality of our drones, parts, and services with comprehensive cancellation and refund policies designed to give you confidence in your purchase.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Whether you need to cancel an order, return a product, or request a refund, our streamlined processes ensure quick resolution. All policies are designed to be fair, transparent, and customer-friendly while maintaining the highest quality standards.
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="card p-4 text-center">
              <XCircle className="text-red-500 mx-auto mb-2" size={24} />
              <h3 className="text-sm font-semibold mb-1">Cancel Order</h3>
              <p className="text-gray-400 text-xs">Within 2 hours</p>
            </div>
            <div className="card p-4 text-center">
              <RotateCcw className="text-blue-500 mx-auto mb-2" size={24} />
              <h3 className="text-sm font-semibold mb-1">Return Item</h3>
              <p className="text-gray-400 text-xs">30-day window</p>
            </div>
            <div className="card p-4 text-center">
              <CreditCard className="text-green-500 mx-auto mb-2" size={24} />
              <h3 className="text-sm font-semibold mb-1">Get Refund</h3>
              <p className="text-gray-400 text-xs">5-10 business days</p>
            </div>
            <div className="card p-4 text-center">
              <CheckCircle className="text-purple-500 mx-auto mb-2" size={24} />
              <h3 className="text-sm font-semibold mb-1">Quality Check</h3>
              <p className="text-gray-400 text-xs">Every return</p>
            </div>
          </div>

          {/* Policy Sections */}
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

          {/* Contact and Important Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card p-8 mt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-primary-400">Need Help with Returns?</h3>
                <p className="text-gray-300 mb-4">
                  Our customer service team is here to assist you with cancellations, returns, and refunds.
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Email:</strong> returns@anantamaerialsandrobotics.com</p>
                  <p><strong>Phone:</strong> +91-79222 29737</p>
                  <p><strong>Support Hours:</strong> Mon-Fri 9:00 AM - 6:00 PM IST</p>
                  <p><strong>Return Address:</strong> Will be provided with RMA number</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-primary-400">Important Reminders</h3>
                <div className="space-y-3">
                  <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      <strong>Free Returns:</strong> Manufacturing defects and wrong deliveries qualify for free return shipping.
                    </p>
                  </div>
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      <strong>Keep Packaging:</strong> Original packaging required for all returns and exchanges.
                    </p>
                  </div>
                  <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      <strong>RMA Required:</strong> All returns must have a Return Merchandise Authorization number.
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

export default CancellationRefundPage;