const STORAGE_KEY = "prompt-library";

const form = document.getElementById("prompt-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const list = document.getElementById("prompt-list");
const emptyState = document.getElementById("empty-state");
const countBadge = document.getElementById("count");

/** Read prompts from localStorage, returning an array. */
function loadPrompts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Persist the given prompts array to localStorage. */
function savePrompts(prompts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

/** Escape text so it renders as plain text inside HTML. */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/** Render all prompts to the page. */
function render() {
  const prompts = loadPrompts();
  countBadge.textContent = prompts.length;
  list.innerHTML = "";

  if (prompts.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  for (const prompt of prompts) {
    const card = document.createElement("article");
    card.className = "prompt";
    card.innerHTML = `
      <div class="prompt__head">
        <h3 class="prompt__title">${escapeHtml(prompt.title)}</h3>
        <button class="btn prompt__delete" type="button" data-id="${prompt.id}">
          Delete
        </button>
      </div>
      <p class="prompt__content">${escapeHtml(prompt.content)}</p>
    `;
    list.appendChild(card);
  }
}

/** Handle new prompt submission. */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) return;

  const prompts = loadPrompts();
  prompts.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    title,
    content,
  });
  savePrompts(prompts);

  form.reset();
  titleInput.focus();
  render();
});

/** Handle delete clicks via event delegation. */
list.addEventListener("click", (event) => {
  const button = event.target.closest(".prompt__delete");
  if (!button) return;

  const id = button.dataset.id;
  const prompts = loadPrompts().filter((p) => p.id !== id);
  savePrompts(prompts);
  render();
});

render();
