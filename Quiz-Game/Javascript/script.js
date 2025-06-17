// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
// Locate toggle button and nav list
const menuToggle = document.getElementById("menu-toggle");
const navList = document.getElementById("primary-nav");

if (menuToggle && navList) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");

    // Update ARIA attribute
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Optional: Close menu when clicking a link (improve UX)
  navList.querySelectorAll("a.nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      // On mobile, after clicking a link, collapse menu
      if (navList.classList.contains("open")) {
        navList.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// Quiz Questions
const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];

// Quiz State Variables
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// Initialize quiz info
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Event Listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

// Quiz Functions
function startQuiz() {
  // Reset quiz state
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  // Hide start screen, show quiz screen immediately
  startScreen.classList.remove("screen--active");
  startScreen.classList.add("screen--hidden");
  quizScreen.classList.remove("screen--hidden");
  quizScreen.classList.add("screen--active");

  // Directly show first question
  showQuestion();
}

function showQuestion() {
  // Reset answer state
  answersDisabled = false;

  // Get current question
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Update UI immediately
  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
  questionText.textContent = currentQuestion.question;

  // Clear previous answers
  answersContainer.innerHTML = "";

  // Create answer buttons
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  // Prevent multiple answers
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  // Highlight correct/incorrect answers immediately
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  // Update score if correct
  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  // Immediately move to next question or results
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  // Hide quiz screen and show results
  quizScreen.classList.remove("screen--active");
  quizScreen.classList.add("screen--hidden");
  resultScreen.classList.remove("screen--hidden");
  resultScreen.classList.add("screen--active");

  // Update final score
  finalScoreSpan.textContent = score;

  // Show appropriate message based on score
  const percentage = (score / quizQuestions.length) * 100;
  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }
}

function restartQuiz() {
  // Hide results screen and restart quiz
  resultScreen.classList.remove("screen--active");
  resultScreen.classList.add("screen--hidden");
  startQuiz();
}
