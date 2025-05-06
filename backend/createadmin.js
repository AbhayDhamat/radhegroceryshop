const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const UserModel = require("./model/userModel");

dotenv.config(); // Load environment variables

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "dhamatabhay1142005@admin.com"; // Replace with your desired admin email
    const adminPassword = "admin123";      // Replace with your desired admin password

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create new admin user
    const adminUser = new UserModel({
      name: "Admin",       // Replace with desired admin name
      email: adminEmail,
      number:"9586811464",
      password: hashedPassword,
      role: "admin",       // Set role as "admin"
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

// Call the function to create the admin user
createAdmin();