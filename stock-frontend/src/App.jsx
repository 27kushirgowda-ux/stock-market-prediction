import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/Landing";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Settings from "./pages/settings";
import History from "./pages/History";
import AppLayout from "./Layout/Applayout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      {/* LANDING */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/home" /> : <Landing />}
      />

      {/* AUTH */}
      <Route
        path="/signin"
        element={
          isLoggedIn ? (
            <Navigate to="/home" />
          ) : (
            <Signin onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />

      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate to="/home" /> : <Signup />}
      />

      {/* PROTECTED ROUTES */}
      <Route
        element={isLoggedIn ? <AppLayout /> : <Navigate to="/signin" />}
      >
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<div>Chatbot Page</div>} />
        <Route path="/history" element={<History />} />
        <Route
          path="/settings"
          element={<Settings onLogout={() => setIsLoggedIn(false)} />}
        />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;