import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Eye,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Clock,
  DollarSign,
  BookOpen
} from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
}

interface NewWorkshop {
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
}

const Workshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [error, setError] = useState<string>('');

  const [newWorkshop, setNewWorkshop] = useState<NewWorkshop>({
    title: '',
    image: 'https://images.pexels.com/photos/442584/pexels-photo-442584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: '',
    duration: '',
    schedule: '',
    location: 'Anantam Training Center, Bangalore',
    price: '',
    capacity: 0,
    level: 'Beginner',
    upcoming: [{ date: '', spots: 0 }],
    curriculum: ['']
  });

  // API Base URL
  const API_BASE = 'https://anantam-backend-7ezq.onrender.com/api';

  // Fetch workshops
  const fetchWorkshops = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/workshops/admin/workshops`);
      if (!response.ok) throw new Error('Failed to fetch workshops');
      const data = await response.json();
      setWorkshops(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workshops');
    } finally {
      setLoading(false);
    }
  };

  // Create workshop
  const createWorkshop = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/workshops/admin/workshops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkshop),
      });

      if (!response.ok) throw new Error('Failed to create workshop');
      
      await fetchWorkshops();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workshop');
    }
  };

  // Update workshop
  const updateWorkshop = async (): Promise<void> => {
    if (!editingWorkshop) return;

    try {
      const response = await fetch(`${API_BASE}/workshops/admin/workshops/${editingWorkshop._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkshop),
      });

      if (!response.ok) throw new Error('Failed to update workshop');
      
      await fetchWorkshops();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workshop');
    }
  };

  // Delete workshop
  const deleteWorkshop = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;

    try {
      const response = await fetch(`${API_BASE}/workshops/admin/workshops/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete workshop');
      
      await fetchWorkshops();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workshop');
    }
  };

  // Toggle workshop status
  const toggleWorkshopStatus = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/workshops/admin/workshops/${id}/toggle-status`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to toggle workshop status');
      
      await fetchWorkshops();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle workshop status');
    }
  };

  // Reset form
  const resetForm = (): void => {
    setNewWorkshop({
      title: '',
      image: 'https://images.pexels.com/photos/442584/pexels-photo-442584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      description: '',
      duration: '',
      schedule: '',
      location: 'Anantam Training Center, Bangalore',
      price: '',
      capacity: 0,
      level: 'Beginner',
      upcoming: [{ date: '', spots: 0 }],
      curriculum: ['']
    });
    setEditingWorkshop(null);
  };

  // Open edit modal
  const openEditModal = (workshop: Workshop): void => {
    setEditingWorkshop(workshop);
    setNewWorkshop({
      title: workshop.title,
      image: workshop.image,
      description: workshop.description,
      duration: workshop.duration,
      schedule: workshop.schedule,
      location: workshop.location,
      price: workshop.price,
      capacity: workshop.capacity,
      level: workshop.level,
      upcoming: workshop.upcoming,
      curriculum: workshop.curriculum
    });
    setShowModal(true);
  };

  // Add curriculum item
  const addCurriculumItem = (): void => {
    setNewWorkshop(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, '']
    }));
  };

  // Remove curriculum item
  const removeCurriculumItem = (index: number): void => {
    setNewWorkshop(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }));
  };

  // Update curriculum item
  const updateCurriculumItem = (index: number, value: string): void => {
    setNewWorkshop(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((item, i) => i === index ? value : item)
    }));
  };

  // Add upcoming session
  const addUpcomingSession = (): void => {
    setNewWorkshop(prev => ({
      ...prev,
      upcoming: [...prev.upcoming, { date: '', spots: 0 }]
    }));
  };

  // Remove upcoming session
  const removeUpcomingSession = (index: number): void => {
    setNewWorkshop(prev => ({
      ...prev,
      upcoming: prev.upcoming.filter((_, i) => i !== index)
    }));
  };

  // Update upcoming session
  const updateUpcomingSession = (index: number, field: 'date' | 'spots', value: string | number): void => {
    setNewWorkshop(prev => ({
      ...prev,
      upcoming: prev.upcoming.map((session, i) => 
        i === index ? { ...session, [field]: value } : session
      )
    }));
  };

  // Filter workshops
  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workshop.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total enrolled for a workshop
  const getTotalEnrolled = (workshop: Workshop): number => {
    return workshop.upcoming.reduce((total, session) => 
      total + (workshop.capacity - session.spots), 0
    );
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Workshop Management</h1>
          <p className="text-gray-400">Manage your workshop schedule and content</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Workshop
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workshops..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Workshops Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Workshop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredWorkshops.map((workshop) => (
                <tr key={workshop._id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={workshop.image}
                          alt={workshop.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{workshop.title}</div>
                        <div className="text-sm text-gray-400">{workshop.level}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">
                      <div className="flex items-center mb-1">
                        <Clock size={14} className="text-primary-400 mr-2" />
                        {workshop.duration}
                      </div>
                      <div className="flex items-center mb-1">
                        <DollarSign size={14} className="text-primary-400 mr-2" />
                        {workshop.price}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="text-primary-400 mr-2" />
                        <span className="text-xs text-gray-400 truncate max-w-32">
                          {workshop.location}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      <div className="flex items-center mb-1">
                        <Users size={14} className="text-primary-400 mr-2" />
                        {getTotalEnrolled(workshop)}/{workshop.capacity * workshop.upcoming.length}
                      </div>
                      <div className="text-xs text-gray-400">
                        {workshop.upcoming.length} session{workshop.upcoming.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleWorkshopStatus(workshop._id)}
                      className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        workshop.isActive
                          ? 'bg-green-900 text-green-200 hover:bg-green-800'
                          : 'bg-red-900 text-red-200 hover:bg-red-800'
                      } transition-colors`}
                    >
                      {workshop.isActive ? (
                        <ToggleRight size={14} className="mr-1" />
                      ) : (
                        <ToggleLeft size={14} className="mr-1" />
                      )}
                      {workshop.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openEditModal(workshop)}
                      className="text-primary-400 hover:text-primary-300 mr-3 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => deleteWorkshop(workshop._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingWorkshop ? 'Edit Workshop' : 'Create New Workshop'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newWorkshop.title}
                  onChange={(e) => setNewWorkshop(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Level
                </label>
                <select
                  value={newWorkshop.level}
                  onChange={(e) => setNewWorkshop(prev => ({ 
                    ...prev, 
                    level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
                  }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newWorkshop.description}
                  onChange={(e) => setNewWorkshop(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={newWorkshop.duration}
                  onChange={(e) => setNewWorkshop(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 3 days, 2 weeks"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  value={newWorkshop.price}
                  onChange={(e) => setNewWorkshop(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., ₹15,000"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacity per Session
                </label>
                <input
                  type="number"
                  value={newWorkshop.capacity}
                  onChange={(e) => setNewWorkshop(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Schedule
                </label>
                <input
                  type="text"
                  value={newWorkshop.schedule}
                  onChange={(e) => setNewWorkshop(prev => ({ ...prev, schedule: e.target.value }))}
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newWorkshop.location}
                  onChange={(e) => setNewWorkshop(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newWorkshop.image}
                  onChange={(e) => setNewWorkshop(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>

              {/* Upcoming Sessions */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upcoming Sessions
                </label>
                {newWorkshop.upcoming.map((session, index) => (
                  <div key={index} className="flex gap-3 mb-2">
                    <input
                      type="date"
                      value={session.date}
                      onChange={(e) => updateUpcomingSession(index, 'date', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                    />
                    <input
                      type="number"
                      value={session.spots}
                      onChange={(e) => updateUpcomingSession(index, 'spots', parseInt(e.target.value) || 0)}
                      placeholder="Available spots"
                      className="w-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                    />
                    {newWorkshop.upcoming.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUpcomingSession(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addUpcomingSession}
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  + Add Session
                </button>
              </div>

              {/* Curriculum */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Curriculum
                </label>
                {newWorkshop.curriculum.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateCurriculumItem(index, e.target.value)}
                      placeholder="Curriculum item"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                    />
                    {newWorkshop.curriculum.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCurriculumItem(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCurriculumItem}
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  + Add Curriculum Item
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingWorkshop ? updateWorkshop : createWorkshop}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingWorkshop ? 'Update' : 'Create'} Workshop
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Workshops;