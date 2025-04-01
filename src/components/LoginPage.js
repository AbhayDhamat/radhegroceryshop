import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";
import "./Home.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    number: "", 
    password: "",
  });
  const [error, setError] = useState("");
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.password = formData.password.trim(); 

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setPopup(true);
        setTimeout(() => {
          setPopup(false);
          navigate("/Home");
        }, 2000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login" style={{ background: "#1a1a1a", minHeight: "100vh", color: "#fff" }}>
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Login</h1>
          <p>Welcome back to Radhe Grocery</p>
        </div>
      </div>

      <div className="featured-products">
        <div className="category-list">
          <div className="category-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h3>Login</h3>
            {error && <p style={{ color: "#ff4444", marginBottom: "1rem" }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    background: "#2d2d2d",
                    border: "1px solid #4CAF50",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="number">Phone Number</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    background: "#2d2d2d",
                    border: "1px solid #4CAF50",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    background: "#2d2d2d",
                    border: "1px solid #4CAF50",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                />
              </div>
              <button
                type="submit"
                className="shop-now"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                Login
              </button>
            </form>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <Link to="/forget" style={{ color: "#4CAF50", textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {popup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Login Successful!</h3>
            <p>Redirecting...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
