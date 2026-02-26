import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/settings.css";

export default function Settings({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* PROFILE */}
      <div className="settings-card">
        <h3>◎ Profile</h3>
        <p>Name: {user?.name || "User"}</p>
        <p>Email: {user?.email || "Not available"}</p>
      </div>

      {/* FEEDBACK */}
      <div
        className="settings-card"
        style={{ cursor: "pointer" }}
        onClick={() => setShowQR(!showQR)}
      >
        <h3>◈ Feedback</h3>
        <p>Click to {showQR ? "hide" : "view"} QR code</p>

        {showQR && (
          <div className="qr-box">
            <img
              src={`${window.location.origin}/feedback-qr.png`}
              alt="Feedback QR"
              width="160"
            />
            <p>Scan to submit feedback</p>
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <div className="settings-card">
        <h3>⇦ Logout</h3>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            onLogout();
            navigate("/signin"); // ✅ redirect after logout
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}