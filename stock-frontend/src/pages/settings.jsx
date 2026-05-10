import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, ShieldCheck, MessageSquare, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/settings.css";

export default function Settings() {
  const { user, logout } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/signin");
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </header>

      {/* PROFILE CARD */}
      <div className="settings-card">
        <div className="card-top">
          <User size={20} color="#22c55e" />
          <h3>Account Profile</h3>
        </div>
        
        <div className="profile-list">
          <div className="profile-row">
            <span className="label"><User size={14} /> Name</span>
            <span className="value">{user?.displayName || "kushi"}</span>
          </div>
          <div className="profile-row">
            <span className="label"><Mail size={14} /> Email</span>
            <span className="value">{user?.email || "kushi@gmail.com"}</span>
          </div>
          <div className="profile-row">
            <span className="label"><ShieldCheck size={14} /> Status</span>
            <span className="value status-tag">Verified Account</span>
          </div>
        </div>
      </div>

      {/* FEEDBACK CARD */}
      <div className="settings-card clickable" onClick={() => setShowQR(!showQR)}>
        <div className="card-top">
          <div className="title-group">
            <MessageSquare size={20} color="#3b82f6" />
            <h3>Feedback & Support</h3>
          </div>
          <ChevronDown size={20} className={showQR ? "rotate" : ""} />
        </div>
        {showQR && (
          <div className="qr-reveal">
            <div className="qr-box">
              <img src="/feedback-qr.png" alt="QR" />
              <p>Scan to help us improve</p>
            </div>
          </div>
        )}
      </div>

      {/* DANGER ZONE */}
      <div className="settings-card danger">
        <div className="card-top">
          <LogOut size={20} color="#f87171" />
          <h3>Session Management</h3>
        </div>
        <p className="card-subtext">Signing out will end your current active session on this device.</p>
        <button className="logout-action-btn" onClick={handleLogout}>
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}