import React, { useState, useEffect } from 'react';
import './Wishlist.css';

const Wishlist = ({ user }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const savedWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.username}`) || '[]');
    setWishlistItems(savedWishlist);
  };

  const removeFromWishlist = (cookieId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== cookieId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem(`wishlist_${user.username}`, JSON.stringify(updatedWishlist));
  };

  const addToCart = (cookie) => {
    const cart = JSON.parse(localStorage.getItem(`cart_${user.username}`) || '[]');
    const existingItem = cart.find(item => item.id === cookie.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...cookie, quantity: 1 });
    }
    
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    alert(`${cookie.cookieName} added to cart!`);
  };

  const moveToCart = (cookie) => {
    addToCart(cookie);
    removeFromWishlist(cookie.id);
  };

  return (
    <div className="wishlist">
      <div className="wishlist-header">
        <h2>❤️ My Wishlist</h2>
        <span className="item-count">{wishlistItems.length} items</span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty</p>
          <button onClick={() => window.location.href = '/cookies'} className="browse-btn">
            Browse Cookies
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(cookie => (
            <div key={cookie.id} className="wishlist-item">
              <div className="cookie-info">
                <h3>{cookie.cookieName}</h3>
                <p className="flavor">{cookie.flavor}</p>
                <p className="price">${cookie.price}</p>
                <p className="stock">Stock: {cookie.quantityAvailable}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => moveToCart(cookie)} className="cart-btn">
                  Add to Cart
                </button>
                <button onClick={() => removeFromWishlist(cookie.id)} className="remove-btn">
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;