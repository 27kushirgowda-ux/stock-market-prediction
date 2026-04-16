import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/settings.css";

export default function Settings({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("user");
    onLogout();
    navigate("/signin");
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      {/* PROFILE */}
      <div className="settings-card">
        <h3>👤 Profile</h3>
        <div className="profile-info">
          <p><span>Name:</span> {user?.name || "User"}</p>
          <p><span>Email:</span> {user?.email || "Not available"}</p>
        </div>
      </div>

      {/* FEEDBACK */}
      <div className="settings-card">
        <div
          className="feedback-header"
          onClick={() => setShowQR(!showQR)}
        >
          <h3>💬 Feedback</h3>
          <span>{showQR ? "▲" : "▼"}</span>
        </div>

        {showQR && (
          <div className="qr-box">
            <img
              src={`${window.location.origin}/feedback-qr.png`}
              alt="Feedback QR"
            />
            <p>Scan to submit feedback</p>
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <div className="settings-card danger">
        <h3>🚪 Logout</h3>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}