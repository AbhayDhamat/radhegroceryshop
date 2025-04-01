// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import './Home.css';

// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();
//   const mobile = location.state?.mobile;

//   if (!mobile) {
//     navigate("/forgot-password");
//     return null;
//   }

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
  
//     if (password !== confirmPassword) {
//       setError("❌ Passwords do not match!");
//       return;
//     }
  
//     try {
//       const response = await fetch("http://localhost:5000/api/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mobile, password }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         alert("✅ Password reset successful!");
//         navigate("/login");
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
//           <h1 className="hero-title">Reset Password</h1>
//         </div>
//       </div>

//       <div className="featured-products">
//         <div className="category-list">
//           <div className="category-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
//             <form onSubmit={handleResetPassword} style={{ width: "100%" }}>
//               <input
//                 type="password"
//                 placeholder="New Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 style={{
//                   width: "100%",
//                   padding: "15px",
//                   marginBottom: "20px",
//                   borderRadius: "10px",
//                   border: "2px solid #4CAF50",
//                   background: "#2d2d2d",
//                   color: "#fff",
//                   fontSize: "16px"
//                 }}
//               />
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 style={{
//                   width: "100%",
//                   padding: "15px",
//                   marginBottom: "20px",
//                   borderRadius: "10px",
//                   border: "2px solid #4CAF50",
//                   background: "#2d2d2d",
//                   color: "#fff",
//                   fontSize: "16px"
//                 }}
//               />
//               <button type="submit" className="shop-now">
//                 Reset Password
//               </button>
//             </form>
//             {error && (
//               <p style={{ 
//                 color: "#ff6b6b", 
//                 marginTop: "20px",
//                 padding: "10px",
//                 borderRadius: "5px",
//                 backgroundColor: "rgba(255, 107, 107, 0.1)"
//               }}>
//                 {error}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import './Home.css';

// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email;  // Getting email from location state

//   if (!email) {
//     navigate("/forgot-password");
//     return null;
//   }

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
//         navigate("/login");  // Redirect to login after successful password reset
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
//           <h1 className="hero-title">Reset Password</h1>
//         </div>
//       </div>

//       <div className="featured-products">
//         <div className="category-list">
//           <div className="category-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
//             <form onSubmit={handleResetPassword} style={{ width: "100%" }}>
//               <input
//                 type="password"
//                 placeholder="New Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 style={{
//                   width: "100%",
//                   padding: "15px",
//                   marginBottom: "20px",
//                   borderRadius: "10px",
//                   border: "2px solid #4CAF50",
//                   background: "#2d2d2d",
//                   color: "#fff",
//                   fontSize: "16px"
//                 }}
//               />
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 style={{
//                   width: "100%",
//                   padding: "15px",
//                   marginBottom: "20px",
//                   borderRadius: "10px",
//                   border: "2px solid #4CAF50",
//                   background: "#2d2d2d",
//                   color: "#fff",
//                   fontSize: "16px"
//                 }}
//               />
//               <button type="submit" className="shop-now">
//                 Reset Password
//               </button>
//             </form>
//             {error && (
//               <p style={{ 
//                 color: "#ff6b6b", 
//                 marginTop: "20px",
//                 padding: "10px",
//                 borderRadius: "5px",
//                 backgroundColor: "rgba(255, 107, 107, 0.1)"
//               }}>
//                 {error}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Home.css';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;  // Getting email from location state

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("❌ Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Password reset successful!");
        navigate("/login");  // Redirect to login after password reset
      } else {
        setError(data.message || "❌ Failed to reset password.");
      }
    } catch (err) {
      setError("❌ Network error. Try again.");
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Reset Password</h1>
        </div>
      </div>

      <div className="featured-products-1">
        <div className="category-list-1">
          <div className="category-card" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <form onSubmit={handleResetPassword} style={{ width: "100%" }}>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={handlePasswordChange}
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
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
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
              <button type="submit" className="shop-now">
                Reset Password
              </button>
              {error && <p style={{ color: "#ff6b6b", marginTop: "20px" }}>{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
