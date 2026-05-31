const STORAGE_KEY = 'prompt-library';

function loadPrompts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function savePrompts(prompts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

function preview(text, words = 8) {
  const trimmed = text.trim().split(/\s+/).slice(0, words).join(' ');
  return trimmed + (text.trim().split(/\s+/).length > words ? '…' : '');
}

function renderCards() {
  const prompts = loadPrompts();
  const grid = document.getElementById('prompt-cards');
  const empty = document.getElementById('empty-state');

  grid.innerHTML = '';

  if (prompts.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  prompts.forEach((prompt) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-title">${escapeHtml(prompt.title)}</div>
      <div class="card-preview">${escapeHtml(preview(prompt.content))}</div>
      <button class="btn-delete" data-id="${prompt.id}">Delete</button>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.getElementById('prompt-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  if (!title || !content) return;

  const prompts = loadPrompts();
  prompts.push({ id: Date.now(), title, content });
  savePrompts(prompts);
  renderCards();

  e.target.reset();
});

document.getElementById('prompt-cards').addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn-delete')) return;
  const id = Number(e.target.dataset.id);
  const prompts = loadPrompts().filter((p) => p.id !== id);
  savePrompts(prompts);
  renderCards();
});

renderCards();
