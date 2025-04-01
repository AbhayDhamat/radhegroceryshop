

// // export default ForgotPassword;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Home.css";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [error, setError] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);
//   const navigate = useNavigate();

//   // Handle Email Change (For OTP request)
//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   // Handle OTP Change (For OTP verification)
//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//   };

//   // Handle Password and Confirm Password Change (For password reset)
//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleConfirmPasswordChange = (e) => {
//     setConfirmPassword(e.target.value);
//   };

//   // Send OTP Request
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setError("");

//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:5000/request-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("✅ OTP sent successfully to your email.");
//         setIsOtpSent(true);  // OTP has been sent, show OTP verification form
//       } else {
//         setError(data.message || "❌ Failed to send OTP.");
//       }
//     } catch (err) {
//       setError("❌ Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setOtpError("");

//     if (!/^\d{6}$/.test(otp)) {
//       setOtpError("❌ Please enter a valid 6-digit OTP.");
//       return;
//     }

//     setOtpLoading(true);
//     try {
//       const response = await fetch("http://localhost:5000/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("✅ OTP Verified Successfully!");
//       } else {
//         setOtpError(data.message || "❌ Invalid OTP. Please try again.");
//       }
//     } catch (err) {
//       setOtpError("❌ Network error. Please try again.");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // Reset Password
//   const handleResetPassword = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError("❌ Passwords do not match!");
//       return;
//     }

//     if (password.length < 6) {
//       setError("❌ Password must be at least 6 characters long.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("✅ Password reset successful!");
//         navigate("/login");  // Redirect to login after password reset
//       } else {
//         setError(data.message || "❌ Failed to reset password.");
//       }
//     } catch (err) {
//       setError("❌ Network error. Try again.");
//     }
//   };

//   return (
//     <div className="home">
//       <div className="hero">
//         <div className="hero-content">
//           <h1 className="hero-title">{isOtpSent ? "Verify OTP" : "Forgot Password"}</h1>
//           <p>{isOtpSent ? "Enter the OTP sent to your email." : "We'll help you reset your password"}</p>
//         </div>
//       </div>

//       <div className="featured-products">
//         <div className="category-list">
//           <div className="category-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
//             {!isOtpSent ? (
//               <form onSubmit={handleSendOtp} style={{ width: "100%" }}>
//                 <input
//                   type="email"
//                   placeholder="Enter your email address"
//                   value={email}
//                   onChange={handleEmailChange}
//                   required
//                   style={{
//                     width: "100%",
//                     padding: "15px",
//                     marginBottom: "20px",
//                     borderRadius: "10px",
//                     border: "2px solid #4CAF50",
//                     background: "#2d2d2d",
//                     color: "#fff",
//                     fontSize: "16px"
//                   }}
//                 />
//                 <button type="submit" className="shop-now" style={{ width: "100%" }} disabled={loading}>
//                   {loading ? "Sending OTP..." : "Send OTP"}
//                 </button>
//                 {error && <p style={{ color: "#ff6b6b", marginTop: "20px" }}>{error}</p>}
//               </form>
//             ) : (
//               <>
//                 <form onSubmit={handleVerifyOtp} style={{ width: "100%" }}>
//                   <input
//                     type="text"
//                     placeholder="Enter 6-digit OTP"
//                     value={otp}
//                     onChange={handleOtpChange}
//                     maxLength="6"
//                     required
//                     style={{
//                       width: "100%",
//                       padding: "15px",
//                       marginBottom: "20px",
//                       borderRadius: "10px",
//                       border: "2px solid #4CAF50",
//                       background: "#2d2d2d",
//                       color: "#fff",
//                       fontSize: "16px"
//                     }}
//                   />
//                   <button type="submit" className="shop-now" style={{ width: "100%" }} disabled={otpLoading}>
//                     {otpLoading ? "Verifying OTP..." : "Verify OTP"}
//                   </button>
//                   {otpError && <p style={{ color: "#ff6b6b", marginTop: "20px" }}>{otpError}</p>}
//                 </form>

//                 <form onSubmit={handleResetPassword} style={{ width: "100%", marginTop: "20px" }}>
//                   <input
//                     type="password"
//                     placeholder="New Password"
//                     value={password}
//                     onChange={handlePasswordChange}
//                     required
//                     style={{
//                       width: "100%",
//                       padding: "15px",
//                       marginBottom: "20px",
//                       borderRadius: "10px",
//                       border: "2px solid #4CAF50",
//                       background: "#2d2d2d",
//                       color: "#fff",
//                       fontSize: "16px"
//                     }}
//                   />
//                   <input
//                     type="password"
//                     placeholder="Confirm Password"
//                     value={confirmPassword}
//                     onChange={handleConfirmPasswordChange}
//                     required
//                     style={{
//                       width: "100%",
//                       padding: "15px",
//                       marginBottom: "20px",
//                       borderRadius: "10px",
//                       border: "2px solid #4CAF50",
//                       background: "#2d2d2d",
//                       color: "#fff",
//                       fontSize: "16px"
//                     }}
//                   />
//                   <button type="submit" className="shop-now" style={{ width: "100%" }}>
//                     Reset Password
//                   </button>
//                   {error && <p style={{ color: "#ff6b6b", marginTop: "20px" }}>{error}</p>}
//                 </form>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ OTP sent successfully to your email.");
        // Redirect to the OTP verification page
        navigate("/verify-otp", { state: { email } });
      } else {
        setError(data.message || "❌ Failed to send OTP.");
      }
    } catch (err) {
      setError("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Forgot Password</h1>
          <p>We'll help you reset your password</p>
        </div>
      </div>

      <div className="featured-products-1">
        <div className="category-list-1">
          <div className="category-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <form onSubmit={handleSendOtp} style={{ width: "100%" }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
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
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              {error && <p style={{ color: "#ff6b6b", marginTop: "20px" }}>{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
