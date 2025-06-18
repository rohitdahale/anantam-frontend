import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Filter, X, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import axios from 'axios';

// TypeScript interfaces
interface Service {
  _id: string;
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface NewService {
  id: string;
  title: string;
  description: string;
  features: string;
  icon: string;
  order: string;
  isActive: boolean;
  image: File | null;
}

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [newService, setNewService] = useState<NewService>({
    id: '',
    title: '',
    description: '',
    features: '',
    icon: '',
    order: '0',
    isActive: true,
    image: null,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async (): Promise<void> => {
    try {
      // Using admin endpoint to get all services including inactive ones
      const response = await axios.get<Service[]>('https://anantam-backend-7ezq.onrender.com/api/services/admin/all');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewService(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setNewService(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setNewService(prev => ({
      ...prev,
      image: file,
    }));
  };

  const resetForm = (): void => {
    setNewService({
      id: '',
      title: '',
      description: '',
      features: '',
      icon: '',
      order: '0',
      isActive: true,
      image: null,
    });
    setEditingService(null);
    
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleAddService = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!newService.id || !newService.title || !newService.description) {
      alert('Please fill in all required fields (ID, Title, Description)');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('id', newService.id);
      formData.append('title', newService.title);
      formData.append('description', newService.description);
      formData.append('features', newService.features);
      formData.append('icon', newService.icon);
      formData.append('order', newService.order);
      formData.append('isActive', newService.isActive.toString());
      
      if (newService.image) {
        formData.append('image', newService.image);
      }

      if (editingService) {
        await axios.put(`https://anantam-backend-7ezq.onrender.com/api/services/${editingService._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('https://anantam-backend-7ezq.onrender.com/api/services', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setShowModal(false);
      resetForm();
      await fetchServices();
    } catch (error) {
      console.error('Failed to save service:', error);
      if (axios.isAxiosError(error) && error.response?.data?.details) {
        alert(`Failed to save service: ${error.response.data.details}`);
      } else {
        alert('Failed to save service. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service: Service): void => {
    setEditingService(service);
    setNewService({
      id: service.id,
      title: service.title,
      description: service.description,
      features: service.features.join(', '),
      icon: service.icon,
      order: service.order.toString(),
      isActive: service.isActive,
      image: null, // File will be uploaded if user selects new one
    });
    setShowModal(true);
  };

  const handleDeleteService = async (serviceId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`https://anantam-backend-7ezq.onrender.com/api/services/${serviceId}`);
        await fetchServices();
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  const handleToggleService = async (serviceId: string): Promise<void> => {
    try {
      await axios.put(`https://anantam-backend-7ezq.onrender.com/api/services/${serviceId}/toggle`);
      await fetchServices();
    } catch (error) {
      console.error('Failed to toggle service status:', error);
      alert('Failed to toggle service status. Please try again.');
    }
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    resetForm();
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterActive === 'all' ||
      (filterActive === 'active' && service.isActive) ||
      (filterActive === 'inactive' && !service.isActive);

    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-950 text-white p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="text-gray-400">Manage your service offerings</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn-primary flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Service
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services by title, ID, or description..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 appearance-none text-white"
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
                >
                  <option value="all">All Services</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Features</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      No services found
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={service.image || 'https://via.placeholder.com/150'}
                              alt={service.title}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{service.title}</div>
                            <div className="text-xs text-gray-400 max-w-xs truncate">
                              {service.description}
                            </div>
                            {service.icon && (
                              <div className="text-xs text-blue-400">Icon: {service.icon}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900 text-purple-200">
                          {service.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white max-w-xs">
                          {service.features.length > 0 ? (
                            <div className="space-y-1">
                              {service.features.slice(0, 3).map((feature, index) => (
                                <div key={index} className="text-xs bg-gray-600 px-2 py-1 rounded">
                                  {feature}
                                </div>
                              ))}
                              {service.features.length > 3 && (
                                <div className="text-xs text-gray-400">
                                  +{service.features.length - 3} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No features</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{service.order}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleService(service._id)}
                          className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            service.isActive
                              ? 'bg-green-900 text-green-200 hover:bg-green-800'
                              : 'bg-red-900 text-red-200 hover:bg-red-800'
                          }`}
                        >
                          {service.isActive ? (
                            <>
                              <ToggleRight size={14} className="mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={14} className="mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {new Date(service.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditService(service)}
                          className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Service Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button 
                onClick={handleCloseModal} 
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="id"
                    placeholder="Service ID (unique) *"
                    value={newService.id}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                    required
                    disabled={!!editingService} // Don't allow editing ID for existing services
                  />
                  <input
                    type="text"
                    name="title"
                    placeholder="Service Title *"
                    value={newService.title}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <textarea
                  name="description"
                  placeholder="Service Description *"
                  value={newService.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 resize-vertical"
                  required
                />

                <textarea
                  name="features"
                  placeholder="Features (comma-separated, e.g., Feature 1, Feature 2, Feature 3)"
                  value={newService.features}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 resize-vertical"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="icon"
                    placeholder="Icon (CSS class or name)"
                    value={newService.icon}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    name="order"
                    placeholder="Display Order"
                    value={newService.order}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={newService.isActive}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="isActive" className="text-white">
                    Service is active and visible to users
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 cursor-pointer flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    <Upload size={16} className="mr-2" />
                    {newService.image 
                      ? `Selected: ${newService.image.name}` 
                      : (editingService ? 'Change Service Image' : 'Upload Service Image *')}
                  </label>
                  <div className="text-xs text-gray-400 mt-1">
                    Upload a representative image for this service
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors text-white font-medium"
                >
                  {loading 
                    ? (editingService ? 'Updating Service...' : 'Adding Service...') 
                    : (editingService ? 'Update Service' : 'Add Service')
                  }
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Services;