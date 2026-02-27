import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Signin({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignin = async () => {
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid credentials");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user_id,
          name: data.name,
          email: data.email,
        })
      );

      onLogin && onLogin();
      navigate("/home");
    } catch (err) {
      setError("Backend not reachable");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Sign In</h2>
        <p className="auth-sub">Access your stock analysis dashboard</p>

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

        <button className="primary-btn" onClick={handleSignin}>
          Sign In
        </button>
      </div>
    </div>
  );
}
