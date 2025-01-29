import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./styles/TaskPage.css";

const TaskPage = ({ token }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        setError("Failed to fetch tasks. Try again.");
      }
    };

    fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    if (!taskTitle) {
      setError("Task title is required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title: taskTitle,
          completed: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newTask = response.data;
      setTasks([...tasks, newTask]);
      setTaskTitle("");
      setError("");
    } catch (err) {
      setError("Failed to add task. Try again.");
    }
  };

  const handleEditTask = (taskId, currentTitle) => {
    setEditTaskId(taskId);
    setTaskTitle(currentTitle);
  };

  const handleUpdateTask = async () => {
    if (!taskTitle) {
      setError("Task title is required!");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${editTaskId}`,
        {
          title: taskTitle,
          completed: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedTask = response.data;
      setTasks(
        tasks.map((task) => (task._id === editTaskId ? updatedTask : task))
      );
      setTaskTitle("");
      setEditTaskId(null);
      setError("");
    } catch (err) {
      setError("Failed to update task. Try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(tasks.filter((task) => task._id !== taskId));
      } catch (err) {
        setError("Failed to delete task. Try again.");
      }
    }
  };

  const handleToggleCompleted = async (taskId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          completed: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedTask = response.data;
      setTasks(tasks.map((task) => (task._id === taskId ? updatedTask : task)));
    } catch (err) {
      setError("Failed to update task completion status. Try again.");
    }
  };

  return (
    <div class="task-manager">
      <h2 class="title">{editTaskId ? "Update Task" : "Add Task"}</h2>
      <div class="input-container">
        <input
          class="input"
          type="text"
          placeholder="Enter Task"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button
          class={`button ${editTaskId ? "button-update" : "button-add"}`}
          onClick={editTaskId ? handleUpdateTask : handleAddTask}
        >
          {editTaskId ? "Update Task" : "Add Task"}
        </button>
      </div>
      {error && <p class="error">{error}</p>}

      <div class="tasks">
        <h3 class="tasks-title">Your Tasks:</h3>
        {tasks.length === 0 ? (
          <p class="no-tasks">No tasks added yet.</p>
        ) : (
          <ul class="list">
            {tasks.map((task) => (
              <li class="item" key={task._id}>
                <label class="item-label">
                  <input
                    class="checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleToggleCompleted(task._id, task.completed)
                    }
                  />
                  <strong
                    class={`item-title ${
                      task.completed ? "completed-task" : ""
                    }`}
                  >
                    {task.title}
                  </strong>
                </label>
                <div class="action-buttons">
                  <button
                    class="button button-edit"
                    onClick={() => handleEditTask(task._id, task.title)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    class="button button-delete"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
