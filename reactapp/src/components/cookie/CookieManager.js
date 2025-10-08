import React, { useState, useEffect } from 'react';
import './CookieManager.css';

const CookieManager = ({ user }) => {
  const [cookies, setCookies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [editingCookie, setEditingCookie] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ cookieName: '', flavor: '', price: '', quantityAvailable: '' });

  useEffect(() => {
    loadCookies();
  }, [currentPage]);

  const loadCookies = async () => {
    try {
      const response = await fetch(`https://8080-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io/api/cookies/paginated?page=${currentPage}&size=${pageSize}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setCookies(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load cookies:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCookie ? `https://8080-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io/api/cookies/${editingCookie.id}` : 'https://8080-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io/api/cookies/addCookie';
      const method = editingCookie ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      setFormData({ cookieName: '', flavor: '', price: '', quantityAvailable: '' });
      setEditingCookie(null);
      setShowAddForm(false);
      loadCookies();
    } catch (err) {
      console.error('Failed to save cookie:', err);
    }
  };

  const handleEdit = (cookie) => {
    setEditingCookie(cookie);
    setFormData({
      cookieName: cookie.cookieName,
      flavor: cookie.flavor,
      price: cookie.price,
      quantityAvailable: cookie.quantityAvailable
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cookie?')) {
      try {
        await fetch(`https://8080-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io/api/cookies/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        loadCookies();
      } catch (err) {
        console.error('Failed to delete cookie:', err);
      }
    }
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

  const addToWishlist = (cookie) => {
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.username}`) || '[]');
    const exists = wishlist.find(item => item.id === cookie.id);
    
    if (!exists) {
      wishlist.push(cookie);
      localStorage.setItem(`wishlist_${user.username}`, JSON.stringify(wishlist));
      alert(`${cookie.cookieName} added to wishlist!`);
    } else {
      alert('Already in wishlist!');
    }
  };

  return (
    <div className="cookie-manager">
      <div className="manager-header">
        <h2>Cookie Management</h2>
        {user.role === 'ADMIN' && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="add-btn"
          >
            {showAddForm ? 'Cancel' : 'Add Cookie'}
          </button>
        )}
      </div>

      {showAddForm && user.role === 'ADMIN' && (
        <div className="cookie-form">
          <h3>{editingCookie ? 'Edit Cookie' : 'Add New Cookie'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Cookie Name"
              value={formData.cookieName}
              onChange={(e) => setFormData({...formData, cookieName: e.target.value})}
              required
            />
            <select
              value={formData.flavor}
              onChange={(e) => setFormData({...formData, flavor: e.target.value})}
              required
            >
              <option value="">Select Flavor</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Vanilla">Vanilla</option>
              <option value="Strawberry">Strawberry</option>
              <option value="Mint">Mint</option>
              <option value="Butter">Butter</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantityAvailable}
              onChange={(e) => setFormData({...formData, quantityAvailable: e.target.value})}
              required
            />
            <button type="submit" className="submit-btn">
              {editingCookie ? 'Update' : 'Add'} Cookie
            </button>
          </form>
        </div>
      )}

      <div className="cookies-grid">
        {cookies.map(cookie => (
          <div key={cookie.id} className="cookie-card">
            <h3>{cookie.cookieName}</h3>
            <p className="flavor">{cookie.flavor}</p>
            <p className="price">${cookie.price}</p>
            <p className="quantity">Qty: {cookie.quantityAvailable}</p>
            <div className="card-actions">
              {user.role === 'ADMIN' ? (
                <>
                  <button onClick={() => handleEdit(cookie)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cookie.id)} className="delete-btn">
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => addToCart(cookie)} className="cart-btn">
                    Add to Cart
                  </button>
                  <button onClick={() => addToWishlist(cookie)} className="wishlist-btn">
                    ❤️
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="page-btn"
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage >= totalPages - 1}
          className="page-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CookieManager;