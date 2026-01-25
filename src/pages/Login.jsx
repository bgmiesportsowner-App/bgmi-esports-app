import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("🚀 Login started:", email);

    try {
      // 🔥 STEP 1: Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        alert("⚠️ Email verify karo! Inbox/spam check kar.");
        return;
      }

      const firebaseEmail = userCredential.user.email;
      console.log("✅ Firebase login:", firebaseEmail);

      // 🔥 STEP 2: SERVER SE FRESH DATA (SINGLE API CALL!)
      console.log("🔄 Fetching FRESH user data from SERVER...");
      const loginRes = await fetch("https://main-server-firebase.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: firebaseEmail.toLowerCase().trim() })
      });

      const serverData = await loginRes.json();
      console.log("🔍 SERVER LOGIN RESPONSE:", serverData);

      if (!serverData.success) {
        throw new Error("User not found in our system");
      }

      // 🔥 STEP 3: FRESH SERVER DATA SAVE (NO LOCALSTORAGE HACKS!)
      const freshUser = serverData.user;
      const userData = {
        uid: userCredential.user.uid,
        username: freshUser.username,
        email: firebaseEmail,
        profile_id: freshUser.profile_id,
        verified: true,
        balance: freshUser.balance || 0,
        backend_token: freshUser.token
      };

      // 🔥 STEP 4: LOCALSTORAGE FRESH DATA SE UPDATE
      localStorage.setItem("bgmi_user", JSON.stringify(userData));
      sessionStorage.setItem("bgmi_user", JSON.stringify(userData));
      
      console.log("✅ LOGIN FRESH SUCCESS:", userData);
      console.log("🔥 SAVED BGMI ID:", userData.profile_id);
      
      alert(`✅ Welcome ${freshUser.username}! ID: ${freshUser.profile_id}`);
      
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);

    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found") {
        setError("👤 User nahi mila! Register karo.");
      } else if (err.code === "auth/wrong-password") {
        setError("🔒 Galat password!");
      } else {
        setError("Login fail! Pehle register karo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <div className="bgmi-logo">🔐</div>
          <h2 className="login-title">BGMI Login</h2>
          <p className="login-subtitle">Access your BGMI profile instantly</p>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email" 
              placeholder="📧 Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <input
              type="password" 
              placeholder="🔒 Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="input-field"
            />
          </div>
          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging In...
              </>
            ) : (
              "🚀 Login & Get BGMI ID"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="register-link">
            New player? <a href="/register" className="register-btn">Register Now</a>
          </p>

          {/* 🔥 PRODUCTION DEBUG BUTTON */}
          <button 
            type="button"
            onClick={async () => {
              console.log("🔍 Storage:", localStorage.getItem("bgmi_user"));
              try {
                const res = await fetch("https://main-server-firebase.onrender.com/api/admin/users");
                const data = await res.json();
                console.log("🔍 Backend Users:", data);
              } catch(e) {
                console.log("Backend check failed");
              }
            }}
            className="debug-button"
          >
            🔍 Check Backend Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
