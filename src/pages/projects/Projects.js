import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    budget: 'all',
    skills: []
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else {
        setError('Failed to fetch projects');
      }
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  const filteredProjects = projects.filter(project => {
    if (filters.status !== 'all' && project.status !== filters.status) {
      return false;
    }
    if (filters.budget !== 'all') {
      const [min, max] = filters.budget.split('-').map(Number);
      if (project.budget < min || project.budget > max) {
        return false;
      }
    }
    if (filters.skills.length > 0) {
      const projectSkills = project.requiredSkills || [];
      const hasRequiredSkills = filters.skills.some(skill => 
        projectSkills.includes(skill)
      );
      if (!hasRequiredSkills) return false;
    }
    return true;
  });

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          {user?.role === 'CLIENT' && (
            <button
              onClick={handleCreateProject}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Create New Project
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
              
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Budget: </span>
                <span className="text-sm text-gray-600">${project.budget}</span>
              </div>

              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Status: </span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  project.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                  project.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.status}
                </span>
              </div>

              {project.requiredSkills && project.requiredSkills.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Skills: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.requiredSkills.map((skill, index) => (
                      <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Link
                  to={`/projects/${project.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Details
                </Link>
                {user?.role === 'FREELANCER' && project.status === 'OPEN' && (
                  <Link
                    to={`/projects/${project.id}/apply`}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Apply
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
