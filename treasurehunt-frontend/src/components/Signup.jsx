import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
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
            // Send signup request
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamID, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the JWT token in localStorage
                localStorage.setItem('authToken', data.token); // Make sure backend sends this token

                // Redirect to dashboard after successful signup
                navigate('/dashboard');
            } else {
                setError(data.message || 'Error during registration');
            }
        } catch (err) {
            setError('Error connecting to the server');
        } finally {
            setIsLoading(false); // Set loading to false once the request is complete
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="text"
                    placeholder="Team ID"
                    value={teamID}
                    onChange={(e) => setTeamID(e.target.value)}
                    required
                    className="signup-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="signup-input"
                />
                <button type="submit" className="signup-btn" disabled={isLoading}>
                    {isLoading ? 'Please wait, signing up...' : 'Register'}
                </button>
            </form>
            {error && <p className="signup-error">{error}</p>}
        </div>
    );
};

export default Signup;

// Inject styles dynamically for the Signup page
const signupStyles = `
    .signup-container {
        text-align: center;
        padding: 50px;
        background-color: #f9f9f9;
        min-height: 100vh;
    }

    .signup-title {
        font-size: 2.5rem;
        margin-bottom: 20px;
        color: #333;
    }

    .signup-form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .signup-input {
        padding: 12px 20px;
        margin: 10px 0;
        width: 80%;
        max-width: 400px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
    }

    .signup-btn {
        padding: 14px 30px;
        font-size: 1.1rem;
        border-radius: 5px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .signup-btn:hover {
        background-color: #45a049;
    }

    .signup-error {
        color: red;
        margin-top: 10px;
    }
`;

// Inject styles to the document
const signupStyleTag = document.createElement('style');
signupStyleTag.innerHTML = signupStyles;
document.head.appendChild(signupStyleTag);
