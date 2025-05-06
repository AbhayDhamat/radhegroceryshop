const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const DairyProduct = require("./model/DairyProduct");
const Fruit = require("./model/Fruit");
const Vegetable = require("./model/Vegetable");
const bodyParser = require("body-parser");
const User = require("./model/userModel");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Order = require("./model/orderModel");
const Contact  =require("./model/Contact");
const bcrypt = require("bcryptjs");
//const { generateOtp, sendOtp, storeOtp, verifyOtp } = require("./model/otpServices")
const stripe = require('stripe')('sk_test_51R67GI4QoKRR4mf5qJQupmGl0W3iXYkTXiqyyeWKm7JFtPIJSl21eVEHi92MmhzykcijhkhUe95DSFaY7AJkW5Xr00OE4bhCPS');  // Replace with your actual secret key
const { generateOtp, storeOtp, sendOtpEmail } = require('./otpservice');
const Otp = require('./model/emailotp');


dotenv.config(); // Load environment variables from .envf

const app = express();
app.use(bodyParser.json());
const JWT_SECRET=process.env.JWT_SECRET;
const PORT = 5000;

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process if the database connection fails
  });

  
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: "Access denied, token missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach user info to request
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

// Role Verification Middleware (move this up before routes use it)
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();  // Continue if the role matches
  };
};
app.put("/user/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // User ID from token
    const { name, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, address },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
})

// 📌 1️⃣ Send OTP for Forgot Password
// app.post('/api/forgot-password/send-otp', async (req, res) => {
//   const { mobile } = req.body;

//   if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
//     return res.status(400).json({ message: 'Invalid mobile number' });
//   }

//   try {
//     const otp = generateOtp();
//     console.log("Generated OTP:",otp); // Log the OTP for debugging purposes

//     const otpSent = await sendOtp(mobile, otp);

//     if (otpSent) {
//       await storeOtp(mobile, otp); // Save OTP in the database
//       return res.status(200).json({ message: 'OTP sent successfully' });
//     } else {
//       return res.status(500).json({ message: 'Failed to send OTP' });
//     }
//   } catch (error) {
//     console.error("Error generating OTP or sending SMS:", error);  // Log detailed error
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });


// app.post('/api/forgot-password/send-otp', async (req, res) => {
//   const { mobile } = req.body;

//   console.log("📥 Received OTP request for:", mobile);

//   if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
//     console.log("❌ Invalid mobile number:", mobile);
//     return res.status(400).json({ message: 'Invalid mobile number' });
//   }

//   try {
//     const otp = generateOtp();
//     console.log("🔢 Generated OTP:", otp);

//     const otpSent = await sendOtp(mobile, otp);

//     if (otpSent) {
//       await storeOtp(mobile, otp);
//       console.log(`✅ OTP successfully sent to ${mobile}`);
//       return res.status(200).json({ message: '✅ OTP sent successfully' });
//     } else {
//       console.error("❌ Failed to send OTP. API Error.");
//       return res.status(500).json({ message: 'Failed to send OTP' });
//     }
//   } catch (error) {
//     console.error("❌ Error generating OTP or sending SMS:", error);
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// app.post('/api/forgot-password/send-otp', async (req, res) => {
//   const { mobile } = req.body;

//   console.log("📥 Received OTP request for:", mobile);

//   if (!mobile || mobile.length !== 10 ) {
//     console.log("❌ Invalid mobile number:", mobile);
//     return res.status(400).json({ message: 'Invalid mobile number' });
//   }

//   try {
//     const otp = generateOtp();
//     console.log("🔢 Generated OTP:", otp);

//     const otpSent = await sendOtp(mobile, otp);

//     if (otpSent) {
//       await storeOtp(mobile, otp);
//       console.log(`✅ OTP successfully sent to ${mobile}`);
//       return res.status(200).json({ message: '✅ OTP sent successfully' });
//     } else {
//       console.error("❌ Failed to send OTP. API Error.");
//       return res.status(500).json({ message: 'Failed to send OTP' });
//     }
//   } catch (error) {
//     console.error("❌ Error generating OTP or sending SMS:", error);
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });









//  app.post('/api/forgot-password/verify-otp', async (req, res) => {
//   const { mobile, otp } = req.body;

//   if (!mobile || !otp) {
//     return res.status(400).json({ message: 'Mobile number and OTP are required' });
//   }

//   try {
//     const isOtpValid = await verifyOtp(mobile, otp); // Await verification

//     if (isOtpValid) {
//       return res.status(200).json({ message: 'OTP verified successfully' });
//     } else {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);  // Log detailed error
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });
// app.post('/api/reset-password', async (req, res) => {
//   const { mobile, password } = req.body;

//   if (!mobile || !password || password.length < 6) {
//     return res.status(400).json({ message: '❌ Mobile number and password are required (Min: 6 chars).' });
//   }

//   try {
//     // ✅ Find user by mobile number
//     const user = await User.findOne({ number: mobile });

//     if (!user) {
//       return res.status(404).json({ message: '❌ User not found.' });
//     }

//     console.log("🔍 New Password Before Hashing:", password);

//     // ✅ Check if password is already hashed (DO NOT HASH TWICE)
//     if (password.startsWith("$2b$")) {
//       return res.status(400).json({ message: "❌ Password is already hashed." });
//     }

//     // ✅ Hash password only once
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("🔐 Hashed Password Stored:", hashedPassword);

//     // ✅ Store hashed password
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: '✅ Password reset successfully!' });
//   } catch (err) {
//     console.error('❌ Error resetting password:', err);
//     res.status(500).json({ message: '❌ Internal Server Error', error: err.message });
//   }
// });




// app.post('/api/forgot-password/verify-otp', async (req, res) => {
//   const { mobile, otp } = req.body;

//   if (!mobile || !otp) {
//     return res.status(400).json({ message: 'Mobile number and OTP are required' });
//   }

//   try {
//     const result = await verifyOtp(mobile, otp); // This returns { success: true/false, message: "..." }

//     if (result.success) {
//       return res.status(200).json({ message: result.message }); // ✅ Correct OTP
//     } else {
//       return res.status(400).json({ message: result.message }); // ❌ Invalid or expired OTP
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);  
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });




// NOW your route can safely use verifyRole
app.get("/admin/orders", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const allOrders = await Order.find()
      .populate("userId", "name email")   // Populate user details
      .populate({
        path: "items.productId",         // Dynamically populate productId
        select: "name price",            // Only fetch name and price
      })
      .sort({ createdAt: -1 });

    if (!allOrders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(allOrders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});


// Update order status (Admin only)
app.put("/admin/orders/:orderId/status", verifyToken, verifyRole("admin"), async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const updateFields = { status };

    // ✅ Update timestamps based on status change
    if (status === "Processing") updateFields["statusDates.processing"] = new Date();
    if (status === "Shipped") updateFields["statusDates.shipped"] = new Date();
    if (status === "Out for Delivery") updateFields["statusDates.outForDelivery"] = new Date();
    if (status === "Delivered") updateFields["statusDates.delivered"] = new Date();
orders
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateFields, { new: true });

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
});

//Create or Update Address:
app.put("/user/address", verifyToken, async (req, res) => {
  const { street, city, state, zip, country } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update address fields
    user.address = { street, city, state, zip, country };
    await user.save();

    res.status(200).json({ message: "Address updated successfully", address: user.address });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address", error: error.message });
  }
});


//Get Address for Profile Page:
app.get("/user/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "name email address");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

//Ensure Address is Required on First Order
app.post("/orders", verifyToken, async (req, res) => {
  const { items, totalAmount } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user.address || !user.address.street) {
      return res.status(400).json({ message: "Address required to place an order" });
    }

    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
});


app.delete("/orders/:orderId", verifyToken, async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure the logged-in user is the one who placed the order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own orders" });
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
});

  
app.post("/orders/fruits", verifyToken, async (req, res) => {
  try {
      console.log("🟢 Received Fruit Order:", JSON.stringify(req.body, null, 2));

      const { items, totalAmount } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
          console.error("❌ Invalid order data:", req.body);
          return res.status(400).json({ message: "Invalid order data: Missing items or totalAmount" });
      }

      const userId = req.user.id;
      console.log("🟢 Order Placed by User ID:", userId);

      const newOrder = new Order({
          userId,
          orderType: "FruitOrder",
          items,
          totalAmount,
      });

      const savedOrder = await newOrder.save();
      console.log("✅ Order Saved Successfully:", savedOrder);
      res.status(201).json(savedOrder);
  } catch (error) {
      console.error("❌ Error placing fruit order:", error);
      res.status(500).json({ message: "Failed to place fruit order", error: error.message });
  }
});

  
  app.post("/orders/dairy", verifyToken, async (req, res) => {
    try {
      console.log("🟢 Received Dairy Order Request:", req.body);
  
      const { items, totalAmount } = req.body;
  
      // ✅ Validate Request Data
      if (!items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
        console.error("❌ Invalid order data:", req.body);
        return res.status(400).json({ message: "Invalid order data: Items or totalAmount missing" });
      }
  
      // ✅ Ensure User Exists
      const userId = req.user.id;
      if (!userId) {
        console.error("❌ User not found in request token");
        return res.status(401).json({ message: "Unauthorized: No user ID found" });
      }
  
      // ✅ Ensure Each Item has ProductId
      for (let item of items) {
        if (!item.productId) {
          console.error("❌ Missing productId for item:", item);
          return res.status(400).json({ message: "Each item must have a productId" });
        }
      }
  
      // ✅ Create New Order
      const newOrder = new Order({
        userId,
        orderType: "DairyOrder",
        items,
        totalAmount,
        status: "Pending",
        estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Default 5 days delivery
        statusDates: { pending: new Date() },
      });
  
      const savedOrder = await newOrder.save();
      console.log("✅ Dairy Order Saved Successfully:", savedOrder);
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("❌ Error placing dairy order:", error);
      res.status(500).json({ message: "Failed to place dairy order", error: error.message });
    }
  });
  
  app.post("/orders/vegetables", verifyToken, async (req, res) => {
    try {
      console.log("🟢 Received Vegetable Order Request:", req.body); // ✅ Log request data
  
      const { items, totalAmount } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
        console.error("❌ Invalid order data:", req.body);
        return res.status(400).json({ message: "Invalid order data" });
      }
  
      const userId = req.user.id;
      const newOrder = new Order({
        userId,
        orderType: "VegetableOrder",
        items,
        totalAmount,
      });
  
      const savedOrder = await newOrder.save();
      console.log("🟢 Vegetable Order Saved:", savedOrder);
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("❌ Error placing vegetable order:", error);
      res.status(500).json({ message: "Failed to place vegetable order", error: error.message });
    }
  });

   
  

app.get("/orders", verifyToken, async (req, res) => {
  try {
    console.log("🟢 Fetching orders for user:", req.user.id);

    const userId = req.user.id;
    if (!userId) {
      console.error("❌ No user ID found in request");
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    // ✅ Fetch Orders and Populate Product Details
    const orders = await Order.find({ userId })
      .populate({
        path: "items.productId",
        select: "name price", // ✅ Fetch only name & price
      })
      .lean()
      .sort({ createdAt: -1 });

    console.log("✅ Orders Fetched:", orders);

    if (!orders || orders.length === 0) {
      console.warn("⚠️ No orders found for user:", userId);
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});



app.get("/", (req, res) => {
  res.status(200).send("Server is running!");
});



app.post("/signup", async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    // Check if the user already exists by email or phone number
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUserByPhone = await User.findOne({ number });
    if (existingUserByPhone) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, number, password: hashedPassword });
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(201).json({
      message: "Signup successful",
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, number: savedUser.number },
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { email, number, password } = req.body;

    // ✅ Find user by email or phone number
    const user = await User.findOne({ $or: [{ email }, { number }] });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("🔑 Stored Hashed Password:", user.password); // ✅ Debug stored password
    console.log("🔑 Entered Password:", password); // ✅ Debug entered password

    // ✅ Compare user-entered password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("✅ Password Match:", isPasswordValid); // ✅ Debug result

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ error: "❌ Internal server error" });
  }
});


// ✅ Add a new Dairy Product

app.post("/api/milk-products", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    let { name, price, img } = req.body; // ✅ Expect `img` from frontend

    if (!name || !price || !img) {
      return res.status(400).json({ message: "⚠️ All fields are required (name, price, img)" });
    }

    // ✅ Convert `price` to a number
    price = Number(price);

    // ✅ Remove extra quotes & trim `img`
    img = img.replace(/['"]+/g, "").trim();

    // ✅ Save to MongoDB
    const newDairyProduct = new DairyProduct({ name, price, img });

    const savedDairyProduct = await newDairyProduct.save();
    res.status(201).json(savedDairyProduct);
  } catch (error) {
    console.error("❌ Error adding dairy product:", error.message);
    res.status(500).json({ message: "❌ Error adding dairy product", error: error.message });
  }
});

// ✅ Fetch all Dairy Products
app.get("/api/milk-products",verifyToken,async (req, res) => {
  try {
    const dairyProducts = await DairyProduct.find();

    const formattedDairyProducts = dairyProducts.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      img: product.img || "default-image.jpg", // Provide a default image in case img is missing
    }));

    res.status(200).json(formattedDairyProducts);
  } catch (error) {
    console.error("❌ Error fetching dairy products:", error.message);
    res.status(500).json({ message: "❌ Error fetching dairy products", error: error.message });
  }
});


// ✅ Update a Dairy Product
app.put("/api/milk-products/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, img } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid dairy product ID" });
    }

    const updatedDairyProduct = await DairyProduct.findByIdAndUpdate(
      id,
      { name, price, img },
      { new: true, runValidators: true }
    );

    if (!updatedDairyProduct) {
      return res.status(404).json({ message: "❌ Dairy product not found" });
    }

    res.status(200).json(updatedDairyProduct);
  } catch (error) {
    console.error("❌ Error updating dairy product:", error.message);
    res.status(500).json({ message: "❌ Error updating dairy product", error: error.message });
  }
});

// ✅ Delete a Dairy Product
app.delete("/api/milk-products/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid dairy product ID" });
    }

    const deletedDairyProduct = await DairyProduct.findByIdAndDelete(id);

    if (!deletedDairyProduct) {
      return res.status(404).json({ message: "❌ Dairy product not found" });
    }

    res.status(200).json({ message: "✅ Dairy product deleted successfully", id });
  } catch (error) {
    console.error("❌ Error deleting dairy product:", error.message);
    res.status(500).json({ message: "❌ Error deleting dairy product", error: error.message });
  }
});


app.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Packing", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateFields = { status };

    if (status === "Packing") updateFields["statusDates.packing"] = new Date();
    if (status === "Shipped") updateFields["statusDates.shipped"] = new Date();
    if (status === "Out for Delivery") updateFields["statusDates.outForDelivery"] = new Date();
    if (status === "Delivered") updateFields["statusDates.delivered"] = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
});



app.post("/api/fruits",verifyToken,verifyRole("admin") ,async (req, res) => {
  try {
    let { name, price, img } = req.body;  // ✅ Expect `img` from frontend

    if (!name || !price || !img) {
      return res.status(400).json({ message: "⚠️ All fields are required (name, price, img)" });
    }

    // ✅ Convert `price` to a number
    price = Number(price);

    // ✅ Remove extra quotes & trim `img`
    img = img.replace(/['"]+/g, '').trim();

    // ✅ Save as `imageUrl` in MongoDB
    const newFruit = new Fruit({ name, price, img: img });

    const savedFruit = await newFruit.save();

    res.status(201).json(savedFruit);
  } catch (error) {
    console.error("❌ Error adding fruit:", error.message);
    res.status(500).json({ message: "❌ Error adding fruit", error: error.message });
  }
});





app.get("/api/fruits", async (req, res) => {
  try {
    const fruits = await Fruit.find();
    
    const formattedFruits = fruits.map((fruit) => ({
      _id: fruit._id,
      name: fruit.name,
      price: fruit.price,
      img: fruit.img || "default-image.jpg",  // ✅ Ensure `imageUrl` exists
    }));

    res.status(200).json(formattedFruits);
  } catch (error) {
    console.error("Error fetching fruits:", error.message);
    res.status(500).json({ message: "Error fetching fruits", error: error.message });
  }
});



app.put("/api/fruits/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, img } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid fruit ID" });
    }

    const updatedFruit = await Fruit.findByIdAndUpdate(
      id,
      { name, price, img },
      { new: true, runValidators: true }
    );

    if (!updatedFruit) {
      return res.status(404).json({ message: "❌ Fruit not found" });
    }

    res.status(200).json(updatedFruit);
  } catch (error) {
    console.error("❌ Error updating fruit:", error.message);
    res.status(500).json({ message: "❌ Error updating fruit", error: error.message });
  }
});


app.delete("/api/fruits/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid fruit ID" });
    }

    const deletedFruit = await Fruit.findByIdAndDelete(id);

    if (!deletedFruit) {
      return res.status(404).json({ message: "Fruit not found" });
    }

    res.status(200).json({ message: "✅ Fruit deleted successfully", id });
  } catch (error) {
    console.error("Error deleting fruit:", error.message);
    res.status(500).json({ message: "❌ Error deleting fruit", error: error.message });
  }
});





// ✅ Add a new vegetable
app.post("/api/vegetables", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    let { name, price, img } = req.body; // ✅ Expect `img` from frontend

    if (!name || !price || !img) {
      return res.status(400).json({ message: "⚠️ All fields are required (name, price, img)" });
    }

    // ✅ Convert `price` to a number
    price = Number(price);

    // ✅ Remove extra quotes & trim `img`
    img = img.replace(/['"]+/g, "").trim();

    // ✅ Save to MongoDB
    const newVegetable = new Vegetable({ name, price, img });

    const savedVegetable = await newVegetable.save();
    res.status(201).json(savedVegetable);
  } catch (error) {
    console.error("❌ Error adding vegetable:", error.message);
    res.status(500).json({ message: "❌ Error adding vegetable", error: error.message });
  }
});

// ✅ Fetch all vegetables
app.get("/api/vegetables", async (req, res) => {
  try {
    const vegetables = await Vegetable.find();

    const formattedVegetables = vegetables.map((veg) => ({
      _id: veg._id,
      name: veg.name,
      price: veg.price,
      img: veg.img || "default-image.jpg", // ✅ Ensure `img` exists
    }));

    res.status(200).json(formattedVegetables);
  } catch (error) {
    console.error("❌ Error fetching vegetables:", error.message);
    res.status(500).json({ message: "❌ Error fetching vegetables", error: error.message });
  }
});

// ✅ Update a vegetable
app.put("/api/vegetables/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, img } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vegetable ID" });
    }

    const updatedVegetable = await Vegetable.findByIdAndUpdate(
      id,
      { name, price, img },
      { new: true, runValidators: true }
    );

    if (!updatedVegetable) {
      return res.status(404).json({ message: "❌ Vegetable not found" });
    }

    res.status(200).json(updatedVegetable);
  } catch (error) {
    console.error("❌ Error updating vegetable:", error.message);
    res.status(500).json({ message: "❌ Error updating vegetable", error: error.message });
  }
});

// ✅ Delete a vegetable
app.delete("/api/vegetables/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vegetable ID" });
    }

    const deletedVegetable = await Vegetable.findByIdAndDelete(id);

    if (!deletedVegetable) {
      return res.status(404).json({ message: "❌ Vegetable not found" });
    }

    res.status(200).json({ message: "✅ Vegetable deleted successfully", id });
  } catch (error) {
    console.error("❌ Error deleting vegetable:", error.message);
    res.status(500).json({ message: "❌ Error deleting vegetable", error: error.message });
  }
});



app.post("/orders",verifyToken, (req, res) => {
  const { orderItems } = req.body;
  if (!orderItems || !orderItems.length) {
    return res.status(400).json({ message: "No items in the order." });
  }
  // Save the order to the database
  res.status(200).json({ message: "Order placed successfully." });
});

app.post("/", verifyToken, async (req, res) => {
  try {
    const { fruitId, quantity } = req.body;

    if (!fruitId || !quantity) {
      return res.status(400).json({ error: "Missing fruitId or quantity" });
    }

    const newOrder = new Order({
      fruitId,
      quantity,
      userId: req.user.id, // Assuming `verifyToken` adds user info to `req`
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error adding order:", err);
    res.status(500).json({ error: "Failed to add order" });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: 'Message received successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message. Please try again later.' });
  }
});
// In your backend
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find(); // Fetch all contact messages
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts.' });
  }
});

// Get all orders (admin)
app.get("/admin/orders", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});



// app.post('/create-payment-intent', async (req, res) => {
//   const { amount } = req.body;

//   // Ensure the amount is a valid integer and is greater than or equal to 5000 paise (₹50.00)
//   if (!amount || isNaN(amount) || amount < 5000) { // 5000 paise = ₹50.00
//     return res.status(400).send({
//       error: 'Amount is required and should be at least ₹50.00',
//     });
//   }

//   try {
//     // Create a PaymentIntent with the amount (in paise for INR)
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount, // amount should already be in the correct format (paise)
//       currency: 'inr', // Currency in INR
//     });

//     // Send the clientSecret to the frontend to complete the payment
//     res.status(200).send({
//       clientSecret: paymentIntent.client_secret,
//     });
//     console.log("PaymentIntent created successfully:", paymentIntent.id);
    
//   } catch (error) {
//     console.error('Error creating payment intent:', error.message);
//     res.status(500).send({
//       error: 'Failed to create payment intent',
//     });
//   }
// });

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  // Ensure the amount is a valid number and is greater than or equal to 50 INR (₹50.00)
  if (!amount || isNaN(amount) || amount < 50) { // Minimum amount should be ₹50
    return res.status(400).send({
      error: 'Amount is required and should be at least ₹50.00',
    });
  }

  try {
    // Convert rupees to paise (1 INR = 100 paise)
    const amountInPaise = amount * 100;

    // Create a PaymentIntent with the amount in paise
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,  // Amount is now in paise (1 INR = 100 paise)
      currency: 'inr',        // Currency in INR
    });

    // Send the clientSecret to the frontend to complete the payment
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
    console.log("PaymentIntent created successfully:", paymentIntent.id);

  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    res.status(500).send({
      error: 'Failed to create payment intent',
    });
  }
});



app.get("/orders/:orderId", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is admin or if the order belongs to the user
    if (req.user.role !== "admin" && order.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// Update order status (admin only)
app.put("/admin/orders/:orderId/status", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});




// Route to request OTP for password reset
app.post('/request-otp', async (req, res) => {
  const { email } = req.body;

  // Validate email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const otp = generateOtp();
  await storeOtp(email, otp); // Store OTP in the database

  try {
    await sendOtpEmail(email, otp); // Send OTP via email
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Route to verify OTP and reset password
app.post('/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found, request a new one' });
    }

    // Check if OTP is valid and not expired
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const currentTime = Date.now();
    if (currentTime - otpRecord.createdAt.getTime() > 120000) { // 2 minutes expiry time
      return res.status(400).json({ message: 'OTP expired, request a new one' });
    }

    // Reset password
    const user = await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });

    // Delete OTP after successful verification
    await Otp.deleteOne({ email });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP or resetting password' });
  }
});



app.post("/api/reset-password", async (req, res) => {
  const { email, password } = req.body;

  // Validate password
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: "❌ Email and password are required (Min: 6 chars)." });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "❌ User not found." });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password with the hashed version
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "✅ Password reset successfully!" });
  } catch (err) {
    console.error("❌ Error resetting password:", err);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});


// 📌 1️⃣ whatapp api send-otp,verify-otp,reset-password


// app.post('/api/forgot-password/send-otp', async (req, res) => {
//   const { mobile } = req.body;

//   console.log("📥 Received OTP request for:", mobile);

//   if (!mobile || mobile.length !== 10 ) {
//     console.log("❌ Invalid mobile number:", mobile);
//     return res.status(400).json({ message: 'Invalid mobile number' });
//   }

//   try {
//     const otp = generateOtp();
//     console.log("🔢 Generated OTP:", otp);

//     const otpSent = await sendOtp(mobile, otp);

//     if (otpSent) {
//       await storeOtp(mobile, otp);
//       console.log(`✅ OTP successfully sent to ${mobile}`);
//       return res.status(200).json({ message: '✅ OTP sent successfully' });
//     } else {
//       console.error("❌ Failed to send OTP. API Error.");
//       return res.status(500).json({ message: 'Failed to send OTP' });
//     }
//   } catch (error) {
//     console.error("❌ Error generating OTP or sending SMS:", error);
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });


//  app.post('/api/forgot-password/verify-otp', async (req, res) => {
//   const { mobile, otp } = req.body;

//   if (!mobile || !otp) {
//     return res.status(400).json({ message: 'Mobile number and OTP are required' });
//   }

//   try {
//     const isOtpValid = await verifyOtp(mobile, otp); // Await verification

//     if (isOtpValid) {
//       return res.status(200).json({ message: 'OTP verified successfully' });
//     } else {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);  // Log detailed error
//     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// app.post('/api/reset-password', async (req, res) => {
//   const { mobile, password } = req.body;

//   if (!mobile || !password || password.length < 6) {
//     return res.status(400).json({ message: '❌ Mobile number and password are required (Min: 6 chars).' });
//   }

//   try {
//     // ✅ Find user by mobile number
//     const user = await User.findOne({ number: mobile });

//     if (!user) {
//       return res.status(404).json({ message: '❌ User not found.' });
//     }

//     console.log("🔍 New Password Before Hashing:", password);

//     // ✅ Check if password is already hashed (DO NOT HASH TWICE)
//     if (password.startsWith("$2b$")) {
//       return res.status(400).json({ message: "❌ Password is already hashed." });
//     }

//     // ✅ Hash password only once
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("🔐 Hashed Password Stored:", hashedPassword);

//     // ✅ Store hashed password
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: '✅ Password reset successfully!' });
//   } catch (err) {
//     console.error('❌ Error resetting password:', err);
//     res.status(500).json({ message: '❌ Internal Server Error', error: err.message });
//   }
// });






/**
 * Handle undefined routes
 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
