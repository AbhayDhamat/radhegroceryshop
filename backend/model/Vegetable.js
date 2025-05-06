const mongoose = require("mongoose");

const VegetableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
});

const Vegetable = mongoose.model("Vegetable", VegetableSchema);
module.exports = Vegetable;
