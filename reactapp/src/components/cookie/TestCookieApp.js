import React, { useState, useEffect } from "react";
import CookieForm from "./CookieForm";
import CookieList from "./CookieList";
import { getAllCookies, getCookiesByFlavor, getCookiesSortedByPrice, addCookie, deleteCookie } from "../../services/api";

function TestCookieApp() {
  const [cookies, setCookies] = useState([]);
  const [filter, setFilter] = useState("All Cookies");

  useEffect(() => {
    loadCookies();
  }, []);

  const loadCookies = async () => {
    try {
      const response = await getAllCookies();
      setCookies(response.data);
    } catch (error) {
      console.error("Failed to load cookies:", error);
      setCookies([]);
    }
  };

  const handleAddCookie = async (cookieData) => {
    try {
      await addCookie(cookieData);
      await loadCookies();
    } catch (error) {
      console.error("Failed to add cookie:", error);
      throw error;
    }
  };

  const handleDeleteCookie = async (id) => {
    try {
      await deleteCookie(id);
      await loadCookies();
    } catch (error) {
      console.error("Failed to delete cookie:", error);
    }
  };

  return (
    <div>
      <h1>Cookie Store Management</h1>
      <CookieForm addCookie={handleAddCookie} />
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="All Cookies">All Cookies</option>
      </select>
      <CookieList cookies={cookies} onDelete={handleDeleteCookie} />
    </div>
  );
}

export default TestCookieApp;