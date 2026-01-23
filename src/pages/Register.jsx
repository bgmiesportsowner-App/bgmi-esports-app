import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      
      // 🔥 USERNAME FIELD SE SAVE!
      const userData = {
        uid: userCredential.user.uid,
        username: username,  // 🔥 REGISTER FORM KA USERNAME!
        email: email,
        profile_id: `user_${userCredential.user.uid.slice(0, 8)}`,
        verified: false
      };

      localStorage.setItem("bgmi_user", JSON.stringify(userData));
      sessionStorage.setItem("bgmi_user", JSON.stringify(userData));
      
      console.log("✅ Registered:", userData);
      alert("✅ Account created! Email verify karo phir login karo.");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err) {
      console.error("Register error:", err.code);
      if (err.code === "auth/email-already-in-use") setError("👤 Email already registered!");
      else if (err.code === "auth/weak-password") setError("🔒 Password 6+ chars ka karo!");
      else setError("Registration failed!");
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
        📝 BGMI Register
      </h2>
      
      {error && (
        <div style={{ color: "#ff4444", padding: 10, background: "#fee", borderRadius: 5, marginBottom: 15 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="🎮 Username (leyonev264)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%", padding: 12, margin: "10px 0", borderRadius: 6,
            border: "1px solid #ccc", boxSizing: "border-box"
          }}
        />
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
          placeholder="🔒 Password (6+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
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
          {loading ? "⏳ Creating..." : "🔥 Register"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20 }}>
        Already registered? <a href="/login" style={{ color: "#ff4444", fontWeight: "bold" }}>Login</a>
      </p>
    </div>
  );
};

export default Register;
