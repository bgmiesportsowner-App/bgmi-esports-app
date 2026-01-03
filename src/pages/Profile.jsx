import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ wins: 0, kills: 0, kd: 0, rank: 'Unranked' });
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // User data
      const userRes = await axios.get(`${API_BASE}/admin/users`);
      const userData = userRes.data.find(u => u.profile_id === profileId);
      setUser(userData);
      setFormData({
        name: userData?.name || '',
        email: userData?.email || ''
      });

      // Tournament stats for this player
      const tourRes = await axios.get(`${API_BASE}/tournaments`);
      const playerTournaments = tourRes.data.filter(t => 
        t.players?.some(p => p.profile_id === profileId)
      );
      setTournaments(playerTournaments.slice(0, 5)); // Recent 5

      // Calculate stats
      const totalKills = playerTournaments.reduce((sum, t) => sum + (t.kills?.[profileId] || 0), 0);
      const wins = playerTournaments.filter(t => t.winner === profileId).length;
      const kd = totalKills > 0 ? (totalKills / playerTournaments.length).toFixed(1) : 0;
      setStats({ 
        wins, 
        kills: totalKills, 
        kd, 
        rank: wins > 10 ? 'PRO' : wins > 3 ? 'ACE' : 'ROOKIE' 
      });

    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => setEditMode(!editMode);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API_BASE}/admin/users/${profileId}`, formData);
      setUser({ ...user, ...formData });
      setEditMode(false);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <span className="player-id">BGMI #{profileId}</span>
        </div>
        <button className="edit-btn" onClick={toggleEdit} disabled={saving}>
          {saving ? '💾 Saving...' : editMode ? '✅ Save' : '✏️ Edit'}
        </button>
      </header>

      {/* Avatar + Quick Stats */}
      <div className="profile-hero">
        <div className="avatar-container">
          <img 
            src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${profileId}`} 
            alt="Player Avatar" 
            className="player-avatar"
          />
          <div className="rank-badge">{stats.rank}</div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.kd}</span>
            <span className="stat-label">K/D</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.kills.toLocaleString()}</span>
            <span className="stat-label">Total Kills</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.wins}</span>
            <span className="stat-label">Wins</span>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="info-cards">
        <div className="info-card">
          <label>Email</label>
          {editMode ? (
            <input 
              name="email"
              value={formData.email} 
              onChange={handleInputChange}
              className="edit-field"
            />
          ) : (
            <span className="info-value">{user?.email}</span>
          )}
        </div>
        <div className="info-card">
          <label>Joined</label>
          <span className="info-value">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('hi-IN') : 'Recent'}
          </span>
        </div>
        <div className="info-card">
          <label>Tournaments</label>
          <span className="info-value">{tournaments.length}</span>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="matches-section">
        <h3>Recent Tournaments</h3>
        {tournaments.length > 0 ? (
          <div className="matches-list">
            {tournaments.map((t, i) => (
              <div key={i} className={`match-card ${t.winner === profileId ? 'win' : 'loss'}`}>
                <div className="match-header">
                  <span>{t.type} #{t.id}</span>
                  <span className="match-result">
                    {t.winner === profileId ? 'WINNER' : `Top ${t.players.findIndex(p => p.profile_id === profileId) + 1}`}
                  </span>
                </div>
                <div className="match-stats">
                  <span>{t.kills?.[profileId] || 0} Kills</span>
                  <span>{new Date(t.date).toLocaleDateString('hi-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-matches">No tournaments yet. Join one! 🎮</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-btn primary">🏆 Join Next TDM</button>
        <button className="action-btn secondary">📊 Full Stats</button>
      </div>
    </div>
  );
};

export default Profile;
