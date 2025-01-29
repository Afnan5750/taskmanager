const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(
      token,
      "6dcb9d3c24af3b1eb3456789abcedf12abcdef3456789fedcba0987654"
    );
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

router.get("/", authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId })
      .populate("userId", "email")
      .exec();

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a task for the authenticated user
router.post("/", authenticateUser, async (req, res) => {
  const { title, completed } = req.body;

  try {
    const user = await User.findById(req.userId); // Get the user based on the userId from the token

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = new Task({
      title,
      completed,
      userId: req.userId,
      email: user.email, // Save the user's email with the task
    });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update a task
router.put("/:id", async (req, res) => {
  try {
    const { title, completed } = req.body; // Only handle title and completed
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
