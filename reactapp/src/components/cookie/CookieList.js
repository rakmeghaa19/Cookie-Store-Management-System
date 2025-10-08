import React from "react";
import CookieCard from "./CookieCard";
import "./Cookie.css";

function CookieList({ cookies, onDelete }) {
  if (!cookies || cookies.length === 0) {
    return <p data-testid="empty-state">No cookies available</p>;
  }

  return (
    <div className="cookie-list" data-testid="cookie-list">
      {cookies.map((cookie) => (
        <CookieCard key={cookie.id} cookie={cookie} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default CookieList;