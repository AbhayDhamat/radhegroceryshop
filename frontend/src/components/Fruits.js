import React, { useState, useEffect, useCallback } from "react";
import jwt_decode from "jwt-decode";
import "./Fruits.css";
import  "./Home.css";
const Fruits = () => {
  const [fruits, setFruits] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch Fruits Data
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsAdmin(decoded.role === "admin");
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

    const fetchFruits = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/fruits", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch fruits data");

        const data = await response.json();
        setFruits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFruits();
  }, [token]);

  // ✅ Add Fruit to Cart
  const handleAddToCart = useCallback((fruit) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === fruit._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === fruit._id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [
        ...prevCart,
        {
          productId: fruit._id,
          productType: "Fruit",
          name: fruit.name,
          img: fruit.img,
          quantity: 1,
          price: fruit.price,
          total: fruit.price,
        },
      ];
    });
  }, []);

  // ✅ Remove Item from Cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  // ✅ Adjust Quantity in Cart
  const handleQuantityChange = (productId, change) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(item.quantity + change, 1), total: Math.max(item.quantity + change, 1) * item.price }
          : item
      )
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  // ✅ Place Order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("❌ Please add items to your cart before placing an order.");
      return;
    }

    if (!token) {
      alert("❌ No token found. Please log in again.");
      return;
    }

    const orderData = {
      items: cart.map((item) => ({
        productId: item.productId,
        productType: "Fruit",
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
    };

    console.log("🟢 Sending Fruit Order:", JSON.stringify(orderData, null, 2));

    try {
      const response = await fetch("http://localhost:5000/orders/fruits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log("✅ Order Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      alert("✅ Your fruit order has been placed successfully!");
      setCart([]);
      setShowSummary(false);
    } catch (err) {
      console.error("❌ Error placing order:", err.message);
      alert("❌ Failed to place order: " + err.message);
    }
  };

  if (loading) return <p>Loading fruits...</p>;
  if (error) return <p>Error: {error}</p>;
  if (fruits.length === 0) return <p>No fruits available</p>;

  return (
    <div className="fruits">
      <h1>Fruits</h1>
      <div className="category-list">
        {fruits.map((fruit) => (
          <div key={fruit._id} className="category-card">
            <img src={fruit.img} alt={fruit.name} />
            <h3>{fruit.name}</h3>
            <p>₹{fruit.price}</p>
            {!isAdmin && (
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(fruit)}>
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      {!isAdmin && cart.length > 0 && (
        <>
          <button className="place-order-btn" onClick={() => setShowSummary(true)}>View Cart & Place Order</button>
          {showSummary && (
            <div className="order-summary">
              <h2>Your Cart</h2>
              <ul>
                {cart.map((item) => (
                  <li key={item.productId}>
                    <img src={item.img} alt={item.name} />
                    <div className="cart-item-details">
                      <p>{item.name} - ₹{item.price} each</p>
                      <div className="quantity-control">
                        <button onClick={() => handleQuantityChange(item.productId, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.productId, 1)}>+</button>
                      </div>
                      <p>Total: ₹{item.total}</p>
                      <button className="remove-btn" onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <h3>Total Amount: ₹{totalAmount}</h3>
              <button onClick={handlePlaceOrder} className="confirm-order-btn">Confirm Order</button>
              <button onClick={() => setShowSummary(false)} className="cancel-btn">Cancel</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Fruits;
