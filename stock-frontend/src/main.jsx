import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // 👈 Make sure this path is correct
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider MUST wrap App to share the 'user' state */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);