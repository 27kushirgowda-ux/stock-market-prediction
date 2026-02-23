import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";
import "../styles/layout.css";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}
