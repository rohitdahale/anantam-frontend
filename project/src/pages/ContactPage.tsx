import { motion } from 'framer-motion';
import { useState } from 'react';
import { Helmet } from '../components/utils/Helmet';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface SubmitStatus {
  type: 'success' | 'error';
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'first-name' ? 'firstName' : 
       id === 'last-name' ? 'lastName' : id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://anantam-backend-7ezq.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.errors ? data.errors[0].msg : 'Failed to send message. Please try again.' 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet title="Contact Us | Anantam Aerials and Robotics" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className="absolute inset-0">
  {/* Background Image */}
  <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center bg-no-repeat"></div>
  
  <div className="absolute inset-0 bg-black opacity-60"></div>

  {/* Overlay with opacity */}
  </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300">Get in touch with our team for inquiries, support, or partnerships.</p>
          </div>
        </div>
      </section>
      
      {/* Contact Content */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              
              {/* Status Message */}
              {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-900/20 border border-green-700 text-green-400' 
                    : 'bg-red-900/20 border border-red-700 text-red-400'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="label">First Name</label>
                    <input 
                      type="text" 
                      id="first-name" 
                      className="input" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="label">Last Name</label>
                    <input 
                      type="text" 
                      id="last-name" 
                      className="input" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="input" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="label">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="input" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="label">Subject</label>
                  <select 
                    id="subject" 
                    className="input"
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="services">Services</option>
                    <option value="products">Products</option>
                    <option value="workshops">Workshops</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="label">Your Message</label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    className="input resize-none" 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary flex items-center"
                  disabled={isSubmitting}
                >
                  <Send size={18} className="mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            
{/* Contact Information */}
<div>
  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

  <div className="space-y-6 mb-8">
    <div className="flex items-start">
      <div className="bg-primary-900/20 p-3 rounded-lg text-primary-500 mr-4">
        <MapPin size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">Our Location</h3>
        <p className="text-gray-400">
  Pune - 412105<br />
  Jalgaon - 425201
</p>

      </div>
    </div>

    <div className="flex items-start">
      <div className="bg-primary-900/20 p-3 rounded-lg text-primary-500 mr-4">
        <Mail size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">Email Us</h3>
        <p className="text-gray-400">
          director@anantamaerialsandrobotics.com
        </p>
      </div>
    </div>

    <div className="flex items-start">
      <div className="bg-primary-900/20 p-3 rounded-lg text-primary-500 mr-4">
        <Phone size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">Call Us</h3>
        <p className="text-gray-400">
          +91-7972229737
        </p>
      </div>
    </div>
  </div>

  <div>
    <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-400">Monday - Friday:</span>
        <span className="text-white">9:00 AM - 6:00 PM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Saturday:</span>
        <span className="text-white">10:00 AM - 4:00 PM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Sunday:</span>
        <span className="text-white">Closed</span>
      </div>
    </div>
  </div>

  <div className="mt-8">
    <h3 className="text-lg font-semibold mb-4">Our Location</h3>
    <div className="rounded-lg overflow-hidden h-64 bg-dark-700">
      <iframe
        className="w-full h-full border-0"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.0198168968934!2d73.89476547511248!3d18.677346165573746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7cd75555555%3A0xc865c4d83fca78d3!2sAlandi%2C%20Pune%2C%20Maharashtra%20412105!5e0!3m2!1sen!2sin!4v1718184345678!5m2!1sen!2sin"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</div>

          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our services and products.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">What areas do you serve?</h3>
              <p className="text-gray-400">
                We currently serve clients throughout India, with our headquarters in Bangalore. For international inquiries, please contact our sales team directly.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Do you offer custom drone solutions?</h3>
              <p className="text-gray-400">
                Yes, we specialize in creating custom drone and robotics solutions tailored to specific industry needs. Our team works closely with you to understand your requirements and develop appropriate solutions.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">What is the typical turnaround time for repairs?</h3>
              <p className="text-gray-400">
                Our standard repair turnaround time is 3-5 business days, depending on the complexity of the issue and parts availability. We also offer expedited repair services for urgent needs.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">How can I register for a workshop?</h3>
              <p className="text-gray-400">
                You can register for our workshops through our website by creating an account and selecting the workshop you're interested in. Payment can be made online, and you'll receive a confirmation email with details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;