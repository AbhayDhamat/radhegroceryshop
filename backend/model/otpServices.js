const mongoose = require("mongoose");
const fetch = require("node-fetch");

// ✅ Define OTP Schema with Expiration Time (2 minutes)
const otpSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 120 } // OTP expires in 2 minutes
});

const Otp = mongoose.model("Otp", otpSchema);

// ✅ Function to Generate a Secure 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



// ✅ Store OTP in Database (Upsert)
const storeOtp = async (mobile, otp) => {
  try {
    await Otp.findOneAndUpdate(
      { mobile },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );
    console.log(`💾 OTP for ${mobile} stored successfully.`);
  } catch (error) {
    console.error("❌ Error storing OTP:", error.message);
    throw new Error("Failed to store OTP in database.");
  }
};


const sendOtp = async (mobile, otp) => {
  const apiKey = "7269d7885883424d8afdc29639de2eab"; // Your API Key
  const formattedMobile = mobile.startsWith("+") ? mobile : `+91${mobile}`; // Format for India
  const msg = `Radhe Grocery Shop: Your OTP for verification is  ${otp}.Please use it to complete your action`;
  const url = `http://bot.bonrix.in/wapp/api/send?apikey=${apiKey}&mobile=${formattedMobile}&msg=${encodeURIComponent(msg)}`;

  try {
    console.log(`📨 Sending OTP to ${formattedMobile}, OTP: ${otp}`);
    const response = await fetch(url, { method: "GET" });
    const responseBody = await response.json();

    console.log("📩 Response Status:", response.status);
    console.log("📩 Full API Response:", responseBody);

    if (!response.ok || responseBody.status.toLowerCase() !== "success") {
      console.error("❌ Failed to send OTP, HTTP Status:", response.status);
      return false;
    }

    console.log("✅ OTP sent successfully.");
    return true;
  } catch (error) {
    console.error("❌ Error in sending OTP:", error.message);
    return false;
  }
};

// Store OTP only if sending succeeds
const storeOtpIfSent = async (mobile) => {
  const otp = generateOtp();
  const sent = await sendOtp(mobile, otp);
  
  if (sent) {
    try {
      await Otp.findOneAndUpdate(
        { mobile },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
      );
      console.log(`💾 OTP for ${mobile} stored successfully.`);
    } catch (error) {
      console.error("❌ Error storing OTP:", error.message);
    }
  } else {
    console.error("❌ OTP not stored as sending failed.");
  }
};

// Modify verification logic to avoid redirecting users to reset password if OTP is incorrect
const verifyOtp = async (mobile, enteredOtp) => {
  try {
    const otpRecord = await Otp.findOne({ mobile });

    // ⚠️ If No OTP Found
    if (!otpRecord) {
      console.log(`⚠️ No OTP record found for ${mobile}`);
      return { success: false, message: "⚠️ OTP not found. Please request a new OTP." };
    }

    // ❌ If OTP is Incorrect
    if (otpRecord.otp !== enteredOtp) {
      console.log(`❌ Invalid OTP entered for ${mobile}`);
      return { success: false, message: "❌ Incorrect OTP. Please try again." };
    }

    // ⏳ Check if OTP is Expired
    const currentTime = Date.now();
    if (currentTime - otpRecord.createdAt.getTime() > 120000) { // 120000 ms = 2 minutes
      console.log(`⏳ OTP expired for ${mobile}`);
      await Otp.deleteOne({ mobile }); // Delete expired OTP
      return { success: false, message: "⏳ OTP expired. Request a new one." };
    }

    // ✅ OTP is Correct & Verified
    console.log(`✅ OTP verified successfully for ${mobile}`);
    await Otp.deleteOne({ mobile }); // Delete OTP after successful verification

    return { success: true, message: "✅ OTP Verified Successfully." };
  } catch (error) {
    console.error("❌ Error verifying OTP:", error.message);
    return { success: false, message: "❌ Error verifying OTP. Please try again later." };
  }
};

module.exports = { generateOtp, sendOtp, storeOtp, verifyOtp };
