


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import "./Order.css";

// const Order = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userInfo, setUserInfo] = useState({});
//   const [address, setAddress] = useState(null);
//   const [showBill, setShowBill] = useState(false);
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false); // State to show/hide the modal

//   // Function to handle Cash On Delivery button click
//   const handleCashOnDelivery = () => {
//     setShowModal(true); // Show the confirmation modal
//   };

//   // Function to close the modal
//   const closeModal = () => {
//     setShowModal(false); // Close the modal
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//     } else {
//       fetchUserProfile(token);
//       fetchOrders(token);
//     }
//   }, [navigate]);

//   const fetchUserProfile = async (token) => {
//     try {
//       const response = await fetch("http://localhost:5000/user/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();
//       if (!response.ok)
//         throw new Error(data.message || "Failed to fetch user profile");

//       setUserInfo({ name: data.name, email: data.email, phone: data.phone });
//       setAddress(data.address || {});
//     } catch (err) {
//       console.error("Error fetching profile:", err.message);
//     }
//   };

//   const fetchOrders = async (token) => {
//     try {
//       const response = await fetch("http://localhost:5000/orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch orders");
//       }

//       if (!data || data.length === 0) {
//         setOrders([]);
//         return;
//       }

//       setOrders(data);
//     } catch (err) {
//       console.error("Error fetching orders:", err.message);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateBill = (orderDate) => {
//     const combinedOrders = orders.filter(
//       (order) => new Date(order.createdAt).toDateString() === orderDate
//     );
//     setSelectedOrders(combinedOrders);
//     setShowBill(true);
//   };

//   const handleDownloadBill = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(22);
//     doc.setTextColor(40);
//     doc.text("Radhe Grocery Shop", 70, 20);

//     doc.setFontSize(12);
//     doc.setTextColor(70);
//     doc.text(
//       `Bill Date: ${new Date(
//         selectedOrders[0].createdAt
//       ).toLocaleDateString()}`,
//       14,
//       40
//     );
//     doc.text(`Name: ${userInfo.name || "Unknown"}`, 14, 50);
//     doc.text(`Email: ${userInfo.email || "Unknown"}`, 14, 60);
//     doc.text(
//       `Address: ${address?.street}, ${address?.city}, ${address?.state}, ${address?.zip}, ${address?.country}`,
//       14,
//       70
//     );

//     autoTable(doc, {
//       startY: 80,
//       head: [
//         ["Order ID", "Product Name", "Type", "Price", "Quantity", "Total"],
//       ],
//       body: selectedOrders.flatMap((order) =>
//         order.items.map((item) => [
//           order._id, // Show Order ID in every row
//           item.productId?.name || "Unknown Product", // Fetch product name
//           item.productType, // Show product type (Fruit, Dairy, Vegetable)
//           `₹${item.price || "N/A"}`, // Correctly fetch product price
//           item.quantity, // Correctly fetch quantity
//           `₹${order.totalAmount}`, // Show `totalAmount` in every row
//         ])
//       ),
//       styles: {
//         fontSize: 10,
//         cellPadding: 3,
//         textColor: 50,
//         fillColor: [220, 220, 220],
//         lineColor: [44, 62, 80],
//         lineWidth: 0.1,
//       },
//       headStyles: {
//         fillColor: [44, 62, 80],
//         textColor: 255,
//         fontStyle: "bold",
//       },
//     });

//     const totalAmount = selectedOrders.reduce(
//       (sum, order) => sum + order.totalAmount,
//       0
//     );

//     doc.setTextColor(0);
//     doc.setFontSize(14);
//     doc.text(
//       `Total Amount: ₹${totalAmount}`,
//       14,
//       doc.lastAutoTable.finalY + 10
//     );
//     doc.text(
//       `Payment Method: Cash on Delivery`,
//       14,
//       doc.lastAutoTable.finalY + 20
//     );

//     doc.save("Order_Bill.pdf");
//   };

//   const handlePayNow = () => {
//     const totalAmount = selectedOrders.reduce(
//       (sum, order) => sum + order.totalAmount,
//       0
//     );
//     // Navigate to the payment page and pass the totalAmount via state
//     navigate("/payment", { state: { totalAmount } });
//   };

//   if (loading) return <p>Loading orders...</p>;
//   if (error) return <p>Error: {error}</p>;

//   if (showBill && selectedOrders.length > 0) {
//     const totalAmount = selectedOrders.reduce(
//       (sum, order) => sum + order.totalAmount,
//       0
//     );

//     return (
//       <div className="bill-page">
//         <h1>Radhe Grocery Shop Order Bill</h1>
//         <div className="bill-header">
//           <p>
//             <strong>Bill Date:</strong>{" "}
//             {new Date(selectedOrders[0].createdAt).toLocaleDateString()}
//           </p>
//         </div>
//         <div className="bill-user-info">
//           <p>
//             <strong>Name:</strong> {userInfo.name || "Unknown"}
//           </p>
//           <p>
//             <strong>Email:</strong> {userInfo.email || "Unknown"}
//           </p>
//           <p>
//             <strong>Address:</strong> {address?.street}, {address?.city},{" "}
//             {address?.state}, {address?.zip}, {address?.country}
//           </p>
//         </div>
//         <br />

//         <table className="bill-container">
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Product Name</th>
//               <th>Type</th>
//               <th>Price</th>
//               <th>Quantity</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <br></br>
//           <tbody>
//             {selectedOrders.map((order) =>
//               order.items.map((item, index) => (
//                 <tr key={`${order._id}-${index}`}>
//                   <td>{order._id}</td>
//                   <td>{item.productId?.name || "Unknown Product"}</td>
//                   <td>{item.productType}</td>
//                   <td>₹{item.price || "N/A"}</td>
//                   <td>{item.quantity}</td>
//                   <td>₹{item.quantity * item.price}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         <div className="bill-footer">
//           <h3>Total Amount: ₹{totalAmount}</h3>
         
//         </div>

//         <button onClick={handleDownloadBill} className="download-btn">
//           Download Bill
//         </button>
//         <button onClick={() => setShowBill(false)} className="download-btn  ">
//           Back to Orders
//         </button>

//         {/* Add the Pay Now Button */}
//         <button onClick={handlePayNow} className="download-btn  ">
//           Pay Now
//         </button>

//         {/* Cash On Delivery Button */}
//       <button onClick={handleCashOnDelivery} className="download-btn">
//         Cash On Delivery
//       </button>

//       {/* Modal Popup for Order Confirmation */}
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Order Confirmed Successfully!</h2>
//             <p>Your order will be delivered shortly. Thank you for shopping with us!</p>
//             <button onClick={closeModal} className="close-btn">
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//   </div>    
    
// );
//   }

//   if (orders.length === 0) return <p>No orders found.</p>;

//   const uniqueDates = [
//     ...new Set(orders.map((order) => new Date(order.createdAt).toDateString())),
//   ];

//   return (
//     <div className="order-page">
//       <h1>Your Orders</h1>
//       {uniqueDates.map((date) => (
//         <div key={date} className="order-card1">
//           <h3>Orders on: {date}</h3>
//           <button
//             onClick={() => handleGenerateBill(date)}
//             className="download-btn "
//           >
//             Final Bill
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Order;




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import "./Order.css";

// const Order = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userInfo, setUserInfo] = useState({});
//   const [address, setAddress] = useState(null);
//   const [showBill, setShowBill] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null); // Track the selected order for bill generation
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false); // State to show/hide the modal

//   // Function to handle Cash On Delivery button click
//   const handleCashOnDelivery = () => {
//     setShowModal(true); // Show the confirmation modal
//   };
  

//   // Function to close the modal
//   const closeModal = () => {
//     setShowModal(false); // Close the modal
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//     } else {
//       fetchUserProfile(token);
//       fetchOrders(token);
//     }
//   }, [navigate]);

//   const fetchUserProfile = async (token) => {
//     try {
//       const response = await fetch("http://localhost:5000/user/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();
//       if (!response.ok)
//         throw new Error(data.message || "Failed to fetch user profile");

//       setUserInfo({ name: data.name, email: data.email, phone: data.phone });
//       setAddress(data.address || {});
//     } catch (err) {
//       console.error("Error fetching profile:", err.message);
//     }
//   };

//   const fetchOrders = async (token) => {
//     try {
//       const response = await fetch("http://localhost:5000/orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch orders");
//       }

//       if (!data || data.length === 0) {
//         setOrders([]);
//         return;
//       }

//       setOrders(data);
//     } catch (err) {
//       console.error("Error fetching orders:", err.message);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update this function to handle a specific order for the bill
//   const handleGenerateBill = (orderId) => {
//     const order = orders.find((order) => order._id === orderId); // Find the selected order by ID
//     setSelectedOrder(order); // Set the selected order for bill generation
//     setShowBill(true); // Show the bill
//   };

//   const handleDownloadBill = () => {
//     if (!selectedOrder) return; // Ensure there's a selected order

//     const doc = new jsPDF();
//     doc.setFontSize(22);
//     doc.setTextColor(40);
//     doc.text("Radhe Grocery Shop", 70, 20);

//     doc.setFontSize(12);
//     doc.setTextColor(70);
//     doc.text(
//       `Bill Date: ${new Date(
//         selectedOrder.createdAt
//       ).toLocaleDateString()}`,
//       14,
//       40
//     );
//     doc.text(`Name: ${userInfo.name || "Unknown"}`, 14, 50);
//     doc.text(`Email: ${userInfo.email || "Unknown"}`, 14, 60);
//     doc.text(
//       `Address: ${address?.street}, ${address?.city}, ${address?.state}, ${address?.zip}, ${address?.country}`,
//       14,
//       70
//     );

//     autoTable(doc, {
//       startY: 80,
//       head: [
//         ["Order ID", "Product Name", "Type", "Price", "Quantity", "Total"],
//       ],
//       body: selectedOrder.items.map((item) => [
//         selectedOrder._id, // Order ID
//         item.productId?.name || "Unknown Product", // Product name
//         item.productType, // Product type (Fruit, Dairy, etc.)
//         `₹${item.price || "N/A"}`, // Product price
//         item.quantity, // Quantity
//         `₹${item.quantity * item.price}`, // Total for this item
//       ]),
//       styles: {
//         fontSize: 10,
//         cellPadding: 3,
//         textColor: 50,
//         fillColor: [220, 220, 220],
//         lineColor: [44, 62, 80],
//         lineWidth: 0.1,
//       },
//       headStyles: {
//         fillColor: [44, 62, 80],
//         textColor: 255,
//         fontStyle: "bold",
//       },
//     });

//     const totalAmount = selectedOrder.totalAmount;

//     doc.setTextColor(0);
//     doc.setFontSize(14);
//     doc.text(`Total Amount: ₹${totalAmount}`, 14, doc.lastAutoTable.finalY + 10);
//     doc.text(`Payment Method: Cash on Delivery`, 14, doc.lastAutoTable.finalY + 20);

//     doc.save("Order_Bill.pdf");
//   };

//   // Function for handling Pay Now action
//   const handlePayNow = () => {
//     const totalAmount = selectedOrder.totalAmount;
//     // Navigate to the payment page and pass the totalAmount via state
//     navigate("/payment", { state: { totalAmount } });
//   };

//   if (loading) return <p>Loading orders...</p>;
//   if (error) return <p>Error: {error}</p>;

//   if (showBill && selectedOrder) {
//     const totalAmount = selectedOrder.totalAmount;

//     return (
//       <div className="bill-page">
//         <h1>Radhe Grocery Shop Order Bill</h1>
//         <div className="bill-header">
//           <p>
//             <strong>Bill Date:</strong>{" "}
//             {new Date(selectedOrder.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//         <div className="bill-user-info">
//           <p>
//             <strong>Name:</strong> {userInfo.name || "Unknown"}
//           </p>
//           <p>
//             <strong>Email:</strong> {userInfo.email || "Unknown"}
//           </p>
//           <p>
//             <strong>Address:</strong> {address?.street}, {address?.city},{" "}
//             {address?.state}, {address?.zip}, {address?.country}
//           </p>
//         </div>
//         <br />

//         <table className="bill-container">
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Product Name</th>
//               <th>Type</th>
//               <th>Price</th>
//               <th>Quantity</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {selectedOrder.items.map((item, index) => (
//               <tr key={`${selectedOrder._id}-${index}`}>
//                 <td>{selectedOrder._id}</td>
//                 <td>{item.productId?.name || "Unknown Product"}</td>
//                 <td>{item.productType}</td>
//                 <td>₹{item.price || "N/A"}</td>
//                 <td>{item.quantity}</td>
//                 <td>₹{item.quantity * item.price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="bill-footer">
//           <h3>Total Amount: ₹{totalAmount}</h3>
//         </div>

//         <button onClick={handleDownloadBill} className="download-btn">
//           Download Bill
//         </button>
//         <button onClick={() => setShowBill(false)} className="download-btn">
//           Back to Orders
//         </button>

//         {/* Add the Pay Now Button */}
//         <button onClick={handlePayNow} className="download-btn">
//           Pay Now
//         </button>

//         {/* Cash On Delivery Button */}
//         <button onClick={handleCashOnDelivery} className="download-btn">
//           Cash On Delivery
//         </button>

//         {/* Modal Popup for Order Confirmation */}
//         {showModal && (
//           <div className="modal">
//             <div className="modal-content">
//               <h2>Order Confirmed Successfully!</h2>
//               <p>Your order will be delivered shortly. Thank you for shopping with us!</p>
//               <button onClick={closeModal} className="close-btn">
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (orders.length === 0) return <p>No orders found.</p>;

//   const uniqueDates = [
//     ...new Set(orders.map((order) => new Date(order.createdAt).toDateString())),
//   ];

//   return (
//     <div className="order-page">
//       <h1>Your Orders</h1>
//       {uniqueDates.map((date) => (
//         <div key={date} className="order-card1">
//           <h3>Orders on: {date}</h3>
//           {orders
//             .filter((order) => new Date(order.createdAt).toDateString() === date)
//             .map((order) => (
//               <button
//                 onClick={() => handleGenerateBill(order._id)}
//                 key={order._id}
//                 className="download-btn"
//               >
//                 View Bill
//               </button>
//             ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Order;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [address, setAddress] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track the selected order for bill generation
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false); // State to show/hide the modal

  // Function to handle Cash On Delivery button click
  const handleCashOnDelivery = () => {
    setShowModal(true); // Show the confirmation modal
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
      fetchOrders(token);
    }
  }, [navigate]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch user profile");

      setUserInfo({ name: data.name, email: data.email, phone: data.phone });
      setAddress(data.address || {});
    } catch (err) {
      console.error("Error fetching profile:", err.message);
    }
  };

  const fetchOrders = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      if (!data || data.length === 0) {
        setOrders([]);
        return;
      }

      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel order
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel order");
      }

      // If successfully canceled, update the orders state and navigate to the orders page
      alert("Order canceled successfully!");
      fetchOrders(token); // Refresh orders to reflect the cancellation
      navigate("/home"); // Navigate to orders page after cancellation
    } catch (err) {
      console.error("Error canceling order:", err.message);
      setError("Failed to cancel order. Please try again.");
    }
  };

  const handleGenerateBill = (orderId) => {
    const order = orders.find((order) => order._id === orderId); // Find the selected order by ID
    setSelectedOrder(order); // Set the selected order for bill generation
    setShowBill(true); // Show the bill
  };

  const handleDownloadBill = () => {
    if (!selectedOrder) return; // Ensure there's a selected order

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text("Radhe Grocery Shop", 70, 20);

    doc.setFontSize(12);
    doc.setTextColor(70);
    doc.text(
      `Bill Date: ${new Date(
        selectedOrder.createdAt
      ).toLocaleDateString()}`,
      14,
      40
    );
    doc.text(`Name: ${userInfo.name || "Unknown"}`, 14, 50);
    doc.text(`Email: ${userInfo.email || "Unknown"}`, 14, 60);
    doc.text(
      `Address: ${address?.street}, ${address?.city}, ${address?.state}, ${address?.zip}, ${address?.country}`,
      14,
      70
    );

    autoTable(doc, {
      startY: 80,
      head: [
        ["Order ID", "Product Name", "Type", "Price", "Quantity", "Total"],
      ],
      body: selectedOrder.items.map((item) => [
        selectedOrder._id, // Order ID
        item.productId?.name || "Unknown Product", // Product name
        item.productType, // Product type (Fruit, Dairy, etc.)
        `₹${item.price || "N/A"}`, // Product price
        item.quantity, // Quantity
        `₹${item.quantity * item.price}`, // Total for this item
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: 50,
        fillColor: [220, 220, 220],
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    const totalAmount = selectedOrder.totalAmount;

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹${totalAmount}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Payment Method: Cash on Delivery`, 14, doc.lastAutoTable.finalY + 20);

    doc.save("Order_Bill.pdf");
  };

  // Function for handling Pay Now action
  const handlePayNow = () => {
    const totalAmount = selectedOrder.totalAmount;
    // Navigate to the payment page and pass the totalAmount via state
    navigate("/payment", { state: { totalAmount } });
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  if (showBill && selectedOrder) {
    const totalAmount = selectedOrder.totalAmount;

    return (
      <div className="bill-page">
        <h1>Radhe Grocery Shop Order Bill</h1>
        <div className="bill-header">
          <p>
            <strong>Bill Date:</strong>{" "}
            {new Date(selectedOrder.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="bill-user-info">
          <p>
            <strong>Name:</strong> {userInfo.name || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email || "Unknown"}
          </p>
          <p>
            <strong>Address:</strong> {address?.street}, {address?.city},{" "}
            {address?.state}, {address?.zip}, {address?.country}
          </p>
        </div>
        <br />

        <table className="bill-container">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {selectedOrder.items.map((item, index) => (
              <tr key={`${selectedOrder._id}-${index}`}>
                <td>{selectedOrder._id}</td>
                <td>{item.productId?.name || "Unknown Product"}</td>
                <td>{item.productType}</td>
                <td>₹{item.price || "N/A"}</td>
                <td>{item.quantity}</td>
                <td>₹{item.quantity * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bill-footer">
          <h3>Total Amount: ₹{totalAmount}</h3>
        </div>

        <button onClick={handleDownloadBill} className="download-btn">
          Download Bill
        </button>
        <button onClick={() => setShowBill(false)} className="download-btn">
          Back to Orders
        </button>

        {/* Add the Pay Now Button */}
        <button onClick={handlePayNow} className="download-btn">
          Pay Now
        </button>

        {/* Cash On Delivery Button */}
        <button onClick={handleCashOnDelivery} className="download-btn">
          Cash On Delivery
        </button>

        {/* Modal Popup for Order Confirmation */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Order Confirmed Successfully!</p>
              <p>Your order will be delivered shortly. Thank you for shopping with us!</p>
              <button onClick={closeModal} className="download-btn">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (orders.length === 0) return <p>No orders found.</p>;

  const uniqueDates = [
    ...new Set(orders.map((order) => new Date(order.createdAt).toDateString())),
  ];

  return (
    <div className="order-page">
      <h1>Your Orders</h1>
      {uniqueDates.map((date) => (
        <div key={date} className="order-card1">
          <h3>Orders on: {date}</h3>
          {orders
            .filter((order) => new Date(order.createdAt).toDateString() === date)
            .map((order) => (
              <div key={order._id}>
                <button
                  onClick={() => handleGenerateBill(order._id)}
                  className="download-btn"
                >
                  View Bill
                </button>
                {/* Add Cancel Button */}
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="download-btn"//cancel-btn
                >
                  Cancel Order
                </button>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Order;

