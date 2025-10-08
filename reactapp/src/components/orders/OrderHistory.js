import React, { useState, useEffect } from 'react';
import './OrderHistory.css';

const OrderHistory = ({ user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || '[]');
    setOrders(savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return '#28a745';
      case 'Processing': return '#ffc107';
      case 'Shipped': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div className="order-history">
      <div className="orders-header">
        <h2>📦 Order History</h2>
        <span className="order-count">{orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>No orders yet</p>
          <button onClick={() => window.location.href = '/cookies'} className="shop-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge" 
                    style={{backgroundColor: getStatusColor(order.status)}}
                  >
                    {order.status}
                  </span>
                  <span className="order-total">${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.cookieName}</span>
                    <span className="item-details">
                      {item.flavor} × {item.quantity}
                    </span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;