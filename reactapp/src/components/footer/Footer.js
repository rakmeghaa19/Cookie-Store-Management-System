import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Links</h3>
          <ul>
            <li>Home</li>
            <li>Buy Cookies</li>
            <li>Diwali Gifting</li>
            <li>Gifting</li>
            <li>Chocolates</li>
            <li>Blog</li>
            <li>FAQ</li>
            <li>Stores</li>
            <li>Track Your Order</li>
            <li>My account</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Cookies</h3>
          <ul>
            <li>All Cookies</li>
            <li>Chocolate Cookies</li>
            <li>Gourmet Cookies</li>
            <li>Healthy Cookies</li>
            <li>Combo Cookies</li>
          </ul>
        </div>



        <div className="footer-section">
          <h3>Cookie Flavours</h3>
          <ul>
            <li>Chocolate</li>
            <li>Strawberry</li>
            <li>Butter Mint</li>
            <li>Vanilla</li>
          </ul>
        </div>

      </div>
      
      <div className="get-in-touch-section">
        <div className="contact-info-horizontal">
          <h3>Get in touch</h3>
          <div className="contact-details">
            <p>📞 +91 99529 72111</p>
            <p>✉️ Email us</p>
            <div className="social-links-horizontal">
              <span>Follow us:</span>
              <span>📷 Instagram</span>
              <span>📘 Facebook</span>
              <span>🎥 YouTube</span>
              <span>🐦 Twitter</span>
              <span>💼 LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-links">
          <span>Search</span>
          <span>Terms</span>
          <span>Privacy Policy</span>
          <span>Refund Policy</span>
          <span>Track Your Order</span>
        </div>
        <p>Powered by Cookie Store Management System</p>
      </div>
    </footer>
  );
};

export default Footer;