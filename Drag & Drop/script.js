let cards = document.querySelectorAll(".kanban-card");
let lists = document.querySelectorAll(".kanban-list");

const editModal = document.getElementById("editModal");
const editTextarea = document.getElementById("editTextarea");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let currentEditingCard = null;

function updateCardListeners() {
  cards = document.querySelectorAll(".kanban-card");
  cards.forEach((card) => {
    card.removeEventListener("dblclick", onCardDoubleClick); // avoid duplicates
    card.addEventListener("dblclick", onCardDoubleClick);
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
  });
  updateCounts();
}

function onCardDoubleClick(event) {
  currentEditingCard = event.currentTarget;
  editTextarea.value = currentEditingCard
    .querySelector(".kanban-card__text")
    .textContent.trim();
  editModal.style.display = "flex";
  editTextarea.focus();
}

function removeCard(btn) {
  btn.parentElement.remove();
  updateCardListeners();
  saveState(); // Save after removal
}

lists.forEach((list) => {
  list.addEventListener("dragover", dragOver);
  list.addEventListener("dragenter", dragEnter);
  list.addEventListener("dragleave", dragLeave);
  list.addEventListener("drop", dragDrop);
});

function dragStart(e) {
  e.dataTransfer.setData("text/plain", this.id);
}

function dragEnd(e) {
  e.preventDefault();
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add("over");
}

function dragLeave(e) {
  this.classList.remove("over");
}

function dragDrop(e) {
  e.preventDefault();
  this.classList.remove("over");

  const id = e.dataTransfer.getData("text/plain");
  const draggable = document.getElementById(id);
  this.appendChild(draggable);

  updateCardListeners();
  saveState(); // Save after drag & drop
}

function addCard(listId) {
  const task = prompt("Enter task title:");
  if (!task) return;

  const newCard = document.createElement("div");
  newCard.className = "kanban-card";
  newCard.draggable = true;
  newCard.id = `card${Date.now()}`;
  newCard.innerHTML = `
        <p class="kanban-card__text">${task}</p>
        <button class="kanban-card__delete" onclick="removeCard(this)">✖</button>
    `;

  const list = document.getElementById(listId);
  list.appendChild(newCard);

  updateCardListeners();
  saveState(); // Save after adding card
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function updateCounts() {
  document.querySelectorAll(".kanban-list").forEach((list) => {
    const count = list.querySelectorAll(".kanban-card").length;
    const countSpan = list.querySelector(".kanban-list__count");
    if (countSpan) countSpan.textContent = `(${count})`;
  });
}

function saveState() {
  const state = {};
  document.querySelectorAll(".kanban-list").forEach((list) => {
    const listId = list.id;
    state[listId] = [];
    list.querySelectorAll(".kanban-card").forEach((card) => {
      state[listId].push({
        id: card.id,
        text: card.querySelector(".kanban-card__text").textContent.trim(),
      });
    });
  });
  localStorage.setItem("kanbanState", JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem("kanbanState");
  if (savedState) {
    // Clear existing cards first to avoid duplication
    document.querySelectorAll(".kanban-list").forEach((list) => {
      list.querySelectorAll(".kanban-card").forEach((card) => card.remove());
    });

    const state = JSON.parse(savedState);
    for (const listId in state) {
      const list = document.getElementById(listId);
      if (list) {
        state[listId].forEach((cardData) => {
          const newCard = document.createElement("div");
          newCard.className = "kanban-card";
          newCard.draggable = true;
          newCard.id = cardData.id;
          newCard.innerHTML = `
                        <p class="kanban-card__text">${cardData.text}</p>
                        <button class="kanban-card__delete" onclick="removeCard(this)">✖</button>
                    `;
          list.appendChild(newCard);
        });
      }
    }
    updateCardListeners();
  }
}

// Save edits
saveEditBtn.onclick = () => {
  if (!currentEditingCard) return;
  const newText = editTextarea.value.trim();
  if (newText) {
    currentEditingCard.querySelector(".kanban-card__text").textContent =
      newText;
    saveState();
  }
  closeEditModal();
};

// Cancel edits
cancelEditBtn.onclick = () => {
  closeEditModal();
};

function closeEditModal() {
  editModal.style.display = "none";
  currentEditingCard = null;
}

// Optional: click outside modal content closes it
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

// Optional: close on Escape key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && editModal.style.display === "flex") {
    closeEditModal();
  }
});

// Load saved tasks only after DOM content is loaded
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  updateCounts();
});


document.addEventListener('scroll', function() {
  document.documentElement.classList.add('scrolling');
  clearTimeout(window.scrollEndTimer);
  window.scrollEndTimer = setTimeout(function() {
    document.documentElement.classList.remove('scrolling');
  }, 500);
}, { passive: true });