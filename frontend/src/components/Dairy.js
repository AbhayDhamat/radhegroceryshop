import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import "./Dairy.css";
import "./Home.css";
const Dairy = () => {
  const [milkProducts, setMilkProducts] = useState([]);
  const [cart, setCart] = useState([]); // Store selected items in the cart
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("token");

  // Check user role from token and fetch dairy products
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsAdmin(decoded.role === "admin");
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

    const fetchMilkProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/milk-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch milk products");
        }

        const data = await response.json();
        console.log("Milk Products:", data);
        setMilkProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMilkProducts();
  }, [token]);

  // Add product to cart (only for non-admin users)
  const handleAddToCart = (product) => {
    if (isAdmin) {
      alert("Admins are not allowed to place orders.");
      return;
    }
    const existingItem = cart.find((item) => item.productId === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          productType: "Dairy",
          name: product.name,
          img: product.img,
          quantity: 1,
          price: product.price,
          total: product.price,
        },
      ]);
    }
  };

  // Remove product from cart
  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  // Adjust quantity in cart
  const handleQuantityChange = (productId, change) => {
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(item.quantity + change, 1),
              total: Math.max(item.quantity + change, 1) * item.price,
            }
          : item
      )
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  // Place order for dairy products
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("❌ Please add dairy products to your cart before placing an order.");
      return;
    }

    const confirmOrder = window.confirm(
      `🥛 Your Dairy Order:\n${cart
        .map((item) => `${item.name} x ${item.quantity} = ₹${item.total}`)
        .join("\n")}\n\nTotal Amount: ₹${totalAmount}\n\nDo you want to place this order?`
    );

    if (!confirmOrder) {
      alert("❌ Order canceled.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to place an order.");
        return;
      }

      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.name,
          productType: "DairyProduct",
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      };

      console.log("🟢 Sending Dairy Order Request:", orderData);

      const response = await fetch("http://localhost:5000/orders/dairy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to place dairy order");
      }

      console.log("✅ Order Placed Successfully:", data);
      alert("✅ Your dairy order has been placed successfully!");
      setCart([]); // Clear cart after successful order
      setShowSummary(false);
    } catch (error) {
      console.error("❌ Error placing order:", error.message);
      alert("❌ Failed to place dairy order: " + error.message);
    }
  };

  if (loading) return <p>Loading dairy products...</p>;
  if (error) return <p>Error: {error}</p>;
  if (milkProducts.length === 0) return <p>No dairy products available</p>;

  return (
    <div className="milk">
      <h1>Dairy Products</h1>
      <div className="category-list">
        {milkProducts.map((product) => (
          <div key={product._id} className="category-card">
            {product.name && product.price ? (
              <>
                <img src={product.img} alt={product.name} />
                <h3>{product.name}</h3>
                <p>₹{product.price}</p>
              </>
            ) : (
              <p>Product information is missing</p>
            )}
            {/* Only display "Add to Cart" for non-admin users */}
            {!isAdmin && (
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Show cart and order section only for non-admin users */}
      {!isAdmin && cart.length > 0 && (
        <>
          <button
            className="place-order-btn"
            onClick={() => setShowSummary(true)}
          >
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
                      <p>
                        {item.name} - ₹{item.price} each
                      </p>
                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, -1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <p>Total: ₹{item.total}</p>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <h3>Total: ₹{totalAmount}</h3>
              <button onClick={handlePlaceOrder} className="confirm-order-btn">
                Confirm Order
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
      
    </div>
  );
};

export default Dairy;
