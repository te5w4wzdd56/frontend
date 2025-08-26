import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    applications: 0,
    messages: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats based on user role
      if (user.role === 'CLIENT') {
        const [projectsResponse, messagesResponse] = await Promise.all([
          api.get('/api/projects'),
          api.get('/api/messages/unread-count')
        ]);
        
        const myProjects = projectsResponse.data.filter(p => p.clientId === user.id);
        
        setStats({
          totalProjects: myProjects.length,
          activeProjects: myProjects.filter(p => p.status === 'OPEN').length,
          applications: myProjects.reduce((acc, p) => acc + (p.applications?.length || 0), 0),
          messages: messagesResponse.data.count || 0
        });
        
        setRecentProjects(myProjects.slice(0, 5));
      } else if (user.role === 'FREELANCER') {
        const [applicationsResponse, messagesResponse] = await Promise.all([
          api.get('/api/applications'),
          api.get('/api/messages/unread-count')
        ]);
        
        const myApplications = applicationsResponse.data.filter(a => a.freelancerId === user.id);
        
        setStats({
          totalProjects: 0,
          activeProjects: myApplications.filter(a => a.status === 'ACCEPTED').length,
          applications: myApplications.length,
          messages: messagesResponse.data.count || 0
        });
        
        setRecentApplications(myApplications.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Handle unauthorized error
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {user.role === 'CLIENT' ? 'Total Projects' : 'Applications'}
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {user.role === 'CLIENT' ? stats.totalProjects : stats.applications}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {user.role === 'CLIENT' ? 'Active Projects' : 'Active Work'}
            </h3>
            <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.messages}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {user.role === 'CLIENT' ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Projects</h2>
              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map(project => (
                    <div key={project.id} className="border-b pb-4 last:border-b-0">
                      <h3 className="font-medium text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                          project.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No projects yet</p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map(application => (
                    <div key={application.id} className="border-b pb-4 last:border-b-0">
                      <h3 className="font-medium text-gray-900">{application.projectTitle}</h3>
                      <p className="text-sm text-gray-600">{application.proposalMessage}</p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No applications yet</p>
              )}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {user.role === 'CLIENT' ? (
                <>
                  <button 
                    onClick={() => navigate('/projects/create')}
                    className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                    Create New Project
                  </button>
                  <button 
                    onClick={() => window.location.href = '/freelancers'}
                    className="w-full text-left px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
                    Browse Freelancers
                  </button>
                  <button 
                    onClick={() => window.location.href = '/messages'}
                    className="w-full text-left px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-200">
                    View Messages
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => window.location.href = '/projects'}
                    className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                    Browse Projects
                  </button>
                  <button 
                    onClick={() => window.location.href = '/profile'}
                    className="w-full text-left px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
                    Update Profile
                  </button>
                  <button 
                    onClick={() => window.location.href = '/messages'}
                    className="w-full text-left px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-200">
                    View Messages
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
