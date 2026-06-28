import React, { useState, useEffect } from 'react';
import Registration from './components/auth/Registration';
import Login from './components/auth/Login';
import Questionnaire from './components/auth/Questionnaire';
import AdminDashboard from './components/auth/admin/AdminDashboard';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const adminToken = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminUser');
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // If on admin path, show admin dashboard
    if (path === '/admin' || path === '/admin/dashboard') {
      if (adminToken && admin) {
        setIsAdmin(true);
        setAdminUser(JSON.parse(admin));
        setShowAdmin(true);
        setLoading(false);
        return;
      } else {
        // Redirect to home if no admin token on admin path
        window.location.href = '/';
        setLoading(false);
        return;
      }
    }

    // Clear admin data if not on admin path (prevents auto-redirect)
    if (adminToken && admin && path !== '/admin' && path !== '/admin/dashboard') {
      // Keep token but don't show admin
      setIsAdmin(false);
      setShowAdmin(false);
    }

    // Check user login
    if (token && user) {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/';
  };

  const handleUserLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0d7ff 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e4e7',
            borderTop: '4px solid #aa3bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#6b6375' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin dashboard only if explicitly on admin path
  if (showAdmin && isAdmin) {
    return <AdminDashboard adminUser={adminUser} onLogout={handleAdminLogout} />;
  }

  // Show user questionnaire if logged in
  if (isLoggedIn) {
    return <Questionnaire />;
  }

  // Show login/register
  return (
    <div className="App">
      {showLogin ? (
        <Login onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <Registration onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;