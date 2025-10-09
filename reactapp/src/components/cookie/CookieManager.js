import React, { useEffect, useState } from "react";

const ShowCookies = () => {
  const [cookies, setCookies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCookies = async () => {
      try {
        const response = await fetch(
          "https://8080-fecafffabfdabaaeaedaacebfbabbcbebecf.premiumproject.examly.io/api/cookies/allCookies"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCookies(data);
      } catch (err) {
        console.error("Failed to fetch cookies:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCookies();
  }, []);

  if (loading) return <div>Loading cookies...</div>;
  if (error) return <div>Error: [Error - You need to specify the message]</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🍪 All Cookies</h2>
      {cookies.length === 0 ? (
        <p>No cookies available.</p>
      ) : (
        <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {cookies.map((cookie) => (
            <div
              key={cookie.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{cookie.cookieName}</h3>
              <p><strong>Flavor:</strong> {cookie.flavor}</p>
              <p><strong>Price:</strong> ${cookie.price}</p>
              <p><strong>Quantity:</strong> {cookie.quantityAvailable}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowCookies;
