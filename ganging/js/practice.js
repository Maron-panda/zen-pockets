const username = Session.require();

const orbColors = ['#FF3D7F', '#7C3AED', '#17C3D9', '#FFB627', '#7ED957'];
const orbGrid = document.getElementById('orb-grid');
for (let t = 1; t <= 10; t++) {
  const btn = document.createElement('button');
  btn.className = 'orb-btn';
  btn.style.setProperty('--c', orbColors[(t - 1) % orbColors.length]);
  btn.textContent = t;
  btn.addEventListener('click', () => startPractice(t));
  orbGrid.appendChild(btn);
}

let deck = [];
let current = null;
let table = 0;
let score = 0, correct = 0, attempts = 0;
let factLog = [];
let questionStart = 0;
let sessionStartTime = 0;

function startPractice(t) {
  table = t;
  const factors = t === 1 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  deck = shuffle(factors.slice());
  score = 0; correct = 0; attempts = 0; factLog = [];
  sessionStartTime = Date.now();

  document.getElementById('picker-view').style.display = 'none';
  document.getElementById('session-view').style.display = 'block';
  document.getElementById('session-title').textContent = `${t}× Table`;
  nextQuestion();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function nextQuestion() {
  if (deck.length === 0) return finishPractice();
  const totalQuestions = attempts + deck.length;
  const b = deck.pop();
  current = { a: table, b: b };
  document.getElementById('problem-text').textContent = `${table} × ${b}`;
  document.getElementById('progress-text').textContent = `Question ${attempts + 1} of ${totalQuestions + 1}`;
  document.getElementById('answer-input').value = '';
  document.getElementById('answer-input').focus();
  questionStart = performance.now();
}

document.getElementById('answer-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const val = document.getElementById('answer-input').value;
  if (val === '') return;
  const timeMs = Math.round(performance.now() - questionStart);
  const isCorrect = Number(val) === current.a * current.b;
  attempts++;
  if (isCorrect) { correct++; score++; }
  factLog.push({ a: current.a, b: current.b, correct: isCorrect, timeMs });
  nextQuestion();
});

async function finishPractice() {
  document.getElementById('session-view').style.display = 'none';
  document.getElementById('result-view').style.display = 'block';
  const accuracyPct = attempts > 0 ? Math.round((correct / attempts) * 1000) / 10 : 0;
  const durationSec = Math.round((Date.now() - sessionStartTime) / 1000);
  document.getElementById('result-score').textContent = `${correct}/${attempts}`;
  document.getElementById('result-stats').textContent = `${accuracyPct}% accuracy`;

  await Api.submitPracticeSession({ username, table, score, correct, attempts, durationSec, factLog });
  const earned = await evaluateAndAwardAchievements(username);
  document.getElementById('new-badges').innerHTML = earned.map(a => `<span class="badge-earned">🏅 ${a.label}</span>`).join('');
}

document.getElementById('practice-again-btn').addEventListener('click', () => {
  document.getElementById('result-view').style.display = 'none';
  document.getElementById('picker-view').style.display = 'block';
});
