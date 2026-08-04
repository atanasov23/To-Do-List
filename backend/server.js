const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;


// Middleware
app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, "data", "tasks.json");

// Четене на задачите
function loadTasks() {
    if (!fs.existsSync(FILE_PATH)) {
        return [];
    }

    const data = fs.readFileSync(FILE_PATH, "utf8");

    return data ? JSON.parse(data) : [];
}

// Записване на задачите
function saveTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

// Връща всички задачи
app.get("/tasks", (req, res) => {
    const tasks = loadTasks();
    res.json(tasks);
});

// Добавяне на задача
app.post("/tasks", (req, res) => {

    const tasks = loadTasks();

    const newTask = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks(tasks);

    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {

    const tasks = loadTasks();

    const task = tasks.find(t => t.id == req.params.id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    task.text = req.body.text;
    task.completed = req.body.completed;

    saveTasks(tasks);

    res.json(task);
});

app.delete("/tasks/:id", (req, res) => {

    const tasks = loadTasks();

    const filteredTasks = tasks.filter(t => t.id != req.params.id);

    saveTasks(filteredTasks);

    res.json({ message: "Task deleted" });
});

// Стартиране на сървъра
app.listen(PORT, () => {
    console.log(`Сървърът работи на http://localhost:${PORT}`);
});