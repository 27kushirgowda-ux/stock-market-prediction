import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";
import "../styles/layout.css";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}