import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const handleSocialClick = (platform) => {
    alert(`You clicked on ${platform}!`);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Your trusted grocery store for fresh and organic products.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <p><a href="/home">Home</a></p>
          <p><a href="/about">About</a></p>
          <p><a href="/contact">Contact</a></p>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>
            <a href="#" onClick={() => handleSocialClick("Facebook")}>
              <FontAwesomeIcon icon={faFacebook} /> Facebook
            </a>
            <br />
            <a href="#" onClick={() => handleSocialClick("Instagram")}>
              <FontAwesomeIcon icon={faInstagram} /> Instagram
            </a>
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Radhe Grocery Shop | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
