import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="hero">
        <div className="hero-text">
          <h4>AI-POWERED STOCK ANALYSIS</h4>

          <h1>
            Smarter Stock Decisions <br />
            Using AI & Market Data
          </h1>

          <p>
            Analyze stocks using real-time and historical data from Yahoo Finance.
          </p>

          <div className="landing-buttons">
            <button
              className="landing-btn primary"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </button>

            <button
              className="landing-btn secondary"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
