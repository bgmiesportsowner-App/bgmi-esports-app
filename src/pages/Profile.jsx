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
      if (userData) setFormData({
        name: userData.name,
        email: userData.email
      });
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    if (user) setFormData({ name: user.name, email: user.email });
  };
  const handleSave = async () => {
    try {
      setUser({ ...user, ...formData });
      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) return <div className="loading">Loading Profile...</div>;

  return (
    <div className="player-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileId}`} alt="Avatar" />
          <div className="avatar-glow"></div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">
            {editMode ? (
              <input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="edit-input"
              />
            ) : user?.name}
          </h1>
          <div className="profile-id">ID: <strong>{profileId}</strong></div>
          <div className="profile-actions-header">
            {editMode ? (
              <>
                <button onClick={handleSave} className="btn-save">💾 Save</button>
                <button onClick={handleCancel} className="btn-cancel">❌ Cancel</button>
              </>
            ) : (
              <button onClick={handleEdit} className="btn-edit">✏️ Edit Profile</button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="stat-card kills">
          <div className="stat-icon">🔫</div>
          <div className="stat-number">1,247</div>
          <div className="stat-label">Total Kills</div>
        </div>
        <div className="stat-card wins">
          <div className="stat-icon">🏆</div>
          <div className="stat-number">47</div>
          <div className="stat-label">Wins</div>
        </div>
        <div className="stat-card kd">
          <div className="stat-icon">⚡</div>
          <div className="stat-number">4.8</div>
          <div className="stat-label">K/D Ratio</div>
        </div>
        <div className="stat-card rank">
          <div className="stat-icon">👑</div>
          <div className="stat-number">#12</div>
          <div className="stat-label">Global Rank</div>
        </div>
      </div>

      <div className="profile-details-grid">
        <div className="detail-card contact">
          <h3>📧 Account Details</h3>
          <div className="detail-row">
            <span>Email:</span>
            {editMode ? (
              <input 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="edit-input-small"
              />
            ) : (
              <strong>{user?.email}</strong>
            )}
          </div>
          <div className="detail-row">
            <span>Joined:</span>
            <strong>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recent'}</strong>
          </div>
          <div className="detail-row">
            <span>Profile ID:</span>
            <code>{profileId}</code>
          </div>
        </div>

        <div className="detail-card tournaments">
          <h3>🏆 Recent Tournaments</h3>
          <div className="tournaments-list">
            <div className="tournament-item gold">
              <span>TDM Championship</span>
              <span className="t-rank">#1</span>
            </div>
            <div className="tournament-item silver">
              <span>Classic Squads S2</span>
              <span className="t-rank">#3</span>
            </div>
            <div className="tournament-item">
              <span>Scrim #47</span>
              <span className="t-rank">Top 10</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-primary large">📤 Share Profile</button>
        <button className="btn-secondary large">📊 Full Stats</button>
        <button className="btn-danger large">⚠️ Report</button>
      </div>
    </div>
  );
};

export default Profile;
