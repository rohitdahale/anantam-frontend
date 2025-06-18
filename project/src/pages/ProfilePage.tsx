import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Edit2, Save, X, Lock } from 'lucide-react';
import { Helmet } from '../components/utils/Helmet';

// Type definitions
interface UserData {
  _id: string;
  name: string;
  email: string;
  googleId?: string;
  authMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileFormData {
  name: string;
}

// API service
const api = {
  getProfile: async (): Promise<{ data: UserData }> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('https://anantam-backend-7ezq.onrender.com/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },
  
  updateProfile: async (data: ProfileFormData): Promise<{ data: UserData; message: string }> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('https://anantam-backend-7ezq.onrender.com/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return response.json();
  },

  getActivity: async (): Promise<{ data: any }> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('https://anantam-backend-7ezq.onrender.com/api/users/activity', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activity data');
    }

    return response.json();
  }
};

// Helper function to update localStorage and dispatch custom event
const updateUserInStorage = (userData: UserData) => {
  localStorage.setItem('user', JSON.stringify({
    id: userData._id,
    name: userData.name,
    email: userData.email
  }));
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('userUpdated', {
    detail: { user: userData }
  }));
};

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activityData, setActivityData] = useState({
    workshopsAttended: 0,
    ordersPlaced: 0,
    servicesUsed: 0
  });
  const [formData, setFormData] = useState<ProfileFormData>({
    name: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchActivity();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.getProfile();
      setUser(response.data);
      setFormData({
        name: response.data.name
      });
      
      // Update localStorage with fresh data from database
      updateUserInStorage(response.data);
    } catch (err: any) {
      setError('Failed to load profile: ' + err.message);
      // If token is invalid, redirect to login
      if (err.message.includes('token') || err.message.includes('authentication')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await api.getActivity();
      setActivityData(response.data);
    } catch (err) {
      console.error('Failed to fetch activity data:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.updateProfile(formData);
      setUser(response.data);
      setIsEditing(false);
      setSuccessMessage(response.message);
      
      // Update localStorage and notify other components
      updateUserInStorage(response.data);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name
      });
    }
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen pt-28 pb-16 bg-dark-900"
      >
        <div className="container-custom">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet title="Profile | Anantam Aerial" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className='absolute inset-0'>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Profile</h1>
            <p className="text-xl text-gray-300">
              Manage your account information and preferences
            </p>
          </div>
        </div>
      </section>
      
      {/* Profile Content */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Account Details</h2>
                  <p className="text-gray-400 mt-2">
                    Update your personal information and account settings
                  </p>
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Edit2 size={18} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm">{successMessage}</p>
                </div>
              )}

              <div className="space-y-8">
                {/* Profile Avatar */}
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                    <User size={36} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{user?.name}</h3>
                    <p className="text-gray-400 text-lg">{user?.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Profile Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="label">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-dark-700 rounded-lg border border-dark-600">
                        <User size={20} className="text-gray-400" />
                        <span className="text-lg">{user?.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="label flex items-center space-x-2">
                      <span>Email Address</span>
                      <Lock size={16} className="text-gray-400" />
                      <span className="text-xs text-gray-500">(Read-only)</span>
                    </label>
                    <div className="flex items-center space-x-3 p-4 bg-dark-700 rounded-lg border border-dark-600 opacity-75">
                      <Mail size={20} className="text-gray-400" />
                      <span className="text-lg">{user?.email}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  <div>
                    <label className="label">User ID</label>
                    <div className="flex items-center space-x-3 p-4 bg-dark-700 rounded-lg border border-dark-600">
                      <Shield size={20} className="text-gray-400" />
                      <span className="font-mono text-sm text-gray-300">{user?._id}</span>
                    </div>
                  </div>

                  <div>
                    <label className="label">Account Status</label>
                    <div className="flex items-center space-x-3 p-4 bg-dark-700 rounded-lg border border-dark-600">
                      <Calendar size={20} className="text-gray-400" />
                      <span className="px-3 py-1 bg-green-600 text-green-100 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="border-t border-dark-600 pt-8">
                  <h3 className="text-xl font-semibold mb-6">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-dark-700 rounded-lg border border-dark-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-lg">Account Type</p>
                          <p className="text-gray-400">
                            {user?.authMethod === 'google' ? 'Google Account' : 'Standard User'}
                          </p>
                        </div>
                        <span className="px-4 py-2 bg-primary-600 text-primary-100 rounded-full text-sm font-medium">
                          Active
                        </span>
                      </div>
                    </div>

                    {user?.googleId && (
                      <div className="p-6 bg-dark-700 rounded-lg border border-dark-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-lg">Google Account</p>
                            <p className="text-gray-400">Connected via OAuth</p>
                          </div>
                          <span className="px-4 py-2 bg-green-600 text-green-100 rounded-full text-sm font-medium">
                            Connected
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="border-t border-dark-600 pt-8">
                  <h3 className="text-xl font-semibold mb-6">Activity Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-dark-700 rounded-lg border border-dark-600 text-center">
                      <p className="text-3xl font-bold text-primary-500 mb-2">
                        {activityData.workshopsAttended}
                      </p>
                      <p className="text-gray-400">Workshops Attended</p>
                    </div>
                    <div className="p-6 bg-dark-700 rounded-lg border border-dark-600 text-center">
                      <p className="text-3xl font-bold text-primary-500 mb-2">
                        {activityData.ordersPlaced}
                      </p>
                      <p className="text-gray-400">Orders Placed</p>
                    </div>
                    <div className="p-6 bg-dark-700 rounded-lg border border-dark-600 text-center">
                      <p className="text-3xl font-bold text-primary-500 mb-2">
                        {activityData.servicesUsed}
                      </p>
                      <p className="text-gray-400">Services Used</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProfilePage;