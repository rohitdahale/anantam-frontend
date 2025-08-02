import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Eye, 
  Download, 
  Filter,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Hash
} from 'lucide-react';
import axios from 'axios';

// TypeScript Interfaces
interface CustomerInfo {
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
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  _id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentMethod: string;
  deliveryStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, deliveryFilter, sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get<OrdersResponse>('https://anantam-backend-7ezq.onrender.com/api/orders/my', {
        params: {
          page,
          limit: 10,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          deliveryStatus: deliveryFilter !== 'all' ? deliveryFilter : undefined,
          sortBy,
          sortOrder
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`https://anantam-backend-7ezq.onrender.com/api/orders/${orderId}/status`, {
        deliveryStatus: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, deliveryStatus: newStatus as any }
          : order
      ));
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      alert('Failed to update delivery status');
    }
  };

  const exportOrders = async () => {
    try {
      const response = await axios.get('https://anantam-backend-7ezq.onrender.com/api/orders/export', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export orders:', error);
      alert('Failed to export orders');
    }
  };

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid': return 'bg-green-900 text-green-200';
      case 'pending': return 'bg-yellow-900 text-yellow-200';
      case 'failed': return 'bg-red-900 text-red-200';
      case 'cancelled': return 'bg-gray-900 text-gray-200';
      default: return 'bg-gray-900 text-gray-200';
    }
  };

  const getDeliveryStatusColor = (status: string): string => {
    switch (status) {
      case 'delivered': return 'bg-green-900 text-green-200';
      case 'shipped': return 'bg-blue-900 text-blue-200';
      case 'processing': return 'bg-yellow-900 text-yellow-200';
      case 'cancelled': return 'bg-red-900 text-red-200';
      default: return 'bg-gray-900 text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-green-400" />;
      case 'pending': return <Clock size={16} className="text-yellow-400" />;
      case 'failed': return <XCircle size={16} className="text-red-400" />;
      case 'cancelled': return <XCircle size={16} className="text-gray-400" />;
      default: return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} className="text-green-400" />;
      case 'shipped': return <Truck size={16} className="text-blue-400" />;
      case 'processing': return <Package size={16} className="text-yellow-400" />;
      case 'cancelled': return <XCircle size={16} className="text-red-400" />;
      default: return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading orders...</p>
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
      className="min-h-screen bg-dark-900 p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Orders Management</h1>
        <p className="text-gray-400 mt-2">Manage customer orders and delivery status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{pagination?.total || 0}</p>
            </div>
            <Hash className="text-primary-400" size={24} />
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <Clock className="text-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Processing</p>
              <p className="text-2xl font-bold text-blue-400">
                {orders.filter(o => o.deliveryStatus === 'processing').length}
              </p>
            </div>
            <Package className="text-blue-400" size={24} />
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Delivered</p>
              <p className="text-2xl font-bold text-green-400">
                {orders.filter(o => o.deliveryStatus === 'delivered').length}
              </p>
            </div>
            <CheckCircle className="text-green-400" size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-dark-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Email..."
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select 
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Delivery Status Filter */}
          <div>
            <select 
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
            >
              <option value="all">All Delivery Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Export Button */}
          <div>
            <button 
              onClick={exportOrders}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white rounded-lg transition-colors"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-dark-800 rounded-lg overflow-hidden">
        {error && (
          <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-700 border-b border-dark-600">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Items & Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Delivery Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600">
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white">{order.orderId}</div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                        {order.razorpayPaymentId && (
                          <div className="text-xs text-gray-500">
                            Payment ID: {order.razorpayPaymentId.slice(-8)}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white flex items-center">
                          <User size={12} className="mr-1" />
                          {order.customerInfo.name}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Mail size={12} className="mr-1" />
                          {order.customerInfo.email}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Phone size={12} className="mr-1" />
                          {order.customerInfo.phone}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white flex items-center">
                          <DollarSign size={12} className="mr-1" />
                          {formatPrice(order.totalAmount)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.currency} • {order.paymentMethod}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getDeliveryStatusIcon(order.deliveryStatus)}
                        <select
                          value={order.deliveryStatus}
                          onChange={(e) => updateDeliveryStatus(order._id, e.target.value)}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 ${getDeliveryStatusColor(order.deliveryStatus)}`}
                          disabled={order.status !== 'paid'}
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        {expandedOrder === order._id ? <ChevronUp size={18} /> : <Eye size={18} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-dark-700/30">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Order Items */}
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Order Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 bg-dark-800 rounded-lg p-4">
                                  <img
                                    src={item.imageUrl || 'https://via.placeholder.com/60x60'}
                                    alt={item.name}
                                    className="w-15 h-15 object-cover rounded-lg"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                                    }}
                                  />
                                  <div className="flex-1">
                                    <div className="text-white font-medium">{item.name}</div>
                                    <div className="text-gray-400 text-sm">
                                      Qty: {item.quantity} × {formatPrice(item.price)}
                                    </div>
                                    <div className="text-primary-400 font-medium">
                                      {formatPrice(item.price * item.quantity)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Shipping Address</h4>
                            <div className="bg-dark-800 rounded-lg p-4">
                              <div className="space-y-2">
                                <div className="flex items-center text-white">
                                  <User size={16} className="mr-2 text-gray-400" />
                                  {order.customerInfo.name}
                                </div>
                                <div className="flex items-center text-gray-300">
                                  <Mail size={16} className="mr-2 text-gray-400" />
                                  {order.customerInfo.email}
                                </div>
                                <div className="flex items-center text-gray-300">
                                  <Phone size={16} className="mr-2 text-gray-400" />
                                  {order.customerInfo.phone}
                                </div>
                                <div className="flex items-start text-gray-300 mt-3">
                                  <MapPin size={16} className="mr-2 text-gray-400 mt-1" />
                                  <div>
                                    <div>{order.customerInfo.address.street}</div>
                                    <div>
                                      {order.customerInfo.address.city}, {order.customerInfo.address.state}
                                    </div>
                                    <div>
                                      {order.customerInfo.address.zipCode}, {order.customerInfo.address.country}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            {order.notes && (
                              <div className="mt-4">
                                <h5 className="text-white font-medium mb-2">Order Notes</h5>
                                <div className="bg-dark-800 rounded-lg p-4">
                                  <p className="text-gray-300">{order.notes}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="bg-dark-700 px-6 py-4 flex items-center justify-between border-t border-dark-600">
            <div className="text-gray-400 text-sm">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {
                Math.min(pagination.page * pagination.limit, pagination.total)
              } of {pagination.total} orders
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 border border-dark-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-white">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className="px-3 py-2 border border-dark-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No orders found</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all' || deliveryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Orders will appear here when customers make purchases'
              }
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Orders;