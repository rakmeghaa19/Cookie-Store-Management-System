import React, { useState } from "react";
import "./Cookie.css";

function CookieForm({ addCookie }) {
  // local controlled state ensures inputs are never undefined
  const [cookieData, setCookieData] = useState({
    cookieName: "",
    flavor: "",
    price: "",
    quantityAvailable: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCookieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // required validation
    if (
      !cookieData.cookieName.trim() ||
      !cookieData.flavor.trim() ||
      cookieData.price === "" ||
      cookieData.quantityAvailable === ""
    ) {
      setFormError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      await addCookie({
        cookieName: cookieData.cookieName.trim(),
        flavor: cookieData.flavor.trim(),
        price: Number(cookieData.price),
        quantityAvailable: Number(cookieData.quantityAvailable),
      });
      // clear form
      setCookieData({ cookieName: "", flavor: "", price: "", quantityAvailable: "" });
    } catch (err) {
      setFormError("Failed to add cookie");
      throw err; // allow tests that mock addCookie to detect failure
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <form className="cookie-form" onSubmit={handleSubmit} data-testid="add-cookie-form">
      {formError && <p data-testid="form-error" className="error">{formError}</p>}



      <input
        name="cookieName"
        placeholder="Cookie Name"
        value={cookieData.cookieName}
        onChange={handleChange}
        data-testid="cookieName-input"
      />
      <input
        name="flavor"
        placeholder="Flavor (Chocolate, Vanilla...)"
        value={cookieData.flavor}
        onChange={handleChange}
        data-testid="flavor-input"
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={cookieData.price}
        onChange={handleChange}
        data-testid="price-input"
      />
      <input
        name="quantityAvailable"
        type="number"
        placeholder="Quantity"
        value={cookieData.quantityAvailable}
        onChange={handleChange}
        data-testid="quantity-input"
      />

      <button type="submit" data-testid="add-cookie-button" disabled={submitting}>
        {submitting ? "Adding..." : "Add Cookie"}
      </button>
    </form>
  );
}

export default CookieForm;