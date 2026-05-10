import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // 👈 Import your hook

import Landing from "./pages/Landing";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Settings from "./pages/settings";
import History from "./pages/History";
import AppLayout from "./Layout/Applayout";

function App() {
  const { user, loading } = useAuth(); // 👈 Get user and loading state

  // Prevent redirecting while Firebase is still checking the session
  if (loading) return <div className="loading-screen">Loading StockAI...</div>;

  return (
    <Routes>
      {/* LANDING */}
      <Route
        path="/"
        element={user ? <Navigate to="/home" /> : <Landing />}
      />

      {/* AUTH */}
      <Route
        path="/signin"
        element={user ? <Navigate to="/home" /> : <Signin />}
      />

      <Route
        path="/signup"
        element={user ? <Navigate to="/home" /> : <Signup />}
      />

      {/* PROTECTED ROUTES */}
      <Route
        element={user ? <AppLayout /> : <Navigate to="/signin" />}
      >
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<div>Chatbot Page</div>} />
        <Route path="/history" element={<History />} />
        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;