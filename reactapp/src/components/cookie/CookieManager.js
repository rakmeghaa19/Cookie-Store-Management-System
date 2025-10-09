import React from "react";
import CookieList from "./CookieList";
import AddCookie from "./AddCookie";
import "./CookieManager.css";

const CookieManager = ({ user }) => {
  return (
    <div className="cookie-manager">
      {user && user.role === 'ADMIN' && (
        <div className="admin-section">
          <h2>Cookie Management</h2>
          <AddCookie />
        </div>
      )}
      <CookieList user={user} />
    </div>
  );
};

export default CookieManager;
