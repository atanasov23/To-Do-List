const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

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

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Моля, въведете задача.");
        return;
    }

        if (text.length < 3) {
        alert("Задачата трябва да съдържа поне 3 символа.");
        taskInput.focus();
        return;
    }

    if (text.length > 100) {
        alert("Задачата не може да бъде по-дълга от 100 символа.");
        taskInput.focus();
        return;
    }

    createTask(text);

    taskInput.value = "";
    taskInput.focus();
}

function createTask(text) {

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;

    const buttons = document.createElement("div");

    // Завършена задача
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";

    completeBtn.addEventListener("click", () => {
        span.style.textDecoration =
            span.style.textDecoration === "line-through"
                ? "none"
                : "line-through";
    });

    // Редакция
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏";

    editBtn.addEventListener("click", () => {
        const newText = prompt("Редактирай задачата:", span.textContent);

        if (newText && newText.trim() !== "") {
            span.textContent = newText.trim();
        }
    });

    // Изтриване
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";

    deleteBtn.addEventListener("click", () => {
        li.remove();
    });

    buttons.appendChild(completeBtn);
    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttons);

    taskList.appendChild(li);
}