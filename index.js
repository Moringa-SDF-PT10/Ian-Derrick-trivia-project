let questions = []; // Will store questions from API
let currentQuestion = 0;
let score = 0;
let wrongAnswers = [];

let questionTimeLimit = 15;
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
      clearInterval(questionInterval);
      alert(" Time's up!");
      wrongAnswers.push({
        question: decodeHTML(questions[currentQuestion].question),
        correct: decodeHTML(questions[currentQuestion].correct_answer)
      });
      currentQuestion++;
      currentQuestion < questions.length ? showQuestion() : showResult();
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

  answers.forEach(answer => {
    let btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => {
      clearInterval(questionInterval);
      checkAnswer(answer, correct);
    };
    answersDiv.appendChild(btn);
  });
}



function checkAnswer(selected, correct) {

  if (selected === correct) {
    alert("✅ Correct!");
    score++;
  } else {
    alert("❌ Wrong! Correct answer: " + correct);
    wrongAnswers.push({
      question: decodeHTML(questions[currentQuestion].question),
      correct: correct
    });
  }

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

  wrongAnswers.forEach(item => {
    let li = document.createElement("li");
    li.innerText = ` Q: ${item.question} | ✅ Correct answer is: ${item.correct}`;
    list.appendChild(li);
  });
  if (score >= questions.length / 1.25 ) {
    document.getElementById("result-message").innerText = "Congratulations! You are truly a genius.";
  }
  else if (score >= questions.length / 2) {
    document.getElementById("result-message").innerText = "Good job! You have a solid knowledge.";
  }
  else {
    document.getElementById("result-message").innerText = "Don't be discouraged! You can always try again.";
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