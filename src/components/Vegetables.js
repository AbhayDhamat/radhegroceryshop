import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";  // Import jwt-decode to check user roles
import "./Vegetables.css";
import "./Home.css";
const Vegetables = () => {
  const [vegetables, setVegetables] = useState([]);
  const [cart, setCart] = useState([]);  // Store selected items in the cart
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);  // Track if the user is an admin

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsAdmin(decoded.role === "admin");  // Check if the user is an admin
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

    const fetchVegetables = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vegetables", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch vegetables");

        const data = await response.json();
        setVegetables(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVegetables();
  }, [token]);

  // Add vegetable to cart
  const handleAddToCart = (vegetable) => {
    const existingItem = cart.find(item => item.productId === vegetable._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === vegetable._id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: vegetable._id,
        productType: "Vegetable",
        name: vegetable.name,
        img: vegetable.img,
        quantity: 1,
        price: vegetable.price,
        total: vegetable.price,
      }]);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Adjust quantity in cart
  const handleQuantityChange = (productId, change) => {
    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: Math.max(item.quantity + change, 1), total: Math.max(item.quantity + change, 1) * item.price }
        : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  // Place the vegetable order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("❌ Please add vegetables to your cart before placing an order.");
      return;
    }

    const confirmOrder = window.confirm(
      `🥦 Your Vegetable Order:\n${cart
        .map(item => `${item.name} x ${item.quantity} = ₹${item.total}`)
        .join("\n")}\n\nTotal Amount: ₹${totalAmount}\n\nDo you want to place this order?`
    );

    if (!confirmOrder) {
      alert("❌ Order canceled.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/orders/vegetables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cart, totalAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place vegetable order");
      }

      alert("✅ Your vegetable order has been placed successfully!");
      setCart([]);  // Clear cart after successful order
      setShowSummary(false);
    } catch (err) {
      alert("❌ Failed to place vegetable order: " + err.message);
    }
  };

  if (loading) return <p>Loading vegetables...</p>;
  if (error) return <p>Error: {error}</p>;
  if (vegetables.length === 0) return <p>No vegetables available</p>;

  return (
    <div className="vegetables">
      <h1>Vegetables</h1>
      <div className="category-list">
        {vegetables.map((vegetable) => (
          <div key={vegetable._id} className="category-card">
            <img src={vegetable.img} alt={vegetable.name} />
            <h3>{vegetable.name}</h3>
            <p>₹{vegetable.price}</p>
            {/* Hide 'Add to Cart' button for admins */}
            {!isAdmin && (
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(vegetable)}>
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Cart and Order Section (only for non-admin users) */}
      {!isAdmin && cart.length > 0 && (
        <>
          <button className="place-order-btn" onClick={() => setShowSummary(true)}>
            View Cart & Place Order
          </button>
          {showSummary && (
            <div className="order-summary">
              <h2>Your Cart</h2>
              <ul>
                {cart.map((item) => (
                  <li key={item.productId}>
                    <img src={item.img} alt={item.name} />
                    <div className="cart-item-details">
                      {item.name} - ₹{item.price} each
                      <div className="quantity-control">
                        <button onClick={() => handleQuantityChange(item.productId, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.productId, 1)}>+</button>
                      </div>
                      <p>Total: ₹{item.total}</p>
                      <button className="remove-btn" onClick={() => handleRemoveFromCart(item.productId)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <h3>Total Amount: ₹{totalAmount}</h3>
              <button onClick={handlePlaceOrder} className="confirm-order-btn">
                Confirm Order
              </button>
              <button onClick={() => setShowSummary(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Vegetables;
