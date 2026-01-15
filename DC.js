window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  const content = document.getElementById("mycontainer");

  setTimeout(() => {
    splash.style.display = "none";
    content.style.display = "block";
  }, 3000);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

Notification.requestPermission();


function scheduleReminder(task, timeValue) {
  const reminderTime = new Date(timeValue);
  const now = new Date();
  const delay = reminderTime - now;

  if (delay <= 0) {
    console.log("Time already passed");
    return;
  }

  setTimeout(() => {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification("Task Reminder", {
        body: task,
        icon: "icon.png"
      });
    });
  }, delay);
}

function addTask() {
  const taskText = myTask.value.trim();
  const timeValue = document.getElementById("time").value;

  if (!taskText) return;

  createTaskElement(taskText);

  saveTask(taskText);

  if (timeValue) scheduleReminder(taskText, timeValue);

  myTask.value = "";
  document.getElementById("time").value = "";
}

const addBtn = document.getElementById("addBtn");
const myTask = document.getElementById("myTask");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
});

window.addEventListener("load", loadTasks);
addBtn.addEventListener("click", addTask);


function createTaskElement(taskText, completed = false) {
  const li = document.createElement("li");
  li.textContent = taskText;

  if (completed) li.classList.add("completed");

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateLocalStorage();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    updateLocalStorage();
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function saveTask(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateLocalStorage() {
  let tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.childNodes[0].textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    createTaskElement(task.text, task.completed);
  });
}
