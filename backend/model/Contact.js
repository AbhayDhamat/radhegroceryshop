const mongoose = require("mongoose");

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email Validation
  },
  phone: { 
    type: String, 
    required: true, 
    match: /^[0-9]{10}$/ // Phone number validation (10 digits)
  },
  message: { type: String, required: true },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true // Rating from 1 to 5
  },
  createdAt: { type: Date, default: Date.now } // Timestamp
});

// Export Model
module.exports = mongoose.model("Contact", contactSchema);