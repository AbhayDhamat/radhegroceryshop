// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";
// import "./AdminOrders.css";

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//     } else {
//       try {
//         const decoded = jwt_decode(token);
//         if (decoded.role !== "admin") {
//           alert("Access Denied! Redirecting to home...");
//           navigate("/home");
//         } else {
//           fetchAllOrders(token);
//         }
//       } catch (err) {
//         console.error("Invalid token:", err);
//         navigate("/login");
//       }
//     }
//   }, [navigate]);

//   const fetchAllOrders = async (token) => {
//     try {
//       const response = await fetch("http://localhost:5000/admin/orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch orders");
//       }

//       const responseData = await response.json();
//       setOrders(responseData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const updateOrderStatus = async (orderId, newStatus) => {
//   //   const token = localStorage.getItem("token");
//   //   try {
//   //     const response = await fetch(
//   //       `http://localhost:5000/admin/orders/${orderId}/status`,
//   //       {
//   //         method: "PUT",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //         body: JSON.stringify({ status: newStatus }),
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Failed to update order status");
//   //     }

//   //     // Optimistically update the status in the UI
//   //     setOrders((prevOrders) =>
//   //       prevOrders.map((order) =>
//   //         order._id === orderId ? { ...order, status: newStatus } : order
//   //       )
//   //     );
//   //   } catch (err) {
//   //     console.error("Error updating status:", err.message);
//   //   }
//   // };

//   if (loading) return <p>Loading orders...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (orders.length === 0) return <p>No orders found.</p>;

//   return (
//     <div className="order-page">
//       <h1>Users: All Orders</h1>
//       {orders.map((order) => (
//         <div key={order._id} className="order-card1">
//           <h3>Order ID: {order._id}</h3>
//           <p>Customer: {order.userId?.name || "Unknown User"}</p>
//           <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
         
//           <p>Product Type: {(order.items[0]?.productType).toLocaleString()}</p>
//           <p>Product Name: {(order.items[0]?.productId?.name).toLocaleString()}</p>
         

//           <h3>Total Amount: ₹{order.totalAmount}</h3>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminOrders;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./AdminOrders.css";
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwt_decode(token);
        if (decoded.role !== "admin") {
          alert("Access Denied!");
          navigate("/home");
        } else {
          fetchOrders(token);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/login");
      }
    }
  }, [navigate]);

  const fetchOrders = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      // Update table and remove order from user page
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      alert("Error deleting order: " + error.message);
    }
  };

  // Filtering orders based on user search & date search
  const filteredOrders = orders
    .filter((order) =>
      searchUser ? order.userId?.name?.toLowerCase().includes(searchUser.toLowerCase()) : true
    )
    .filter((order) =>
      searchDate ? new Date(order.createdAt).toISOString().split("T")[0] === searchDate : true
    );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredOrders.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);

  return (
    <div className="admin-orders">
      <h1>Admin Orders</h1>

      {/* Search Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search User"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
        <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
      </div>

      {/* Orders Table */}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Date</th>
            <th>Type</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userId?.name || "Unknown"}</td>
             
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{(order.items[0]?.productType).toLocaleString()}</td>
              <td>{order.items.map((item) => item.productId?.name).join(", ")}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteOrder(order._id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
