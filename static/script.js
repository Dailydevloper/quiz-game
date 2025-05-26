const setupForm = document.getElementById('setup-form');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const setupContainer = document.getElementById('setup-container');
const category = document.getElementById('category').value;


let questions = [];
let currentIndex = 0;
let score = 0;

setupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const difficulty = document.getElementById('difficulty').value;
  const type = document.getElementById('type').value;
  const amount = document.getElementById('amount').value;

  try {
    const res = await fetch('/get_questions', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ difficulty, type, amount, category })
    });
    const data = await res.json();

    if (res.status !== 200) {
      alert(data.error || "Failed to fetch questions");
      return;
    }

    questions = data;
    currentIndex = 0;
    score = 0;

    setupContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    quizContainer.style.display = 'block';

    showQuestion();
  } catch (error) {
    alert("Error fetching questions. Please try again.");
    console.error(error);
  }
});

function showQuestion() {
  if (currentIndex >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentIndex];

  let options = [...q.incorrect_answers];
  options.push(q.correct_answer);
  shuffle(options);

  let optionsHtml = options.map(opt =>
    `<button class="option-btn">${opt}</button>`
  ).join('');

  quizContainer.innerHTML = `
    <div class="question-number">Question ${currentIndex + 1} / ${questions.length}</div>
    <div class="question-text">${q.question}</div>
    <div class="options">${optionsHtml}</div>
  `;

  document.querySelectorAll('.option-btn').forEach(button => {
    button.onclick = () => {
      if (button.textContent === q.correct_answer) {
        score++;
        button.classList.add('correct');
      } else {
        button.classList.add('incorrect');
  
        document.querySelectorAll('.option-btn').forEach(btn => {
          if (btn.textContent === q.correct_answer) {
            btn.classList.add('correct');
          }
        });
      }

      document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

      setTimeout(() => {
        currentIndex++;
        showQuestion();
      }, 1500);
    };
  });
}

function showResult() {
  quizContainer.style.display = 'none';
  resultContainer.style.display = 'block';

  resultContainer.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your score: <strong>${score}</strong> / ${questions.length}</p>
    <button id="restart-btn">Restart Quiz</button>
  `;

  document.getElementById('restart-btn').onclick = () => {
    resultContainer.style.display = 'none';
    setupContainer.style.display = 'block';
  };
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
