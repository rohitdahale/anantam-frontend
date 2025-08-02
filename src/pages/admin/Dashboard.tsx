import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// API Configuration
const API_BASE_URL = 'https://anantam-backend-7ezq.onrender.com/api';

// Utility function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// API service functions
const apiService = {
  // Fetch user statistics
  fetchUserStats: async () => {
    const response = await fetch(`${API_BASE_URL}/users/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user stats');
    return response.json();
  },

  // Fetch all orders
  fetchOrders: async (limit = 100) => {
    const response = await fetch(`${API_BASE_URL}/orders/my?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Fetch all products
  fetchProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    userStats: null,
    orders: [],
    products: [],
    stats: {
      totalRevenue: 0,
      totalUsers: 0,
      productsSold: 0,
      workshopBookings: 0,
      revenueChange: 0,
      usersChange: 0,
      salesChange: 0,
      workshopChange: 0
    },
    chartData: {
      monthly: [],
      orderStatus: [],
      topProducts: []
    }
  });

  // Calculate statistics from fetched data
  const calculateStats = (orders, products, userStats) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Filter orders by month
    const thisMonthOrders = orders.filter(order => 
      new Date(order.createdAt) >= thisMonth
    );
    const lastMonthOrders = orders.filter(order => 
      new Date(order.createdAt) >= lastMonth && new Date(order.createdAt) < thisMonth
    );

    // Calculate revenue
    const thisMonthRevenue = thisMonthOrders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const lastMonthRevenue = lastMonthOrders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate total products sold
    const totalProductsSold = orders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    const thisMonthProductsSold = thisMonthOrders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    const lastMonthProductsSold = lastMonthOrders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    // Calculate changes
    const revenueChange = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : 0;

    const salesChange = lastMonthProductsSold > 0 
      ? ((thisMonthProductsSold - lastMonthProductsSold) / lastMonthProductsSold * 100).toFixed(1)
      : 0;

    // Generate monthly chart data (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthDate && orderDate < nextMonthDate && order.status === 'paid';
      });

      const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      monthlyData.push({
        name: monthDate.toLocaleString('default', { month: 'short' }),
        value: Math.round(monthRevenue)
      });
    }

    // Order status distribution
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const orderStatusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));

    // Top selling products
    const productSales = {};
    orders.filter(order => order.status === 'paid').forEach(order => {
      order.items.forEach(item => {
        const productName = item.name || 'Unknown Product';
        productSales[productName] = (productSales[productName] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, sales]) => ({ name, sales }));

    return {
      totalRevenue: orders
        .filter(order => order.status === 'paid')
        .reduce((sum, order) => sum + order.totalAmount, 0),
      totalUsers: userStats?.total || 0,
      productsSold: totalProductsSold,
      workshopBookings: 0, // You can add workshop logic here
      revenueChange: parseFloat(revenueChange),
      usersChange: userStats?.recent || 0,
      salesChange: parseFloat(salesChange),
      workshopChange: 0,
      monthlyData,
      orderStatusData,
      topProducts
    };
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [userStatsData, ordersData, productsData] = await Promise.all([
          apiService.fetchUserStats(),
          apiService.fetchOrders(),
          apiService.fetchProducts()
        ]);

        const calculatedStats = calculateStats(
          ordersData.orders || ordersData,
          productsData,
          userStatsData
        );

        setDashboardData({
          userStats: userStatsData,
          orders: ordersData.orders || ordersData,
          products: productsData,
          stats: calculatedStats,
          chartData: {
            monthly: calculatedStats.monthlyData,
            orderStatus: calculatedStats.orderStatusData,
            topProducts: calculatedStats.topProducts
          }
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get recent orders for activity feed
  const getRecentOrders = () => {
    return dashboardData.orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  // Color scheme for charts
  const COLORS = ['#1a81ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
        <span className="ml-2 text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500 mr-2" />
        <span className="text-red-400">Error loading dashboard: {error}</span>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardData.stats.totalRevenue),
      change: `${dashboardData.stats.revenueChange >= 0 ? '+' : ''}${dashboardData.stats.revenueChange}%`,
      isPositive: dashboardData.stats.revenueChange >= 0,
      icon: <TrendingUp size={24} />
    },
    {
      title: 'Total Users',
      value: dashboardData.stats.totalUsers.toLocaleString(),
      change: `+${dashboardData.stats.usersChange}`,
      isPositive: true,
      icon: <Users size={24} />
    },
    {
      title: 'Products Sold',
      value: dashboardData.stats.productsSold.toLocaleString(),
      change: `${dashboardData.stats.salesChange >= 0 ? '+' : ''}${dashboardData.stats.salesChange}%`,
      isPositive: dashboardData.stats.salesChange >= 0,
      icon: <ShoppingBag size={24} />
    },
    {
      title: 'Active Products',
      value: dashboardData.products.length.toLocaleString(),
      change: '+0%',
      isPositive: true,
      icon: <Calendar size={24} />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back, Admin!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                {stat.icon}
              </div>
              <div className={`flex items-center ${
                stat.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.isPositive ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <ArrowDownRight size={20} />
                )}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Revenue Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.chartData.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#F9FAFB'
                  }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Status Chart */}
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Order Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.chartData.orderStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.chartData.orderStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Top Selling Products</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.chartData.topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="sales" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Recent Orders</h2>
          <div className="space-y-4">
            {getRecentOrders().map((order, index) => (
              <div 
                key={order._id || index}
                className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0"
              >
                <div>
                  <p className="font-medium text-white">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-400">
                    {order.customerInfo?.name} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-blue-400 font-medium">{formatCurrency(order.totalAmount)}</span>
                  <div className={`text-xs px-2 py-1 rounded mt-1 ${
                    order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {order.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
            {getRecentOrders().length === 0 && (
              <p className="text-gray-400 text-center py-4">No recent orders</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;