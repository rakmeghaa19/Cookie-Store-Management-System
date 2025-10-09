import React, { useState } from "react";
import { addCookie } from "../../services/api";

function AddCookie() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cookieName, setCookieName] = useState("");
  const [flavor, setFlavor] = useState("");
  const [price, setPrice] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create the new cookie object
    const cookie = {
      cookieName,
      flavor,
      price: parseFloat(price),
      quantityAvailable: parseInt(quantityAvailable),
    };

    try {
      await addCookie(cookie);
      alert("✅ Cookie created successfully!");
      // Reset form fields
      setCookieName("");
      setFlavor("");
      setPrice("");
      setQuantityAvailable("");
      // Refresh the page to show new cookie
      window.location.reload();
    } catch (err) {
      console.error("Error creating cookie:", err);
      alert("❌ Failed to create cookie: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cookie-form">
      <h3>Add a New Cookie 🍪</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cookie Name:</label>
          <input
            type="text"
            value={cookieName}
            onChange={(e) => setCookieName(e.target.value)}
            placeholder="Enter cookie name"
            required
          />
        </div>

        <div>
          <label>Flavor:</label>
          <input
            type="text"
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            placeholder="Enter flavor"
            required
          />
        </div>

        <div>
          <label>Price ($):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label>Quantity Available:</label>
          <input
            type="number"
            min="0"
            value={quantityAvailable}
            onChange={(e) => setQuantityAvailable(e.target.value)}
            placeholder="0"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? '⏳ Creating...' : '➕ Create Cookie'}
        </button>
      </form>
    </div>
  );
}
export default AddCookie;
