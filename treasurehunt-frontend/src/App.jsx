// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Admin from './components/adminDashboard';

import Dashboard from './components/Dashboard';


const App = () => {

    return (
        <AuthProvider> {/* Wrap your app inside AuthProvider */}
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<Admin />} />

                    
                  
                  
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
