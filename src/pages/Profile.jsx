import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/users`);
      const userData = res.data.find(u => u.profile_id === profileId);
      setUser(userData);
      setFormData({
        name: userData?.name || '',
        email: userData?.email || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => setEditMode(!editMode);
  const handleSave = () => {
    setUser({ ...user, ...formData });
    setEditMode(false);
  };

  if (loading) return (
    <div className="profile-loading">
      <div className="spinner"></div>
      <p>Loading Player Stats...</p>
    </div>
  );

  return (
    <div className="profile-container">
      {/* Header Bar */}
      <header className="profile-header">
        <div className="header-left">
          <h1>{user?.name || 'Player'}</h1>
          <span className="player-id">#{profileId}</span>
        </div>
        <button className="edit-btn" onClick={toggleEdit}>
          {editMode ? '✅ Save' : '✏️ Edit'}
        </button>
      </header>

      {/* Avatar + Rank */}
      <div className="profile-hero">
        <div className="avatar-container">
          <img 
            src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${profileId}`} 
            alt="Player" 
            className="player-avatar"
          />
          <div className="rank-badge">PRO</div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">4.8</span>
            <span className="stat-label">K/D</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">1.2K</span>
            <span className="stat-label">Kills</span>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="info-cards">
        <div className="info-card">
          <label>Email</label>
          {editMode ? (
            <input 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="edit-field"
            />
          ) : (
            <span className="info-value">{user?.email}</span>
          )}
        </div>
        <div className="info-card">
          <label>Joined</label>
          <span className="info-value">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('hi-IN') : 'Today'}
          </span>
        </div>
      </div>

      {/* Stats Grid - Mobile Swipe Style */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🏆</div>
          <div className="stat-main">47</div>
          <div className="stat-sub">Wins</div>
        </div>
        <div className="stat-card secondary">
          <div className="stat-icon">🔥</div>
          <div className="stat-main">#12</div>
          <div className="stat-sub">Rank</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-icon">⚔️</div>
          <div className="stat-main">89%</div>
          <div className="stat-sub">Win Rate</div>
        </div>
      </div>

      {/* Recent Matches - Mobile Cards */}
      <div className="matches-section">
        <h3>Recent Matches</h3>
        <div className="matches-list">
          <div className="match-card win">
            <div className="match-header">
              <span>TDM #45</span>
              <span className="match-result">WINNER</span>
            </div>
            <div className="match-stats">
              <span>18 Kills</span>
              <span>2nd Place</span>
            </div>
          </div>
          <div className="match-card loss">
            <div className="match-header">
              <span>Classic Squads</span>
              <span className="match-result">Top 5</span>
            </div>
            <div className="match-stats">
              <span>12 Kills</span>
              <span>5th Place</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-btn primary">Join Tournament</button>
        <button className="action-btn secondary">View Full Stats</button>
      </div>
    </div>
  );
};

export default Profile;
