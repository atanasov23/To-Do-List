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

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        const data = await response.json();
        console.log("Отговор от сървъра:", data);

        // Проверка за грешка от сървъра
        if (!response.ok) {
            throw new Error(data.message);
        }

        const emptyMessage = document.querySelector(".empty-message");

if (emptyMessage) {
    emptyMessage.remove();
}


// Добавяне на новата задача
createTask(data);

taskInput.value = "";

    } catch (error) {

        alert(error.message);

        console.error("Грешка:", error);
    }
}

function createTask(task) {

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
        span.style.textDecoration = "line-through";
    }

    const buttons = document.createElement("div");


    // ==========================
    // Бутон: Завършена задача ✔
    // ==========================

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";

    completeBtn.addEventListener("click", async () => {

        const oldStatus = task.completed;

        task.completed = !task.completed;

        try {

            const response = await fetch(`${API_URL}/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: task.text,
                    completed: task.completed
                })
            });


            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.message);
            }


            span.style.textDecoration =
                task.completed ? "line-through" : "none";


        } catch (error) {

            alert(error.message);
            console.error(error);

            // връщаме старата стойност
            task.completed = oldStatus;
        }

    });



    // ==========================
    // Бутон: Редакция ✏
    // ==========================

    const editBtn = document.createElement("button");
editBtn.textContent = "✏";

let isEditing = false;

editBtn.addEventListener("click", async () => {

    if (!isEditing) {

        // Влизаме в режим редакция
        const input = document.createElement("input");

        input.type = "text";
        input.value = task.text;
        input.className = "edit-input";

        li.replaceChild(input, span);

        editBtn.textContent = "💾";

        input.focus();

        isEditing = true;


    } else {

        // Запазване на промяната

        const input = li.querySelector(".edit-input");

        const newText = input.value.trim();


  


        try {

    const response = await fetch(`${API_URL}/${task.id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            text: newText,
            completed: task.completed
        })
    });


    const data = await response.json();

    console.log("Отговор от сървъра:", data);


    if (!response.ok) {
        alert(data.message);
        return;
    }


    task.text = newText;

    span.textContent = newText;

    li.replaceChild(span, input);

    editBtn.textContent = "✏";

    isEditing = false;


} catch(error) {

    alert("Грешка: " + error.message);

}

    }

});

    // ==========================
    // Бутон: Изтриване 🗑
    // ==========================

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";


    deleteBtn.addEventListener("click", async () => {


        const answer = confirm(
            "Сигурни ли сте, че искате да изтриете задачата?"
        );


        if (!answer) {
            return;
        }


        try {

            const response = await fetch(`${API_URL}/${task.id}`, {

                method: "DELETE"

            });


            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.message);
            }


            li.remove();
            if (taskList.children.length === 0) {

    const emptyMessage = document.createElement("p");

    emptyMessage.textContent = "В момента няма задачи.";

    emptyMessage.className = "empty-message";

    taskList.appendChild(emptyMessage);

}


        } catch (error) {

            alert(error.message);
            console.error(error);

        }

    });



    buttons.appendChild(completeBtn);
    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);


    li.appendChild(span);
    li.appendChild(buttons);


    taskList.appendChild(li);
}

async function loadTasks() {

    try {

        const response = await fetch(API_URL);

        const tasks = await response.json();

        taskList.innerHTML = "";


        if (tasks.length === 0) {

            const emptyMessage = document.createElement("p");

            emptyMessage.textContent = "В момента няма задачи.";

            emptyMessage.className = "empty-message";

            taskList.appendChild(emptyMessage);

            return;
        }


        tasks.forEach(task => {
            createTask(task);
        });


    } catch (error) {

        console.error(error);

        taskList.innerHTML = 
            "<p>Грешка при зареждане на задачите.</p>";

    }

}

loadTasks();