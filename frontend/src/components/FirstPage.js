import React from "react";
import { Link } from "react-router-dom";
import "./FirstPage.css";
import "./Home.css";

const FirstPage = () => {
  return (
    <div className="firstpage" style={{ background: "#1a1a1a", minHeight: "100vh", color: "#fff" }}>
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Radhe Grocery Shop</h1>
          <p>Your one-stop destination for fresh groceries</p>
        </div>
      </div>

      <div className="featured-products">
        <h2>Get Started</h2>
        <div className="category-list">
          <Link to="/login" className="category-card">
            <h3>Login</h3>
            <p>Already have an account? Sign in here</p>
          </Link>
          <Link to="/signup" className="category-card">
            <h3>Sign Up</h3>
            <p>New to Radhe Grocery? Create an account</p>
          </Link>
        </div>
      </div>

      <div className="categories">
        <h2>Why Choose Us?</h2>
        <div className="category-list">
          <div className="category-card">
            <h3>Fresh Products</h3>
            <p>We source our products directly from local farmers</p>
          </div>
          <div className="category-card">
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery to your doorstep</p>
          </div>
          <div className="category-card">
            <h3>Best Prices</h3>
            <p>Competitive prices with regular discounts</p>
          </div>
        </div>
      </div>

      <div className="promotions">
        <div className="promotion-banner">
          <p>Start your fresh grocery journey today!</p>
          <Link to="/signup">
            <button className="shop-now">Join Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;