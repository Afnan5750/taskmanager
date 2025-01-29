const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  email: { type: String, required: true }, // Add email field to store the email in the task
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
