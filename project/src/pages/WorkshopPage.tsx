import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from '../components/utils/Helmet';
import { Calendar, Clock, MapPin, Users, Award, BookOpen, ChevronDown } from 'lucide-react';

// Types
interface Workshop {
  _id: string;
  title: string;
  image: string;
  description: string;
  duration: string;
  schedule: string;
  location: string;
  price: string;
  capacity: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  upcoming: Array<{
    date: string;
    spots: number;
  }>;
  curriculum: string[];
  isActive: boolean;
}

interface WorkshopRegistration {
  _id: string;
  workshop: Workshop;
  selectedDate: string;
  participantInfo: {
    name: string;
    email: string;
    phone: string;
    experience: 'Beginner' | 'Intermediate' | 'Advanced';
    additionalInfo?: string;
  };
  paymentInfo: {
    amount: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentId?: string;
    paymentMethod: 'online' | 'offline' | 'bank_transfer';
    razorpayOrderId?: string;
  };
  registrationStatus: 'registered' | 'confirmed' | 'cancelled' | 'completed';
  registrationDate: string; // Add this line
}

interface PaymentOrder {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  workshopTitle: string;
  selectedDate: string;
  participantInfo: {
    name: string;
    email: string;
    phone: string;
    experience: string;
    additionalInfo?: string;
  };
}

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const FAQs = [
  {
    question: 'Do I need to bring my own drone to the workshops?',
    answer: 'For most workshops, we provide all necessary equipment including drones. However, for the Drone Repair workshop, we encourage participants to bring their own drones if they have specific issues to address. The course details will specify if any personal equipment is required.'
  },
  {
    question: 'Are there any prerequisites for attending the workshops?',
    answer: 'The prerequisites vary by workshop. Beginner courses like our Drone Pilot Certification have no prerequisites. Intermediate and advanced courses may require basic flying experience or technical knowledge. Each workshop listing includes recommended experience levels.'
  },
  {
    question: 'What certification will I receive after completing a workshop?',
    answer: 'Upon successful completion of our workshops, participants receive an Anantam Aerial certification. For the Drone Pilot Certification Course, we also provide guidance for official DGCA certification, though this is a separate process requiring additional steps.'
  },
  {
    question: 'Can workshops be conducted at our company location?',
    answer: 'Yes, we offer corporate workshops that can be conducted at your location. These can be customized to your specific industry needs. Please contact our corporate training department for details and pricing.'
  },
  {
    question: 'What is the cancellation and refund policy?',
    answer: 'Cancellations made 14 or more days before the workshop date receive a full refund. Cancellations 7-13 days prior receive a 50% refund. Cancellations less than 7 days before the workshop are non-refundable. You may transfer your registration to another person or reschedule for a future date (subject to availability).'
  }
];

const WorkshopPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // Add these new state variables:
const [showUserRegistrations, setShowUserRegistrations] = useState(false);
const [userRegistrations, setUserRegistrations] = useState<WorkshopRegistration[]>([]);
const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  
  // Registration form state
  const [participantInfo, setParticipantInfo] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    additionalInfo: ''
  });

  // API base URL
  const API_BASE_URL = 'https://anantam-backend-7ezq.onrender.com/api';

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch workshops
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/workshops`);
        if (!response.ok) {
          throw new Error('Failed to fetch workshops');
        }
        const data = await response.json();
        setWorkshops(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workshops');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleWorkshopSelect = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
  };

  const handleRegistration = (workshop: Workshop, date: string) => {
    setSelectedWorkshop(workshop);
    setSelectedDate(date);
    setShowRegistrationModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParticipantInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add this function to fetch user registrations:
const fetchUserRegistrations = async () => {
  const token = getAuthToken();
  if (!token) {
    alert('Please login to view your registrations');
    return;
  }

  setLoadingRegistrations(true);
  try {
    const response = await fetch(`${API_BASE_URL}/workshops/user/registrations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch registrations');
    }

    const data = await response.json();
    setUserRegistrations(data);
    setShowUserRegistrations(true);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    alert('Failed to fetch your registrations');
  } finally {
    setLoadingRegistrations(false);
  }
};

  const processPayment = async () => {
    if (!selectedWorkshop || !selectedDate) return;

    const token = getAuthToken();
    if (!token) {
      alert('Please login to register for workshops');
      return;
    }

    setRegistrationLoading(true);

    try {
      // Create payment order
      const orderResponse = await fetch(`${API_BASE_URL}/workshops/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          workshopId: selectedWorkshop._id,
          selectedDate,
          participantInfo
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();
      const { order, razorpayKey } = orderData;

      // Initialize Razorpay payment
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Anantam Aerial',
        description: `Registration for ${order.workshopTitle}`,
        order_id: order.razorpayOrderId,
        prefill: {
          name: participantInfo.name,
          email: participantInfo.email,
          contact: participantInfo.phone,
        },
        theme: {
          color: '#3B82F6'
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${API_BASE_URL}/workshops/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                workshopId: selectedWorkshop._id,
                selectedDate,
                participantInfo
              })
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            
            alert('Registration successful! You will receive a confirmation email shortly.');
            
            // Reset form and close modal
            setShowRegistrationModal(false);
            setParticipantInfo({
              name: '',
              email: '',
              phone: '',
              experience: 'Beginner',
              additionalInfo: ''
            });
            
            // Refresh workshops to update spots
            window.location.reload();
            
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setRegistrationLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setRegistrationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading workshops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
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
      <Helmet title="Workshops | Anantam Aerial" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Drone Workshops & Training</h1>
            <p className="text-xl text-gray-300">Enhance your skills with our expert-led workshops for all experience levels.</p>
<div className="mt-8">
  <button 
    onClick={fetchUserRegistrations}
    disabled={loadingRegistrations}
    className="btn-outline mr-4"
  >
    {loadingRegistrations ? 'Loading...' : 'My Registrations'}
  </button>
</div>
          </div>
          

        </div>
      </section>
      
      {/* Workshops List */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Workshops</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our range of workshops designed to develop your drone skills and knowledge.
            </p>
          </div>
          
          {workshops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No workshops available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {workshops.map((workshop) => (
                <motion.div
                  key={workshop._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="card overflow-hidden group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={workshop.image} 
                      alt={workshop.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="px-3 py-1 bg-primary-600 text-white text-xs rounded-full">
                          {workshop.level}
                        </span>
                        <span className="px-3 py-1 bg-dark-700 text-gray-300 text-xs rounded-full">
                          {workshop.price}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{workshop.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-300 mb-4">{workshop.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-400">
                        <Clock size={18} className="mr-2 text-primary-400" />
                        <span>{workshop.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Calendar size={18} className="mr-2 text-primary-400" />
                        <span>{workshop.schedule}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <MapPin size={18} className="mr-2 text-primary-400" />
                        <span>{workshop.location}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Users size={18} className="mr-2 text-primary-400" />
                        <span>Max {workshop.capacity} participants</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button 
                        className="btn-primary"
                        onClick={() => handleWorkshopSelect(workshop)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Why Choose Our Workshops */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Workshops</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our workshops are designed to provide hands-on experience and practical knowledge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="card p-6">
              <div className="text-primary-500 mb-4">
                <Award size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Instructors</h3>
              <p className="text-gray-400">
                Learn from industry professionals with years of experience in drone operations, photography, and engineering.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="text-primary-500 mb-4">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Small Class Sizes</h3>
              <p className="text-gray-400">
                Limited participants per workshop ensures personalized attention and optimal learning experience.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="text-primary-500 mb-4">
                <BookOpen size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Curriculum</h3>
              <p className="text-gray-400">
                Well-structured content covering both theoretical knowledge and practical skills with hands-on exercises.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our workshops.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mt-12 space-y-4">
            {FAQs.map((faq, index) => (
              <div key={index} className="card overflow-hidden">
                <button
                  className="w-full p-6 text-left flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <ChevronDown 
                    size={20} 
                    className={`text-primary-400 transition-transform ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    expandedFAQ === index ? 'pb-6 max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Workshop Details Modal */}
      {selectedWorkshop && !showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedWorkshop.image} 
                alt={selectedWorkshop.title} 
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-900 bg-opacity-70 flex items-center justify-center text-white hover:bg-opacity-100 transition-all"
                onClick={() => setSelectedWorkshop(null)}
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-900">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary-600 text-white text-xs rounded-full">
                    {selectedWorkshop.level}
                  </span>
                  <span className="px-3 py-1 bg-dark-700 text-gray-300 text-xs rounded-full">
                    {selectedWorkshop.price}
                  </span>
                  <span className="px-3 py-1 bg-dark-700 text-gray-300 text-xs rounded-full">
                    {selectedWorkshop.duration}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{selectedWorkshop.title}</h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6">{selectedWorkshop.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Workshop Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <Clock size={18} className="mr-2 text-primary-400" />
                      <span><strong>Duration:</strong> {selectedWorkshop.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar size={18} className="mr-2 text-primary-400" />
                      <span><strong>Schedule:</strong> {selectedWorkshop.schedule}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin size={18} className="mr-2 text-primary-400" />
                      <span><strong>Location:</strong> {selectedWorkshop.location}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users size={18} className="mr-2 text-primary-400" />
                      <span><strong>Capacity:</strong> {selectedWorkshop.capacity} participants</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Upcoming Dates</h3>
                  <div className="space-y-3">
                    {selectedWorkshop.upcoming.map((session, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
                        <span>{session.date}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-400">
                            {session.spots > 0 ? `${session.spots} spots left` : 'Sold out'}
                          </span>
                          <button 
                            className={`py-1 px-3 text-sm rounded ${
                              session.spots > 0 
                                ? 'btn-primary' 
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={session.spots === 0}
                            onClick={() => handleRegistration(selectedWorkshop, session.date)}
                          >
                            {session.spots > 0 ? 'Register' : 'Sold Out'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Curriculum</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedWorkshop.curriculum.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  className="btn-outline"
                  onClick={() => setSelectedWorkshop(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && selectedWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Register for Workshop</h2>
                <button
                  className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-white hover:bg-dark-600 transition-all"
                  onClick={() => {
                    setShowRegistrationModal(false);
                    setParticipantInfo({
                      name: '',
                      email: '',
                      phone: '',
                      experience: 'Beginner',
                      additionalInfo: ''
                    });
                  }}
                >
                  ×
                </button>
              </div>

              <div className="mb-6 p-4 bg-dark-700 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedWorkshop.title}</h3>
                <p className="text-gray-400 mb-2">Date: {selectedDate}</p>
                <p className="text-gray-400">Price: {selectedWorkshop.price}</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); processPayment(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={participantInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-dark-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={participantInfo.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-dark-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={participantInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-dark-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level *</label>
                    <select
                      name="experience"
                      value={participantInfo.experience}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-dark-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Information (Optional)</label>
                    <textarea
                      name="additionalInfo"
                      value={participantInfo.additionalInfo}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-dark-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Any specific requirements or questions..."
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      setShowRegistrationModal(false);
                      setParticipantInfo({
                        name: '',
                        email: '',
                        phone: '',
                        experience: 'Beginner',
                        additionalInfo: ''
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registrationLoading}
                    className="btn-accent flex items-center"
                  >
                    {registrationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      `Pay ${selectedWorkshop.price} & Register`
                    )}
                  </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )}

  {/* User Registrations Modal */}
{showUserRegistrations && (
  <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
    <div className="bg-dark-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Workshop Registrations</h2>
          <button
            className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-white hover:bg-dark-600 transition-all"
            onClick={() => setShowUserRegistrations(false)}
          >
            ×
          </button>
        </div>

        {userRegistrations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No workshop registrations found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userRegistrations.map((registration) => (
              <div key={registration._id} className="bg-dark-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{registration.workshop.title}</h3>
                    <p className="text-gray-400">Date: {registration.selectedDate}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      registration.registrationStatus === 'confirmed' ? 'bg-green-600' :
                      registration.registrationStatus === 'registered' ? 'bg-blue-600' :
                      registration.registrationStatus === 'cancelled' ? 'bg-red-600' :
                      'bg-gray-600'
                    }`}>
                      {registration.registrationStatus}
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      Payment: {registration.paymentInfo.status}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Participant:</strong> {registration.participantInfo.name}</p>
                    <p><strong>Email:</strong> {registration.participantInfo.email}</p>
                    <p><strong>Phone:</strong> {registration.participantInfo.phone}</p>
                  </div>
                  <div>
                    <p><strong>Experience:</strong> {registration.participantInfo.experience}</p>
                    <p><strong>Amount:</strong> {registration.paymentInfo.amount}</p>
                    <p><strong>Registration Date:</strong> {new Date(registration.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {registration.participantInfo.additionalInfo && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-sm"><strong>Additional Info:</strong> {registration.participantInfo.additionalInfo}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
</motion.div>
);
};

export default WorkshopPage;