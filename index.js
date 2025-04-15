let questions = []; // Will store questions from API
let currentQuestion = 0;
let score = 0;
let wrongAnswers = [];

let questionTimer = 0;
let totalTimer = 0;
let questionInterval;
let totalInterval;


function startQuiz() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("question-screen").style.display = "block";

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
  clearInterval(questionInterval); // Stop any previous timer
  questionTimer = 0;
  document.getElementById("total-time").style.display = "none";
  document.getElementById("question-timer").innerText = "0s";
  questionInterval = setInterval(() => {
    questionTimer++;
    document.getElementById("question-timer").innerText = questionTimer + "s";
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
    btn.onclick = () => checkAnswer(answer, correct);
    answersDiv.appendChild(btn);
  });
}


function checkAnswer(selected, correct) {
  if (selected === correct) {
    alert("✅ Correct!");
    score++;
  } else {
    alert("❌ Wrong! Correct answer is: " + correct);
    wrongAnswers.push({
      question: decodeHTML(questions[currentQuestion].question),
      correct: correct
    });
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("total-time").style.display = "block";
  document.getElementById("timer").style.dispaly = "none";
  clearInterval(totalInterval);
  clearInterval(questionInterval);

  document.getElementById("question-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";

  document.getElementById("score").innerText = score + " / " + questions.length;

  let list = document.getElementById("review-list");
  list.innerHTML = "";

  wrongAnswers.forEach(item => {
    let li = document.createElement("li");
    li.innerText = `Q: ${item.question} | ✅ ${item.correct}`;
    list.appendChild(li);
  });
}


function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  wrongAnswers = [];
  document.getElementById("result-screen").style.display = "none";
  startQuiz();
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
