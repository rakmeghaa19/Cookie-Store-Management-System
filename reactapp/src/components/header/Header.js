import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="app-header" data-testid="header">
      <h1 data-testid="header-title">Cookie Store Management</h1>
      <nav className="nav">
        <span className="nav-item active">🏠 Home</span>
        <span className="nav-item">🍪 Add Cookie</span>
        <span className="nav-item">📋 View Cookies</span>
        <span className="nav-item">📊 Analytics</span>
      </nav>
    </header>
  );
}

export default Header;