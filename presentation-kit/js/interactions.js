export function initInteractions(slide) {
  initQuiz(slide);
  initPoll(slide);
}

function initQuiz(slide) {
  const quiz = slide.querySelector(".quiz");
  if (!quiz || quiz.dataset.initialized) return;

  const options = quiz.querySelectorAll(".quiz__option");
  const feedback = quiz.querySelector(".quiz__feedback");
  const correctIndex = Number(quiz.dataset.correct ?? 0);
  let answered = false;

  options.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;

      options.forEach((opt, i) => {
        opt.classList.add("is-selected");
        if (i === correctIndex) opt.classList.add("is-correct");
        else if (i === index) opt.classList.add("is-wrong");
        opt.disabled = true;
      });

      const key = `quiz-${quiz.dataset.quizId || slide.dataset.slideId || "default"}`;
      sessionStorage.setItem(key, String(index));

      if (feedback) {
        feedback.textContent = index === correctIndex
          ? "Resposta correta."
          : "Resposta incorreta. Consulte o conteúdo do capítulo.";
      }
    });
  });

  quiz.dataset.initialized = "true";
}

function initPoll(slide) {
  const poll = slide.querySelector(".poll");
  if (!poll || poll.dataset.initialized) return;

  const options = poll.querySelectorAll(".quiz__option");
  const resultsEl = poll.querySelector(".poll-results");
  const pollId = poll.dataset.pollId || "default";
  const storageKey = `poll-${pollId}`;

  const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
  let total = Object.values(stored).reduce((a, b) => a + b, 0);

  options.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      stored[index] = (stored[index] || 0) + 1;
      total += 1;
      localStorage.setItem(storageKey, JSON.stringify(stored));
      renderPollResults(resultsEl, options, stored, total);
      options.forEach((o) => { o.disabled = true; });
    });
  });

  if (total > 0) renderPollResults(resultsEl, options, stored, total);

  poll.dataset.initialized = "true";
}

function renderPollResults(container, options, counts, total) {
  if (!container) return;
  container.innerHTML = "";

  options.forEach((btn, index) => {
    const count = counts[index] || 0;
    const pct = total ? Math.round((count / total) * 100) : 0;
    const row = document.createElement("div");
    row.className = "poll-results__bar";
    row.innerHTML = `
      <span>${btn.textContent.trim()}</span>
      <div class="poll-results__track"><div class="poll-results__fill" style="width:${pct}%"></div></div>
      <span>${pct}%</span>
    `;
    container.appendChild(row);
  });
}
