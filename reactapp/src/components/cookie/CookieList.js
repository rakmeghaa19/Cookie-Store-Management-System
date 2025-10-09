import React, { useEffect, useState } from "react";
import {
  getAllCookies,
} from "../../services/api";
import CookieCard from "./CookieCard";
import "./Cookie.css";

const CookieList = ({ user, isAdminView = false }) => {
  const [cookies, setCookies] = useState([]);
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [flavorFilter, setFlavorFilter] = useState("");

  // Load all cookies initially
  const loadCookies = async () => {
    try {
      setLoading(true);
      const res = await getAllCookies();
      setCookies(res.data);
      setFilteredCookies(res.data);
    } catch (error) {
      console.error("Error loading cookies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCookies();
  }, []);

  // Add default cookies if backend fails
  useEffect(() => {
    if (cookies.length === 0 && !loading) {
      const defaultCookies = [
        { id: 1, cookieName: "Classic Chocolate Chip", flavor: "Chocolate", price: 25, quantityAvailable: 150 },
        { id: 2, cookieName: "Double Chocolate Fudge", flavor: "Chocolate", price: 35, quantityAvailable: 80 },
        { id: 3, cookieName: "White Chocolate Macadamia", flavor: "White Chocolate", price: 40, quantityAvailable: 60 },
        { id: 4, cookieName: "Oatmeal Raisin Classic", flavor: "Oatmeal", price: 22, quantityAvailable: 120 },
        { id: 5, cookieName: "Peanut Butter Crunch", flavor: "Peanut Butter", price: 28, quantityAvailable: 90 },
        { id: 6, cookieName: "Sugar Cookie Delight", flavor: "Vanilla", price: 18, quantityAvailable: 200 },
        { id: 7, cookieName: "Snickerdoodle Supreme", flavor: "Cinnamon", price: 26, quantityAvailable: 75 },
        { id: 8, cookieName: "Lemon Zest Burst", flavor: "Lemon", price: 24, quantityAvailable: 85 },
        { id: 9, cookieName: "Coconut Macaroon", flavor: "Coconut", price: 32, quantityAvailable: 50 },
        { id: 10, cookieName: "Gingerbread Spice", flavor: "Ginger", price: 30, quantityAvailable: 65 },
        { id: 11, cookieName: "Salted Caramel Delight", flavor: "Caramel", price: 38, quantityAvailable: 55 },
        { id: 12, cookieName: "Mint Chocolate Holiday", flavor: "Mint", price: 33, quantityAvailable: 55 },
        { id: 13, cookieName: "Red Velvet Romance", flavor: "Cream Cheese", price: 36, quantityAvailable: 45 },
        { id: 14, cookieName: "Almond Butter Protein", flavor: "Almond", price: 34, quantityAvailable: 70 },
        { id: 15, cookieName: "Gluten-Free Chocolate", flavor: "Chocolate", price: 38, quantityAvailable: 35 },
        { id: 16, cookieName: "Vegan Oat Cookie", flavor: "Oatmeal", price: 32, quantityAvailable: 40 },
        { id: 17, cookieName: "Matcha Green Tea", flavor: "Matcha", price: 35, quantityAvailable: 30 },
        { id: 18, cookieName: "Birthday Cake Surprise", flavor: "Vanilla", price: 41, quantityAvailable: 20 },
        { id: 19, cookieName: "Flash Sale - Chocolate Delight", flavor: "Chocolate", price: 19, quantityAvailable: 25 },
        { id: 20, cookieName: "Daily Special - Vanilla Dream", flavor: "Vanilla", price: 16, quantityAvailable: 30 }
      ];
      setCookies(defaultCookies);
      setFilteredCookies(defaultCookies);
    }
  }, [cookies.length, loading]);

  // Search cookies
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredCookies(cookies);
      return;
    }

    // Use local search for better performance
    const filtered = cookies.filter(cookie => 
      cookie.cookieName.toLowerCase().includes(term.toLowerCase()) ||
      cookie.flavor.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCookies(filtered);
  };

  // Filter by flavor
  const handleFlavorFilter = (e) => {
    const flavor = e.target.value;
    setFlavorFilter(flavor);

    if (flavor === "") {
      setFilteredCookies(cookies);
      return;
    }

    const filtered = cookies.filter(cookie => 
      cookie.flavor.toLowerCase() === flavor.toLowerCase()
    );
    setFilteredCookies(filtered);
  };

  if (loading) return <div className="loading">Loading cookies...</div>;

  const getCategoryStats = () => {
    const categories = {
      'Premium': cookies.filter(c => c.price >= 35).length,
      'Traditional': cookies.filter(c => c.price < 35 && c.price >= 20).length,
      'Budget': cookies.filter(c => c.price < 20).length,
      'Limited': cookies.filter(c => c.cookieName.includes('Limited') || c.cookieName.includes('Birthday')).length,
      'Healthy': cookies.filter(c => c.cookieName.includes('Gluten-Free') || c.cookieName.includes('Vegan') || c.cookieName.includes('Sugar-Free')).length
    };
    return categories;
  };

  const filterByCategory = (category) => {
    let filtered = [];
    switch(category) {
      case 'Premium':
        filtered = cookies.filter(c => c.price >= 35);
        break;
      case 'Traditional':
        filtered = cookies.filter(c => c.price < 35 && c.price >= 20);
        break;
      case 'Budget':
        filtered = cookies.filter(c => c.price < 20);
        break;
      case 'Limited':
        filtered = cookies.filter(c => c.cookieName.includes('Limited') || c.cookieName.includes('Birthday'));
        break;
      case 'Healthy':
        filtered = cookies.filter(c => c.cookieName.includes('Gluten-Free') || c.cookieName.includes('Vegan') || c.cookieName.includes('Sugar-Free'));
        break;
      default:
        filtered = cookies;
    }
    setFilteredCookies(filtered);
    setSearchTerm('');
    setFlavorFilter('');
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="cookie-list-container">
      <div className="store-header">
        <h1 className="store-title">
          🍪 <span className="gradient-text">Premium Cookie Store</span>
        </h1>
        <p className="store-subtitle">Handcrafted cookies made with love • {cookies.length} varieties available</p>
      </div>

      <div className="category-stats">
        <div className="stat-card show-all" onClick={() => filterByCategory('All')}>
          <span className="stat-number">{cookies.length}</span>
          <span className="stat-label">All Cookies</span>
        </div>
        {Object.entries(categoryStats).map(([category, count]) => (
          <div key={category} className="stat-card" onClick={() => filterByCategory(category)}>
            <span className="stat-number">{count}</span>
            <span className="stat-label">{category}</span>
          </div>
        ))}
      </div>

      <div className="filter-section">
        <div className="filter-bar">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="🔍 Search delicious cookies..."
              value={searchTerm}
              onChange={handleSearch}
              data-testid="search-input"
              className="search-input"
            />
          </div>

          <div className="filter-wrapper">
            <select
              value={flavorFilter}
              onChange={handleFlavorFilter}
              data-testid="filter-input"
              className="filter-input"
            >
              <option value="">🍪 All Flavors</option>
              <option value="Chocolate">🍫 Chocolate</option>
              <option value="Vanilla">🍦 Vanilla</option>
              <option value="Oatmeal">🌾 Oatmeal</option>
              <option value="Peanut Butter">🥜 Peanut Butter</option>
              <option value="Cinnamon">🌿 Cinnamon</option>
              <option value="Lemon">🍋 Lemon</option>
              <option value="Coconut">🥥 Coconut</option>
              <option value="Caramel">🍯 Caramel</option>
              <option value="Mint">🌱 Mint</option>
              <option value="Matcha">🍵 Matcha</option>
            </select>
          </div>
        </div>
        
        <div className="results-info">
          <span className="results-count">
            {filteredCookies.length} of {cookies.length} cookies
          </span>
        </div>
      </div>

      <div className="cookie-grid">
        {filteredCookies.length > 0 ? (
          filteredCookies.map((cookie) => (
            <CookieCard key={cookie.id} cookie={cookie} user={user} isAdminView={isAdminView} />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">😢</div>
            <h3>No cookies found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};  

export default CookieList;
