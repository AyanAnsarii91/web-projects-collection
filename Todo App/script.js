const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const emptyState = document.querySelector(".todo-app__empty-state");
const itemsLeftSpan = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const filters = document.querySelectorAll(".filter");
const dateSpan = document.getElementById("date");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

const updateDate = () => {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  dateSpan.textContent = now.toLocaleDateString("en-US", options);
};

const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const renderTodos = () => {
  todosList.innerHTML = "";
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
  });

  if (filteredTodos.length === 0 && emptyState) {
    emptyState.classList.remove("hidden");
  } else if (emptyState) {
    emptyState.classList.add("hidden");
  }

  filteredTodos.forEach((todo, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("todo-item");
    if (todo.completed) {
      listItem.classList.add("completed");
    }
    listItem.innerHTML = `
      <label class="checkbox-container">
        <input type="checkbox" class="todo-checkbox" ${
          todo.completed ? "checked" : ""
        } data-index="${index}"/>
        <span class="checkmark"></span>
      </label>
      <span class="todo-item-text">${todo.text}</span>
      <button class="delete-btn" data-index="${index}">
        <i class="fas fa-times"></i>
      </button>
    `;
    todosList.appendChild(listItem);
  });

  updateItemsLeft();
};

const addTodo = () => {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    todos.push({
      text: taskText,
      completed: false,
    });
    taskInput.value = "";
    saveTodos();
    renderTodos();
  }
};

const toggleComplete = (index) => {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
};

const deleteTodo = (index) => {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
};

const updateItemsLeft = () => {
  const activeTodos = todos.filter((todo) => !todo.completed).length;
  itemsLeftSpan.textContent = `${activeTodos} item${
    activeTodos !== 1 ? "s" : ""
  } left`;
};

const clearCompleted = () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
};

const setFilter = (newFilter) => {
  filter = newFilter;
  filters.forEach((f) => f.classList.remove("filter--active"));
  document
    .querySelector(`.filter[data-filter="${filter}"]`)
    .classList.add("filter--active");
  renderTodos();
};

// Event Listeners
addTaskBtn.addEventListener("click", addTodo);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

todosList.addEventListener("change", (e) => {
  if (e.target.classList.contains("todo-checkbox")) {
    const index = e.target.dataset.index;
    toggleComplete(index);
  }
});

todosList.addEventListener("click", (e) => {
  if (e.target.closest(".delete-btn")) {
    const index = e.target.closest(".delete-btn").dataset.index;
    deleteTodo(index);
  }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filters.forEach((filterBtn) => {
  filterBtn.addEventListener("click", () => {
    setFilter(filterBtn.dataset.filter);
  });
});

// Initialize
updateDate();
renderTodos();
