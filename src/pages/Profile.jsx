import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');

  // Backend URL - Render pe change kar dena
  const API_URL = 'http://localhost:5000';  // Ya https://bgmi-api.onrender.com

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');  // Login se save: localStorage.setItem('userId', data.user.id)
        if (!userId) {
          setError('Login first');
          return;
        }

        const res = await fetch(`${API_URL}/profile/${userId}`);
        const data = await res.json();

        if (res.ok) {
          // Backend se real data + default stats
          setProfile({
            id: data.profile_id,  // Dynamic BGMI-XXXXX
            name: data.name,
            stats: {
              kdRatio: '5.2',
              winRate: '42%',
              totalMatches: '567',
              chickenDinners: '156',
              totalKills: '3,248',
              avgDamage: '289'
            },
            recentTournaments: ['BGMI Pro Series', 'India Open', 'Weekly Clash']
          });
          setEditName(data.name);
        } else {
          setError(data.error || 'Profile not found');
        }
      } catch (err) {
        setError('Server error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const saveName = async () => {
    // TODO: Backend update endpoint banao baad mein
    if (profile) {
      setProfile({ ...profile, name: editName });
    }
    setEditingName(false);
  };

  const cancelEdit = () => {
    setEditName(profile?.name || '');
    setEditingName(false);
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <div className="esports-profile">
      <header className="profile-header">
        <div className="player-card">
          <div className="player-avatar">
            <div className="avatar-circle">
              <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=1e40af&color=ffffff&size=140&rounded=true&bold=true`} alt="Player" />
            </div>
          </div>
          <div className="player-details">
            <div className="name-row">
              {editingName ? (
                <div className="edit-input-group">
                  <input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="name-input"
                    autoFocus
                  />
                  <div className="edit-buttons">
                    <button onClick={saveName} className="btn-save">Save</button>
                    <button onClick={cancelEdit} className="btn-cancel">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h1>{profile.name}</h1>
                  <button className="btn-edit-name" onClick={() => setEditingName(true)}>
                    Edit
                  </button>
                </>
              )}
            </div>
            <div className="player-id">Profile ID: {profile.id}</div>  {/* Dynamic ID */}
          </div>
        </div>
      </header>

      <section className="stats-section">
        <h2>Performance Stats</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{profile.stats.kdRatio}</div>
            <div className="stat-label">K/D Ratio</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.winRate}</div>
            <div className="stat-label">Win Rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.chickenDinners}</div>
            <div className="stat-label">Chicken Dinners</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.totalMatches}</div>
            <div className="stat-label">Total Matches</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.totalKills}</div>
            <div className="stat-label">Total Kills</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.avgDamage}</div>
            <div className="stat-label">Avg Damage</div>
          </div>
        </div>
      </section>

      <section className="tournaments-section">
        <h2>Recent Tournaments</h2>
        <div className="tournaments-list">
          {profile.recentTournaments.map((tournament, index) => (
            <div key={index} className="tournament-item">
              {tournament}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
