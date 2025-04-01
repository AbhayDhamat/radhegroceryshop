import React, { useState } from "react";
import "./Contact.css";
import "./Home.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    rating: 0,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData((prevState) => ({ ...prevState, rating }));
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission using fetch()
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "", rating: 0 });

        // Hide success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="contact" style={{ background: "#1a1a1a", minHeight: "100vh", color: "#fff" }}>
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="featured-products">
        <h2>Get in Touch</h2>
        <div className="category-list">
          <div className="category-card">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
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
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
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
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
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
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    background: "#2d2d2d",
                    border: "1px solid #4CAF50",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                ></textarea>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Rating:</label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${formData.rating >= star ? "filled" : ""}`}
                    onClick={() => handleRatingChange(star)}
                    style={{
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: formData.rating >= star ? "yellow" : "gray"
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button
                type="submit"
                className="shop-now"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="category-card">
            <h3>Contact Information</h3>
            <div style={{ textAlign: "left" }}>
              <p><strong>Address:</strong><br />123 Grocery Street<br />Ahemdabad, Gujarat , India</p>
              <p><strong>Phone:</strong><br />+91 9586811464</p>
              <p><strong>Email:</strong><br />radhegroceryshop@gmail.com</p>
              <p><strong>Hours:</strong><br />Mon-Sat: 9:00 AM - 9:00 PM<br />Sun: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="promotions">
        <div className="promotion-banner">
          <p>Questions about our products?</p>
          <p>Our team is here to help!</p>
        </div>
      </div>
      {isSubmitted ? (
        <p className="success-message">✅ Thank you! We will contact you soon.</p>
      ) : (
        ""
      )}
      {error && <p className="error-message">❌ {error}</p>}
    </div>
  );
};

export default Contact;
