// script.js

// Ensure DOM is ready before querying elements
document.addEventListener("DOMContentLoaded", () => {
  // Element references
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const mealsContainer = document.getElementById("meals");
  const resultHeading = document.getElementById("result-heading");
  const errorContainer = document.getElementById("error-container");
  const mealDetails = document.getElementById("meal-details");
  const mealDetailsContent = document.querySelector(".meal-details-content");
  const backBtn = document.getElementById("back-btn");
  const navToggle = document.querySelector(".mobile-nav-toggle");
  const primaryNav = document.querySelector(".primary-navigation");

  // API endpoints
  const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
  const SEARCH_URL = `${BASE_URL}search.php?s=`;
  const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

  // Helper: show error message
  function showError(message) {
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.classList.remove("hidden");
    }
  }

  // Helper: hide error
  function hideError() {
    if (errorContainer) {
      errorContainer.classList.add("hidden");
    }
  }

  // Helper: clear previous search results
  function clearResults() {
    mealsContainer.innerHTML = "";
    resultHeading.textContent = "";
  }

  // Display meals grid
  function displayMeals(meals) {
    clearResults();
    if (!meals || meals.length === 0) {
      // No meals to display
      return;
    }
    // For each meal, create a card
    meals.forEach((meal) => {
      const mealDiv = document.createElement("div");
      mealDiv.classList.add("meal");
      mealDiv.setAttribute("data-meal-id", meal.idMeal);

      // Image
      const img = document.createElement("img");
      img.src = meal.strMealThumb;
      img.alt = meal.strMeal;
      mealDiv.appendChild(img);

      // Info container
      const infoDiv = document.createElement("div");
      infoDiv.classList.add("meal-info");

      const title = document.createElement("h3");
      title.classList.add("meal-title");
      title.textContent = meal.strMeal;
      infoDiv.appendChild(title);

      if (meal.strCategory) {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("meal-category");
        categoryDiv.textContent = meal.strCategory;
        infoDiv.appendChild(categoryDiv);
      }

      mealDiv.appendChild(infoDiv);
      mealsContainer.appendChild(mealDiv);
    });
  }

  // Fetch and display meal details
  async function loadMealDetails(mealId) {
    try {
      const response = await fetch(`${LOOKUP_URL}${mealId}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      const data = await response.json();
      if (!data.meals || data.meals.length === 0) {
        showError("Recipe details not found.");
        return;
      }
      const meal = data.meals[0];

      // Build details UI
      mealDetailsContent.innerHTML = ""; // clear previous

      // Image
      const img = document.createElement("img");
      img.src = meal.strMealThumb;
      img.alt = meal.strMeal;
      img.classList.add("meal-details-img");
      mealDetailsContent.appendChild(img);

      // Title
      const title = document.createElement("h2");
      title.classList.add("meal-details-title");
      title.textContent = meal.strMeal;
      mealDetailsContent.appendChild(title);

      // Category / Area
      const catDiv = document.createElement("div");
      catDiv.classList.add("meal-details-category");
      const span = document.createElement("span");
      span.textContent = meal.strCategory || "Uncategorized";
      catDiv.appendChild(span);
      if (meal.strArea) {
        const areaSpan = document.createElement("span");
        areaSpan.textContent = ` • ${meal.strArea}`;
        areaSpan.style.marginLeft = "0.5rem";
        catDiv.appendChild(areaSpan);
      }
      mealDetailsContent.appendChild(catDiv);

      // Instructions
      const instrDiv = document.createElement("div");
      instrDiv.classList.add("meal-details-instructions");
      const instrHeader = document.createElement("h3");
      instrHeader.textContent = "Instructions";
      instrDiv.appendChild(instrHeader);
      const instrPara = document.createElement("p");
      instrPara.textContent = meal.strInstructions;
      instrDiv.appendChild(instrPara);
      mealDetailsContent.appendChild(instrDiv);

      // Ingredients list
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients.push({
            ingredient: ingredient.trim(),
            measure: measure ? measure.trim() : "",
          });
        }
      }
      if (ingredients.length) {
        const ingrDiv = document.createElement("div");
        ingrDiv.classList.add("meal-details-ingredients");
        const ingrHeader = document.createElement("h3");
        ingrHeader.textContent = "Ingredients";
        ingrDiv.appendChild(ingrHeader);

        const ul = document.createElement("ul");
        ul.classList.add("ingredients-list");
        ingredients.forEach((item) => {
          const li = document.createElement("li");
          // icon
          const icon = document.createElement("i");
          icon.classList.add("fas", "fa-check-circle");
          icon.setAttribute("aria-hidden", "true");
          li.appendChild(icon);
          // text
          const textNode = document.createTextNode(
            ` ${item.measure} ${item.ingredient}`
          );
          li.appendChild(textNode);
          ul.appendChild(li);
        });
        ingrDiv.appendChild(ul);
        mealDetailsContent.appendChild(ingrDiv);
      }

      // YouTube link if exists
      if (meal.strYoutube) {
        const ytLink = document.createElement("a");
        ytLink.href = meal.strYoutube;
        ytLink.target = "_blank";
        ytLink.rel = "noopener noreferrer";
        ytLink.classList.add("youtube-link");
        const ytIcon = document.createElement("i");
        ytIcon.classList.add("fab", "fa-youtube");
        ytIcon.setAttribute("aria-hidden", "true");
        ytLink.appendChild(ytIcon);
        const txt = document.createTextNode(" Watch Video");
        ytLink.appendChild(txt);
        mealDetailsContent.appendChild(ytLink);
      }

      // Reveal details section
      mealDetails.classList.remove("hidden");
      mealDetails.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error loading meal details:", err);
      showError("Could not load recipe details. Please try again later.");
    }
  }

  // Handle click on a meal card
  function handleMealClick(e) {
    const mealEl = e.target.closest(".meal");
    if (!mealEl) return;
    const mealId = mealEl.getAttribute("data-meal-id");
    if (mealId) {
      hideError();
      loadMealDetails(mealId);
    }
  }

  // Search meals by term
  async function searchMeals(event) {
    // If invoked via form submit or click, prevent default form action
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
      showError("Please enter a search term.");
      return;
    }
    hideError();
    clearResults();
    resultHeading.textContent = `Searching for "${searchTerm}"...`;

    try {
      const response = await fetch(
        `${SEARCH_URL}${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      const data = await response.json();
      if (!data.meals) {
        // No results
        resultHeading.textContent = "";
        showError(`No recipes found for "${searchTerm}". Try another term!`);
      } else {
        resultHeading.textContent = `Search results for "${searchTerm}":`;
        displayMeals(data.meals);
        // Clear input if desired:
        // searchInput.value = '';
      }
    } catch (err) {
      console.error("Error during searchMeals:", err);
      showError("Something went wrong. Please try again later.");
    }
  }

  // Event listeners
  if (searchForm) {
    // Prevent actual form submission reload
    searchForm.addEventListener("submit", searchMeals);
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", searchMeals);
  }
  if (mealsContainer) {
    mealsContainer.addEventListener("click", handleMealClick);
  }
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      mealDetails.classList.add("hidden");
    });
  }
  // Optional: hide details if clicked outside? (not required)

  // Mobile navigation toggle
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      // Toggle class for visibility; ensure CSS handles .nav-visible
      primaryNav.classList.toggle("nav-visible");
    });
  }

  // Set current year in footer if element exists
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

document.addEventListener(
  "scroll",
  function () {
    document.documentElement.classList.add("scrolling");
    clearTimeout(window.scrollEndTimer);
    window.scrollEndTimer = setTimeout(function () {
      document.documentElement.classList.remove("scrolling");
    }, 500);
  },
  { passive: true }
);
