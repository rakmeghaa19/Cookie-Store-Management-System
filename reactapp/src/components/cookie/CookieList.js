import React, { useEffect, useState } from "react";
import {
  getAllCookies,
  searchCookies,
  getCookiesByFlavor,
} from "../../services/api";
import CookieCard from "./CookieCard";

const CookieList = () => {
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

  // Search cookies
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredCookies(cookies);
      return;
    }

    try {
      const res = await searchCookies(term);
      setFilteredCookies(res.data);
    } catch (error) {
      console.error("Error searching cookies:", error);
    }
  };

  // Filter by flavor
  const handleFlavorFilter = async (e) => {
    const flavor = e.target.value;
    setFlavorFilter(flavor);

    if (flavor.trim() === "") {
      setFilteredCookies(cookies);
      return;
    }

    try {
      const res = await getCookiesByFlavor(flavor);
      setFilteredCookies(res.data);
    } catch (error) {
      console.error("Error filtering cookies:", error);
    }
  };

  if (loading) return <div className="loading">Loading cookies...</div>;

  return (
    <div className="cookie-list-container">
      <h2>🍪 Cookie Store</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search cookies..."
          value={searchTerm}
          onChange={handleSearch}
          data-testid="search-input"
        />

        <input
          type="text"
          placeholder="Filter by flavor..."
          value={flavorFilter}
          onChange={handleFlavorFilter}
          data-testid="filter-input"
        />
      </div>

    {/* //  <CreateCookie onCookieCreated={loadCookies} /> */}

      <div className="cookie-grid">
        {filteredCookies.length > 0 ? (
          filteredCookies.map((cookie) => (
            <CookieCard key={cookie.id} cookie={cookie} />
          ))
        ) : (
          <p data-testid="empty-state">No cookies found</p>
        )}
      </div>
    </div>
  );
};  

export default CookieList;
