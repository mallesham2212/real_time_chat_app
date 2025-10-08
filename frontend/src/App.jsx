import React, { useEffect } from 'react';
import './index.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

import { useAuthStore } from './utils/useAuthStore';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, chekAuth, isCheckingAuth , onlineUsers} = useAuthStore();

  useEffect(() => {
    chekAuth();
  }, [chekAuth]);

  if ( isCheckingAuth) {
   
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-white"  >
    {authUser && <Navbar />}

    {/* Add padding-top equal to navbar height (~64px or 4rem) */}
    <div className={authUser ? "pt-0" : ""}>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/signup" />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUpPage />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>

    <Toaster position="top-left" toastOptions={{ duration: 3000 }} />
  </div>
);


};

export default App;