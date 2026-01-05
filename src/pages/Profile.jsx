import React, { useState, useEffect } from 'react';
import './Profile.css';

// ✅ Confirmed Render URL [memory:43]
const API_URL = 'https://bgmi-api.onrender.com';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      console.log('🔄 Testing API:', API_URL);
      
      try {
        // Health check ✅ [attached_file:1]
        const healthRes = await fetch(`${API_URL}/`);
        const healthData = await healthRes.json();
        console.log('✅ Server OK:', healthData);

        if (!healthRes.ok) throw new Error('Server down');

        // Get users [file:51]
        const usersRes = await fetch(`${API_URL}/admin/users`);
        const users = await usersRes.json();
        console.log('✅ Users:', users);

        if (users && users.length > 0) {
          const user = users[0];  // First user
          setProfile({
            id: user.profile_id || 'BGMI-LOADING',
            name: user.name || 'Player',
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
          setEditName(user.name);
          console.log('✅ Profile LOADED:', user.profile_id);
        } else {
          // Auto create demo user
          console.log('🚀 Creating demo user...');
          const demoRes = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'demo@bgmi.com',
              code: '000000',
              name: 'Demo Player',
              password: 'demo123'
            })
          });
          
          if (demoRes.ok) {
            const usersRes2 = await fetch(`${API_URL}/admin/users`);
            const users2 = await usersRes2.json();
            const user = users2[0];
            setProfile({
              id: user.profile_id,
              name: user.name,
              stats: {
                kdRatio: '5.2',
                winRate: '42%',
                totalMatches: '567',
                chickenDinners: '156',
                totalKills: '3,248',
                avgDamage: '289'
              },
              recentTournaments: ['Demo Tournament']
            });
            console.log('✅ Demo user created:', user.profile_id);
          } else {
            setError('Demo creation failed - register manually');
          }
        }
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const saveName = () => {
    if (profile) setProfile({ ...profile, name: editName });
    setEditingName(false);
  };

  const cancelEdit = () => {
    setEditName(profile?.name || '');
    setEditingName(false);
  };

  if (loading) return <div className="loading">Loading Profile...</div>;
  if (error) return (
    <div className="error">
      ❌ {error}
      <br/>F12 Console check karo
    </div>
  );

  return (
    <div className="esports-profile">
      <header className="profile-header">
        <div className="player-card">
          <div className="player-avatar">
            <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=1e40af&color=fff&size=140`} alt="Avatar" />
          </div>
          <div className="player-details">
            <div className="name-row">
              {editingName ? (
                <>
                  <input 
                    value={editName} 
                    onChange={e => setEditName(e.target.value)} 
                    className="name-input" 
                    autoFocus 
                  />
                  <button onClick={saveName} className="btn-save">Save</button>
                  <button onClick={cancelEdit} className="btn-cancel">Cancel</button>
                </>
              ) : (
                <>
                  <h1>{profile.name}</h1>
                  <button className="btn-edit" onClick={() => setEditingName(true)}>Edit</button>
                </>
              )}
            </div>
            <div className="player-id">
              **Profile ID: {profile.id}**  // YE BGMI-XXXXX HAI!
            </div>
          </div>
        </div>
      </header>

      <section className="stats-section">
        <h2>Performance Stats</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{profile.stats.kdRatio}</div>
            <div>K/D Ratio</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.winRate}</div>
            <div>Win Rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.chickenDinners}</div>
            <div>Chickens</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.totalMatches}</div>
            <div>Matches</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.totalKills}</div>
            <div>Kills</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{profile.stats.avgDamage}</div>
            <div>Damage</div>
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
