// DOM Elements
const form = document.getElementById("registration-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const formSuccess = document.getElementById("form-success");

// Event Listeners
form.addEventListener("submit", handleSubmit);
username.addEventListener("input", () => validateUsername(username));
email.addEventListener("input", () => validateEmail(email));
password.addEventListener("input", () => {
  validatePassword(password);
  if (confirmPassword.value) validatePasswordMatch(password, confirmPassword);
});
confirmPassword.addEventListener("input", () =>
  validatePasswordMatch(password, confirmPassword)
);

// Main Functions
function handleSubmit(e) {
  e.preventDefault();

  // Validate all fields
  const isUsernameValid = validateUsername(username);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const isPasswordMatchValid = validatePasswordMatch(password, confirmPassword);
  const isRequiredValid = checkRequired([
    username,
    email,
    password,
    confirmPassword,
  ]);

  const isFormValid =
    isUsernameValid &&
    isEmailValid &&
    isPasswordValid &&
    isPasswordMatchValid &&
    isRequiredValid;

  if (isFormValid) {
    showFormSuccess();
    form.reset();
    resetFormStyles();
  }
}

// Validation Functions
function validateUsername(input) {
  const min = 4,
    max = 20;
  const usernameRegex = /^[a-zA-Z0-9]+$/;

  if (input.value.trim() === "") {
    showError(input, `${getFieldName(input)} is required`);
    return false;
  }

  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    return false;
  }

  if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
    return false;
  }

  if (!usernameRegex.test(input.value)) {
    showError(
      input,
      `${getFieldName(input)} can only contain letters and numbers`
    );
    return false;
  }

  showSuccess(input);
  return true;
}

function validateEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (input.value.trim() === "") {
    showError(input, `${getFieldName(input)} is required`);
    return false;
  }

  if (!emailRegex.test(input.value.trim())) {
    showError(input, "Email is not valid");
    return false;
  }

  showSuccess(input);
  return true;
}

function validatePassword(input) {
  const min = 8;
  const passwordRegex = /^(?=.*\d).+$/;

  if (input.value.trim() === "") {
    showError(input, `${getFieldName(input)} is required`);
    return false;
  }

  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    return false;
  }

  if (!passwordRegex.test(input.value)) {
    showError(input, `${getFieldName(input)} must contain at least 1 number`);
    return false;
  }

  showSuccess(input);
  return true;
}

function validatePasswordMatch(password, confirmPassword) {
  if (confirmPassword.value.trim() === "") {
    showError(confirmPassword, `${getFieldName(confirmPassword)} is required`);
    return false;
  }

  if (password.value !== confirmPassword.value) {
    showError(confirmPassword, "Passwords do not match");
    return false;
  }

  showSuccess(confirmPassword);
  return true;
}

function checkRequired(inputArray) {
  let isValid = true;

  inputArray.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      isValid = false;
    }
  });

  return isValid;
}

// UI Functions
function showError(input, message) {
  const formGroup = input.closest(".form__group");
  formGroup.classList.remove("success");
  formGroup.classList.add("error");

  const errorElement = formGroup.querySelector(".form__error-text");
  errorElement.textContent = message;
}

function showSuccess(input) {
  const formGroup = input.closest(".form__group");
  formGroup.classList.remove("error");
  formGroup.classList.add("success");

  const errorElement = formGroup.querySelector(".form__error-text");
  errorElement.textContent = "";
}

function showFormSuccess() {
  form.classList.add("hidden");
  formSuccess.classList.remove("hidden");

  // Hide success message after 5 seconds
  setTimeout(() => {
    formSuccess.classList.add("hidden");
    form.classList.remove("hidden");
  }, 5000);
}

function resetFormStyles() {
  document.querySelectorAll(".form__group").forEach((group) => {
    group.classList.remove("success", "error");
    const errorElement = group.querySelector(".form__error-text");
    if (errorElement) errorElement.textContent = "";
  });
}

// Helper Functions
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Utility Functions
function setCurrentYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

function initMobileNavigation() {
  const navToggle = document.querySelector(".header__nav-toggle");
  const primaryNav = document.querySelector(".header__nav");

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !isExpanded);
    primaryNav.classList.toggle("nav-visible");
  });
}

function initPasswordVisibilityToggle() {
  const toggleButtons = document.querySelectorAll(".form__toggle-password");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const input = e.currentTarget.parentElement.querySelector("input");
      const icon = e.currentTarget.querySelector("i");

      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
        e.currentTarget.setAttribute("aria-label", "Hide password");
      } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
        e.currentTarget.setAttribute("aria-label", "Show password");
      }
    });
  });
}

// Initialize
function init() {
  // No-JS fallback
  document.documentElement.classList.remove("no-js");

  // Set current year in footer
  setCurrentYear();

  // Initialize mobile navigation
  initMobileNavigation();

  // Initialize password visibility toggle
  initPasswordVisibilityToggle();
}

// Run initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
