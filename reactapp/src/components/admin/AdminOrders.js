import React, { useState, useEffect } from 'react';
import './AdminOrders.css';

const AdminOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadAllOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [allOrders, statusFilter]);

  const loadAllOrders = () => {
    const users = ['admin', 'user'];
    let orders = [];
    
    users.forEach(username => {
      const userOrders = JSON.parse(localStorage.getItem(`orders_${username}`) || '[]');
      orders = [...orders, ...userOrders.map(order => ({ ...order, username }))];
    });
    
    setAllOrders(orders.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const filterOrders = () => {
    if (statusFilter === 'All') {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(order => order.status === statusFilter));
    }
  };

  const updateOrderStatus = (orderId, username, newStatus) => {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${username}`) || '[]');
    const updatedOrders = userOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    localStorage.setItem(`orders_${username}`, JSON.stringify(updatedOrders));
    loadAllOrders();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return '#22c55e';
      case 'Processing': return '#f59e0b';
      case 'Shipped': return '#3b82f6';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h2>📋 Order Management</h2>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="All">All Orders ({allOrders.length})</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">No orders found</div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={`${order.username}-${order.id}`} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p>Customer: {order.username}</p>
                  <p>{new Date(order.date).toLocaleDateString()}</p>
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
                    <span>{item.cookieName}</span>
                    <span>{item.flavor} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-actions">
                {order.status === 'Processing' && (
                  <>
                    <button 
                      onClick={() => updateOrderStatus(order.id, order.username, 'Shipped')}
                      className="ship-btn"
                    >
                      Ship Order
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, order.username, 'Cancelled')}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {order.status === 'Shipped' && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, order.username, 'Delivered')}
                    className="deliver-btn"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;