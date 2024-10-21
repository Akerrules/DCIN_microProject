// Data for Keirsey Personality Quiz (from "Please Understand Me")
const questions = {
  // First phase (Sensing vs Intuition)
  phase1: [
    {
      question: "Do you prefer to focus on the here and now or future possibilities?",
      options: [
        { text: "I focus on the present and what I can see.", dimension: "S" },
        { text: "I think about the future and what might be.", dimension: "N" },
      ],
    },
    {
      question: "Do you trust facts that are observable or ideas that connect the dots?",
      options: [
        { text: "I trust facts that are concrete and observable.", dimension: "S" },
        { text: "I trust insights that come from patterns and connections.", dimension: "N" },
      ],
    },
    {
      question: "When solving a problem, do you rely on step-by-step instructions or your imagination?",
      options: [
        { text: "I prefer following a step-by-step process.", dimension: "S" },
        { text: "I rely on my imagination to find solutions.", dimension: "N" },
      ],
    },
  ],

  // Second phase (for Sensing: Judging vs Perceiving)
  phase2_S: [
    {
      question: "Do you prefer a structured and organized lifestyle or a more flexible and spontaneous one?",
      options: [
        { text: "I prefer having things planned and organized.", dimension: "J" },
        { text: "I like to be flexible and go with the flow.", dimension: "P" },
      ],
    },
    {
      question: "Do you like to make decisions early or wait until the last moment?",
      options: [
        { text: "I like to make decisions as early as possible.", dimension: "J" },
        { text: "I prefer to keep my options open until the last minute.", dimension: "P" },
      ],
    },
    {
      question: "Do you prefer tasks that have clear deadlines or ones where you can improvise along the way?",
      options: [
        { text: "I prefer tasks with clear deadlines and structure.", dimension: "J" },
        { text: "I like tasks where I can improvise and adapt.", dimension: "P" },
      ],
    },
  ],

  // Second phase (for Intuition: Feeling vs Thinking)
  phase2_N: [
    {
      question: "When making decisions, do you prioritize logic or people’s feelings?",
      options: [
        { text: "I base my decisions on logic and objective criteria.", dimension: "T" },
        { text: "I base my decisions on how they will affect others emotionally.", dimension: "F" },
      ],
    },
    {
      question: "Do you handle disagreements with logic or empathy?",
      options: [
        { text: "I try to be as logical as possible in disagreements.", dimension: "T" },
        { text: "I try to be as empathetic as possible in disagreements.", dimension: "F" },
      ],
    },
    {
      question: "Is it more important to be fair and impartial or warm and caring?",
      options: [
        { text: "I believe it's more important to be fair and impartial.", dimension: "T" },
        { text: "I believe it's more important to be warm and caring.", dimension: "F" },
      ],
    },
  ],
};

// Variables to track state
let currentQuestion = 0;
let currentPhase = 'phase1'; // Start with phase 1
let userPreference = null;   // Track whether user is S (Sensing) or N (Intuition)
let scores = {
  S: 0,
  N: 0,
  T: 0,
  F: 0,
  J: 0,
  P: 0,
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
  const currentQuestions = questions[currentPhase];
  let q = currentQuestions[currentQuestion];

  let phase = ""; 
  if(currentPhase =="phase1"){
    phase ="Phase1"; 
  }else{
    phase = "Phase2"; 
  }


  questionNumber.innerText = `${phase}: Question ${currentQuestion + 1} of ${currentQuestions.length}`;
  questionText.innerText = q.question;

  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.innerText = option.text;
    btn.dataset.dimension = option.dimension;
    btn.addEventListener("click", selectOption);
    optionsContainer.appendChild(btn);
  });

  // Update Progress Bar
  const progressPercent = ((currentQuestion + 1) / currentQuestions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

function resetState() {
  nextBtn.disabled = true;
  optionsContainer.innerHTML = "";
}

function selectOption(e) {
  const selectedBtn = e.target;
  const dimension = selectedBtn.dataset.dimension;

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

  const dimension = selectedOption.dataset.dimension;
  scores[dimension] += 1;

  // Check if the current phase and question count are finished
  if (currentPhase === 'phase1' && currentQuestion < questions.phase1.length - 1) {
    // If we're still in phase 1 and there are more questions
    currentQuestion++;
    displayQuestion();
  } else if (currentPhase === 'phase1' && currentQuestion === questions.phase1.length - 1) {
    // If phase 1 is done, move to phase 2
    currentPhase = scores.S > scores.N ? 'phase2_S' : 'phase2_N';
    userPreference = scores.S > scores.N ? 'S' : 'N';
    currentQuestion = 0; // Reset question count for phase 2
    displayQuestion();
  } else if (currentPhase !== 'phase1' && currentQuestion < questions[currentPhase].length - 1) {
    // If we're in phase 2 and there are more questions
    currentQuestion++;
    displayQuestion();
  } else {
    // If all questions are done, show the results
    showResults();
  }
}


function showResults() {
  questionnaire.classList.remove("active");
  resultsPage.classList.add("active");

  // Set progress bar to 100%
  progressBar.style.width = `100%`;

  // Determine the type
  let personalityType;
  if (userPreference === 'S') {
    personalityType = 'S' + (scores.J > scores.P ? 'J' : 'P');
  } else if (userPreference === 'N') {
    personalityType = 'N' + (scores.T > scores.F ? 'T' : 'F');
  }

  // Display the result
  let description;
  if (personalityType === "SJ") {
    resultColor.style.backgroundColor = "#FDF2D0"; // Yellow
    description = "You are Guardian. \n You are are practical and responsible, valuing structure and tradition.";
  } else if (personalityType === "SP") {
    resultColor.style.backgroundColor = "#DFBAB1"; // Orange
    description = "You are Artisan. \n You are are spontaneous and adaptable, seeking freedom and excitement ";
  } else if (personalityType === "NT") {
    resultColor.style.backgroundColor = "#D3DFE2"; // Blue
    description = "You are Rational. \n You are are logical and strategic, driven by problem-solving and competence ";
  } else if (personalityType === "NF") {
    resultColor.style.backgroundColor = "#DCE9D5"; // Green
    description = "You are Idealist. \n You are empathetic and introspective, focused on personal growth and meaningful connections ";
  }

  resultDescription.innerText = description;
}

function retakeTest() {
  // Reset all variables and scores
  currentQuestion = 0;
  currentPhase = 'phase1';
  userPreference = null;
  scores = {
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  resultsPage.classList.remove("active");
  landingPage.classList.add("active");
}
