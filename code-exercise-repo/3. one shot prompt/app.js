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

function renderStars(promptId, rating) {
  return [1, 2, 3, 4, 5].map(star => `
    <span
      class="star ${rating >= star ? 'filled' : ''}"
      data-id="${promptId}"
      data-value="${star}"
    >★</span>
  `).join('');
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
      <div class="star-row" data-id="${prompt.id}">${renderStars(prompt.id, prompt.rating ?? 0)}</div>
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
  prompts.push({ id: Date.now(), title, content, rating: null });
  savePrompts(prompts);
  renderCards();

  e.target.reset();
});

document.getElementById('prompt-cards').addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const id = Number(e.target.dataset.id);
    const prompts = loadPrompts().filter((p) => p.id !== id);
    savePrompts(prompts);
    renderCards();
    return;
  }

  if (e.target.classList.contains('star')) {
    const id = Number(e.target.dataset.id);
    const stars = Number(e.target.dataset.value);
    const prompts = loadPrompts();
    const prompt = prompts.find((p) => p.id === id);
    if (prompt) {
      prompt.rating = prompt.rating === stars ? null : stars;
      savePrompts(prompts);
      renderCards();
    }
  }
});

document.getElementById('prompt-cards').addEventListener('mouseover', (e) => {
  if (!e.target.classList.contains('star')) return;
  const row = e.target.closest('.star-row');
  const hovered = Number(e.target.dataset.value);
  row.querySelectorAll('.star').forEach((s) => {
    s.classList.toggle('hover', Number(s.dataset.value) <= hovered);
  });
});

document.getElementById('prompt-cards').addEventListener('mouseout', (e) => {
  if (!e.target.classList.contains('star')) return;
  const row = e.target.closest('.star-row');
  if (row && !row.contains(e.relatedTarget)) {
    row.querySelectorAll('.star').forEach((s) => s.classList.remove('hover'));
  }
});

renderCards();
