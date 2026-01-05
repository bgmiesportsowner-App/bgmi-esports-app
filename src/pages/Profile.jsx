import React, { useState, useEffect } from 'react';
import './Profile.css';

const API_URL = 'https://bgmi-api.onrender.com';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const usersRes = await fetch(`${API_URL}/admin/users`);
        const users = await usersRes.json();
        const userData = users[0] || { profile_id: 'BGMI-EB7XR', name: 'HX Profile' };
        
        setProfile({
          id: userData.profile_id || 'BGMI-EB7XR',
          name: userData.name || 'HX Profile',
          stats: {
            kdRatio: '5.2', winRate: '42%', totalMatches: '567',
            chickenDinners: '156', totalKills: '3,248', avgDamage: '289'
          }
        });
      } catch {
        setProfile({
          id: 'BGMI-EB7XR', name: 'HX Profile',
          stats: { kdRatio: '5.2', winRate: '42%', totalMatches: '567', chickenDinners: '156', totalKills: '3,248', avgDamage: '289' }
        });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) return <div className="loading">🔄 Loading...</div>;

  return (
    <div className="esports-profile">
      <header className="profile-header">
        <div className="player-card">
          {/* LEFT: Perfect Circular DP */}
          <div className="player-avatar">
            <div className="avatar-circle">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1e40af&color=fff&size=512`} alt="Gamer Avatar" />
            </div>
          </div>

          {/* RIGHT: Name + Profile ID */}
          <div className="player-details">
            <div className="name-row">
              <h1 className="gamer-name">{profile.name}</h1>
            </div>
            
            {/* Profile ID Inline */}
            <div className="id-row">
              <span className="id-label">Profile ID:</span>
              <strong className="id-value">{profile.id}</strong>
            </div>
          </div>
        </div>
      </header>

      <section className="stats-section">
        <h2>📊 Performance Stats</h2>
        <div className="stats-grid">
          <div className="stat-box"><div className="stat-value">{profile.stats.kdRatio}</div><div>K/D Ratio</div></div>
          <div className="stat-box"><div className="stat-value">{profile.stats.winRate}</div><div>Win Rate</div></div>
          <div className="stat-box"><div className="stat-value">{profile.stats.chickenDinners}</div><div>Chickens</div></div>
          <div className="stat-box"><div className="stat-value">{profile.stats.totalMatches}</div><div>Matches</div></div>
          <div className="stat-box"><div className="stat-value">{profile.stats.totalKills}</div><div>Total Kills</div></div>
          <div className="stat-box"><div className="stat-value">{profile.stats.avgDamage}</div><div>Avg Damage</div></div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
