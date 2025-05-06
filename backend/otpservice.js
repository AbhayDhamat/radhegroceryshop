// otpService.js
const nodemailer = require('nodemailer');
require('dotenv').config();
const Otp = require('./model/emailotp');


// Create a transporter using Gmail SMTP settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: "eany gofq bynh cqwx",  // Make sure this is an App Password if using 2FA
    }
  });
  
  const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for resetting your password is ${otp}. It expires in 2 minutes.`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}`);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email.');
    }
  };
  



// Function to generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in the database
const storeOtp = async (email, otp) => {
    try {
      // Check if the OTP exists for the email
      const otpRecord = await Otp.findOne({ email });
  
      if (otpRecord) {
        // If OTP already exists for the email, update it
        otpRecord.otp = otp;
        otpRecord.createdAt = new Date();
        await otpRecord.save(); // Save the updated record
      } else {
        // If OTP doesn't exist for the email, create a new one
        const newOtp = new Otp({
          email,
          otp,
          createdAt: new Date()
        });
        await newOtp.save(); // Save the new OTP
      }
  
      console.log(`OTP for ${email} stored successfully.`);
    } catch (error) {
      console.error('Error storing OTP:', error);
      throw new Error('Failed to store OTP in database.');
    }
  };



module.exports = { generateOtp, storeOtp, sendOtpEmail };
