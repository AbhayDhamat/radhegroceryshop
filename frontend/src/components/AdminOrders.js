import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwt_decode(token);
        if (decoded.role !== "admin") {
          alert("Access Denied! Redirecting to home...");
          navigate("/home");
        } else {
          fetchAllOrders(token);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/login");
      }
    }
  }, [navigate]);

  const fetchAllOrders = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch orders");
      }

      const responseData = await response.json();
      setOrders(responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const updateOrderStatus = async (orderId, newStatus) => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/admin/orders/${orderId}/status`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ status: newStatus }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to update order status");
  //     }

  //     // Optimistically update the status in the UI
  //     setOrders((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order._id === orderId ? { ...order, status: newStatus } : order
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Error updating status:", err.message);
  //   }
  // };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="order-page">
      <h1>Users: All Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="order-card1">
          <h3>Order ID: {order._id}</h3>
          <p>Customer: {order.userId?.name || "Unknown User"}</p>
          <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
         
          <p>Product Type: {(order.items[0]?.productType).toLocaleString()}</p>
          <p>Product Name: {(order.items[0]?.productId?.name).toLocaleString()}</p>
         

          <h3>Total Amount: ₹{order.totalAmount}</h3>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
  