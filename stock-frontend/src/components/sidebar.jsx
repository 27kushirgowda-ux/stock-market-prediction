import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* TOP */}
      <div className="sidebar-top">
        <span className="logo">{collapsed ? "AI" : "StockAI"}</span>

        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className={`arrow ${collapsed ? "right" : "left"}`} />
        </button>
      </div>

      {/* MAIN MENU */}
      <nav className="nav-section">
        <NavLink to="/home" className="nav-item">
          <span className="icon">⌂</span>
          {!collapsed && <span>Home</span>}
        </NavLink>

        <NavLink to="/dashboard" className="nav-item">
          <span className="icon">▦</span>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>


        <NavLink to="/history" className="nav-item">
          <span className="icon">◷</span>
          {!collapsed && <span>History</span>}
        </NavLink>
      </nav>

      {/* BOTTOM SETTINGS */}
      <div className="sidebar-bottom">
        <div className="divider" />

        <NavLink to="/settings" className="nav-item">
          <span className="icon">⚙</span>
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </div>
  );
}
