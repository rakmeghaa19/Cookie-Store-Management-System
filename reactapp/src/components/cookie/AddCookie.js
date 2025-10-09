import React, { useState } from "react";

function AddCookie() {
  const [cookieName, setCookieName] = useState("");
  const [flavor, setFlavor] = useState("");
  const [price, setPrice] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the new cookie object
    const cookie = {
      cookieName,
      flavor,
      price: parseFloat(price),
      quantityAvailable: parseInt(quantityAvailable),
    };

    try {
      const response = await fetch(
        "https://8081-fecafffabfdabaaeaedaacebfbabbcbebecf.premiumproject.examly.io/api/cookies/addCookies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cookie),
        }
      );

      if (response.ok) {
        alert("✅ Cookie created successfully!");
        // Reset form fields
        setCookieName("");
        setFlavor("");
        setPrice("");
        setQuantityAvailable("");
      } else {
        const errMsg = await response.text();
        alert("❌ Failed to create cookie: " + errMsg);
      }
    } catch (err) {
      console.error("Error creating cookie:", err);
      alert("⚠️ Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Add a New Cookie 🍪</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Cookie Name:</label><br />
          <input
            type="text"
            value={cookieName}
            onChange={(e) => setCookieName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Flavor:</label><br />
          <input
            type="text"
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Price:</label><br />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

      

        <div style={{ marginBottom: "10px" }}>
          <label>Quantity Available:</label><br />
          <input
            type="number"
            value={quantityAvailable}
            onChange={(e) => setQuantityAvailable(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ➕ Create Cookie
        </button>
      </form>
    </div>
  );
}

export default AddCookie;
