import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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
        username: freshUser.username,           // Akash (register time wala)
        email: firebaseEmail,
        profile_id: freshUser.profile_id,       // BGMI-8535 ✅ (NO FALLBACK!)
        verified: true,
        balance: freshUser.balance || 0,
        backend_token: freshUser.token
      };

      // 🔥 STEP 4: LOCALSTORAGE FRESH DATA SE UPDATE
      localStorage.setItem("bgmi_user", JSON.stringify(userData));
      sessionStorage.setItem("bgmi_user", JSON.stringify(userData));
      
      console.log("✅ LOGIN FRESH SUCCESS:", userData);
      console.log("🔥 SAVED BGMI ID:", userData.profile_id); // BGMI-8535 ✅
      
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
    <div style={{ 
      maxWidth: 400, margin: "80px auto", padding: 30, 
      borderRadius: 10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#ff4444", marginBottom: 20 }}>
        🔐 BGMI Login
      </h2>
      
      {error && (
        <div style={{ 
          color: "#ff4444", padding: 10, background: "#fee", 
          borderRadius: 5, marginBottom: 15, textAlign: "center"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email" 
          placeholder="📧 Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required
          style={{
            width: "100%", padding: 12, margin: "10px 0", borderRadius: 6,
            border: "1px solid #ccc", boxSizing: "border-box"
          }}
        />
        <input
          type="password" 
          placeholder="🔒 Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required
          style={{
            width: "100%", padding: 12, margin: "10px 0", borderRadius: 6,
            border: "1px solid #ccc", boxSizing: "border-box"
          }}
        />
        <button type="submit" disabled={loading}
          style={{
            width: "100%", padding: 12, 
            background: loading ? "#ccc" : "#ff4444", color: "white",
            border: "none", borderRadius: 6, cursor: "pointer", fontSize: 16
          }}>
          {loading ? "⏳ Logging in..." : "🚀 Login & Get BGMI ID"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20 }}>
        New player? <a href="/register" style={{ color: "#ff4444", fontWeight: "bold" }}>Register</a>
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
        style={{
          width: "100%", padding: 8, marginTop: 10,
          background: "#28a745", color: "white", border: "none", 
          borderRadius: 4, cursor: "pointer", fontSize: 12
        }}
      >
        🔍 Check Backend Users
      </button>
    </div>
  );
};

export default Login;
