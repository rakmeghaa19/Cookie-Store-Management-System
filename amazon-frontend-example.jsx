// Frontend Components for Amazon Product Integration

import React, { useState, useEffect } from 'react';

// 1. Product Search Component
const ProductSearch = ({ onAddToCart }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    minPrice: '',
    maxPrice: ''
  });

  const searchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        query,
        ...filters
      });
      
      const response = await fetch(`/api/products/search?${params}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="product-search">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Amazon products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
        />
        <button onClick={searchProducts} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="filters">
        <select 
          value={filters.category} 
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
        </select>
        
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
        />
        
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
        />
      </div>

      <div className="product-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

// 2. Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await onAddToCart(product, quantity);
      alert('Product added to cart!');
    } catch (error) {
      alert('Failed to add product to cart');
    }
    setAdding(false);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="price">${(product.price / 100).toFixed(2)}</p>
      
      <div className="product-actions">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button 
          onClick={handleAddToCart}
          disabled={adding}
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
      
      <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
        View on Amazon
      </a>
    </div>
  );
};

// 3. Enhanced Cart Component
const EnhancedCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCartItems(data.items);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
    setLoading(false);
  };

  const addToCart = async (product, quantity) => {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'current-user-id',
        productId: product.id,
        quantity
      })
    });

    if (response.ok) {
      loadCart(); // Refresh cart
    } else {
      throw new Error('Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    await fetch('/api/cart/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: newQuantity })
    });
    loadCart();
  };

  const removeFromCart = async (productId) => {
    await fetch(`/api/cart/remove/${productId}`, { method: 'DELETE' });
    loadCart();
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    ) / 100;
  };

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="enhanced-cart">
      <h2>Shopping Cart ({cartItems.length} items)</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <ProductSearch onAddToCart={addToCart} />
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.productId} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p>${(item.price / 100).toFixed(2)}</p>
                  <span className="source">Source: {item.source}</span>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.productId)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
          
          <ProductSearch onAddToCart={addToCart} />
        </>
      )}
    </div>
  );
};

export default EnhancedCart;