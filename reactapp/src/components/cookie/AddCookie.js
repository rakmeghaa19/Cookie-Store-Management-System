import React, { useState } from "react";

function AddCookie() {
  const [cookieName, setCookieName] = useState("");
  const [flavor, setFlavor] = useState("");
  const [price, setPrice] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cookie = {
      cookieName,
      flavor,
      price: parseInt(price),
      quantityAvailable: parseInt(quantityAvailable),
    };

    try {
      const response = await fetch("http://localhost:8080/api/cookies/addCookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cookie),
      });

      if (response.ok) {
        alert("Cookie added successfully!");
        setCookieName(""); setFlavor(""); setPrice(""); setQuantityAvailable("");
      } else {
        const errMsg = await response.text();
        alert("Failed to add cookie: " + errMsg);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding cookie: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Add a New Cookie 🍪</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cookie Name:</label>
          <input type="text" value={cookieName} onChange={(e) => setCookieName(e.target.value)} required />
        </div>
        <div>
          <label>Flavor:</label>
          <input type="text" value={flavor} onChange={(e) => setFlavor(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Quantity Available:</label>
          <input type="number" value={quantityAvailable} onChange={(e) => setQuantityAvailable(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>Add Cookie</button>
      </form>
    </div>
  );
}

export default AddCookie;