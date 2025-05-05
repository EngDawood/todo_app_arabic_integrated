const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Load initial data
const dataPath = path.join(__dirname, "..", "rest_db_extracted", "tasks_sample.json");
let tasks = [];
try {
  const rawData = fs.readFileSync(dataPath, "utf8");
  tasks = JSON.parse(rawData);
  // Ensure tasks have unique IDs if not already present (simple approach)
  let maxId = 0;
  tasks.forEach(task => {
    if (task.id && typeof task.id === "number" && task.id > maxId) {
      maxId = task.id;
    }
  });
  tasks.forEach(task => {
    if (!task.id) {
      task.id = ++maxId;
    }
  });
  console.log(`Loaded ${tasks.length} tasks from ${dataPath}`);
} catch (err) {
  console.error("Error reading or parsing tasks data:", err);
  // Start with an empty array if file doesn't exist or is invalid
}

let nextId = tasks.reduce((max, task) => Math.max(max, task.id || 0), 0) + 1;

// API Endpoints

// GET /tasks - Get all tasks
app.get("/tasks", (req, res) => {
  console.log(`GET /tasks - Returning ${tasks.length} tasks`);
  res.json(tasks);
});

// POST /tasks - Add a new task
app.post("/tasks", (req, res) => {
  const newTask = req.body;
  if (!newTask || typeof newTask.title !== "string") { // Basic validation
    return res.status(400).json({ message: "Invalid task data" });
  }
  newTask.id = nextId++;
  newTask.completed = newTask.completed || false; // Default completed status
  tasks.push(newTask);
  console.log(`POST /tasks - Added task: ${JSON.stringify(newTask)}`);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update a task
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const updatedTaskData = req.body;
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    console.log(`PUT /tasks/${taskId} - Task not found`);
    return res.status(404).json({ message: "Task not found" });
  }

  // Update only provided fields, keep original id
  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTaskData, id: taskId };
  console.log(`PUT /tasks/${taskId} - Updated task: ${JSON.stringify(tasks[taskIndex])}`);
  res.json(tasks[taskIndex]);
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    console.log(`DELETE /tasks/${taskId} - Task not found`);
    return res.status(404).json({ message: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  console.log(`DELETE /tasks/${taskId} - Deleted task: ${JSON.stringify(deletedTask[0])}`);
  res.status(200).json({ message: "Task deleted successfully", id: taskId }); // Send back ID or confirmation
});

// Start server
app.listen(port, "0.0.0.0", () => { // Listen on 0.0.0.0 for external accessibility
  console.log(`Local task server listening at http://0.0.0.0:${port}`);
});

