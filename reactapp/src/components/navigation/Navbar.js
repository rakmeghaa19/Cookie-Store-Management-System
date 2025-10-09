import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navigate('/dashboard')}>
          <div className="logo">
            <span className="logo-icon">🍪</span>
            <span className="logo-text">LuxeBite M's Cookie</span>
          </div>
        </div>
        
        {user && (
          <div className="nav-menu">
            <span className="nav-item zoom-hover" onClick={() => navigate('/dashboard')}>
              Dashboard
            </span>
            <span className="nav-item zoom-hover" onClick={() => navigate('/cookies')}>
              Cookies
            </span>
            {user.role === 'USER' && (
              <>
                <span className="nav-item zoom-hover" onClick={() => navigate('/cart')}>
                  🛒 Cart
                </span>
                <span className="nav-item zoom-hover" onClick={() => navigate('/wishlist')}>
                  ❤️ Wishlist
                </span>
                <span className="nav-item zoom-hover" onClick={() => navigate('/orders')}>
                  📦 Orders
                </span>
              </>
            )}
            {user.role === 'ADMIN' && (
              <>
                <span className="nav-item zoom-hover" onClick={() => navigate('/admin')}>
                  Admin Panel
                </span>
                <span className="nav-item zoom-hover" onClick={() => navigate('/admin-orders')}>
                  📋 Orders
                </span>
              </>
            )}
            <div className="nav-user">
              <span className="username">{user.username}</span>
              <span className="role-badge">{user.role}</span>
              <button onClick={handleLogout} className="logout-btn zoom-hover">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;