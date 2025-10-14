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

  const removeFromWishlist = (cookieId, cookieName) => {
    if (window.confirm(`Remove ${cookieName} from wishlist?`)) {
      const updatedWishlist = wishlistItems.filter(item => item.id !== cookieId);
      setWishlistItems(updatedWishlist);
      localStorage.setItem(`wishlist_${user.username}`, JSON.stringify(updatedWishlist));
      alert(`${cookieName} removed from wishlist!`);
    }
  };

  const moveToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem(`cart_${user.username}`) || '[]');
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    removeFromWishlist(item.id);
    alert(`${item.cookieName} moved to cart!`);
  };

  const clearWishlist = () => {
    if (window.confirm(`Remove all ${wishlistItems.length} items from wishlist?`)) {
      setWishlistItems([]);
      localStorage.removeItem(`wishlist_${user.username}`);
      alert('Wishlist cleared!');
    }
  };

  return (
    <div className="wishlist">
      <div className="wishlist-header">
        <h2>💝 My Wishlist</h2>
        {wishlistItems.length > 0 && (
          <button onClick={clearWishlist} className="clear-btn">🗑️ Clear All</button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty</p>
          <button onClick={() => window.location.href = '/cookies'} className="shop-btn">
            🍪 Browse Cookies
          </button>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <div className="item-info">
                <h3>{item.cookieName}</h3>
                <p className="flavor">{item.flavor}</p>
                <p className="price">${item.price}</p>
                <p className="stock">
                  {item.quantityAvailable > 0 
                    ? `${item.quantityAvailable} in stock` 
                    : 'Out of stock'
                  }
                </p>
              </div>
              <div className="item-actions">
                <button 
                  onClick={() => moveToCart(item)}
                  className="move-to-cart-btn"
                  disabled={item.quantityAvailable === 0}
                >
                  {item.quantityAvailable === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button onClick={() => removeFromWishlist(item.id, item.cookieName)} className="remove-btn">
                  🗑️ Remove
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