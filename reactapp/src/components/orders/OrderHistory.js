import React, { useState, useEffect } from 'react';
import { getAllOrders, getOrdersByCustomer, updateOrderStatus } from '../../services/api';
import './OrderHistory.css';

const OrderHistory = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
    // Auto-refresh orders every 30 seconds to show admin updates
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, dateFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let backendOrders = [];
      let hasBackendOrders = false;
      
      // Try to load from backend first
      try {
        if (user.role === 'ADMIN' || user.role === 'MANAGER') {
          backendOrders = await getAllOrders();
        } else {
          backendOrders = await getOrdersByCustomer(user.username);
        }
        hasBackendOrders = Array.isArray(backendOrders) && backendOrders.length > 0;
        console.log('Backend orders loaded:', backendOrders);
      } catch (backendError) {
        console.log('Backend not available, using local storage:', backendError.message);
      }
      
      // Load from localStorage
      const localOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
      console.log('Local orders loaded:', localOrders);
      
      // Combine backend and local orders, prioritizing backend
      let allOrders = [];
      if (hasBackendOrders) {
        // Use backend orders and merge with local orders that don't exist in backend
        const backendOrderIds = new Set(backendOrders.map(order => order.id));
        const uniqueLocalOrders = localOrders.filter(order => !backendOrderIds.has(order.id));
        allOrders = [...backendOrders, ...uniqueLocalOrders];
      } else {
        // Use only local orders if backend is not available
        allOrders = localOrders;
      }
      
      // Sort by date (newest first)
      allOrders.sort((a, b) => {
        const dateA = new Date(a.orderDate || a.date);
        const dateB = new Date(b.orderDate || b.date);
        return dateB - dateA;
      });
      
      setOrders(allOrders);
      console.log('Final orders set:', allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Final fallback to localStorage only
      const savedOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
      setOrders(savedOrders.sort((a, b) => new Date(b.date || b.orderDate) - new Date(a.date || a.orderDate)));
    }
    setLoading(false);
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (statusFilter) {
      filtered = filtered.filter(order => {
        const orderStatus = (order.status || 'PENDING').toUpperCase();
        return orderStatus === statusFilter.toUpperCase();
      });
    }
    
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate || order.date);
        // Compare dates without time
        const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
        const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
        return orderDateOnly.getTime() === filterDateOnly.getTime();
      });
    }
    
    setFilteredOrders(filtered);
  };

  const reorderItems = (order) => {
    const cart = JSON.parse(localStorage.getItem(`cart_${user.username}`) || '[]');
    
    if (order.items) {
      // Local order format
      order.items.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          cart.push({ ...item });
        }
      });
    } else {
      // Backend order format
      const existingItem = cart.find(cartItem => cartItem.cookieName === order.cookieName);
      if (existingItem) {
        existingItem.quantity += order.quantity;
      } else {
        cart.push({
          id: Date.now(),
          cookieName: order.cookieName,
          quantity: order.quantity,
          price: Math.round(order.totalPrice / order.quantity)
        });
      }
    }
    
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    alert('Items added to cart!');
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      // Try to cancel via backend API first
      try {
        await updateOrderStatus(orderId, 'CANCELLED');
        alert('Order cancelled successfully');
      } catch (backendError) {
        console.log('Backend cancel failed, updating local storage:', backendError);
        // Fallback to local storage update
        const localOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
        const updatedOrders = localOrders.map(order => 
          order.id === orderId ? { ...order, status: 'CANCELLED' } : order
        );
        localStorage.setItem(`orders_${user.username}`, JSON.stringify(updatedOrders));
        alert('Order cancelled successfully');
      }
      
      // Reload orders to reflect changes
      loadOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED': case 'DELIVERED': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'CONFIRMED': return '#007bff';
      case 'PROCESSING': return '#17a2b8';
      case 'SHIPPED': return '#6f42c1';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getOrderTotal = (order) => {
    if (order.total) return order.total;
    if (order.totalPrice) return order.totalPrice;
    if (order.items) {
      return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    return 0;
  };

  const getOrderDate = (order) => {
    return new Date(order.orderDate || order.date).toLocaleDateString();
  };

  const getTrackingSteps = (currentStatus) => {
    const steps = [
      { status: 'CONFIRMED', label: 'Order Confirmed', icon: '✅' },
      { status: 'PROCESSING', label: 'Processing', icon: '🔄' },
      { status: 'SHIPPED', label: 'Shipped', icon: '🚚' },
      { status: 'COMPLETED', label: 'Delivered', icon: '📦' }
    ];
    
    const statusOrder = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const downloadBill = (order) => {
    const currentDate = new Date().toLocaleString();
    const billContent = `
===============================================
           🍪 PREMIUM COOKIE STORE
===============================================

INVOICE #${order.id}
Generated: ${currentDate}

-----------------------------------------------
CUSTOMER INFORMATION:
-----------------------------------------------
Name: ${order.customerName || user.username}
Order Date: ${getOrderDate(order)}
Status: ${(order.status || 'PENDING').toUpperCase()}

-----------------------------------------------
ORDER DETAILS:
-----------------------------------------------
${order.items ? order.items.map((item, index) => 
  `${index + 1}. ${item.cookieName}\n   Flavor: ${item.flavor || 'N/A'}\n   Quantity: ${item.quantity}\n   Unit Price: $${item.price.toFixed(2)}\n   Total: $${(item.price * item.quantity).toFixed(2)}\n`
).join('\n') : 
  `1. ${order.cookieName}\n   Quantity: ${order.quantity}\n   Total: $${order.totalPrice?.toFixed(2)}\n`
}
-----------------------------------------------
PAYMENT SUMMARY:
-----------------------------------------------
Subtotal: $${(order.subtotal || getOrderTotal(order)).toFixed(2)}
${order.discount > 0 ? `Discount (${order.discount}%): -$${((order.subtotal || getOrderTotal(order)) * order.discount / 100).toFixed(2)}\n` : ''}${order.deliveryOption === 'delivery' ? 'Delivery Fee: $5.00\n' : 'Delivery Fee: $0.00 (Pickup)\n'}${order.tax ? `Tax (8%): $${order.tax.toFixed(2)}\n` : ''}\nTOTAL AMOUNT: $${getOrderTotal(order).toFixed(2)}

-----------------------------------------------
PAYMENT & DELIVERY:
-----------------------------------------------
Payment Method: ${order.paymentMethod === 'card' ? '💳 Card Payment' : '💰 Cash on Delivery'}
Delivery Type: ${order.deliveryOption === 'delivery' ? '🚚 Home Delivery' : '🏠 Store Pickup'}
${order.notes ? `Special Notes: ${order.notes}\n` : ''}
===============================================
Thank you for choosing Premium Cookie Store!
Visit us again for more delicious treats!
===============================================
    `;
    
    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="loading" style={{textAlign: 'center', padding: '50px'}}>
      <div style={{fontSize: '18px', marginBottom: '10px'}}>📦 Loading your orders...</div>
      <div style={{fontSize: '14px', color: '#666'}}>Please wait while we fetch your order history</div>
    </div>
  );

  return (
    <div className="order-history">
      <div className="orders-header">
        <h2>📦 Order History</h2>
        <div className="header-controls">
          <span className="order-count">{filteredOrders.length} of {orders.length} orders</span>
          <button onClick={() => window.location.href = '/cookies'} className="browse-cookies-btn">
            🍪 Browse Cookies
          </button>
          <button onClick={loadOrders} className="refresh-btn">🔄 Refresh</button>
        </div>
      </div>

      <div className="order-filters">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-filter"
        />
        
        <button 
          onClick={() => { setStatusFilter(''); setDateFilter(''); }}
          className="clear-filters-btn"
        >
          Clear Filters
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <p>{orders.length === 0 ? 'No orders found. Start shopping to see your order history!' : 'No orders match your current filters'}</p>
          <button onClick={() => window.location.href = '/cookies'} className="shop-btn">
            🍪 Browse Cookies
          </button>
          {orders.length === 0 && (
            <p style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
              Orders will appear here after you place them
            </p>
          )}
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">{getOrderDate(order)}</p>
                  {order.customerName && (
                    <p className="customer-name">Customer: {order.customerName}</p>
                  )}
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge" 
                    style={{backgroundColor: getStatusColor(order.status)}}
                  >
                    {(order.status || 'PENDING').toUpperCase()}
                  </span>
                  <span className="order-total">${getOrderTotal(order).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="order-items">
                {order.items ? (
                  order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.cookieName}</span>
                      <span className="item-details">
                        {item.flavor} × {item.quantity}
                      </span>
                      <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <div className="order-item">
                    <span className="item-name">{order.cookieName}</span>
                    <span className="item-details">× {order.quantity}</span>
                    <span className="item-price">${order.totalPrice?.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              {order.notes && (
                <div className="order-notes">
                  <strong>Notes:</strong> {order.notes}
                </div>
              )}
              
              {order.paymentMethod && (
                <div className="payment-info">
                  <strong>Payment:</strong> 
                  {order.paymentMethod === 'card' ? '💳 Card Payment' : '💰 Cash on Delivery'}
                </div>
              )}
              
              <div className="order-actions">
                <button 
                  onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  className="details-btn"
                >
                  {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                </button>
                
                <button 
                  onClick={() => reorderItems(order)}
                  className="reorder-btn"
                >
                  🔄 Reorder
                </button>
                
                <button 
                  onClick={() => downloadBill(order)}
                  className="download-btn"
                >
                  💾 Download Bill
                </button>
                
                <button 
                  onClick={() => cancelOrder(order.id)}
                  className="cancel-btn"
                  disabled={order.status === 'CANCELLED' || order.status === 'COMPLETED' || order.status === 'DELIVERED'}
                >
                  {order.status === 'CANCELLED' ? 'Cancelled' : 
                   (order.status === 'COMPLETED' || order.status === 'DELIVERED') ? 'Cannot Cancel' : '❌ Cancel Order'}
                </button>
              </div>
              
              {selectedOrder === order.id && (
                <div className="order-details-expanded">
                  <div className="tracking-section">
                    <h4>📍 Order Tracking</h4>
                    <div className="tracking-timeline">
                      {getTrackingSteps(order.status || 'CONFIRMED').map((step, index) => (
                        <div key={step.status} className={`tracking-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                          <div className="step-icon">{step.icon}</div>
                          <div className="step-content">
                            <div className="step-label">{step.label}</div>
                            <div className="step-status">
                              {step.completed ? 'Completed' : step.active ? 'In Progress' : 'Pending'}
                            </div>
                          </div>
                          {index < 3 && <div className={`step-connector ${step.completed ? 'completed' : ''}`}></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <h4>Order Details</h4>
                  <div className="detail-grid">
                    <div><strong>Order ID:</strong> {order.id}</div>
                    <div><strong>Date:</strong> {getOrderDate(order)}</div>
                    <div><strong>Status:</strong> {(order.status || 'PENDING').toUpperCase()}</div>
                    <div><strong>Total:</strong> ${getOrderTotal(order).toFixed(2)}</div>
                    {order.deliveryOption && (
                      <div><strong>Delivery:</strong> {order.deliveryOption}</div>
                    )}
                    {order.discount > 0 && (
                      <div><strong>Discount:</strong> {order.discount}%</div>
                    )}
                    {order.paymentMethod && (
                      <div><strong>Payment:</strong> 
                        {order.paymentMethod === 'card' ? '💳 Card' : '💰 Cash on Delivery'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;