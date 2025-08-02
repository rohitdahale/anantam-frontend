import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, CreditCard, AlertCircle } from 'lucide-react';

// Type definitions
interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

interface FormErrors {
  [key: string]: string;
}

interface OrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  customerInfo: FormData;
  totalAmount: number;
}

interface OrderResponse {
  success: boolean;
  order: {
    id: string;
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    customerInfo: FormData;
    items: Array<any>;
    totalAmount: number;
  };
  razorpayKey: string;
  error?: string;
}

interface VerifyResponse {
  success: boolean;
  order: {
    orderId: string;
    paymentId: string;
    totalAmount: number;
  };
  error?: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  onOrderSuccess: (orderDetails: {
    orderId: string;
    paymentId: string;
    totalAmount: number;
  }) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

// Function to load Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.getElementById('razorpay-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BuyNowModal: React.FC<BuyNowModalProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  quantity, 
  onOrderSuccess 
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);

  // Load Razorpay script when component mounts
  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
      if (!loaded) {
        console.error('Failed to load Razorpay script');
      }
    };

    if (isOpen) {
      loadScript();
    }
  }, [isOpen]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.address.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.address.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.state.trim()) newErrors.state = 'State is required';
    if (!formData.address.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(formData.address.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1] as keyof Address;
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name] || errors[name?.split('.')[1]]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      delete newErrors[name?.split('.')[1]];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!razorpayLoaded) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    if (!window.Razorpay) {
      alert('Payment system failed to load. Please refresh the page and try again.');
      return;
    }

    setLoading(true);

    try {
      const totalAmount = product.price * quantity;
      const orderData: OrderData = {
        items: [{
          productId: product._id,
          quantity: quantity
        }],
        customerInfo: formData,
        totalAmount: totalAmount
      };

      // Create order
      const response = await fetch('https://anantam-backend-7ezq.onrender.com/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result: OrderResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const options: RazorpayOptions = {
        key: result.razorpayKey,
        amount: result.order.amount,
        currency: result.order.currency,
        name: 'Anantam Aerial',
        description: `Purchase of ${product.name}`,
        order_id: result.order.razorpayOrderId,
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment
            const verifyResponse = await fetch('https://anantam-backend-7ezq.onrender.com/api/orders/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: result.order.id
              })
            });

            const verifyResult: VerifyResponse = await verifyResponse.json();

            if (verifyResult.success) {
              onOrderSuccess({
                orderId: verifyResult.order.orderId,
                paymentId: verifyResult.order.paymentId,
                totalAmount: verifyResult.order.totalAmount
              });
            } else {
              throw new Error(verifyResult.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: `${formData.address.street}, ${formData.address.city}, ${formData.address.state} - ${formData.address.zipCode}`
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Order creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
      alert(errorMessage);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalAmount = product.price * quantity;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-600">
            <h2 className="text-xl font-bold">Complete Your Purchase</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Order Summary */}
          <div className="p-6 border-b border-dark-600">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="flex items-center space-x-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                }}
              />
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-gray-400 text-sm">Quantity: {quantity}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-400">Unit Price:</span>
                  <span>{formatPrice(product.price)}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-dark-600 mt-4 pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-accent-400">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User size={20} className="mr-2" />
              Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-dark-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.name ? 'border-red-500' : 'border-dark-600'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 bg-dark-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.email ? 'border-red-500' : 'border-dark-600'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 bg-dark-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.phone ? 'border-red-500' : 'border-dark-600'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin size={20} className="mr-2" />
              Delivery Address
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Street Address *</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-dark-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.street ? 'border-red-500' : 'border-dark-600'
                  }`}
                  placeholder="Enter your street address"
                />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-dark-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.city ? 'border-red-500' : 'border-dark-600'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State *</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-dark-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.state ? 'border-red-500' : 'border-dark-600'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-dark-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.zipCode ? 'border-red-500' : 'border-dark-600'
                    }`}
                    placeholder="ZIP Code"
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-dark-700 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard size={20} className="text-primary-400" />
                <span className="font-medium">Payment Method</span>
              </div>
              <p className="text-gray-400 text-sm">
                You will be redirected to Razorpay for secure payment processing.
                {!razorpayLoaded && <span className="text-yellow-400 ml-2">(Loading payment system...)</span>}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <AlertCircle size={16} className="text-yellow-400" />
                <span className="text-yellow-400 text-xs">Test Mode: Use test card details</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-dark-600 rounded-lg hover:bg-dark-700 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !razorpayLoaded}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuyNowModal;