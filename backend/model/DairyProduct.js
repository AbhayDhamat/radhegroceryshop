const mongoose = require("mongoose");

const DairyProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
});

const DairyProduct = mongoose.model("DairyProduct", DairyProductSchema);  // ✅ Model name is DairyProduct
module.exports = DairyProduct;
