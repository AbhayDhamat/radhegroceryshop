import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";
import "./ForgetPassword.css"

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;  // Getting email from location state

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("❌ Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ OTP Verified Successfully!");
        // Redirect to the Reset Password page
        navigate("/reset-password", { state: { email } });
      } else {
        setOtpError(data.message || "❌ Invalid OTP. Please try again.");
      }
    } catch (err) {
      setOtpError("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Verify OTP</h1>
        </div>
      </div>

      <div className="featured-products-1">
        <div className="category-list-1">
          <div className="category-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <form onSubmit={handleVerifyOtp} style={{ width: "100%" }}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                maxLength="6"
                required
                style={{
                  width: "100%",
                  padding: "15px",
                  marginBottom: "20px",
                  borderRadius: "10px",
                  border: "2px solid #4CAF50",
                  background: "#2d2d2d",
                  color: "#fff",
                  fontSize: "16px"
                }}
              />
              <button type="submit" className="shop-now" style={{ width: "100%" }} disabled={loading}>
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
              {otpError && <p style={{ color: "#ff6b6b", marginTop: "20px" }}>{otpError}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default VerifyOtpPage;
