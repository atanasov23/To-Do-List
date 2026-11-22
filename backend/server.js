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
    try {
        const { text } = req.body;

        if (!text || text.trim().length < 3) {
            return res.status(400).json({
                message: "Задачата трябва да съдържа поне 4 символа, за да добавите."
            });
        }

        const tasks = loadTasks();

        const newTask = {
            id: Date.now(),
            text: text.trim(),
            completed: false
        };

        tasks.push(newTask);
        saveTasks(tasks);

        res.status(201).json(newTask);

    } catch (error) {
        res.status(500).json({
            message: "Възникна грешка при добавяне на задачата."
        });
    }
});

app.put("/tasks/:id", (req, res) => {
    try {
        const tasks = loadTasks();

        const task = tasks.find(t => t.id == req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Задачата не е намерена."
            });
        }

        if (!req.body.text || req.body.text.trim().length <= 3) {
            return res.status(400).json({
                message: "Невалиден текст на задачата. Трябва да съдържа поне 4 символа."
            });
        }

        task.text = req.body.text.trim();
        task.completed = req.body.completed;

        saveTasks(tasks);

        res.json(task);

    } catch (error) {
        res.status(500).json({
            message: "Възникна грешка при редактиране."
        });
    }
});

app.delete("/tasks/:id", (req, res) => {
    try {
        const tasks = loadTasks();

        const taskExists = tasks.some(t => t.id == req.params.id);

        if (!taskExists) {
            return res.status(404).json({
                message: "Задачата не е намерена."
            });
        }

        const updatedTasks = tasks.filter(t => t.id != req.params.id);

        saveTasks(updatedTasks);

        res.json({
            message: "Задачата беше изтрита."
        });

    } catch (error) {
        res.status(500).json({
            message: "Възникна грешка при изтриване."
        });
    }
});

// Стартиране на сървъра
app.listen(PORT, () => {
    console.log(`Сървърът работи на http://localhost:${PORT}`);
});