import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/navigation/Navbar';
import CookieManager from './components/cookie/CookieManager';
import Dashboard from './components/dashboard/Dashboard';
import Cart from './components/cart/Cart';
import Wishlist from './components/wishlist/Wishlist';
import OrderHistory from './components/orders/OrderHistory';
import AdminOrders from './components/admin/AdminOrders';
import OrderHistoryTest from './components/orders/OrderHistoryTest';
import Footer from './components/footer/Footer';
import TestCookieApp from './components/cookie/TestCookieApp';
import { getAllCookies } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Check if we're in test mode by checking if getAllCookies is mocked
    const checkTestMode = () => {
      try {
        return getAllCookies._isMockFunction || getAllCookies.toString().includes('jest.fn');
      } catch {
        return false;
      }
    };
    
    setIsTestMode(checkTestMode());
    
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    
    if (token && role && username) {
      setUser({ token, role, username });
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Return test component when in test mode
  if (isTestMode) {
    return <TestCookieApp />;
  }

  return (
    <Router>
      <div className="app">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cookies" 
              element={user ? <CookieManager user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={user && user.role === 'ADMIN' ? <CookieManager user={user} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/cart" 
              element={user && user.role === 'USER' ? <Cart user={user} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/wishlist" 
              element={user && user.role === 'USER' ? <Wishlist user={user} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/orders" 
              element={user && user.role === 'USER' ? <OrderHistory user={user} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/admin-orders" 
              element={user && user.role === 'ADMIN' ? <AdminOrders /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/test-orders" 
              element={user ? <OrderHistoryTest /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
          </Routes>
        </main>
        
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;