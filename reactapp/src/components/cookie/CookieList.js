import React, { useState, useEffect } from "react";
import CookieCard from "./CookieCard";
import { getAllCookies, searchCookies, getCookiesByFlavor } from "../../services/api";
import "./Cookie.css";

function CookieList({ cookies: propCookies, onDelete, user }) {
  const [cookies, setCookies] = useState(propCookies || []);
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propCookies) loadCookies();
  }, [propCookies]);

  useEffect(() => {
    filterAndSortCookies();
  }, [cookies, searchTerm, selectedFlavor, sortBy, priceRange]);

  const loadCookies = async () => {
    setLoading(true);
    try {
      const response = await getAllCookies();
      setCookies(response.data || []);
    } catch (error) {
      console.error('Error loading cookies:', error);
    }
    setLoading(false);
  };

  const filterAndSortCookies = () => {
    let filtered = [...cookies];

    if (searchTerm) {
      filtered = filtered.filter(cookie => 
        cookie.cookieName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cookie.flavor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFlavor) {
      filtered = filtered.filter(cookie => cookie.flavor === selectedFlavor);
    }

    filtered = filtered.filter(cookie => 
      cookie.price >= priceRange.min && cookie.price <= priceRange.max
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "quantity": return b.quantityAvailable - a.quantityAvailable;
        case "name": return a.cookieName.localeCompare(b.cookieName);
        default: return 0;
      }
    });

    setFilteredCookies(filtered);
  };

  const addToCart = (cookie) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem(`cart_${user.username}`) || '[]');
    const existingItem = cart.find(item => item.id === cookie.id);
    
    // Add original price for sale items
    const cartItem = { 
      ...cookie, 
      quantity: 1,
      originalPrice: cookie.cookieName.includes('Flash Sale') ? cookie.price + 10 :
                    cookie.cookieName.includes('Daily Special') ? cookie.price + 6 : null
    };
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    alert(`${cookie.cookieName} added to cart!`);
  };

  const uniqueFlavors = [...new Set(cookies.map(cookie => cookie.flavor))];

  if (loading) return <div className="loading">Loading cookies...</div>;

  return (
    <div className="cookie-section">
      <div className="cookie-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search cookies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={selectedFlavor} 
            onChange={(e) => setSelectedFlavor(e.target.value)}
            className="flavor-filter"
          >
            <option value="">All Flavors</option>
            {uniqueFlavors.map(flavor => (
              <option key={flavor} value={flavor}>{flavor}</option>
            ))}
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="quantity">Stock Level</option>
          </select>
          
          <div className="price-range">
            <label>Price: ${priceRange.min} - ${priceRange.max}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
            />
          </div>
        </div>
      </div>

      <div className="results-info">
        <span>{filteredCookies.length} cookies found</span>
      </div>

      {filteredCookies.length === 0 ? (
        <p data-testid="empty-state">No cookies match your criteria</p>
      ) : (
        <div className="cookie-list" data-testid="cookie-list">
          {filteredCookies.map((cookie) => (
            <div key={cookie.id} className="cookie-card-wrapper">
              <CookieCard cookie={cookie} onDelete={onDelete} />
              {user && (
                <button 
                  onClick={() => addToCart(cookie)}
                  className="add-to-cart-btn"
                  disabled={cookie.quantityAvailable === 0}
                >
                  {cookie.quantityAvailable === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CookieList;