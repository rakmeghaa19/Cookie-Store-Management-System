import React, { useState, useEffect } from 'react';
import { getAllOrders, getOrdersByCustomer, updateOrderStatus } from '../../services/api';

const OrderHistoryTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    // Test 1: Get all orders
    try {
      const orders = await getAllOrders();
      addResult('Get All Orders', true, `Found ${orders.length} orders`);
    } catch (error) {
      addResult('Get All Orders', false, error.message);
    }

    // Test 2: Get orders by customer
    try {
      const customerOrders = await getOrdersByCustomer('john_doe');
      addResult('Get Customer Orders', true, `Found ${customerOrders.length} orders for john_doe`);
    } catch (error) {
      addResult('Get Customer Orders', false, error.message);
    }

    // Test 3: Update order status
    try {
      const orders = await getAllOrders();
      if (orders.length > 0) {
        const firstOrder = orders[0];
        await updateOrderStatus(firstOrder.id, 'CONFIRMED');
        addResult('Update Order Status', true, `Updated order ${firstOrder.id} to CONFIRMED`);
      } else {
        addResult('Update Order Status', false, 'No orders found to update');
      }
    } catch (error) {
      addResult('Update Order Status', false, error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 Order History API Test</h2>
      
      <button 
        onClick={runTests} 
        disabled={loading}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Running Tests...' : 'Run API Tests'}
      </button>

      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
        <h3>Test Results:</h3>
        {testResults.length === 0 && !loading && (
          <p>Click "Run API Tests" to test the order functionality</p>
        )}
        
        {testResults.map((result, index) => (
          <div 
            key={index}
            style={{
              padding: '10px',
              margin: '5px 0',
              borderRadius: '3px',
              background: result.success ? '#d4edda' : '#f8d7da',
              border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
              color: result.success ? '#155724' : '#721c24'
            }}
          >
            <strong>{result.success ? '✅' : '❌'} {result.test}</strong>
            <br />
            <small>{result.timestamp}: {result.message}</small>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>What this tests:</strong></p>
        <ul>
          <li>Backend API connectivity</li>
          <li>Order retrieval functionality</li>
          <li>Customer-specific order filtering</li>
          <li>Order status update capability</li>
        </ul>
      </div>
    </div>
  );
};

export default OrderHistoryTest;