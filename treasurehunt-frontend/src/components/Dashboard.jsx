import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure you have installed this package
import axios from 'axios';

const Dashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [teamID, setTeamID] = useState('');
    const [clueNumber, setClueNumber] = useState(1);
    const [clueLink, setClueLink] = useState('');
    const [message, setMessage] = useState('');
    const [clueStatus, setClueStatus] = useState(Array(8).fill(false));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            setIsLoggedIn(true);
            const decodedToken = jwtDecode(token);
            setTeamID(decodedToken.teamID);

            const fetchProgress = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/team`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
                    });

                    const teamProgress = response.data.progress;
                    const progressArray = [
                        teamProgress.clue1.isCorrect,
                        teamProgress.clue2.isCorrect,
                        teamProgress.clue3.isCorrect,
                        teamProgress.clue4.isCorrect,
                        teamProgress.clue5.isCorrect,
                        teamProgress.clue6.isCorrect,
                        teamProgress.clue7.isCorrect,
                        teamProgress.clue8.isCorrect,
                    ];

                    setClueStatus(progressArray);

                    // Find the next unsolved clue
                    const nextClue = progressArray.findIndex((isCorrect) => !isCorrect) + 1 || 8;
                    setClueNumber(nextClue);
                } catch (error) {
                    console.error('Error fetching team progress:', error);
                    setMessage('Error loading progress. Please try again.');
                }
            };

            fetchProgress();
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleClueSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/user/submit-clue`,
                { clueNumber: `clue${clueNumber}`, clueLink },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
                }
            );

            setMessage(response.data.message);

            if (response.data.message.includes('correct')) {
                const updatedClueStatus = [...clueStatus];
                updatedClueStatus[clueNumber - 1] = true;
                setClueStatus(updatedClueStatus);

                if (clueNumber < 8) {
                    setClueNumber(clueNumber + 1);
                    setClueLink('');
                }
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Network error. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            {isLoggedIn ? (
                <div style={styles.dashboard}>
                    <h1 style={styles.welcome}>Welcome, Team {teamID}!</h1>
                    <p style={styles.quote}>“Success is the sum of small efforts, repeated day in and day out.” – Robert Collier</p>
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>

                    <h2 style={styles.clueHeader}>Submit Clue {clueNumber}</h2>

                    <div style={styles.clueContainer}>
                        {Array.from({ length: 8 }, (_, index) => (
                            clueStatus[index] || index + 1 === clueNumber ? (
                                <div key={index} style={clueStatus[index] ? { ...styles.clueBox, ...styles.completed } : styles.clueBox}>
                                    <input
                                        type="text"
                                        placeholder={`Enter Clue ${index + 1} Link`}
                                        value={clueNumber === index + 1 ? clueLink : ''}
                                        onChange={(e) => setClueLink(e.target.value)}
                                        disabled={clueStatus[index]}
                                        style={styles.input}
                                    />
                                    {clueStatus[index] && <span style={styles.checkmark}>✔️</span>}
                                </div>
                            ) : null
                        ))}
                    </div>

                    <button
                        type="submit"
                        onClick={handleClueSubmit}
                        disabled={clueStatus[clueNumber - 1] || isSubmitting}
                        style={styles.submitButton}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Clue'}
                    </button>

                    <p style={styles.message}>{message}</p>

                    {clueStatus[7] && <h2 style={styles.congratulations}>Congratulations! You have completed the game!</h2>}
                </div>
            ) : (
                <h1 style={styles.loginMessage}>Please log in to participate in the treasure hunt.</h1>
            )}
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f9',
        padding: '20px',
    },
    dashboard: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
        overflow: 'auto', // Handle content overflow
    },
    welcome: {
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    quote: {
        fontSize: '16px',
        fontStyle: 'italic',
        color: '#6c757d',
        marginBottom: '20px',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '14px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    clueHeader: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#555',
        marginBottom: '20px',
    },
    clueContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '15px',
        maxHeight: '400px', // Limit height if needed
        overflowY: 'auto', // Enable vertical scroll if content overflows
        marginBottom: '20px',
    },
    clueBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
    },
    input: {
        border: 'none',
        outline: 'none',
        width: '100%',
        padding: '8px',
        fontSize: '14px',
    },
    completed: {
        backgroundColor: '#d4edda',
        border: '1px solid #28a745',
        color: '#155724',
    },
    checkmark: {
        color: '#28a745',
        fontSize: '18px',
    },
    submitButton: {
        marginTop: '20px',
        padding: '12px 20px',
        backgroundColor: '#007bff',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '200px',
    },
    message: {
        color: '#555',
        marginTop: '15px',
    },
    congratulations: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#28a745',
        marginTop: '20px',
    },
    loginMessage: {
        fontSize: '22px',
        color: '#333',
    },
};

export default Dashboard;
