import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import axios from 'axios'
const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {

      await axios.post("https://8080-fecafffabfdabaaeaedaacebfbabbcbebecf.premiumproject.examly.io/api/auth/register",formData)
      alert("Registered Sucessfully")
              navigate('/login');
    } catch (err) {
      setError('Network error');
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand-header">
          <div className="cookie-logo">🍪</div>
          <h1 className="brand-name">LuxeBite M's Cookie</h1>
          <p className="brand-tagline">Premium Handcrafted Cookies</p>
        </div>
        <h2>Join Our Family</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <span onClick={() => navigate('/login')} className="link">Login</span></p>
      </div>
    </div>
  );
};

export default Register;