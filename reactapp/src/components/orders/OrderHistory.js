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
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, dateFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let backendOrders = [];
      
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        const response = await getAllOrders();
        backendOrders = response || [];
      } else {
        // For regular users, try to get their orders by name
        try {
          const response = await getOrdersByCustomer(user.username);
          backendOrders = response || [];
        } catch (error) {
          console.log('No backend orders found for user');
        }
      }
      
      // Also load localStorage orders for compatibility
      const localOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
      
      // Combine and deduplicate orders
      const allOrders = [...backendOrders, ...localOrders];
      const uniqueOrders = allOrders.filter((order, index, self) => 
        index === self.findIndex(o => o.id === order.id)
      );
      
      setOrders(uniqueOrders.sort((a, b) => 
        new Date(b.orderDate || b.date) - new Date(a.orderDate || a.date)
      ));
    } catch (error) {
      console.error('Error loading orders:', error);
      // Fallback to localStorage only
      const savedOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
      setOrders(savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
    setLoading(false);
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (statusFilter) {
      filtered = filtered.filter(order => 
        order.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate || order.date);
        return orderDate.toDateString() === filterDate.toDateString();
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
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        await updateOrderStatus(orderId, 'CANCELLED');
      }
      
      // Update local storage
      const localOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
      const updatedOrders = localOrders.map(order => 
        order.id === orderId ? { ...order, status: 'CANCELLED' } : order
      );
      localStorage.setItem(`orders_${user.username}`, JSON.stringify(updatedOrders));
      
      loadOrders();
      alert('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED': case 'DELIVERED': return '#28a745';
      case 'PENDING': return '#ffc107';
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

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="order-history">
      <div className="orders-header">
        <h2>📦 Order History</h2>
        <div className="header-controls">
          <span className="order-count">{filteredOrders.length} of {orders.length} orders</span>
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
          <p>{orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}</p>
          <button onClick={() => window.location.href = '/cookies'} className="shop-btn">
            Start Shopping
          </button>
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
                    {order.status || 'PENDING'}
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
                  Reorder
                </button>
                
                {(order.status === 'PENDING' || order.status === 'Processing') && (
                  <button 
                    onClick={() => cancelOrder(order.id)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
              
              {selectedOrder === order.id && (
                <div className="order-details-expanded">
                  <h4>Order Details</h4>
                  <div className="detail-grid">
                    <div><strong>Order ID:</strong> {order.id}</div>
                    <div><strong>Date:</strong> {getOrderDate(order)}</div>
                    <div><strong>Status:</strong> {order.status || 'PENDING'}</div>
                    <div><strong>Total:</strong> ${getOrderTotal(order).toFixed(2)}</div>
                    {order.deliveryOption && (
                      <div><strong>Delivery:</strong> {order.deliveryOption}</div>
                    )}
                    {order.discount > 0 && (
                      <div><strong>Discount:</strong> {order.discount}%</div>
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