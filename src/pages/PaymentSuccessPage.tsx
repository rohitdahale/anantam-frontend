import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  CreditCard, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Download,
  Home,
  Truck,
  Clock,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

// Type definitions
interface OrderDetails {
  orderId: string;
  paymentId: string;
  totalAmount: number;
}

interface Order {
  _id: string;
  orderId: string;
  razorpayPaymentId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  totalAmount: number;
  currency: string;
  status: string;
  deliveryStatus: string;
  createdAt: string;
  estimatedDelivery?: string;
}

interface PaymentSuccessPageProps {
  orderDetails?: OrderDetails;
  onBackToHome?: () => void;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ 
  orderDetails, 
  onBackToHome 
}) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = (orderDate: string): string => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7); // Add 7 days for delivery
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDeliveryStatusColor = (status: string): string => {
    switch (status) {
      case 'processing':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'shipped':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'delivered':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderIdToFetch = orderId || orderDetails?.orderId;
        if (!orderIdToFetch) {
          setError('No order ID provided');
          return;
        }

        const response = await fetch(`https://anantam-backend-7ezq.onrender.com/api/orders/${orderIdToFetch}`);
        const result = await response.json();

        if (result.success) {
          setOrder(result.order);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, orderDetails]);

  const downloadInvoice = async () => {
    try {
      if (!order) return;
      
      const response = await fetch(`https://anantam-backend-7ezq.onrender.com/api/orders/${order.orderId}/invoice`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${order.orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Invoice download is currently unavailable. Please contact support.');
    }
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/');
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleTrackOrder = () => {
    // Navigate to order tracking page or profile orders
    navigate('/profile', { state: { activeTab: 'orders' } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center ">
        <div className="text-center max-w-md mx-auto px-4 ">
          <div className="text-green-400 mb-4">
            <CheckCircle size={64} className="mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-400 mb-4">
            {error || 'Unable to load order details, but your payment was processed successfully.'}
          </p>
          {orderDetails && (
            <div className="bg-dark-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-1">Order ID</p>
              <p className="font-mono text-sm mb-2">{orderDetails.orderId}</p>
              <p className="text-sm text-gray-400 mb-1">Payment ID</p>
              <p className="font-mono text-sm mb-2">{orderDetails.paymentId}</p>
              <p className="text-sm text-gray-400 mb-1">Amount Paid</p>
              <p className="text-lg font-bold text-accent-400">{formatPrice(orderDetails.totalAmount)}</p>
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={handleBackToHome}
              className="w-full bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={18} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4 pt-[100px]">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="text-green-400 mb-4">
            <CheckCircle size={64} className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-400 text-lg">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-dark-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Order Details</h2>
              <div className={`px-3 py-1 rounded-full text-sm border flex items-center space-x-1 ${getDeliveryStatusColor(order.deliveryStatus)}`}>
                {getDeliveryStatusIcon(order.deliveryStatus)}
                <span className="capitalize">{order.deliveryStatus}</span>
              </div>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Package className="text-primary-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="font-mono text-sm">{order.orderId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="text-primary-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Payment ID</p>
                  <p className="font-mono text-sm">{order.razorpayPaymentId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-primary-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Order Date</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="text-primary-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Estimated Delivery</p>
                  <p className="font-medium">{getEstimatedDelivery(order.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-dark-600 pt-6">
              <h3 className="font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-dark-700 rounded-lg p-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      <p className="text-accent-400 font-medium">{formatPrice(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t border-dark-600 mt-6 pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-accent-400">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Customer Info */}
            <div className="bg-dark-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm">{order.customerInfo.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm">{order.customerInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm">{order.customerInfo.phone}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-dark-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <MapPin size={20} className="mr-2" />
                Delivery Address
              </h3>
              <div className="text-sm text-gray-300 leading-relaxed">
                <p>{order.customerInfo.address.street}</p>
                <p>{order.customerInfo.address.city}, {order.customerInfo.address.state}</p>
                <p>{order.customerInfo.address.zipCode}</p>
                <p>{order.customerInfo.address.country}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={downloadInvoice}
                className="w-full bg-accent-600 hover:bg-accent-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Download size={18} />
                <span>Download Invoice</span>
              </button>
              
              <button
                onClick={handleTrackOrder}
                className="w-full border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Package size={18} />
                <span>Track Order</span>
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full border border-dark-600 hover:bg-dark-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={18} />
                <span>Continue Shopping</span>
              </button>

              <button
                onClick={handleBackToHome}
                className="w-full bg-dark-700 hover:bg-dark-600 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Home size={18} />
                <span>Back to Home</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-dark-800 rounded-lg p-6"
        >
          <h3 className="font-semibold mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-yellow-400 mb-2">
                <Clock size={24} className="mx-auto" />
              </div>
              <h4 className="font-medium mb-1">Order Processing</h4>
              <p className="text-gray-400 text-sm">Your order is being prepared and will be shipped within 1-2 business days.</p>
            </div>
            <div className="text-center">
              <div className="text-blue-400 mb-2">
                <Truck size={24} className="mx-auto" />
              </div>
              <h4 className="font-medium mb-1">Shipping</h4>
              <p className="text-gray-400 text-sm">You'll receive a tracking number once your order is shipped.</p>
            </div>
            <div className="text-center">
              <div className="text-green-400 mb-2">
                <CheckCircle size={24} className="mx-auto" />
              </div>
              <h4 className="font-medium mb-1">Delivery</h4>
              <p className="text-gray-400 text-sm">Expected delivery within 5-7 business days.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;