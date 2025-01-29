const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes"); // Include auth routes

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection with taskManager database
mongoose
  .connect("mongodb://127.0.0.1:27017/taskManager", {})
  .then(() => console.log("Connected to MongoDB taskManager database"))
  .catch((err) => console.log("MongoDB connection error:", err));

// API Route for tasks only
app.use("/api/tasks", taskRoutes); // Task-related routes
app.use("/api/auth", authRoutes); // Authentication-related routes

// Server start
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
