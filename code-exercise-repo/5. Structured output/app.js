const STORAGE_KEY = 'prompt-library';
const NOTES_KEY = 'prompt-library-notes';
const NOTE_MAX = 500;

// ── Metadata tracking ────────────────────────────────────────────────────────

function estimateTokens(text, isCode) {
  if (typeof text !== 'string') throw new Error('estimateTokens: text must be a string');
  if (typeof isCode !== 'boolean') throw new Error('estimateTokens: isCode must be a boolean');

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;

  let min = Math.round(0.75 * wordCount);
  let max = Math.round(0.25 * charCount);

  if (isCode) {
    min = Math.round(min * 1.3);
    max = Math.round(max * 1.3);
  }

  const avg = (min + max) / 2;
  const confidence = avg < 1000 ? 'high' : avg <= 5000 ? 'medium' : 'low';

  return { min, max, confidence };
}

function trackModel(modelName, content) {
  if (typeof modelName !== 'string' || modelName.trim() === '') {
    throw new Error('trackModel: modelName must be a non-empty string');
  }
  if (modelName.trim().length > 100) {
    throw new Error('trackModel: modelName must not exceed 100 characters');
  }
  if (typeof content !== 'string') {
    throw new Error('trackModel: content must be a string');
  }

  const now = new Date().toISOString();
  return {
    model: modelName.trim(),
    createdAt: now,
    updatedAt: now,
    tokenEstimate: estimateTokens(content, false),
  };
}

function updateTimestamps(metadata) {
  if (!metadata || typeof metadata !== 'object') {
    throw new Error('updateTimestamps: metadata must be an object');
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(metadata.createdAt)) {
    throw new Error('updateTimestamps: createdAt must be a valid ISO 8601 string');
  }

  const updatedAt = new Date().toISOString();
  if (new Date(updatedAt) < new Date(metadata.createdAt)) {
    throw new Error('updateTimestamps: updatedAt cannot be before createdAt');
  }

  return { ...metadata, updatedAt };
}

function touchPromptMetadata(promptId) {
  try {
    const prompts = loadPrompts();
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt?.metadata) {
      prompt.metadata = updateTimestamps(prompt.metadata);
      savePrompts(prompts);
    }
  } catch { /* silent — metadata update is non-critical */ }
}

// ── Metadata display helpers ─────────────────────────────────────────────────

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function renderMetadata(metadata) {
  if (!metadata) return '';
  const { model, createdAt, updatedAt, tokenEstimate } = metadata;
  const { min, max, confidence } = tokenEstimate;
  const confClass = `conf-${confidence}`;

  return `
    <div class="metadata-block">
      <span class="meta-chip meta-chip--model">
        <span class="meta-chip-label">Model</span>${escapeHtml(model)}
      </span>
      <span class="meta-chip meta-chip--created">
        <span class="meta-chip-label">Created</span>${escapeHtml(formatDate(createdAt))}
      </span>
      <span class="meta-chip meta-chip--updated">
        <span class="meta-chip-label">Updated</span>${escapeHtml(formatDate(updatedAt))}
      </span>
      <span class="meta-chip meta-chip--tokens ${confClass}">
        <span class="conf-dot"></span>
        <span class="meta-chip-label">Tokens</span>${min}–${max} · ${confidence}
      </span>
    </div>
  `;
}

function loadPrompts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function savePrompts(prompts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

function loadAllNotes() {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  } catch {
    return {};
  }
}

function loadNotes(promptId) {
  return loadAllNotes()[promptId] || [];
}

function saveNotes(promptId, notes) {
  try {
    const all = loadAllNotes();
    all[promptId] = notes;
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable or quota exceeded — silently skip
  }
}

function deleteAllNotes(promptId) {
  const all = loadAllNotes();
  delete all[promptId];
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  } catch { /* silent */ }
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
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

function renderNotesList(promptId, open) {
  const notes = loadNotes(promptId);
  const count = notes.length;
  const itemsHtml = notes.length === 0
    ? `<p class="notes-empty">No notes yet — add one above.</p>`
    : notes.map(n => `
        <div class="note-item" data-note-id="${n.id}" data-prompt-id="${promptId}">
          <div class="note-text">${escapeHtml(n.content)}</div>
          <div class="note-meta">
            <span class="note-time">${timeAgo(n.updatedAt || n.createdAt)}</span>
            <button class="btn-edit-note" data-note-id="${n.id}" data-prompt-id="${promptId}">Edit</button>
            <button class="btn-delete-note" data-note-id="${n.id}" data-prompt-id="${promptId}">Delete</button>
          </div>
        </div>
      `).join('');

  return `
    <div class="notes-section">
      <button class="btn-notes-toggle ${open ? 'open' : ''}" data-id="${promptId}">
        Notes <span class="notes-badge">${count}</span>
      </button>
      <div class="notes-panel ${open ? 'open' : ''}">
        <div class="notes-panel-inner">
          <div class="notes-add-row">
            <textarea
              class="note-input"
              data-prompt-id="${promptId}"
              placeholder="Add a note…"
              maxlength="${NOTE_MAX}"
              rows="2"
            ></textarea>
            <div class="note-input-footer">
              <span class="note-char-counter">0 / ${NOTE_MAX}</span>
              <button class="btn-add-note" data-prompt-id="${promptId}">Add Note</button>
            </div>
          </div>
          <div class="notes-list">${itemsHtml}</div>
        </div>
      </div>
    </div>
  `;
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

  const sorted = [...prompts].sort((a, b) => {
    const ta = a.metadata?.createdAt ? new Date(a.metadata.createdAt).getTime() : a.id;
    const tb = b.metadata?.createdAt ? new Date(b.metadata.createdAt).getTime() : b.id;
    return tb - ta;
  });

  sorted.forEach((prompt) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-title">${escapeHtml(prompt.title)}</div>
      <div class="card-preview">${escapeHtml(preview(prompt.content))}</div>
      ${renderMetadata(prompt.metadata)}
      <div class="star-row" data-id="${prompt.id}">${renderStars(prompt.id, prompt.rating ?? 0)}</div>
      ${renderNotesList(prompt.id, false)}
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
  const modelName = document.getElementById('model').value.trim();
  const content = document.getElementById('content').value.trim();
  const isCode = document.getElementById('is-code').checked;
  if (!title || !content || !modelName) return;

  let metadata;
  try {
    metadata = trackModel(modelName, content);
    metadata.tokenEstimate = estimateTokens(content, isCode);
  } catch (err) {
    alert(err.message);
    return;
  }

  const prompts = loadPrompts();
  prompts.push({ id: Date.now(), title, content, rating: null, metadata });
  savePrompts(prompts);
  renderCards();

  e.target.reset();
});

document.getElementById('prompt-cards').addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const id = Number(e.target.dataset.id);
    if (!confirm('Delete this prompt?')) return;
    deleteAllNotes(id);
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
    return;
  }

  if (e.target.classList.contains('btn-notes-toggle')) {
    const toggle = e.target;
    const panel = toggle.nextElementSibling;
    toggle.classList.toggle('open');
    panel.classList.toggle('open');
    return;
  }

  if (e.target.classList.contains('btn-add-note')) {
    const promptId = Number(e.target.dataset.promptId);
    const panel = e.target.closest('.notes-panel');
    const textarea = panel.querySelector('.note-input');
    const content = textarea.value.trim();
    if (!content) return;

    const notes = loadNotes(promptId);
    notes.push({ id: Date.now(), content, createdAt: Date.now(), updatedAt: Date.now() });
    saveNotes(promptId, notes);
    touchPromptMetadata(promptId);
    refreshNotesList(promptId, panel);
    textarea.value = '';
    panel.querySelector('.note-char-counter').textContent = `0 / ${NOTE_MAX}`;
    return;
  }

  if (e.target.classList.contains('btn-edit-note')) {
    const noteId = Number(e.target.dataset.noteId);
    const promptId = Number(e.target.dataset.promptId);
    const item = e.target.closest('.note-item');
    const textEl = item.querySelector('.note-text');
    const currentText = loadNotes(promptId).find(n => n.id === noteId)?.content || '';

    item.innerHTML = `
      <textarea class="note-edit-input" maxlength="${NOTE_MAX}">${escapeHtml(currentText)}</textarea>
      <div class="note-edit-actions">
        <span class="note-char-counter">${currentText.length} / ${NOTE_MAX}</span>
        <button class="btn-save-note" data-note-id="${noteId}" data-prompt-id="${promptId}">Save</button>
        <button class="btn-cancel-note" data-note-id="${noteId}" data-prompt-id="${promptId}">Cancel</button>
      </div>
    `;
    item.querySelector('.note-edit-input').focus();
    return;
  }

  if (e.target.classList.contains('btn-save-note')) {
    const noteId = Number(e.target.dataset.noteId);
    const promptId = Number(e.target.dataset.promptId);
    const item = e.target.closest('.note-item');
    const content = item.querySelector('.note-edit-input').value.trim();
    if (!content) return;

    const notes = loadNotes(promptId).map(n =>
      n.id === noteId ? { ...n, content, updatedAt: Date.now() } : n
    );
    saveNotes(promptId, notes);
    touchPromptMetadata(promptId);
    refreshNotesList(promptId, e.target.closest('.notes-panel'));
    return;
  }

  if (e.target.classList.contains('btn-cancel-note')) {
    const promptId = Number(e.target.dataset.promptId);
    refreshNotesList(promptId, e.target.closest('.notes-panel'));
    return;
  }

  if (e.target.classList.contains('btn-delete-note')) {
    const noteId = Number(e.target.dataset.noteId);
    const promptId = Number(e.target.dataset.promptId);
    const item = e.target.closest('.note-item');

    if (item.dataset.confirming === 'true') {
      const notes = loadNotes(promptId).filter(n => n.id !== noteId);
      saveNotes(promptId, notes);
      refreshNotesList(promptId, e.target.closest('.notes-panel'));
    } else {
      item.dataset.confirming = 'true';
      e.target.textContent = 'Sure?';
      e.target.classList.add('danger');
    }
    return;
  }
});

function refreshNotesList(promptId, panel) {
  const notes = loadNotes(promptId);
  const list = panel.querySelector('.notes-panel-inner .notes-list') || panel.querySelector('.notes-list');
  const toggle = panel.previousElementSibling;
  toggle.querySelector('.notes-badge').textContent = notes.length;

  if (notes.length === 0) {
    list.innerHTML = `<p class="notes-empty">No notes yet — add one above.</p>`;
    return;
  }

  list.innerHTML = notes.map(n => `
    <div class="note-item" data-note-id="${n.id}" data-prompt-id="${promptId}">
      <div class="note-text">${escapeHtml(n.content)}</div>
      <div class="note-meta">
        <span class="note-time">${timeAgo(n.updatedAt || n.createdAt)}</span>
        <button class="btn-edit-note" data-note-id="${n.id}" data-prompt-id="${promptId}">Edit</button>
        <button class="btn-delete-note" data-note-id="${n.id}" data-prompt-id="${promptId}">Delete</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('prompt-cards').addEventListener('input', (e) => {
  if (e.target.classList.contains('note-input') || e.target.classList.contains('note-edit-input')) {
    const counter = e.target.closest('.notes-add-row, .note-item')?.querySelector('.note-char-counter');
    if (counter) counter.textContent = `${e.target.value.length} / ${NOTE_MAX}`;
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
