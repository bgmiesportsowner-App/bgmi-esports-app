import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords match nahi kar rahe!');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      alert(`✅ Register successful ${email}! Email verify kar (spam bhi check kar!)`);
      window.location.href = '/login';
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ye email already registered hai! Login kar.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password strong kar (8+ characters)');
      } else {
        setError('Registration fail: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: 400, margin: '80px auto', padding: 30, textAlign: 'center'}}>
      <h1 style={{color: '#ff4444', marginBottom: 30}}>📝 BGMI Register</h1>
      
      {error && (
        <div style={{background: '#ffebee', color: '#c62828', padding: 12, borderRadius: 8, marginBottom: 20}}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div style={{marginBottom: 20}}>
          <input type="email" placeholder="Email ID" value={email} onChange={e=>setEmail(e.target.value)}
            required style={inputStyle} />
        </div>
        <div style={{marginBottom: 20}}>
          <input type="password" placeholder="Password (8+)" value={password} onChange={e=>setPassword(e.target.value)}
            minLength={8} required style={inputStyle} />
        </div>
        <div style={{marginBottom: 25}}>
          <input type="password" placeholder="Confirm Password" value={confirmPassword} 
            onChange={e=>setConfirmPassword(e.target.value)} required style={inputStyle} />
        </div>
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Register ho raha...' : 'Register Karo 🔥'}
        </button>
      </form>
      
      <p style={{marginTop: 25, color: '#666'}}>
        Already registered? <a href="/login" style={{color: '#ff4444', fontWeight: 'bold'}}>Login kar</a>
      </p>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '15px', borderRadius: 10, border: '2px solid #e0e0e0',
  fontSize: 16, boxSizing: 'border-box', background: 'white'
};

const btnStyle = {
  width: '100%', padding: '15px', background: '#ff4444', color: 'white',
  border: 'none', borderRadius: 10, fontSize: 18, fontWeight: 'bold', cursor: 'pointer'
};

export default Register;
