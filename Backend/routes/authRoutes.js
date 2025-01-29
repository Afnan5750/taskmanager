const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.status(200).json(users); // Return the list of users
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users" });
  }
});

// Register a new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password }); // Ensure password is hashed in production
  try {
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login and generate a JWT token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    // Use password hashing in production
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user._id },
    "6dcb9d3c24af3b1eb3456789abcedf12abcdef3456789fedcba0987654",
    {
      expiresIn: "1h",
    }
  );
  res.json({ token });
});

// Update a user by id
router.put("/users/:id", async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL parameter
  const { email, password } = req.body; // Get the updated data from the request body

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's data
    user.email = email || user.email; // If email is provided, update it
    user.password = password || user.password; // If password is provided, update it

    await user.save(); // Save the updated user

    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// Delete a user by id
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL parameter

  try {
    // Find the user by ID and delete
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
