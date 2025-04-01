// models/otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 120 } // OTP expires in 2 minutes
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
