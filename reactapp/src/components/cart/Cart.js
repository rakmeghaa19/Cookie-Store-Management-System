import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem(`cart_${user.username}`) || '[]');
    setCartItems(savedCart);
  };

  const calculateTotal = () => {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(totalAmount);
  };

  const updateQuantity = (cookieId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cookieId);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === cookieId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (cookieId) => {
    const updatedCart = cartItems.filter(item => item.id !== cookieId);
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(`cart_${user.username}`);
  };

  const checkout = () => {
    const order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cartItems,
      total: total,
      status: 'Processing'
    };
    
    const orders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
    orders.push(order);
    localStorage.setItem(`orders_${user.username}`, JSON.stringify(orders));
    
    alert(`Order placed! Total: $${total.toFixed(2)}`);
    clearCart();
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>🛒 Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="clear-btn">Clear Cart</button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => window.location.href = '/cookies'} className="shop-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h3>{item.cookieName}</h3>
                  <p className="flavor">{item.flavor}</p>
                  <p className="price">${item.price}</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span className="quantity">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">×</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="total">
              <h3>Total: ${total.toFixed(2)}</h3>
            </div>
            <button onClick={checkout} className="checkout-btn">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;