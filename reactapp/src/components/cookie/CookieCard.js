import React, { useState } from "react";

const CookieCard = ({ cookie, user, isAdminView }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    cookieName: cookie.cookieName,
    flavor: cookie.flavor,
    price: cookie.price,
    quantityAvailable: cookie.quantityAvailable || cookie.quantity
  });

  const getBadgeType = () => {
    if (cookie.cookieName.includes('Flash Sale') || cookie.cookieName.includes('Daily Special')) return 'sale';
    if (cookie.cookieName.includes('Limited') || cookie.cookieName.includes('Birthday')) return 'limited';
    if (cookie.cookieName.includes('Gluten-Free') || cookie.cookieName.includes('Vegan') || cookie.cookieName.includes('Sugar-Free') || cookie.cookieName.includes('Protein')) return 'healthy';
    if (cookie.price >= 35) return 'premium';
    return null;
  };

  const getStockStatus = () => {
    const qty = cookie.quantityAvailable || cookie.quantity || 0;
    if (qty === 0) return { class: 'stock-out', text: '❌ Out of Stock', icon: '❌' };
    if (qty <= 20) return { class: 'stock-low', text: `⚠️ Only ${qty} left`, icon: '⚠️' };
    if (qty <= 50) return { class: 'stock-medium', text: `${qty} available`, icon: '📦' };
    return { class: 'stock-high', text: '✅ In Stock', icon: '✅' };
  };

  const addToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAdding(true);
    const cart = JSON.parse(localStorage.getItem(`cart_${user.username}`) || '[]');
    
    const existingItem = cart.find(item => item.id === cookie.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: cookie.id,
        cookieName: cookie.cookieName,
        flavor: cookie.flavor,
        price: cookie.price,
        quantity: quantity,
        quantityAvailable: cookie.quantityAvailable || cookie.quantity
      });
    }
    
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    alert(`${quantity} ${cookie.cookieName} added to cart!`);
    setIsAdding(false);
  };

  const addToWishlist = () => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.username}`) || '[]');
    
    if (wishlist.find(item => item.id === cookie.id)) {
      alert('Item already in wishlist!');
      return;
    }
    
    wishlist.push({
      id: cookie.id,
      cookieName: cookie.cookieName,
      flavor: cookie.flavor,
      price: cookie.price,
      quantityAvailable: cookie.quantityAvailable || cookie.quantity
    });
    
    localStorage.setItem(`wishlist_${user.username}`, JSON.stringify(wishlist));
    alert(`${cookie.cookieName} added to wishlist!`);
  };

  const handleEdit = async () => {
    try {
      const { updateCookie } = await import('../../services/api');
      await updateCookie(cookie.id, editData);
      alert('Cookie updated successfully!');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      alert('Failed to update cookie: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete ${cookie.cookieName}?`)) {
      try {
        const { deleteCookie } = await import('../../services/api');
        await deleteCookie(cookie.id);
        alert('Cookie deleted successfully!');
        window.location.reload();
      } catch (error) {
        alert('Failed to delete cookie: ' + error.message);
      }
    }
  };

  const badgeType = getBadgeType();
  const stockStatus = getStockStatus();
  const cardClass = `cookie-card ${badgeType ? badgeType : ''}`;

  return (
    <div className={cardClass} data-testid="cookie-card">
      {badgeType && (
        <div className={`cookie-badge badge-${badgeType}`}>
          {badgeType === 'sale' ? '🔥 SALE' : 
           badgeType === 'limited' ? '⭐ LIMITED' :
           badgeType === 'healthy' ? '🌱 HEALTHY' : '👑 PREMIUM'}
        </div>
      )}
      
      <div className="cookie-info">
        <h3>🍪 {cookie.cookieName}</h3>
        
        <p>
          <span>Flavor:</span>
          <span className="flavor-tag">{cookie.flavor}</span>
        </p>
        
        <p>
          <span>Price:</span>
          <span className="price-display">
            <span className="price-currency">₹</span>
            {cookie.price}
          </span>
        </p>
        
        <p>
          <span>Stock:</span>
          <span className={`stock-indicator ${stockStatus.class}`}>
            {stockStatus.text}
          </span>
        </p>
      </div>
      
      {isAdminView && user && user.role === 'ADMIN' ? (
        <div className="admin-actions">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editData.cookieName}
                onChange={(e) => setEditData({...editData, cookieName: e.target.value})}
                placeholder="Cookie Name"
              />
              <input
                type="text"
                value={editData.flavor}
                onChange={(e) => setEditData({...editData, flavor: e.target.value})}
                placeholder="Flavor"
              />
              <input
                type="number"
                value={editData.price}
                onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value)})}
                placeholder="Price"
              />
              <input
                type="number"
                value={editData.quantityAvailable}
                onChange={(e) => setEditData({...editData, quantityAvailable: parseInt(e.target.value)})}
                placeholder="Quantity"
              />
              <div className="edit-buttons">
                <button onClick={handleEdit} className="save-btn">💾 Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">❌ Cancel</button>
              </div>
            </div>
          ) : (
            <div className="admin-buttons">
              <button onClick={() => setIsEditing(true)} className="edit-btn">✏️ Edit</button>
              <button onClick={handleDelete} className="delete-btn">🗑️ Delete</button>
            </div>
          )}
        </div>
      ) : (
        user && user.role === 'USER' && (cookie.quantityAvailable || cookie.quantity) > 0 && (
          <div className="cookie-actions">
            <div className="quantity-selector">
              <label>Qty:</label>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[...Array(Math.min(10, cookie.quantityAvailable || cookie.quantity))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            <div className="action-buttons">
              <button 
                onClick={addToCart}
                disabled={isAdding || (cookie.quantityAvailable || cookie.quantity) === 0}
                className="add-to-cart-btn"
                data-testid="add-to-cart-btn"
              >
                {isAdding ? '⏳ Adding...' : '🛒 Add to Cart'}
              </button>
              
              <button 
                onClick={addToWishlist}
                className="add-to-wishlist-btn"
              >
                💝
              </button>
            </div>
          </div>
        )
      )}
      
      {(cookie.quantityAvailable || cookie.quantity) === 0 && (
        <div className="out-of-stock">❌ Out of Stock</div>
      )}
    </div>
  );
};

export default CookieCard;