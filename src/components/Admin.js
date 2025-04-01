import React, { useState, useEffect } from "react";
import "./Admin.css";

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [productType, setProductType] = useState("fruits"); // Default category
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    img: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ API endpoint mapping for different product categories
  const apiEndpoints = {
    fruits: "http://localhost:5000/api/fruits",
    vegetables: "http://localhost:5000/api/vegetables",
    dairy: "http://localhost:5000/api/milk-products",
  };

  // ✅ Fetch products based on selected category
  useEffect(() => {
    fetchProducts();
  }, [productType]); // Fetch when product type changes

  const fetchProducts = () => {
    fetch(apiEndpoints[productType], {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Error: Expected an array but got:", data);
          setProducts([]);
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add a new product
  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.img) {
      setMessage("⚠️ Please fill in all fields");
      return;
    }

    const cleanedFormData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      img: formData.img.replace(/['"]+/g, "").trim(),
    };

    fetch(apiEndpoints[productType], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cleanedFormData),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Could not add product");
        }
        setProducts([...products, data]);
        setFormData({ name: "", price: "", img: "" });
        setMessage("✅ Product added successfully!");
      })
      .catch((error) => setMessage("❌ " + error.message));
  };

  // ✅ Update a product
  const handleUpdateProduct = () => {
    if (!formData.name || !formData.price || !formData.img) {
      setMessage("⚠️ Please fill in all fields");
      return;
    }

    fetch(`${apiEndpoints[productType]}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Could not update product");
        }
        setProducts((prev) => prev.map((prod) => (prod._id === editId ? data : prod)));
        setFormData({ name: "", price: "", img: "" });
        setEditId(null);
        setMessage("✅ Product updated successfully!");
      })
      .catch((error) => setMessage("❌ " + error.message));
  };

  // ✅ Delete a product
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiEndpoints[productType]}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((product) => product._id !== id));
      setTimeout(() => {
        fetchProducts();
        setMessage("✅ Product deleted successfully!");
      }, 200);
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  // ✅ Set product to edit mode
  const handleEdit = (product) => {
    setFormData({ name: product.name, price: product.price, img: product.img });
    setEditId(product._id);
  };

  return (
    <div className="admin-container">
      <h2>Manage Products</h2>

      {message && <p className="message">{message}</p>}

      {/* Product Category Selector */}
      <div className="category-selector">
        <label>Select Category: </label>
        <select onChange={(e) => setProductType(e.target.value)} value={productType}>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
          <option value="dairy">Dairy Products</option>
        </select>
      </div>

      {/* Product Form */}
      <div className="product-form">
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="text" name="img" placeholder="Image URL" value={formData.img} onChange={handleChange} required />

        {editId ? (
          <button onClick={handleUpdateProduct}>Update Product</button>
        ) : (
          <button onClick={handleAddProduct}>Add Product</button>
        )}
      </div>

      {/* Product List */}
      <h3>Product List ({productType})</h3>
      <div className="product-list">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              {product.img ? (
                <img
                  src={product.img}
                  alt={product.name || "No Image"}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
              ) : (
                <img src="https://via.placeholder.com/150" alt="Placeholder" />
              )}
              <h4>{product.name || "Unknown Product"}</h4>
              <p>₹{product.price || "N/A"}</p>
              <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
