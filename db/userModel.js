const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
  password: { type: String },
  user_name: { type: String },
});

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);
