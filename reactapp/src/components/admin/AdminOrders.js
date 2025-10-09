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
      let allOrdersList = [];
      
      // Try to load from backend
      try {
        const backendOrders = await getAllOrders();
        allOrdersList = [...backendOrders];
      } catch (error) {
        console.log('Backend orders not available');
      }
      
      // Load from localStorage for all users
      const allLocalStorageKeys = Object.keys(localStorage);
      const orderKeys = allLocalStorageKeys.filter(key => key.startsWith('orders_'));
      
      orderKeys.forEach(key => {
        try {
          const userOrders = JSON.parse(localStorage.getItem(key) || '[]');
          allOrdersList = [...allOrdersList, ...userOrders];
        } catch (error) {
          console.log(`Error loading orders from ${key}`);
        }
      });
      
      // Remove duplicates based on order ID
      const uniqueOrders = allOrdersList.filter((order, index, self) => 
        index === self.findIndex(o => o.id === order.id)
      );
      
      setAllOrders(uniqueOrders.sort((a, b) => 
        new Date(b.orderDate || b.date) - new Date(a.orderDate || a.date)
      ));
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
      // Try to update in backend
      try {
        await updateOrderStatus(orderId, newStatus);
      } catch (error) {
        console.log('Backend update failed, updating localStorage');
      }
      
      // Update in localStorage for all users
      const allLocalStorageKeys = Object.keys(localStorage);
      const orderKeys = allLocalStorageKeys.filter(key => key.startsWith('orders_'));
      
      orderKeys.forEach(key => {
        try {
          const userOrders = JSON.parse(localStorage.getItem(key) || '[]');
          const orderFound = userOrders.find(order => order.id === orderId);
          if (orderFound) {
            const updatedOrders = userOrders.map(order => 
              order.id === orderId ? { ...order, status: newStatus } : order
            );
            localStorage.setItem(key, JSON.stringify(updatedOrders));
            console.log(`Updated order ${orderId} status to ${newStatus} in ${key}`);
          }
        } catch (error) {
          console.error(`Error updating orders in ${key}:`, error);
        }
      });
      
      alert(`Order status updated to ${newStatus}`);
      loadAllOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED': case 'DELIVERED': return '#22c55e';
      case 'PENDING': return '#ffc107';
      case 'CONFIRMED': return '#007bff';
      case 'PROCESSING': return '#f59e0b';
      case 'SHIPPED': return '#3b82f6';
      case 'CANCELLED': return '#ef4444';
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
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
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
                  <span className="order-total">${(order.total || order.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="order-items">
                {(order.items || order.orderItems || []).map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.cookieName || item.name}</span>
                    <span>{item.flavor} × {item.quantity}</span>
                    <span>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-actions">
                {(order.status === 'CONFIRMED' || order.status === 'PENDING') && (
                  <button 
                    onClick={() => handleUpdateOrderStatus(order.id, 'PROCESSING')}
                    className="process-btn"
                  >
                    🔄 Start Processing
                  </button>
                )}
                {order.status === 'PROCESSING' && (
                  <>
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                      className="ship-btn"
                    >
                      🚚 Ship Order
                    </button>
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                      className="cancel-btn"
                    >
                      ❌ Cancel
                    </button>
                  </>
                )}
                {order.status === 'SHIPPED' && (
                  <button 
                    onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                    className="deliver-btn"
                  >
                    ✅ Mark Completed
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