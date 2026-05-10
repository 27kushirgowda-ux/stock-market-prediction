import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { Mail, Lock, LogIn } from "lucide-react"; // Adding icons for a pro look
import "../styles/auth.css";

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Updated to match your main landing page
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("Access denied. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your <span className="brand-accent">StockAI</span> account</p>
        </div>

        <form onSubmit={handleSignin} className="auth-form">
          <div className="input-field">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-field">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-toast">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
            {!loading && <LogIn size={18} />}
          </button>
        </form>

        <p className="auth-footer">
          New to StockAI?{" "}
          <span className="link" onClick={() => navigate("/signup")}>
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}