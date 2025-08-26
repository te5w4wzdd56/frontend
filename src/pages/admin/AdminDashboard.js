import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalFreelancers: 0,
    totalClients: 0
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is admin before fetching data
    if (user?.role !== 'ADMIN') {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // For now, use mock data since admin endpoints don't exist
      // You can replace this with actual API calls when admin endpoints are implemented
      const mockStats = {
        totalUsers: 150,
        totalProjects: 45,
        totalFreelancers: 89,
        totalClients: 61
      };
      
      // Mock user data
      const mockUsers = [
        { id: 1, email: 'admin@example.com', role: 'ADMIN', isActive: true },
        { id: 2, email: 'client1@example.com', role: 'CLIENT', isActive: true },
        { id: 3, email: 'freelancer1@example.com', role: 'FREELANCER', isActive: true }
      ];
      
      // Mock project data
      const mockProjects = [
        { id: 1, title: 'Website Development', status: 'OPEN', budget: 5000 },
        { id: 2, title: 'Mobile App', status: 'IN_PROGRESS', budget: 8000 }
      ];
      
      setStats(mockStats);
      setUsers(mockUsers);
      setProjects(mockProjects);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        // This is a mock implementation since admin endpoints don't exist yet
        // Replace with actual API call when admin endpoints are implemented
        alert('User deactivation functionality will be available when admin endpoints are implemented');
      } catch (error) {
        alert('Failed to deactivate user');
      }
    }
  };

  const handleArchiveProject = async (projectId) => {
    if (window.confirm('Are you sure you want to archive this project?')) {
      try {
        // This is a mock implementation since admin endpoints don't exist yet
        // Replace with actual API call when admin endpoints are implemented
        alert('Project archiving functionality will be available when admin endpoints are implemented');
      } catch (error) {
        alert('Failed to archive project');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalProjects}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Freelancers</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalFreelancers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Clients</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalClients}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'projects'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Projects
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {activeTab === 'overview' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Recent Users</h4>
                  <div className="space-y-2">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-gray-600">{user.role}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recent Projects</h4>
                  <div className="space-y-2">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="p-3 bg-gray-50 rounded">
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-gray-600">{project.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Role</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-2">{user.email}</td>
                        <td className="py-2">{user.role}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-2">
                          {user.isActive && (
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Project Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Title</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Budget</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="border-b">
                        <td className="py-2">{project.title}</td>
                        <td className="py-2">{project.status}</td>
                        <td className="py-2">${project.budget}</td>
                        <td className="py-2">
                          <button
                            onClick={() => handleArchiveProject(project.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Archive
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
