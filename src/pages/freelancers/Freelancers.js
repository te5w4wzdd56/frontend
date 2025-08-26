import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [rateFilter, setRateFilter] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFreelancers();
  }, []);

  useEffect(() => {
    filterFreelancers();
  }, [freelancers, searchTerm, skillFilter, rateFilter]);

  const fetchFreelancers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/freelancers');
      setFreelancers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      setLoading(false);
    }
  };

  const filterFreelancers = () => {
    let filtered = [...freelancers];

    if (searchTerm) {
      filtered = filtered.filter(freelancer =>
        freelancer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (skillFilter) {
      filtered = filtered.filter(freelancer =>
        freelancer.skills?.some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    if (rateFilter.min) {
      filtered = filtered.filter(freelancer => 
        freelancer.hourlyRate >= parseInt(rateFilter.min)
      );
    }

    if (rateFilter.max) {
      filtered = filtered.filter(freelancer => 
        freelancer.hourlyRate <= parseInt(rateFilter.max)
      );
    }

    setFilteredFreelancers(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  const paginatedFreelancers = filteredFreelancers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Freelancers</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
            <input
              type="text"
              placeholder="Skill..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Rate ($/hr)</label>
            <input
              type="number"
              placeholder="Min"
              value={rateFilter.min}
              onChange={(e) => setRateFilter({...rateFilter, min: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Rate ($/hr)</label>
            <input
              type="number"
              placeholder="Max"
              value={rateFilter.max}
              onChange={(e) => setRateFilter({...rateFilter, max: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedFreelancers.map((freelancer) => (
          <div key={freelancer.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">
                  {freelancer.firstName?.[0]}{freelancer.lastName?.[0]}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">
                  {freelancer.firstName} {freelancer.lastName}
                </h3>
                <p className="text-gray-600">${freelancer.hourlyRate}/hour</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">{freelancer.bio}</p>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {freelancer.skills?.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {freelancer.skills?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{freelancer.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <Link
              to={`/freelancers/${freelancer.id}`}
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}

      {filteredFreelancers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No freelancers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Freelancers;
