import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Signup failed");
        return;
      }

      setSuccess("Signup successful! Please sign in.");

      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err) {
      setError("Backend not reachable");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <p className="auth-sub">Create your StockAI account</p>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <button className="primary-btn" onClick={handleSignup}>
          Sign Up
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/signin")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}