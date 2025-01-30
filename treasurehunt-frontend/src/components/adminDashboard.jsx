import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [teamProgress, setTeamProgress] = useState([]);
    const [isSorted, setIsSorted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamProgress = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/team-progress`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setTeamProgress(response.data);
            } catch (error) {
                console.error('Error fetching team progress:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeamProgress();
    }, []);

    const sortedTeams = isSorted
        ? [...teamProgress].sort((a, b) => {
              const clue8A = a.progress.clue8.submissionTime ? new Date(a.progress.clue8.submissionTime) : null;
              const clue8B = b.progress.clue8.submissionTime ? new Date(b.progress.clue8.submissionTime) : null;
              if (clue8A && clue8B) return clue8A - clue8B;
              if (clue8A && !clue8B) return -1;
              if (!clue8A && clue8B) return 1;
              return 0;
          })
        : teamProgress;

    const handleSort = () => {
        setIsSorted(true);
    };

    const calculateProgress = (clue) => (clue?.isCorrect ? 100 : 0);

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    if (loading) {
        return (
            <div style={styles.dashboardContainer}>
                <h1 style={styles.header}>Admin Dashboard</h1>
                <div style={styles.loading}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={styles.dashboardContainer}>
            <h1 style={styles.header}>Admin Dashboard</h1>
            <button style={styles.sortButton} onClick={handleSort}>
                Sort by Clue 8 Submission Time
            </button>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Team ID</th>
                            {[...Array(8)].map((_, idx) => (
                                <th key={idx} style={styles.th}>Clue {idx + 1} Progress</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTeams.map((team) => (
                            <tr key={team.teamID} style={styles.tr}>
                                <td style={styles.td}>{team.teamID}</td>
                                {[...Array(8)].map((_, idx) => (
                                    <td key={idx} style={styles.td}>
                                        <div style={styles.progressBarContainer}>
                                            <div style={styles.progressLabel}>
                                                {formatTime(team.progress[`clue${idx + 1}`]?.submissionTime)}
                                            </div>
                                            <div
                                                style={{
                                                    ...styles.progressBar,
                                                    width: `${calculateProgress(team.progress[`clue${idx + 1}`])}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    dashboardContainer: {
        fontFamily: `'Roboto', sans-serif`,
        padding: '40px',
        backgroundColor: '#f9fafb',
        borderRadius: '10px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '1200px',
        margin: '40px auto',
        overflowX: 'auto',
    },
    header: {
        fontSize: '36px',
        color: '#2d3748',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center',
    },
    sortButton: {
        padding: '12px 24px',
        backgroundColor: '#3182ce',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'block',
        margin: '0 auto 30px',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    tableContainer: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
        marginTop: '20px',
        minWidth: '800px',
    },
    th: {
        backgroundColor: '#4A5568',
        color: 'white',
        padding: '12px',
        textAlign: 'left',
    },
    tr: {
        borderBottom: '1px solid #E2E8F0',
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#f7fafc',
    },
    progressBarContainer: {
        width: '100%',
        backgroundColor: '#e2e8f0',
        borderRadius: '6px',
        height: '20px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressLabel: {
        fontSize: '12px',
        color: '#2d3748',
        textAlign: 'center',
        fontWeight: 'bold',
        position: 'absolute',
        width: '100%',
    },
    progressBar: {
        backgroundColor: '#48bb78',
        height: '100%',
        borderRadius: '6px',
        transition: 'width 0.4s ease',
    },
    loading: {
        fontSize: '24px',
        color: '#2d3748',
        fontWeight: '600',
        textAlign: 'center',
    },
};

export default AdminDashboard;
