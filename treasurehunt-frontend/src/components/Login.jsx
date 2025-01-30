import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [teamID, setTeamID] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Set loading to true when the form is submitted

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamID, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store JWT token in localStorage
                localStorage.setItem('authToken', data.token);
                navigate('/dashboard'); // Redirect to dashboard after successful login
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Error connecting to the server');
        } finally {
            setIsLoading(false); // Set loading to false once the request is complete
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Log In</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    placeholder="Team ID"
                    value={teamID}
                    onChange={(e) => setTeamID(e.target.value)}
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className="login-btn" disabled={isLoading}>
                    {isLoading ? 'Please wait, logging in...' : 'Log In'}
                </button>
            </form>
            {error && <p className="login-error">{error}</p>}
        </div>
    );
};

export default Login;

// Inject styles dynamically for the Login page
const loginStyles = `
    .login-container {
        text-align: center;
        padding: 50px;
        background-color: #f9f9f9;
        min-height: 100vh;
    }

    .login-title {
        font-size: 2.5rem;
        margin-bottom: 20px;
        color: #333;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .login-input {
        padding: 12px 20px;
        margin: 10px 0;
        width: 80%;
        max-width: 400px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
    }

    .login-btn {
        padding: 14px 30px;
        font-size: 1.1rem;
        border-radius: 5px;
        background-color: #008CBA;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .login-btn:hover {
        background-color: #007bb5;
    }

    .login-error {
        color: red;
        margin-top: 10px;
    }
`;

// Inject styles to the document
const loginStyleTag = document.createElement('style');
loginStyleTag.innerHTML = loginStyles;
document.head.appendChild(loginStyleTag);
