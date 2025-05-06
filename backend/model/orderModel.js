const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderType: { type: String, enum: ["FruitOrder", "VegetableOrder", "DairyOrder"], required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, refPath: "items.productType", required: true },
        productType: { type: String, enum: ["Fruit", "Vegetable", "DairyProduct"], required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Packing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],  // Added Packing
      default: "Pending",
    },
    estimatedDeliveryDate: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 2 * 60 * 60 * 1000); // ✅ 2-hour delivery time
      },
    },
    statusDates: {
      packing: { type: Date }, // Changed Packing to lowercase to be consistent
      shipped: { type: Date },
      outForDelivery: { type: Date },
      delivered: { type: Date },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
