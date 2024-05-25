// UserController.js
const User = require("../db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("bson");
require("dotenv").config();

// Function to hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Register user
const registerUser = async (req, res) => {
  const { user_name, password, location, description, occupation } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = new User({
      user_name,
      password: hashedPassword,
      location,
      description,
      occupation,
    });

    await newUser.save();

    // Create token data
    const tokenData = {
      _id: newUser._id,
      user_name: newUser.user_name,
      location: newUser.location,
      description: newUser.description,
      occupation: newUser.occupation,
    };

    // Sign the JWT token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET);

    res.status(201).json({ token, ...tokenData }); // Return the token and user info
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getUsersList = async (req, res) => {
  try {
    const users = await User.find({}, "user_name _id").lean();
    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }
    res.json({ users, count: users.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Login user
const loginUser = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const user = await User.findOne({ user_name });
    if (!user) {
      return res.status(400).json({ error: "Invalid login name or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid login name or password" });
    }

    const tokenData = {
      _id: user._id,
      user_name: user.user_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET);

    res.json({ token, ...tokenData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Logout user (if needed)
const logoutUser = (req, res) => {
  // Handle logout logic here
};

module.exports = {
  registerUser,
  getUsersList,
  getUserById,
  loginUser,
  logoutUser,
};
