import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import "./Home.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
    }
  }, [navigate]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch profile");

      setUser(data);
      setUpdatedUser(data);
    } catch (err) {
      console.error("Error fetching profile:", err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.message);
    }
  };

  return (
    <div className="about" style={{ background: "#1a1a1a", minHeight: "100vh", color: "#fff" }}>
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Your Profile</h1>
          <p>Manage your account information</p>
        </div>
      </div>

      <div className="featured-products">
        <div className="profile">
          <div className="profile-card">
            <h3>{isEditing ? "Edit Profile" : "Profile Information"}</h3>
            {isEditing ? (
              <form onSubmit={(e) => e.preventDefault()} style={{ textAlign: "left" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={updatedUser.name || ""}
                    onChange={handleInputChange}
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
                    value={updatedUser.email || ""}
                    onChange={handleInputChange}
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
                  <label htmlFor="address">Address</label>
                  {updatedUser.address ? (
                    <>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={updatedUser.address.street || ""}
                        onChange={handleAddressChange}
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
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={updatedUser.address.city || ""}
                        onChange={handleAddressChange}
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
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={updatedUser.address.state || ""}
                        onChange={handleAddressChange}
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
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={updatedUser.address.zip || ""}
                        onChange={handleAddressChange}
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
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={updatedUser.address.country || ""}
                        onChange={handleAddressChange}
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
                    </>
                  ) : (
                    <textarea
                      id="address"
                      name="address"
                      value={updatedUser.address || ""}
                      onChange={handleInputChange}
                      rows="3"
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
                  )}
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button type="button" onClick={handleSave} className="shop-now" style={{ flex: 1 }}>
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="shop-now"
                    style={{
                      flex: 1,
                      background: "#2d2d2d",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "left" }}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address ? (
                  <>
                    <p>{user.address.street}, {user.address.city}</p>
                    <p>{user.address.state}, {user.address.zip}</p>
                    <p>{user.address.country}</p>
                  </>
                ) : (
                  <p>No address added.</p>
                )}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="shop-now"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="promotions">
        <div className="promotion-banner">
          <p>Keep your profile updated for a better shopping experience!</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
