let questions = []; // Will store questions from API
let currentQuestion = 0;
let score = 0;
let wrongAnswers = [];

let questionTimeLimit = 20;
let questionTimeLeft = questionTimeLimit;
let questionInterval;
let totalInterval;
let questionTimerRunning = false;



function startQuiz() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("intro-animated").style.display = "none";
  document.getElementById("progress-bar-container").style.display = "block";
  document.getElementById("question-screen").style.display = "block";
  document.getElementById("result-screen").style.display = "none";
  

  totalTimer = 0;

  document.getElementById("total-timer").innerText = "0s";
  totalInterval = setInterval(() => {
    totalTimer++;
    document.getElementById("total-timer").innerText = totalTimer + "s";
  }, 1000);

  fetch("https://opentdb.com/api.php?amount=10&category=9&type=multiple")
    .then(response => response.json())
    .then(data => {
      questions = data.results;
      showQuestion();
    });
}


function showQuestion() {
  document.getElementById("restart page").style.display = "none";
 
  clearInterval(questionInterval);
  questionTimeLeft = questionTimeLimit;
  updateQuestionTimer();

  questionInterval = setInterval(() => {
    questionTimeLeft--;
    updateQuestionTimer();
    if (questionTimeLeft <= 0) {
      document.getElementById("next").style.display = "block";
      
      clearInterval(questionInterval);
      handleTimeout();
      
    }
  }, 1000);

  let questionData = questions[currentQuestion];
  let questionText = decodeHTML(questionData.question);
  let correct = decodeHTML(questionData.correct_answer);
  let answers = questionData.incorrect_answers.map(decodeHTML);
  answers.push(correct);
  answers = shuffle(answers);

  document.getElementById("question-text").innerText = questionText;

  let answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
 document.getElementById("next").style.display = "none";

  answers.forEach(answer => {
    let btn = document.createElement("button");
    btn.innerText = answer;
    btn.classList.add("answer-btn");
    btn.onclick = () => checkAnswer(btn, answer, correct);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(selectedBtn, selectedAnswer, correctAnswer) {
  clearInterval(questionInterval);
  const allButtons = document.querySelectorAll(".answer-btn");
  allButtons.forEach(btn => btn.disabled = true);

  if (selectedAnswer === correctAnswer) {
     selectedBtn.style.backgroundColor = "green";
    score++;
  } else {
    selectedBtn.style.backgroundColor = "red";
    allButtons.forEach(btn => {
      if (btn.innerText === correctAnswer) {
        btn.style.backgroundColor = "green";
      }
    });
   wrongAnswers.push({
      question: decodeHTML(questions[currentQuestion].question),
      correct: correctAnswer
    });
  }
  document.getElementById("next").style.display = "block";
}

function handleTimeout() {
  const correctAnswer = decodeHTML(questions[currentQuestion].correct_answer);
  const allButtons = document.querySelectorAll(".answer-btn");
  allButtons.forEach(btn => btn.disabled = true);
  if (btn.innerText === correctAnswer) {
    btn.style.backgroundColor = "green";

  }

}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult(); // <- This ensures results display
  }
}



function showResult() {
  clearInterval(questionInterval);
  clearInterval(totalInterval);

  document.getElementById("question-screen").style.display = "none";
  document.getElementById("progress-bar-container").style.display = "none";
  document.getElementById("timer-container").style.display = "block";
  document.getElementById("result-screen").style.display = "block";
  document.getElementById("restart page").style.display = "none";

  document.getElementById("score").innerText = score + " / " + questions.length;

  let list = document.getElementById("review-list");
  list.innerHTML = "";

  wrongAnswers.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <div style="margin-bottom: 2px; padding: 1px;">
        <strong>Question:</strong> ${item.question}<br>
        <span style="color: #007BFF;">✅ Correct Answer:</span> <em>${item.correct}</em>
      </div>
    `;
    list.appendChild(li);
  });
  if (score >= questions.length / 1.25 ) {
    document.getElementById("result-message").innerText = "🎉 Excellent! You're a quiz master!";
  }
  else if (score >= questions.length / 2) {
    document.getElementById("result-message").innerText = "👍 Not bad! You got solid knowledge.";
  }
  else {
    document.getElementById("result-message").innerText = "💪 Don't be discouraged! You can always try again.";
  }
}


function restartQuiz() {
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("restart page").style.display = "block";
  document.getElementById("timer-container").style.display = "none";
  document.getElementById("start-screen").style.display = "none";


  clearInterval(questionInterval);
  clearInterval(totalInterval);

  // Reset all variables
  currentQuestion = 0;
  score = 0;
  totalTimer = 0;
  wrongAnswers = [];

  // Reset screens
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "none";

  // Reset progress bar and timers
  document.getElementById("progress-bar").style.width = "100%";
  document.getElementById("total-timer").innerText = "0s";
}


// Helper: Randomize order of answers
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Helper: Convert HTML entities to plain text
function decodeHTML(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
function updateQuestionTimer() {
  document.getElementById("progress-bar").innerText = `${questionTimeLeft}s`;
  const percent = (questionTimeLeft / questionTimeLimit) * 100;
  document.getElementById("progress-bar").style.width = `${percent}%`;
}