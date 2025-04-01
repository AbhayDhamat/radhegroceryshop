import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Store token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show success message and redirect
      alert("✅ Signup successful!");
      navigate("/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "2px solid #4CAF50",
    background: "#2d2d2d",
    color: "#fff",
    fontSize: "16px"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#4CAF50",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "left"
  };

  const errorStyle = {
    color: "#ff6b6b",
    marginTop: "20px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "rgba(255, 107, 107, 0.1)"
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Create Account</h1>
          <p>Join Radhe Grocery Shop today</p>
        </div>
      </div>

      <div className="featured-products">
        <div className="category-list">
          <div className="category-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Mobile Number</label>
                <input
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  style={inputStyle}
                />
              </div>

              <button 
                type="submit" 
                className="shop-now" 
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              {error && <p style={errorStyle}>{error}</p>}
            </form>
          </div>
        </div>
      </div>

      <div className="promotions">
        <div className="promotion-banner">
          <p>Already have an account?</p>
          <button onClick={() => navigate("/login")} className="shop-now">
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
