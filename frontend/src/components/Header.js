import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsAdmin(decoded.role === "admin");
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAdmin(false);
      }
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <header className="header">
      {/* Logo Section - Always Visible */}
      <div className="logo-container">
        <img 
          src="https://tse3.mm.bing.net/th?id=OIP.XwJSXivE1p2iHc4_55F7SAHaFJ&pid=Api&P=0&h=220" 
          alt="Radhe Grocery Logo" 
          className="logo-img"
        />
        <div className="logo-text">Radhe Grocery Shop</div>
      </div>

      {/* Menu Toggle Button for Mobile */}
      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>

      {/* Navigation Menu */}
      <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
        {/* Links for Regular Users */}
        {!isAdmin && (
          <>
            <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>About</NavLink>
            <NavLink to="/features" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Features</NavLink>
            <NavLink to="/blogs" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Blogs</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Contact</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Profile</NavLink>
            
            <NavLink to="/order" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Order
            </NavLink>
          </>
        )}

        {/* Links for Admins */}
        {isAdmin && (
          <>
            <NavLink to="/admincontacts" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Users All Feedback
            </NavLink>
            <NavLink to="/adminorders" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Users All Orders
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Manage Categories
            </NavLink>
          </>
        )}

        {/* Logout Button - Visible for All */}
        <button onClick={handleLogout} className="nav-link logout-btn">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
