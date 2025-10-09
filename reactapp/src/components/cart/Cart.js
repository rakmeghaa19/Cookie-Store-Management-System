import React, { useState, useEffect } from 'react';
import { createOrder } from '../../services/api';

import './Cart.css';

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [tax, setTax] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const coupons = {
    'SWEET10': { discount: 10, minOrder: 50 },
    'COOKIE20': { discount: 20, minOrder: 100 },
    'NEWBIE15': { discount: 15, minOrder: 30 }
  };

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    calculateTotal();
    calculateEstimatedDelivery();
    setItemCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
  }, [cartItems, discount, deliveryOption]);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem(`cart_${user.username}`) || '[]');
    setCartItems(savedCart);
  };

  const calculateTotal = () => {
    const subtotalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(subtotalAmount);
    const couponDiscountAmount = (subtotalAmount * discount) / 100;
    const bulkDiscount = getBulkDiscount();
    const bulkDiscountAmount = (subtotalAmount * bulkDiscount) / 100;
    const totalDiscountAmount = couponDiscountAmount + bulkDiscountAmount;
    const deliveryFee = deliveryOption === 'delivery' ? 5 : 0;
    const taxAmount = (subtotalAmount - totalDiscountAmount + deliveryFee) * 0.08;
    setTax(taxAmount);
    setTotal(subtotalAmount - totalDiscountAmount + deliveryFee + taxAmount);
  };

  const calculateEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDays = deliveryOption === 'delivery' ? 2 : 1;
    const deliveryDate = new Date(today.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
    setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    }));
  };

  const getItemDetails = (item) => {
    const totalPrice = item.price * item.quantity;
    const savings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0;
    return { totalPrice, savings };
  };

  const applyCoupon = () => {
    const coupon = coupons[couponCode.toUpperCase()];
    if (!coupon) {
      alert('Invalid coupon code');
      return;
    }
    if (subtotal < coupon.minOrder) {
      alert(`Minimum order of $${coupon.minOrder} required for this coupon`);
      return;
    }
    setDiscount(coupon.discount);
    alert(`Coupon applied! ${coupon.discount}% discount`);
  };

  const saveForLater = (cookieId) => {
    const item = cartItems.find(item => item.id === cookieId);
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.username}`) || '[]');
    
    if (!wishlist.find(w => w.id === cookieId)) {
      wishlist.push(item);
      localStorage.setItem(`wishlist_${user.username}`, JSON.stringify(wishlist));
    }
    
    removeFromCart(cookieId);
    alert('Item saved to wishlist!');
  };

  const updateQuantity = (cookieId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cookieId);
      return;
    }
    
    if (newQuantity > 50) {
      alert('Maximum 50 items per cookie type allowed');
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === cookieId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(updatedCart));
  };

  const getBulkDiscount = () => {
    if (itemCount >= 50) return 5; // 5% for 50+ items
    if (itemCount >= 25) return 3; // 3% for 25+ items
    if (itemCount >= 10) return 2; // 2% for 10+ items
    return 0;
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

  const checkout = async () => {
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      // Save to localStorage first (always works)
      const order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: cartItems,
        total: total,
        subtotal: subtotal,
        discount: discount,
        deliveryOption: deliveryOption,
        notes: orderNotes,
        customerName: customerName,
        status: 'PENDING'
      };
      
      const orders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
      orders.push(order);
      localStorage.setItem(`orders_${user.username}`, JSON.stringify(orders));
      
      // Try backend but don't fail if it doesn't work
      try {
        for (const item of cartItems) {
          const orderData = {
            customerName: customerName.trim(),
            cookieName: item.cookieName,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity
          };
          await createOrder(orderData);
        }
      } catch (backendError) {
        console.log('Backend unavailable, order saved locally');
      }
      
      alert(`Order placed successfully! Total: ₹${total.toFixed(2)}`);
      clearCart();
      setCustomerName('');
      setOrderNotes('');
      setCouponCode('');
      setDiscount(0);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Order saved locally. Total: ₹' + total.toFixed(2));
    }
    
    setIsCheckingOut(false);
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <div className="header-left">
          <h2>🛒 Shopping Cart</h2>
          {cartItems.length > 0 && (
            <div className="cart-notifications">
              {getBulkDiscount() > 0 && (
                <div className="notification bulk-discount">
                  🎉 {getBulkDiscount()}% Bulk Discount Applied!
                </div>
              )}
              {itemCount >= 100 && (
                <div className="notification warning">
                  ⚠️ Large order - consider splitting for faster processing
                </div>
              )}
            </div>
          )}
        </div>
        <div className="header-actions">
          {cartItems.length > 0 && (
            <>
              <button onClick={() => window.location.href = '/cookies'} className="continue-btn">
                Continue Shopping
              </button>
              <button onClick={clearCart} className="clear-btn">Clear Cart</button>
            </>
          )}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛍️</div>
          <h3>Your cart is empty</h3>
          <p>Add some delicious cookies to get started!</p>
          <button onClick={() => window.location.href = '/cookies'} className="shop-btn">
            Browse Cookies
          </button>
        </div>
      ) : (
        <>
          <div className="cart-stats">
            <div className="stat">
              <span className="stat-number">{itemCount}</span>
              <span className="stat-label">Items</span>
            </div>
            <div className="stat">
              <span className="stat-number">${subtotal.toFixed(2)}</span>
              <span className="stat-label">Subtotal</span>
            </div>
            <div className="stat">
              <span className="stat-number">{estimatedDelivery}</span>
              <span className="stat-label">Est. {deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}</span>
            </div>
          </div>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h3>{item.cookieName}</h3>
                  <p className="flavor">{item.flavor}</p>
                  <div className="price-info">
                    <span className="current-price">${item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="original-price">${item.originalPrice}</span>
                    )}
                  </div>
                  <p className="stock-info">
                    {item.quantityAvailable > 10 ? '✅ In Stock' : 
                     item.quantityAvailable > 0 ? `⚠️ Only ${item.quantityAvailable} left` : 
                     '❌ Out of Stock'}
                  </p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= 50 || item.quantity >= item.quantityAvailable}
                  >
                    +
                  </button>
                  {item.quantity >= 10 && (
                    <span className="bulk-indicator">🎁</span>
                  )}
                </div>
                <div className="item-total">
                  <div className="total-price">${(item.price * item.quantity).toFixed(2)}</div>
                  {getItemDetails(item).savings > 0 && (
                    <div className="savings">Save ${getItemDetails(item).savings.toFixed(2)}</div>
                  )}
                </div>
                <div className="item-actions">
                  <button onClick={() => saveForLater(item.id)} className="save-btn">💾</button>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">×</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="coupon-section">
              <h3>Coupon Code</h3>
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={applyCoupon} className="apply-coupon-btn">Apply</button>
              </div>
              <div className="available-coupons">
                <small>Available: SWEET10 (10% off $50+), COOKIE20 (20% off $100+), NEWBIE15 (15% off $30+)</small>
              </div>
            </div>
            
            <div className="order-details">
              <h3>Order Details</h3>
              <input
                type="text"
                placeholder="Customer Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="customer-name-input"
                required
              />
              
              <div className="delivery-options">
                <label>
                  <input
                    type="radio"
                    value="pickup"
                    checked={deliveryOption === 'pickup'}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                  />
                  Pickup (Free)
                </label>
                <label>
                  <input
                    type="radio"
                    value="delivery"
                    checked={deliveryOption === 'delivery'}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                  />
                  Delivery (+$5)
                </label>
              </div>
              
              <textarea
                placeholder="Order notes (optional)"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="order-notes"
                rows="3"
              />
            </div>
            
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-line">
                  <span>Items ({itemCount}):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-line discount">
                    <span>Coupon Discount ({discount}%):</span>
                    <span>-${((subtotal * discount) / 100).toFixed(2)}</span>
                  </div>
                )}
                {getBulkDiscount() > 0 && (
                  <div className="summary-line discount">
                    <span>Bulk Discount ({getBulkDiscount()}%):</span>
                    <span>-${((subtotal * getBulkDiscount()) / 100).toFixed(2)}</span>
                  </div>
                )}
                {deliveryOption === 'delivery' && (
                  <div className="summary-line">
                    <span>Delivery:</span>
                    <span>$5.00</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-line total">
                  <span>Order Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="delivery-info">
                <h4>Delivery Information</h4>
                <p className="delivery-method">
                  {deliveryOption === 'delivery' ? '🚚 Delivery' : '🏠 Pickup'}
                </p>
                <p className="estimated-delivery">
                  Estimated {deliveryOption === 'delivery' ? 'delivery' : 'ready'}: {estimatedDelivery}
                </p>
              </div>
            </div>
            
            <button 
              onClick={checkout} 
              className="checkout-btn"
              disabled={isCheckingOut || !customerName.trim()}
            >
              {isCheckingOut ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;