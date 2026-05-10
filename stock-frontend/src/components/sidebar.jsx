import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, History, Settings, LogOut, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/sidebar.css";

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* BRAND SECTION */}
      <div className="sidebar-header">
        <div className="brand">
          <TrendingUp color="#22c55e" size={28} />
          {!collapsed && <span className="brand-name">StockAI</span>}
        </div>
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* NAV SECTION */}
      <nav className="nav-menu">
        <NavLink to="/home" className="nav-item">
          <Home size={22} />
          {!collapsed && <span>Home</span>}
        </NavLink>

        <NavLink to="/dashboard" className="nav-item">
          <LayoutDashboard size={22} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/history" className="nav-item">
          <History size={22} />
          {!collapsed && <span>History</span>}
        </NavLink>
      </nav>

      {/* FOOTER SECTION */}
      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <Settings size={22} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        
        <button className="logout-btn">
          <LogOut size={22} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}