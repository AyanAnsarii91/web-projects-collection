const { useContext } = require("react");

const passwordEl = document.getElementById("password");
const lengthEl = document.getElementById("length");
const lengthValueEl = document.getElementById("length-value");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");
const strengthLabelEl = document.getElementById("strength-label");
const strengthBarEl = document.querySelector(".strength-bar");

const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

// Update length value display
lengthEl.addEventListener("input", () => {
  lengthValueEl.innerText = lengthEl.value;
});

// Generate password
generateBtn.addEventListener("click", generatePassword);

function generatePassword() {
  const length = lengthEl.value;
  let characters = "";
  let password = "";

  if (uppercaseEl.checked) {
    characters += uppercaseChars;
  }
  if (lowercaseEl.checked) {
    characters += lowercaseChars;
  }
  if (numbersEl.checked) {
    characters += numberChars;
  }
  if (symbolsEl.checked) {
    characters += symbolChars;
  }

  if (characters === "") {
    passwordEl.value = "Select at least one option";
    updateStrength(0);
    return;
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  passwordEl.value = password;
  updateStrength(password);
}

// Copy password to clipboard
copyBtn.addEventListener("click", () => {
  passwordEl.select();
  document.execCommand("copy");
  alert("Password copied to clipboard!");
});

// Update password strength indicator
function updateStrength(password) {
  let strength = 0;
  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password);

  if (length >= 8) strength++;
  if (hasUppercase) strength++;
  if (hasLowercase) strength++;
  if (hasNumbers) strength++;
  if (hasSymbols) strength++;

  let strengthText = "Weak";
  let strengthColor = "red";

  if (strength >= 3) {
    strengthText = "Medium";
    strengthColor = "orange";
  }
  if (strength >= 5) {
    strengthText = "Strong";
    strengthColor = "green";
  }

  strengthLabelEl.innerText = strengthText;
  strengthBarEl.style.width = `${(strength / 5) * 100}%`;
  strengthBarEl.style.backgroundColor = strengthColor;
}

// Initial password generation
generatePassword();


       