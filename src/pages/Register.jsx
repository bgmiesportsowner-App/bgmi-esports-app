import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";
import { supabase } from "../supabaseClient";
import './Register.css';

// 🔥 PRODUCTION READY - Correct Render URL
const API_URL = import.meta.env.VITE_API_URL || "https://main-server-firebase.onrender.com";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");  // ✅ New State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Password Match Validation
    if (password !== confirmPassword) {
      setError("❌ Passwords match nahi kar rahe!");
      setLoading(false);
      return;
    }

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("❌ Sab fields bharo!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("🔒 Password 6+ characters ka hona chahiye!");
      setLoading(false);
      return;
    }

    try {
      // 1. Firebase Auth ✅
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      console.log("✅ Firebase UID:", userCredential.user.uid);

      // 2. PRODUCTION SERVER URL ✅
      console.log("📤 Calling:", `${API_URL}/api/register`);
      const serverRes = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(),
          username: username.trim(),
          password: password.trim(),
          uid: userCredential.user.uid
        }),
      });

      const serverData = await serverRes.json();
      console.log("✅ Server:", serverData);
      
      if (!serverData.success) {
        throw new Error(serverData.error || "Server failed");
      }

      // 3. IST Time
      const now = new Date();
      const istTime = now.toLocaleDateString('en-GB', { 
        timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('en-IN', { 
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true 
      });

      // 4. Frontend Supabase backup (CORRECT SYNTAX!)
      try {
        const { error: supabaseError } = await supabase
          .from("registeruser")
          .insert([{
            uid: userCredential.user.uid,
            profile_id: serverData.user.profile_id,
            username: username.trim(),
            email: email.toLowerCase().trim(),
            "User Password": password.trim(),
            verified: false,
            balance: serverData.user.balance || 0,
            token: serverData.user.token || "",
            register_time_ist: istTime
          }]);
        
        if (supabaseError) {
          console.log("⚠️ Frontend backup failed (OK):", supabaseError.message);
        }
      } catch (supabaseErr) {
        console.log("⚠️ Frontend Supabase backup failed (non-critical):", supabaseErr.message);
      }

      // 5. LocalStorage + SUCCESS
      localStorage.setItem("bgmi_user", JSON.stringify({
        uid: userCredential.user.uid,
        username: username.trim(),
        email: email.toLowerCase().trim(),
        profile_id: serverData.user.profile_id,
        verified: false,
        balance: 0
      }));

      console.log("🎉 FULL SUCCESS:", serverData.user.profile_id);
      alert(`✅ Account Ready! ID: ${serverData.user.profile_id}\nTime: ${istTime}`);
      setTimeout(() => window.location.href = "/login", 2000);

    } catch (err) {
      console.error("❌ Register error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("👤 Email already registered!");
      } else if (err.code === "auth/weak-password") {
        setError("🔒 Password 6+ chars ka karo!");
      } else {
        setError(err.message || "Registration failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-header">
          <div className="bgmi-logo">🎮</div>
          <h2 className="register-title">BGMI Register</h2>
          <p className="register-subtitle">Join the ultimate BGMI platform</p>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="🎮 Username (admin123)"
              autocomplete="username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="input-field"
            />
          </div>
          
          <div className="input-group">
            <input 
              type="email" 
              placeholder="📧 Email"
              autocomplete="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="input-field"
            />
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              placeholder="🔒 Password (6+ chars)"
              autocomplete="new-password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
              className="input-field"
            />
          </div>

          {/* ✅ NEW CONFIRM PASSWORD FIELD */}
          <div className="input-group">
            <input 
              type="password" 
              placeholder="🔐 Confirm Password"
              autocomplete="new-password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              minLength={6}
              className="input-field"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="register-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "🔥 Create Account"
            )}
          </button>
        </form>

        <div className="register-footer">
          <p className="login-link">
            Already registered? <a href="/login" className="login-btn">Login Now</a>
          </p>
          <div className="features">
            <span>✅ Secure Firebase Auth</span>
            <span>✅ Instant Email Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
