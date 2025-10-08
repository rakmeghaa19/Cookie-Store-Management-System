import React from "react";
import "./Cookie.css";

function CookieCard({ cookie, onDelete }) {
  return (
    <div className="cookie-card" data-testid="cookie-card">
      <h3 data-testid="cookie-name">{cookie.cookieName}</h3>
      <p data-testid="cookie-flavor">Flavor: {cookie.flavor}</p>
      <p data-testid="cookie-price">Price: {cookie.price}</p>
      <p data-testid="cookie-quantity">Quantity: {cookie.quantityAvailable}</p>
      {onDelete && (
        <button data-testid="delete-btn" onClick={() => onDelete(cookie.id)}>
          Delete
        </button>
      )}
    </div>
  );
}

export default CookieCard;