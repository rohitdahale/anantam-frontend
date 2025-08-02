import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  AlertCircle, 
  CheckCircle,
  Building2,
  Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';

// TypeScript interfaces
interface Collaborator {
  _id: string;
  name: string;
  logo: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CollaboratorFormData {
  name: string;
  category: string;
  description: string;
  logo?: File;
}

const Collaborator: React.FC = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  
  const [formData, setFormData] = useState<CollaboratorFormData>({
    name: '',
    category: '',
    description: '',
  });

  const categories = [
    'Technology Partner',
    'Strategic Partner',
    'Manufacturing Partner',
    'Supplier',
    'Research Institution',
    'Government Agency',
    'Educational Institution',
    'Service Provider'
  ];

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Collaborator[]>('https://anantam-backend-7ezq.onrender.com/api/collaborators');
      setCollaborators(response.data);
    } catch (error) {
      console.error('Failed to fetch collaborators:', error);
      setError('Failed to load collaborators. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (collaborator?: Collaborator): void => {
    if (collaborator) {
      setEditingCollaborator(collaborator);
      setFormData({
        name: collaborator.name,
        category: collaborator.category,
        description: collaborator.description || '',
      });
      setLogoPreview(collaborator.logo);
    } else {
      setEditingCollaborator(null);
      setFormData({
        name: '',
        category: '',
        description: '',
      });
      setLogoPreview('');
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = (): void => {
    setShowModal(false);
    setEditingCollaborator(null);
    setFormData({
      name: '',
      category: '',
      description: '',
    });
    setLogoPreview('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim()) {
      setError('Name and category are required.');
      return;
    }

    if (!editingCollaborator && !formData.logo) {
      setError('Logo image is required for new collaborators.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('category', formData.category);
      submitData.append('description', formData.description.trim());
      
      if (formData.logo) {
        submitData.append('logo', formData.logo);
      }

      let response;
      if (editingCollaborator) {
        // Update existing collaborator
        response = await axios.put(
          `https://anantam-backend-7ezq.onrender.com/api/collaborators/${editingCollaborator._id}`,
          submitData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Create new collaborator
        response = await axios.post(
          'https://anantam-backend-7ezq.onrender.com/api/collaborators',
          submitData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      setSuccess(
        editingCollaborator 
          ? 'Collaborator updated successfully!' 
          : 'Collaborator created successfully!'
      );
      
      // Refresh collaborators list
      await fetchCollaborators();
      
      // Close modal after short delay
      setTimeout(() => {
        closeModal();
      }, 1500);

    } catch (error: any) {
      console.error('Submit error:', error);
      setError(
        error.response?.data?.error || 
        'Failed to save collaborator. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (collaboratorId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this collaborator?')) {
      return;
    }

    try {
      await axios.delete(`https://anantam-backend-7ezq.onrender.com/api/collaborators/${collaboratorId}`);
      setSuccess('Collaborator deleted successfully!');
      await fetchCollaborators();
      
      // Clear success message after delay
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Delete error:', error);
      setError(
        error.response?.data?.error || 
        'Failed to delete collaborator. Please try again.'
      );
      setTimeout(() => setError(''), 5000);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading collaborators...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Collaborators Management
              </h1>
              <p className="text-gray-400">
                Manage your business collaborators and partners
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Add Collaborator</span>
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-600 bg-opacity-20 border border-green-600 text-green-400 px-4 py-3 rounded-lg flex items-center space-x-2"
          >
            <CheckCircle size={20} />
            <span>{success}</span>
          </motion.div>
        )}

        {error && !showModal && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Collaborators Grid */}
        {collaborators.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {collaborators.map((collaborator) => (
              <motion.div
                key={collaborator._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 rounded-lg overflow-hidden border border-dark-600 hover:border-primary-500 transition-colors"
              >
                <div className="relative h-32 bg-dark-700 flex items-center justify-center">
                  {collaborator.logo ? (
                    <img
                      src={collaborator.logo}
                      alt={collaborator.name}
                      className="max-h-full max-w-full object-contain p-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <Building2 size={48} className="text-gray-400" />
                  )}
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-dark-700">
                    <Building2 size={48} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {collaborator.name}
                    </h3>
                    <span className="text-sm text-primary-400 bg-primary-600 bg-opacity-20 px-2 py-1 rounded-full">
                      {collaborator.category}
                    </span>
                  </div>
                  
                  {collaborator.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {collaborator.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-4">
                    Added: {formatDate(collaborator.createdAt)}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(collaborator)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(collaborator._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <Building2 size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Collaborators Found</h3>
            <p className="text-gray-400 mb-6">Get started by adding your first collaborator.</p>
            <button
              onClick={() => openModal()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
            >
              <Plus size={20} />
              <span>Add First Collaborator</span>
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-dark-600">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      {editingCollaborator ? 'Edit Collaborator' : 'Add New Collaborator'}
                    </h2>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {error && (
                    <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                      <AlertCircle size={20} />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-600 bg-opacity-20 border border-green-600 text-green-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                      <CheckCircle size={20} />
                      <span>{success}</span>
                    </div>
                  )}

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Logo {!editingCollaborator && <span className="text-red-400">*</span>}
                    </label>
                    <div className="border-2 border-dashed border-dark-600 rounded-lg p-4 text-center">
                      {logoPreview ? (
                        <div className="space-y-2">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-h-32 mx-auto object-contain"
                          />
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              id="logo-upload"
                            />
                            <label
                              htmlFor="logo-upload"
                              className="text-primary-400 hover:text-primary-300 cursor-pointer text-sm"
                            >
                              Change Logo
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <ImageIcon size={48} className="text-gray-400 mx-auto mb-2" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="text-primary-400 hover:text-primary-300 cursor-pointer flex items-center justify-center space-x-1"
                          >
                            <Upload size={16} />
                            <span>Upload Logo</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                      placeholder="Enter collaborator name"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                      placeholder="Enter description (optional)"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-dark-600 flex space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{editingCollaborator ? 'Update' : 'Create'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collaborator;