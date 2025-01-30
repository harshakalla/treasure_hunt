import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use useNavigate hook for redirection

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send login request to backend
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/login`, {
                username,
                password,
            });

            // If login is successful, store the token in localStorage
            localStorage.setItem('authToken', response.data.token);

            // Redirect to Admin Dashboard
            navigate('/admin-dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={styles.input}
                    required
                />
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>
                    Login
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        width: '300px',
        margin: 'auto',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        backgroundColor: '#3182ce',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        fontSize: '14px',
    },
};

export default AdminLogin;
