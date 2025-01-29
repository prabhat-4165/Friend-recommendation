const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  interests: [String],
  notifications: [{ type: String }], // Add this field to store notifications
});

module.exports = mongoose.model("User", userSchema);
