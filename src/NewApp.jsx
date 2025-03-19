import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { useAuth } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Donors from './components/Donors';
import Projects from './components/Projects';
import Sponsorships from './components/Sponsorships';
import Volunteers from './components/Volunteers';
import Login from './components/Login';
import Unauthorized from './components/Unauthorized';

const { Content } = Layout;

// Protected Route Component
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user doesn't have permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

// Main Layout with Sidebar
const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected Routes with Main Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard - accessible to all authenticated users */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Donors - accessible to admin and PR officers */}
            <Route 
              path="/donors" 
              element={<ProtectedRoute allowedRoles={['admin', 'pr_officer']} />} 
            >
              <Route index element={<Donors />} />
            </Route>
            
            {/* Projects - accessible to all authenticated users */}
            <Route path="/projects" element={<Projects />} />
            
            {/* Sponsorships - accessible to admin and PR officers */}
            <Route 
              path="/sponsorships" 
              element={<ProtectedRoute allowedRoles={['admin', 'pr_officer']} />} 
            >
              <Route index element={<Sponsorships />} />
            </Route>
            
            {/* Volunteers - accessible to admin and PR officers */}
            <Route 
              path="/volunteers" 
              element={<ProtectedRoute allowedRoles={['admin', 'pr_officer']} />} 
            >
              <Route index element={<Volunteers />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

