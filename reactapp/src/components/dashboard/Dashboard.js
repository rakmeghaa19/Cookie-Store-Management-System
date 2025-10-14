import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalCookies: 0,
    popularFlavor: 'Loading...',
    revenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    recentActivity: []
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadDashboardData();
    updateGreeting();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const loadDashboardData = async () => {
    try {
      // Import API functions
      const { getAllCookies, getAllOrders } = await import('../../services/api');
      
      // Fetch data from backend
      const [cookiesRes, ordersRes] = await Promise.all([
        getAllCookies().catch(() => ({ data: [] })),
        getAllOrders().catch(() => [])
      ]);
      
      const cookies = cookiesRes.data || [];
      const orders = ordersRes || [];
      
      // Calculate statistics
      const totalCookies = cookies.reduce((sum, cookie) => sum + cookie.quantityAvailable, 0);
      
      const flavorCounts = cookies.reduce((acc, cookie) => {
        acc[cookie.flavor] = (acc[cookie.flavor] || 0) + cookie.quantityAvailable;
        return acc;
      }, {});
      
      const popularFlavor = Object.keys(flavorCounts).length > 0 
        ? Object.keys(flavorCounts).reduce((a, b) => flavorCounts[a] > flavorCounts[b] ? a : b)
        : 'None';
      
      const revenue = orders
        .filter(order => order.status === 'COMPLETED')
        .reduce((sum, order) => sum + order.totalPrice, 0);
      
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => 
        ['PENDING', 'PROCESSING', 'CONFIRMED'].includes(order.status)
      ).length;
      
      // Recent activity from actual orders
      const recentActivity = orders
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 5)
        .map(order => ({
          type: 'order',
          message: `Order #${order.id} - ${order.customerName} - ${order.cookieName}`,
          time: new Date(order.orderDate).toLocaleTimeString(),
          status: order.status
        }));
      
      setStats({ totalCookies, popularFlavor, revenue, totalOrders, pendingOrders, recentActivity });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Fallback to demo data
      setStats({
        totalCookies: 1250,
        popularFlavor: 'Chocolate',
        revenue: 15420,
        totalOrders: 89,
        pendingOrders: 12,
        recentActivity: [
          { type: 'order', message: 'Order #1001 - John Doe - Chocolate Chip', time: '2:30 PM', status: 'PENDING' },
          { type: 'order', message: 'Order #1002 - Jane Smith - Double Chocolate', time: '1:45 PM', status: 'COMPLETED' }
        ]
      });
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>{greeting}, {user.username}! 👋</h1>
          <p className="role-indicator">Role: {user.role}</p>
          <p className="current-time">{currentTime.toLocaleString()}</p>
        </div>
        <div className="weather-widget">
          <div className="weather-icon">☀️</div>
          <div className="weather-info">
            <span>Perfect day for cookies!</span>
            <small>Cookie Store Weather</small>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card zoom-hover">
            <div className="stat-icon">🍪</div>
            <div className="stat-info">
              <h3>Total Cookies</h3>
              <p className="stat-number">{stats.totalCookies}</p>
              <small className="stat-trend">+2 this week</small>
            </div>
          </div>
          
          <div className="stat-card zoom-hover">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Popular Flavor</h3>
              <p className="stat-text">{stats.popularFlavor}</p>
              <small className="stat-trend">Trending up</small>
            </div>
          </div>
          
          <div className="stat-card zoom-hover">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.totalOrders}</p>
              <small className="stat-trend">{stats.pendingOrders} pending</small>
            </div>
          </div>
          
          {user.role === 'ADMIN' && (
            <div className="stat-card zoom-hover">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>Total Value</h3>
                <p className="stat-number">${stats.revenue.toFixed(2)}</p>
                <small className="stat-trend">Revenue overview</small>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-grid">
          <div className="activity-feed">
            <h2>📈 Recent Activity</h2>
            <div className="activity-list">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.status === 'COMPLETED' ? '✅' : 
                       activity.status === 'PENDING' ? '⏳' : 
                       activity.status === 'PROCESSING' ? '🔄' : '📦'}
                    </div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <small>{activity.time} - <span className={`status-${activity.status?.toLowerCase()}`}>{activity.status}</span></small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activity">
                  <p>No recent activity</p>
                  <small>Orders will appear here once placed!</small>
                </div>
              )}
            </div>
          </div>

          <div className="quick-actions">
            <h2>🚀 Actions</h2>
            <div className="actions-grid">
              <button 
                onClick={() => window.location.href = '/cookies'}
                className="action-btn zoom-hover"
              >
                🍪 Cookies
              </button>
              {user.role === 'USER' && (
                <>
                  <button 
                    onClick={() => window.location.href = '/cart'}
                    className="action-btn zoom-hover"
                  >
                    🛒 Cart
                  </button>
                  <button 
                    onClick={() => window.location.href = '/orders'}
                    className="action-btn zoom-hover"
                  >
                    📦 Orders
                  </button>
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <button 
                    onClick={() => window.location.href = '/admin'}
                    className="action-btn admin zoom-hover"
                  >
                    ⚙️ Admin
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin-orders'}
                    className="action-btn admin zoom-hover"
                  >
                    📋 Orders
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;