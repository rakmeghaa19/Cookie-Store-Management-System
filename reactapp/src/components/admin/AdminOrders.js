import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
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

  const loadAllOrders = async () => {
    try {
      const orders = await getAllOrders();
      setAllOrders(orders.sort((a, b) => new Date(b.orderDate || b.date) - new Date(a.orderDate || a.date)));
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const filterOrders = () => {
    if (statusFilter === 'All') {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(order => order.status === statusFilter));
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadAllOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
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
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p>Customer: {order.customerName || order.username}</p>
                  <p>{new Date(order.orderDate || order.date).toLocaleDateString()}</p>
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
                {(order.items || order.orderItems || []).map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.cookieName || item.name}</span>
                    <span>{item.flavor} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-actions">
                {order.status === 'Processing' && (
                  <>
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                      className="ship-btn"
                    >
                      Ship Order
                    </button>
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {order.status === 'Shipped' && (
                  <button 
                    onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
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