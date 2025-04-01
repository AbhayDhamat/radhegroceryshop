const mongoose = require("mongoose");

const FruitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  
});

const Fruit = mongoose.model("Fruit", FruitSchema);

module.exports = Fruit;
