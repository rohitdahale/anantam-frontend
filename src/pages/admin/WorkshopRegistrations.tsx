import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Eye,
  Edit,
  Calendar, 
  Users, 
  Mail,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Types
interface Workshop {
  _id: string;
  title: string;
  duration: string;
  price: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Registration {
  _id: string;
  workshop: Workshop;
  user: User;
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
  registrationDate: string;
  confirmationDate?: string;
  cancellationDate?: string;
  cancellationReason?: string;
  refundAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface RegistrationsResponse {
  registrations: Registration[];
  totalPages: number;
  currentPage: number;
  total: number;
}

const WorkshopRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [workshopFilter, setWorkshopFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [error, setError] = useState<string>('');

  // API Base URL
  const API_BASE = 'https://anantam-backend-7ezq.onrender.com/api';

  // Fetch workshops for filter dropdown
  const fetchWorkshops = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/workshops/admin/workshops`);
      if (!response.ok) throw new Error('Failed to fetch workshops');
      const data = await response.json();
      setWorkshops(data);
    } catch (err) {
      console.error('Error fetching workshops:', err);
    }
  };

  // Fetch registrations
  const fetchRegistrations = async (): Promise<void> => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (statusFilter) params.append('status', statusFilter);
      if (workshopFilter) params.append('workshopId', workshopFilter);

      const response = await fetch(`${API_BASE}/workshops/admin/registrations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch registrations');
      
      const data: RegistrationsResponse = await response.json();
      setRegistrations(data.registrations);
      setTotalPages(data.totalPages);
      setTotalRegistrations(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  // Update registration status
  const updateRegistrationStatus = async (): Promise<void> => {
    if (!selectedRegistration) return;

    try {
      const response = await fetch(`${API_BASE}/workshops/admin/registrations/${selectedRegistration._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNotes
        }),
      });

      if (!response.ok) throw new Error('Failed to update registration status');
      
      setShowStatusModal(false);
      setSelectedRegistration(null);
      setNewStatus('');
      setStatusNotes('');
      await fetchRegistrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update registration status');
    }
  };

  // Open status update modal
  const openStatusModal = (registration: Registration): void => {
    setSelectedRegistration(registration);
    setNewStatus(registration.registrationStatus);
    setStatusNotes(registration.notes || '');
    setShowStatusModal(true);
  };

  // Open details modal
  const openDetailsModal = (registration: Registration): void => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  // Filter registrations by search term
  const filteredRegistrations = registrations.filter(registration =>
    registration.participantInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.participantInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.workshop.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge style
  const getStatusBadge = (status: string) => {
    const styles = {
      registered: 'bg-blue-900 text-blue-200',
      confirmed: 'bg-green-900 text-green-200',
      cancelled: 'bg-red-900 text-red-200',
      completed: 'bg-purple-900 text-purple-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-900 text-gray-200';
  };

  // Get payment status badge style
  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-900 text-yellow-200',
      paid: 'bg-green-900 text-green-200',
      failed: 'bg-red-900 text-red-200',
      refunded: 'bg-orange-900 text-orange-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-900 text-gray-200';
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, statusFilter, workshopFilter]);

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
          <h1 className="text-2xl font-bold text-white">Workshop Registrations</h1>
          <p className="text-gray-400">Manage workshop registrations and participant details</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            {totalRegistrations} Total Registrations
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search participants..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
          >
            <option value="">All Statuses</option>
            <option value="registered">Registered</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          {/* Workshop Filter */}
          <select
            value={workshopFilter}
            onChange={(e) => setWorkshopFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
          >
            <option value="">All Workshops</option>
            {workshops.map((workshop) => (
              <option key={workshop._id} value={workshop._id}>
                {workshop.title}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setStatusFilter('');
              setWorkshopFilter('');
              setSearchTerm('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Workshop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date & Payment
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
              {filteredRegistrations.map((registration) => (
                <tr key={registration._id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {registration.participantInfo.name}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <Mail size={12} className="mr-1" />
                          {registration.participantInfo.email}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <Phone size={12} className="mr-1" />
                          {registration.participantInfo.phone}
                        </div>
                        <div className="text-xs text-primary-400 mt-1">
                          {registration.participantInfo.experience} Level
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">
                      <div className="font-medium flex items-center">
                        <BookOpen size={14} className="text-primary-400 mr-2" />
                        {registration.workshop.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Duration: {registration.workshop.duration}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">
                      <div className="flex items-center mb-1">
                        <Calendar size={14} className="text-primary-400 mr-2" />
                        {formatDate(registration.selectedDate)}
                      </div>
                      <div className="flex items-center mb-1">
                        <DollarSign size={14} className="text-primary-400 mr-2" />
                        {registration.paymentInfo.amount}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(registration.paymentInfo.status)}`}>
                        {registration.paymentInfo.status === 'paid' && <CheckCircle size={12} className="mr-1" />}
                        {registration.paymentInfo.status === 'failed' && <XCircle size={12} className="mr-1" />}
                        {registration.paymentInfo.status === 'pending' && <Clock size={12} className="mr-1" />}
                        {registration.paymentInfo.status.charAt(0).toUpperCase() + registration.paymentInfo.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(registration.registrationStatus)}`}>
                      {registration.registrationStatus === 'confirmed' && <CheckCircle size={12} className="mr-1" />}
                      {registration.registrationStatus === 'cancelled' && <XCircle size={12} className="mr-1" />}
                      {registration.registrationStatus === 'registered' && <Clock size={12} className="mr-1" />}
                      {registration.registrationStatus.charAt(0).toUpperCase() + registration.registrationStatus.slice(1)}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      Registered: {formatDate(registration.registrationDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openDetailsModal(registration)}
                      className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => openStatusModal(registration)}
                      className="text-green-400 hover:text-green-300 transition-colors"
                      title="Update Status"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-300">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalRegistrations)} of {totalRegistrations} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">Registration Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Participant Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                  Participant Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <p className="text-white">{selectedRegistration.participantInfo.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <p className="text-white">{selectedRegistration.participantInfo.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <p className="text-white">{selectedRegistration.participantInfo.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Experience Level</label>
                  <p className="text-white">{selectedRegistration.participantInfo.experience}</p>
                </div>
                {selectedRegistration.participantInfo.additionalInfo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Additional Info</label>
                    <p className="text-white">{selectedRegistration.participantInfo.additionalInfo}</p>
                  </div>
                )}
              </div>

              {/* Workshop & Payment Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                  Workshop & Payment
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Workshop</label>
                  <p className="text-white">{selectedRegistration.workshop.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Selected Date</label>
                  <p className="text-white">{formatDate(selectedRegistration.selectedDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                  <p className="text-white">{selectedRegistration.paymentInfo.amount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(selectedRegistration.paymentInfo.status)}`}>
                    {selectedRegistration.paymentInfo.status.charAt(0).toUpperCase() + selectedRegistration.paymentInfo.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
                  <p className="text-white capitalize">{selectedRegistration.paymentInfo.paymentMethod}</p>
                </div>
                {selectedRegistration.paymentInfo.paymentId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Payment ID</label>
                    <p className="text-white text-xs font-mono">{selectedRegistration.paymentInfo.paymentId}</p>
                  </div>
                )}
              </div>

              {/* Registration Status */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                  Registration Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Current Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedRegistration.registrationStatus)}`}>
                      {selectedRegistration.registrationStatus.charAt(0).toUpperCase() + selectedRegistration.registrationStatus.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Registration Date</label>
                    <p className="text-white">{formatDate(selectedRegistration.registrationDate)}</p>
                  </div>
                </div>
                
                {selectedRegistration.confirmationDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Confirmation Date</label>
                    <p className="text-white">{formatDate(selectedRegistration.confirmationDate)}</p>
                  </div>
                )}
                
                {selectedRegistration.cancellationDate && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Cancellation Date</label>
                      <p className="text-white">{formatDate(selectedRegistration.cancellationDate)}</p>
                    </div>
                    {selectedRegistration.refundAmount && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Refund Amount</label>
                        <p className="text-white">₹{selectedRegistration.refundAmount}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedRegistration.cancellationReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Cancellation Reason</label>
                    <p className="text-white">{selectedRegistration.cancellationReason}</p>
                  </div>
                )}
                
                {selectedRegistration.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Admin Notes</label>
                    <p className="text-white">{selectedRegistration.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">Update Registration Status</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Participant: {selectedRegistration.participantInfo.name}
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                >
                  <option value="registered">Registered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                  placeholder="Add any notes about this status change..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateRegistrationStatus}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WorkshopRegistrations;