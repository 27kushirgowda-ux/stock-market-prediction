import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false); // for mobile

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleNavClick = () => {
    if (isMobile) setOpen(false); // auto close on mobile
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      {isMobile && (
        <div className="mobile-topbar">
          <button onClick={() => setOpen(true)}>☰</button>
          <span className="mobile-title">StockAI</span>
        </div>
      )}

      {/* OVERLAY */}
      {isMobile && open && (
        <div className="overlay" onClick={() => setOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div
        className={`sidebar 
          ${collapsed ? "collapsed" : ""} 
          ${isMobile ? "mobile" : ""} 
          ${open ? "open" : ""}
        `}
      >
        {/* TOP */}
        <div className="sidebar-top">
          <span className="logo">{collapsed ? "AI" : "StockAI"}</span>

          {!isMobile && (
            <button
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              <span className={`arrow ${collapsed ? "right" : "left"}`} />
            </button>
          )}
        </div>

        {/* MENU */}
        <nav className="nav-section">
          <NavLink to="/home" className="nav-item" onClick={handleNavClick}>
            <span className="icon">⌂</span>
            {!collapsed && <span>Home</span>}
          </NavLink>

          <NavLink to="/dashboard" className="nav-item" onClick={handleNavClick}>
            <span className="icon">▦</span>
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/history" className="nav-item" onClick={handleNavClick}>
            <span className="icon">◷</span>
            {!collapsed && <span>History</span>}
          </NavLink>
        </nav>

        {/* BOTTOM */}
        <div className="sidebar-bottom">
          <div className="divider" />

          <NavLink to="/settings" className="nav-item" onClick={handleNavClick}>
            <span className="icon">⚙</span>
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </div>
    </>
  );
}