// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminLogin from './components/adminLogin';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/adminDashboard';

const App = () => {
    const isLoggedIn = !!localStorage.getItem('adminToken'); // Check if the admin is logged in

    return (
        <AuthProvider> {/* Wrap your app inside AuthProvider */}
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    
                    {/* If the user is logged in, show the admin dashboard, else redirect to login */}
                    <Route path="/admin-dashboard" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/admin-login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
