import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');

  useEffect(() => {
    fetchProjectDetails();
    if (user?.role === 'CLIENT') {
      fetchApplications();
    }
  }, [id, user]);

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      setError('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get(`/api/projects/${id}/applications`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/projects/${id}/applications`, {
        proposalMessage: applicationMessage
      });
      setShowApplicationForm(false);
      setApplicationMessage('');
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Failed to submit application');
    }
  };

  const handleAssignFreelancer = async (freelancerId) => {
    try {
      await api.put(`/api/projects/${id}/assign`, {
        freelancerId
      });
      fetchProjectDetails();
      alert('Freelancer assigned successfully!');
    } catch (error) {
      alert('Failed to assign freelancer');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.put(`/api/projects/${id}/status`, {
        status: newStatus
      });
      fetchProjectDetails();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!project) return <div className="text-center">Project not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'OPEN' ? 'bg-green-100 text-green-800' :
            project.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
            project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
            project.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
            'bg-red-100 text-red-800'
          }`}>
            {project.status}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Budget</h3>
            <p className="text-2xl font-bold text-green-600">${project.budget}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Client</h3>
            <p className="text-gray-700">{project.client?.companyName || 'Client'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Posted</h3>
            <p className="text-gray-700">{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills?.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {user?.role === 'FREELANCER' && project.status === 'OPEN' && (
          <div className="mb-6">
            {!showApplicationForm ? (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Apply to Project
              </button>
            ) : (
              <form onSubmit={handleApply} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Submit Application</h4>
                <textarea
                  id="application-message"
                  name="application-message"
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  placeholder="Tell the client why you're a good fit for this project..."
                  className="w-full p-3 border rounded-lg mb-4"
                  rows="4"
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {user?.role === 'CLIENT' && project.clientId === user.id && (
          <div className="mb-6">
            <div className="flex gap-2">
              {project.status === 'OPEN' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('ASSIGNED')}
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                  >
                    Mark as Assigned
                  </button>
                </>
              )}
              {project.status === 'ASSIGNED' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Start Project
                  </button>
                </>
              )}
              {project.status === 'IN_PROGRESS' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('CANCELED')}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Cancel Project
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {user?.role === 'CLIENT' && project.clientId === user.id && applications.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Applications ({applications.length})</h3>
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{application.freelancer?.firstName} {application.freelancer?.lastName}</h4>
                    <p className="text-gray-600 text-sm">${application.freelancer?.hourlyRate}/hour</p>
                  </div>
                  {project.status === 'OPEN' && (
                    <button
                      onClick={() => handleAssignFreelancer(application.freelancerId)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Assign
                    </button>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{application.proposalMessage}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
