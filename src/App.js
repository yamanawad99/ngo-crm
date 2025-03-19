import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Donors from './components/Donors';
import Projects from './components/Projects';
import Sponsorships from './components/Sponsorships';
import Volunteers from './components/Volunteers';
import Login from './components/Login';
import Unauthorized from './components/Unauthorized';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';


function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes with Main Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard - accessible to all authenticated users */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Projects - accessible to all authenticated users */}
            <Route path="/projects" element={<Projects />} />

            {/* Routes that require specific roles */}
            {/* <Route element={<PrivateRoute requiredRoles={['admin', 'pr_officer']} />}> */}
              {/* Donors - accessible to admin and PR officers */}
              <Route path="/donors" element={<Donors />} />

              {/* Sponsorships - accessible to admin and PR officers */}
              <Route path="/sponsorships" element={<Sponsorships />} />

              {/* Volunteers - accessible to admin and PR officers */}
              <Route path="/volunteers" element={<Volunteers />} />
            {/* </Route> */}
          </Route>
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
