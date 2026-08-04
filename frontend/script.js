const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const API_URL = "http://localhost:3000/tasks";

// Премахваме примерната задача от HTML
taskList.innerHTML = [];

// Добавяне на задача
addTaskBtn.addEventListener("click", addTask);

// Добавяне с Enter
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

async function addTask() {
    const text = taskInput.value.trim();

    if (text.length < 3) {
        alert("Въведете поне 3 символа.");
        return;
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text
        })
    });

    const task = await response.json();

    createTask(task);

    taskInput.value = "";
}

function createTask(task) {

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
        span.style.textDecoration = "line-through";
    }

    const buttons = document.createElement("div");

    // Бутон за маркиране като изпълнена
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";

    completeBtn.addEventListener("click", async () => {

        task.completed = !task.completed;

        await fetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        span.style.textDecoration = task.completed ? "line-through" : "none";
    });

    // Бутон за редактиране
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏";

    editBtn.addEventListener("click", async () => {

        const newText = prompt("Редактирайте задачата:", task.text);

        if (!newText || newText.trim() === "") {
            return;
        }

        task.text = newText.trim();

        await fetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        span.textContent = task.text;
    });

    // Бутон за изтриване
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";

    deleteBtn.addEventListener("click", async () => {

        const answer = confirm("Сигурни ли сте, че искате да изтриете задачата?");

        if (!answer) {
            return;
        }

        await fetch(`${API_URL}/${task.id}`, {
            method: "DELETE"
        });

        li.remove();
    });

    buttons.appendChild(completeBtn);
    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttons);

    taskList.appendChild(li);
}

async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    taskList.innerHTML = "";

    tasks.forEach(task => {
        createTask(task);
    });
}

loadTasks();