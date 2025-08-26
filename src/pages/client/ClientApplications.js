import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const ClientApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && user.role === 'CLIENT') {
      fetchApplications();
    }
  }, [user, currentPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/applications/client?page=${currentPage}&size=10`);
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status?status=${status}`);
      toast.success(`Application ${status.toLowerCase()} successfully`);
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const openModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || user.role !== 'CLIENT') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only clients can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications for Your Projects</h1>
          <p className="text-gray-600 mt-2">
            Manage applications submitted by freelancers for your projects
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">
              You haven't received any applications for your projects yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.project?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Applied by: {application.freelancer?.firstName} {application.freelancer?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Applied on: {formatDate(application.createdAt)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(application.status)}`}>
                    {application.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 line-clamp-3">
                    {application.proposalMessage}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => openModal(application)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>

                  {application.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'ACCEPTED')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === i
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Application Details Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Project</h3>
                    <p className="text-gray-700">{selectedApplication.project?.title}</p>
                    <p className="text-sm text-gray-600">{selectedApplication.project?.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Freelancer</h3>
                    <p className="text-gray-700">
                      {selectedApplication.freelancer?.firstName} {selectedApplication.freelancer?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedApplication.freelancer?.email}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Proposal Message</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.proposalMessage}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Applied On</h3>
                    <p className="text-gray-700">{formatDate(selectedApplication.createdAt)}</p>
                  </div>
                </div>

                {selectedApplication.status === 'PENDING' && (
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, 'ACCEPTED');
                        closeModal();
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
                    >
                      Accept Application
                    </button>
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, 'REJECTED');
                        closeModal();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium"
                    >
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientApplications;
