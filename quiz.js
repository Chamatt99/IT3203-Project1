// Milestone 2 quiz: answers, timer, grading and reset.
const answers = [
  "infrastructure as a service", "identity and access management", "SaaS",
  "Multi-factor authentication", "Changing resources based on demand",
  ["MFA", "Updates", "Backups"], "IaaS", "Both provider and customer",
  "Virtualization", "Misconfigured storage"
];
const form = document.getElementById("quizForm");
const timerText = document.getElementById("timer");
const results = document.getElementById("results");
let startTime = Date.now();
let timerId;
let finished = false;
const maxSeconds = 600;

function showTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins + ":" + String(secs).padStart(2, "0");
}
function updateTimer() {
  if (finished) return;
  const used = Math.min(maxSeconds, Math.floor((Date.now() - startTime) / 1000));
  timerText.textContent = showTime(maxSeconds - used);
  if (used >= maxSeconds) gradeQuiz();
}
function gradeQuiz() {
  if (finished) return;
  finished = true;
  clearInterval(timerId);
  const used = Math.min(maxSeconds, Math.floor((Date.now() - startTime) / 1000));
  timerText.textContent = showTime(maxSeconds - used);
  let score = 0;
  answers.forEach((answer, index) => {
    const num = index + 1;
    let response;
    if (num <= 2) {
      response = form.elements["q" + num].value.trim().toLowerCase().replace(/\s+/g, " ");
    } else if (num === 6) {
      response = Array.from(form.querySelectorAll('input[name="q6"]:checked')).map(item => item.value).sort();
    } else {
      const selected = form.querySelector('input[name="q' + num + '"]:checked');
      response = selected ? selected.value : "";
    }
    const correct = Array.isArray(answer)
      ? JSON.stringify(response) === JSON.stringify([...answer].sort())
      : num <= 2 ? response === answer : response === answer;
    if (correct) score += 10;
    const feedback = document.getElementById("feedback" + num);
    feedback.className = "feedback " + (correct ? "correct" : "incorrect");
    feedback.textContent = (correct ? "Correct" : "Incorrect") + " (" + (correct ? 10 : 0) + "/10 points). Correct answer: " + (Array.isArray(answer) ? answer.join(", ") : answer);
  });
  const passed = score >= 70;
  const summary = document.getElementById("summary");
  summary.textContent = (passed ? "PASS" : "FAIL") + " - Score: " + score + "/100";
  summary.className = passed ? "correct" : "incorrect";
  document.getElementById("timeUsed").textContent = "Time spent: " + showTime(used) + (used === 600 ? " (time ran out)" : "");
  results.hidden = false;
  form.querySelectorAll("input").forEach(input => input.disabled = true);
  document.getElementById("submitBtn").disabled = true;
  results.scrollIntoView({behavior:"smooth", block:"start"});
}
function resetQuiz() {
  clearInterval(timerId);
  form.reset();
  form.querySelectorAll("input").forEach(input => input.disabled = false);
  document.getElementById("submitBtn").disabled = false;
  for (let i = 1; i <= 10; i++) {
    const feedback = document.getElementById("feedback" + i);
    feedback.textContent = "";
    feedback.className = "feedback";
  }
  results.hidden = true;
  document.getElementById("summary").textContent = "";
  document.getElementById("timeUsed").textContent = "";
  finished = false;
  startTime = Date.now();
  timerText.textContent = "10:00";
  timerId = setInterval(updateTimer, 250);
}
form.addEventListener("submit", event => { event.preventDefault(); gradeQuiz(); });
document.getElementById("resetBtn").addEventListener("click", resetQuiz);
resetQuiz();
