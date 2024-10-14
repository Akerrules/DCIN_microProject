// Data for the True Colors Model
const questions = [
  {
    question: "How do you prefer to spend your free time?",
    options: [
      { text: "Helping others and being part of a community.", color: "blue" },
      { text: "Organizing events and taking the lead.", color: "orange" },
      { text: "Exploring ideas and seeking knowledge.", color: "green" },
      { text: "Achieving goals and seeking success.", color: "gold" },
    ],
  },
  {
    question: "What motivates you the most?",
    options: [
      { text: "Building strong relationships.", color: "blue" },
      { text: "Excitement and new experiences.", color: "orange" },
      { text: "Understanding and personal growth.", color: "green" },
      { text: "Recognition and rewards.", color: "gold" },
    ],
  },
  {
    question: "In a team project, what role do you usually take?",
    options: [
      { text: "Supporting and ensuring harmony.", color: "blue" },
      { text: "Initiating ideas and driving action.", color: "orange" },
      { text: "Analyzing and strategizing.", color: "green" },
      { text: "Managing tasks and ensuring deadlines.", color: "gold" },
    ],
  },
  {
    question: "How do you handle challenges?",
    options: [
      { text: "By seeking support and collaborating.", color: "blue" },
      {
        text: "By taking bold actions and staying optimistic.",
        color: "orange",
      },
      { text: "By thinking critically and finding solutions.", color: "green" },
      { text: "By planning meticulously and staying focused.", color: "gold" },
    ],
  },
  // You can add more questions here as needed
];

// Variables to track state
let currentQuestion = 0;
let scores = {
  blue: 0,
  orange: 0,
  green: 0,
  gold: 0,
};

// DOM Elements
const landingPage = document.getElementById("landing-page");
const startBtn = document.getElementById("start-btn");
const questionnaire = document.getElementById("questionnaire");
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const resultsPage = document.getElementById("results-page");
const resultColor = document.getElementById("result-color");
const resultDescription = document.getElementById("result-description");
const retakeBtn = document.getElementById("retake-btn");
const progressBar = document.getElementById("progress-bar");

// Event Listeners
startBtn.addEventListener("click", startTest);
nextBtn.addEventListener("click", handleNext);
retakeBtn.addEventListener("click", retakeTest);

// Functions
function startTest() {
  landingPage.classList.remove("active");
  questionnaire.classList.add("active");
  displayQuestion();
}

function displayQuestion() {
  resetState();
  let q = questions[currentQuestion];
  questionNumber.innerText = `Question ${currentQuestion + 1} of ${
    questions.length
  }`;
  questionText.innerText = q.question;

  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.innerText = option.text;
    btn.dataset.color = option.color;
    btn.addEventListener("click", selectOption);
    optionsContainer.appendChild(btn);
  });

  // Update Progress Bar
  const progressPercent = (currentQuestion / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

function resetState() {
  nextBtn.disabled = true;
  optionsContainer.innerHTML = "";
}

function selectOption(e) {
  const selectedBtn = e.target;
  const color = selectedBtn.dataset.color;

  // Deselect all options
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Select the clicked option
  selectedBtn.classList.add("selected");

  // Enable next button
  nextBtn.disabled = false;
}

function handleNext() {
  const selectedOption = document.querySelector(".option-btn.selected");
  if (!selectedOption) return;

  const color = selectedOption.dataset.color;
  scores[color] += 1;

  currentQuestion++;

  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  questionnaire.classList.remove("active");
  resultsPage.classList.add("active");

  // Set progress bar to 100%
  progressBar.style.width = `100%`;

  // Determine the highest score
  let maxScore = 0;
  let dominantColor = "";
  for (let color in scores) {
    if (scores[color] > maxScore) {
      maxScore = scores[color];
      dominantColor = color;
    }
  }

  // Handle tie-breakers by selecting the first color with the highest score
  // You can enhance this logic if needed

  // Set the result color
  resultColor.style.backgroundColor = dominantColor;

  // Set the description based on the color
  const descriptions = {
    blue: "You are compassionate and empathetic. You value relationships and strive to help others.",
    orange:
      "You are energetic and adventurous. You thrive on excitement and love new experiences.",
    green:
      "You are analytical and thoughtful. You seek knowledge and enjoy problem-solving.",
    gold: "You are organized and responsible. You value structure and strive for success.",
  };

  resultDescription.innerText = descriptions[dominantColor];
}

function retakeTest() {
  // Reset all variables and scores
  currentQuestion = 0;
  scores = {
    blue: 0,
    orange: 0,
    green: 0,
    gold: 0,
  };

  resultsPage.classList.remove("active");
  landingPage.classList.add("active");
}
