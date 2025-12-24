// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const API_BASE = "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gamerTag: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = details, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setMessage("OTP sent to your email. Please check inbox/spam.");
      setStep(2);
    } catch (err) {
      setError(err.message || "Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || otp.length !== 6) {
      setError("Please enter 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.gamerTag,
          email: formData.email,
          password: formData.password,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      localStorage.setItem("bgmi_user", JSON.stringify(data.user));
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen register-screen">
      <div className="auth-bg-gradient" />

      <div className="auth-card">
        <div className="auth-logo-row">
          <div className="auth-logo-circle">BG</div>
          <span className="auth-logo-title">BGMI ESPORTS HUB</span>
        </div>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-subtitle">
          Save your squads, scrims and tournament history in one profile.
        </p>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        {message && (
          <div className="auth-alert auth-alert-success">{message}</div>
        )}

        {step === 1 && (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <label className="auth-field">
              <span className="auth-label">In-game name</span>
              <input
                type="text"
                name="gamerTag"
                placeholder="Soul Goblin"
                value={formData.gamerTag}
                onChange={handleChange}
                required
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
                />
              </label>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? "SENDING OTP..." : "SEND OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <label className="auth-field">
              <span className="auth-label">Enter 6-digit OTP</span>
              <input
                type="text"
                name="otp"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
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

            <button
              type="button"
              className="auth-btn-secondary"
              onClick={handleSendOtp}
              disabled={loading}
            >
              RESEND OTP
            </button>
          </form>
        )}

        <div className="auth-footer-row">
          <span>Already registered?</span>
          <Link to="/login" className="auth-link">
            Login to lobby
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
