import React, { useState, useEffect } from 'react';
import { UserProfile, LeaderboardEntry, Achievement } from '../types/studentDashboard';

const StudentDashboard: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        id: '1',
        name: '',
        username: '',
        points: 0,
        itemsFound: 0,
        itemsReturned: 0,
        avatarUrl: 'https://placeholder.com/150x150'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);

    // Handle profile updates
    const handleProfileUpdate = (field: keyof UserProfile, value: string | number) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Toggle edit mode
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // Save profile changes
    const saveChanges = () => {
        // TODO: Implement API call to save changes
        setIsEditing(false);
    };

    return (
        <div className="student-dashboard">
            {/* Profile Section */}
            <section className="profile-section">
                <div className="avatar-container">
                    <img src={profile.avatarUrl} alt="Student Avatar" className="avatar" />
                    <button className="change-avatar-btn">Change Avatar</button>
                </div>

                <div className="profile-info">
                    {isEditing ? (
                        <> 
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => handleProfileUpdate('name', e.target.value)}
                                placeholder="Your Name"
                            />
                            <input
                                type="text"
                                value={profile.username}
                                onChange={(e) => handleProfileUpdate('username', e.target.value)}
                                placeholder="Username"
                            />
                            <button onClick={saveChanges}>Save Changes</button>
                        </>
                    ) : (
                        <>
                            <h2>{profile.name}</h2>
                            <p>@{profile.username}</p>
                            <button onClick={toggleEdit}>Edit Profile</button>
                        </>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stat-card">
                    <h3>Total Points</h3>
                    <p>{profile.points}</p>
                </div>
                <div className="stat-card">
                    <h3>Items Found</h3>
                    <p>{profile.itemsFound}</p>
                </div>
                <div className="stat-card">
                    <h3>Items Returned</h3>
                    <p>{profile.itemsReturned}</p>
                </div>
            </section>

            {/* Leaderboard Section */}
            <section className="leaderboard-section">
                <h2>Leaderboard</h2>
                <div className="leaderboard-list">
                    {leaderboard.map((entry, index) => (
                        <div key={index} className="leaderboard-entry">
                            <span className="rank">#{entry.rank}</span>
                            <span className="username">{entry.username}</span>
                            <span className="points">{entry.points} pts</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Achievements Section */}
            <section className="achievements-section">
                <h2>Achievements</h2>
                <div className="achievements-grid">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={`achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
                        >
                            <h3>{achievement.title}</h3>
                            <p>{achievement.description}</p>
                            <span className="points">+{achievement.points} pts</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;