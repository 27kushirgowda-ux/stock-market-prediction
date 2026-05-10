import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { User, Mail, Lock, UserPlus } from "lucide-react"; 
import "../styles/auth.css";

export default function Signup() {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Navigate to home after successful registration
      navigate("/home");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join <span className="brand-accent">StockAI</span> to start analyzing</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="input-field">
            <User className="input-icon" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating Profile..." : "Create Account"}
            {!loading && <UserPlus size={18} />}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/signin")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}