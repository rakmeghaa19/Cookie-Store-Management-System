import React from "react";
import { useLocation } from "react-router-dom";
import CookieList from "./CookieList";
import AddCookie from "./AddCookie";
import "./CookieManager.css";

const CookieManager = ({ user }) => {
  const location = useLocation();
  const isAdminPanel = location.pathname === '/admin';

  return (
    <div className="cookie-manager">
      {isAdminPanel && user && user.role === 'ADMIN' ? (
        <div className="admin-panel">
          <div className="admin-header">
            <h2>⚙️ Admin Panel - Cookie Management</h2>
            <p>Manage your cookie inventory and store operations</p>
          </div>
          <AddCookie />
          <div className="admin-cookie-list">
            <h3>🍪 Current Cookie Inventory</h3>
            <CookieList user={user} isAdminView={true} />
          </div>
        </div>
      ) : (
        <div className="customer-view">
          <CookieList user={user} isAdminView={false} />
        </div>
      )}
    </div>
  );
};

export default CookieManager;
