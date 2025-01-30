import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to Treasure Hunt!</h1>
            <p className="home-subtitle">Register your team or log in to continue</p>
            <div className="home-actions">
                <Link to="/signup" className="home-btn home-btn-signup">Register</Link>
                <Link to="/login" className="home-btn home-btn-login">Login</Link>
                {/* Added Admin Dashboard button */}
                <Link to="/admin-login" className="home-btn home-btn-admin">Admin Dashboard</Link>
            </div>
        </div>
    );
};

export default Home;

// CSS for Home Page (Inline in the same file)
const styles = `
.home-container {
    text-align: center;
    padding: 50px;
    background-color: #f9f9f9;
    min-height: 100vh;
}

.home-title {
    font-size: 3rem;
    margin-bottom: 20px;
    color: #333;
}

.home-subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
}

.home-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.home-btn {
    padding: 15px 30px;
    font-size: 1.1rem;
    border-radius: 5px;
    text-decoration: none;
    transition: all 0.3s ease;
}

.home-btn-signup {
    background-color: #4CAF50;
    color: white;
}

.home-btn-signup:hover {
    background-color: #45a049;
}

.home-btn-login {
    background-color: #008CBA;
    color: white;
}

.home-btn-login:hover {
    background-color: #007bb5;
}

.home-btn-admin {
    background-color: #ff9800;
    color: white;
}

.home-btn-admin:hover {
    background-color: #fb8c00;
}
`;

// Inject styles to the document
const styleTag = document.createElement('style');
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);
