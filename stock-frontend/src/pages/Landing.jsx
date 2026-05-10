import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Subtle background overlay */}
      <div className="grid-overlay"></div>

      <nav className="simple-nav">
        <div className="logo">Stock<span>AI</span></div>
        <div className="nav-auth">
          <button className="nav-link" onClick={() => navigate("/signin")}>Login</button>
          <button className="nav-btn-sm" onClick={() => navigate("/signup")}>Get Started</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-card">
          <span className="badge">Powered by Machine Learning</span>
          <h1>
            Predict the Market <br /> 
            <span className="highlight">with Confidence</span>
          </h1>
          <p>
            Leverage advanced AI models to analyze Yahoo Finance data and 
            stay ahead of market trends with real-time insights.
          </p>

          <div className="button-group">
            <button
              className="btn-primary"
              onClick={() => navigate("/signup")}
            >
              Start Predicting
            </button>
            <button
              className="btn-outline"
              onClick={() => navigate("/signin")}
            >
              View Live Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}