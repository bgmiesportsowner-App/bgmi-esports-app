import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Email verified check
      if (!userCredential.user.emailVerified) {
        alert('⚠️ Pehle email verify kar! Inbox/spam check kar.');
        return;
      }

      // localStorage save (tera existing logic)
      localStorage.setItem("bgmi_user", JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        verified: true
      }));

      alert('✅ Login successful! Redirecting...');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') setError('User nahi mila!');
      else if (err.code === 'auth/wrong-password') setError('Galat password!');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: 400, margin: '80px auto', padding: 30, textAlign: 'center'}}>
      <h1 style={{color: '#ff4444', marginBottom: 30}}>🔐 BGMI Login</h1>
      {error && <div style={{background: '#ffebee', color: '#c62828', padding: 15, borderRadius: 8, marginBottom: 20}}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required style={inputStyle} />
        <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Login...' : 'Login ⚡'}</button>
      </form>
      
      <p style={{marginTop: 25}}>
        New? <a href="/register" style={{color: '#ff4444'}}>Register</a>
      </p>
    </div>
  );
};

const inputStyle = {width: '100%', padding: '15px', margin: '10px 0', borderRadius: 10, border: '2px solid #e0e0e0', boxSizing: 'border-box'};
const btnStyle = {width: '100%', padding: '15px', background: '#ff4444', color: 'white', border: 'none', borderRadius: 10, fontSize: 18};

export default Login;
