// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        message: '',
        token: null,
        teamID: '', // Add teamID to the state
    });

    // Load token from localStorage if available
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuth({ isAuthenticated: true, message: 'Welcome back!', token });
            fetchTeamDetails(token); // Fetch team details if token is available
        }
    }, []);

    const fetchTeamDetails = async (token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/team`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setAuth(prevAuth => ({
                    ...prevAuth,
                    teamID: response.data.teamID, // Set teamID after successful fetch
                }));
            } else {
                console.log('Failed to fetch teamID');
            }
        } catch (error) {
            console.error('Error fetching team details:', error);
        }
    };

    const login = (message, token) => {
        localStorage.setItem('token', token);
        setAuth({ isAuthenticated: true, message, token });
        fetchTeamDetails(token); // Fetch team details when logging in
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ isAuthenticated: false, message: '', token: null, teamID: '' });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
