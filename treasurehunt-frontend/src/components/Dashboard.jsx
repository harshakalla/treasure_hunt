import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // You may need to install this package
import axios from 'axios';

const Dashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // To check if the user is logged in
    const [teamID, setTeamID] = useState(''); // State to store the teamID
    const [clueNumber, setClueNumber] = useState(1); // Track the current clue
    const [clueLink, setClueLink] = useState(''); // Store the entered clue link
    const [message, setMessage] = useState(''); // Store the response message
    const [clueStatus, setClueStatus] = useState(Array(8).fill(false)); // Track clue completion status for 8 clues
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Check if the user is logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        if (token) {
            setIsLoggedIn(true);
            const decodedToken = jwtDecode(token); // Decode the token to get teamID
            setTeamID(decodedToken.teamID); // Set teamID from decoded token

            // Fetch the team progress from the backend
            const fetchProgress = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/team`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    });

                    // Set the team progress and determine the starting clue number
                    const teamProgress = response.data.progress;
                    setClueStatus([
                        teamProgress.clue1.isCorrect,
                        teamProgress.clue2.isCorrect,
                        teamProgress.clue3.isCorrect,
                        teamProgress.clue4.isCorrect,
                        teamProgress.clue5.isCorrect,
                        teamProgress.clue6.isCorrect,
                        teamProgress.clue7.isCorrect,
                        teamProgress.clue8.isCorrect,
                    ]);

                    // Set the clue number to the next unresolved clue
                    const nextClue = teamProgress.clue1.isCorrect
                        ? teamProgress.clue2.isCorrect
                            ? teamProgress.clue3.isCorrect
                                ? teamProgress.clue4.isCorrect
                                    ? teamProgress.clue5.isCorrect
                                        ? teamProgress.clue6.isCorrect
                                            ? teamProgress.clue7.isCorrect
                                                ? 8
                                                : 7
                                            : 6
                                        : 5
                                    : 4
                                : 3
                            : 2
                        : 1;
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
        localStorage.removeItem('authToken'); // Clear authToken on logout
        setIsLoggedIn(false); // Update state to reflect the logout
        navigate('/'); // Redirect to the home page after logout
    };

    const handleClueSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Send the clue link and clue number to the server
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/user/submit-clue`,
                { clueNumber: `clue${clueNumber}`, clueLink },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
    
            setMessage(response.data.message); // Set message from server response
    
            // If the clue is correct, move to the next clue
            if (response.data.message.includes('correct')) {
                const updatedClueStatus = [...clueStatus];
                updatedClueStatus[clueNumber - 1] = true; // Mark current clue as correct
                setClueStatus(updatedClueStatus);
                
                if (clueNumber < 8) {
                    setClueNumber(clueNumber + 1); // Proceed to next clue
                    setClueLink(''); // Clear the input field
                }
            }
        } catch (error) {
            if (error.response) {
                // If the error response exists (e.g., 400 Bad Request)
                setMessage(error.response.data.message || 'Error submitting clue. Please try again.');
            } else {
                // If no response, the error could be in the network or connection
                setMessage('Network error. Please check your internet connection.');
            }
            console.error(error);
        }
    };

    return (
        <div style={styles.dashboardContainer}>
            {/* Show welcome message and logout button if the user is logged in */}
            {isLoggedIn ? (
                <div>
                    <h1 style={styles.welcomeHeader}>Welcome Team {teamID}!</h1> {/* Display teamID in the welcome message */}
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>

                    <div>
                        <h2 style={styles.clueHeader}>Submit Clue {clueNumber}</h2>
                        
                        {/* Dynamic Clues */}
                        {Array.from({ length: 8 }, (_, index) => (
                            // Only show input for current or unlocked clues
                            clueStatus[index] || index + 1 === clueNumber ? (
                                <div key={index} style={clueStatus[index] ? { ...styles.clueInput, ...styles.completed } : styles.clueInput}>
                                    <input
                                        type="text"
                                        placeholder={`Enter Clue ${index + 1} Link`}
                                        value={clueNumber === index + 1 ? clueLink : ''}
                                        onChange={(e) => setClueLink(e.target.value)}
                                        disabled={clueStatus[index]} // Disable input if the clue is correct
                                        required
                                        style={styles.inputField}
                                    />
                                    {clueStatus[index] && <span style={styles.checkmark}>✔️</span>}
                                </div>
                            ) : null
                        ))}

                        <button 
                            type="submit" 
                            onClick={handleClueSubmit} 
                            disabled={clueStatus[clueNumber - 1]} 
                            style={styles.submitButton}
                        >
                            Submit Clue
                        </button>

                        <p style={styles.messageText}>{message}</p>

                        {/* Show completion message when all clues are solved */}
                        {clueStatus[7] && <h2 style={styles.congratulations}>Congratulations! You have completed the game!</h2>}
                    </div>
                </div>
            ) : (
                <h1 style={styles.loginPrompt}>Please log in to participate in the treasure hunt.</h1>
            )}
        </div>
    );
};

const styles = {
    dashboardContainer: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '0 auto',
    },
    welcomeHeader: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
    },
    logoutButton: {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
    },
    clueHeader: {
        fontSize: '20px',
        color: '#333',
        marginTop: '20px',
    },
    clueInput: {
        margin: '10px 0',
    },
    inputField: {
        padding: '10px',
        width: '300px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    completed: {
        backgroundColor: '#d4edda',
        border: '2px solid #28a745',
        color: '#155724',
    },
    checkmark: {
        marginLeft: '10px',
        color: '#28a745',
        fontSize: '20px',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    messageText: {
        color: '#555',
    },
    congratulations: {
        fontSize: '20px',
        color: '#28a745',
        fontWeight: 'bold',
    },
    loginPrompt: {
        fontSize: '24px',
        color: '#333',
        textAlign: 'center',
    },
};

export default Dashboard;
