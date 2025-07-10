const mongoose = require("mongoose");
const { type } = require("os");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  purchaseAmount: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  productPurchased: {
    type: String,
  },
  invoiceNumber: {
    type: Number,
  },
  earnedPoints: {
    type: Number,
    default: 0,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("user", user);
