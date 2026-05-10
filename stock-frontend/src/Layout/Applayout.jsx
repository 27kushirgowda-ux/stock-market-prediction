import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import "../styles/layout.css";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar comes FIRST */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content follows */}
      <main className={`page-content ${collapsed ? "collapsed-offset" : ""}`}>
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}