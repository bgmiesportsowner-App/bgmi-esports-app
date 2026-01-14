// src/pages/Register.jsx - COMPLETE FIX
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gamerTag: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState("");

  // 🔥 DIRECT MAIN BACKEND URL
  const API_BASE = 'https://bgmi-admin-panel.onrender.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // STEP 1: OTP generate - CORS FIXED
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.gamerTag.trim()) {
      setError("Please enter your in‑game name");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // 🔥 CORS + RENDER FIXED
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
        mode: 'cors',           // 🔥 FORCE CORS
        cache: 'no-cache',      // 🔥 BYPASS COLD START
        keepalive: true         // 🔥 KEEP ALIVE
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate OTP");
      }

      setMessage("OTP generated! Check mail or contact admin for code.");
      setStep("otp");
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.gamerTag.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password,
          code: otp.trim(),
        }),
        mode: 'cors',
        cache: 'no-cache'
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid or expired OTP");
      }

      localStorage.setItem(
        "bgmi_user",
        JSON.stringify({ user: data.user })
      );

      setMessage("Account created! Entering lobby...");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen register-screen">
      <div className="auth-bg-gradient" />
      <div className="auth-card">
        <div className="auth-logo-row">
          <h2 className="center-text">Register</h2>
        </div>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        {message && <div className="auth-alert auth-alert-success">{message}</div>}

        {step === "form" ? (
          <form className="auth-form" onSubmit={handleRegister}>
            <label className="auth-field">
              <span className="auth-label">In-game name</span>
              <input
                type="text"
                name="gamerTag"
                placeholder="Soul Goblin"
                value={formData.gamerTag}
                onChange={handleChange}
                required
                autoComplete="username"     // ✅ WARNING FIXED
              />
            </label>

            <label className="auth-field">
              <span className="auth-label">Email</span>
              <input
                type="email"
                name="email"
                placeholder="player@bgmi.gg"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"        // ✅ WARNING FIXED
              />
            </label>

            <div className="auth-grid-2">
              <label className="auth-field">
                <span className="auth-label">Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"  // ✅ WARNING FIXED
                />
              </label>

              <label className="auth-field">
                <span className="auth-label">Confirm</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"  // ✅ WARNING FIXED
                />
              </label>
            </div>

            <button
              id="btn"
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? "REGISTER..." : "REGISTER"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <label className="auth-field">
              <span className="auth-label">Enter OTP</span>
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? "VERIFYING..." : "VERIFY & CREATE ACCOUNT"}
            </button>
          </form>
        )}

        <div className="auth-footer-row">
          <span><h3>Already registered</h3></span>
          <Link to="/login" className="auth-link">
            <h3>Login</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
