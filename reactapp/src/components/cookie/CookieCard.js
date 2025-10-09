import React from "react";

const CookieCard = ({ cookie }) => {
  return (
    <div className="cookie-card" data-testid="cookie-card">
      <h3>{cookie.cookieName}</h3>
      <p><strong>Flavor:</strong> {cookie.flavor}</p>
      <p><strong>Price:</strong> ₹{cookie.price}</p>
      <p><strong>Quantity:</strong> {cookie.quantity}</p>
    </div>
  );
};

export default CookieCard;