import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/projects/Projects';
import ProjectDetail from './pages/projects/ProjectDetail';
import CreateProject from './pages/projects/CreateProject';
import ApplyPage from './pages/projects/ApplyPage';
import Freelancers from './pages/freelancers/Freelancers';
import FreelancerProfile from './pages/profiles/FreelancerProfile';
import ClientProfile from './pages/profiles/ClientProfile';
import Messages from './pages/Messages';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientApplications from './pages/client/ClientApplications';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/projects/:id/apply" element={<ProtectedRoute><ApplyPage /></ProtectedRoute>} />
            <Route path="/freelancers" element={<ProtectedRoute><Freelancers /></ProtectedRoute>} />
            <Route path="/freelancers/:id" element={<ProtectedRoute><FreelancerProfile /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/client/applications" element={<ProtectedRoute><ClientApplications /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
