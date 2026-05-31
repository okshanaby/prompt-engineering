# Few-Shot Prompt — Exercise

## Technique

**Few-Shot Prompt** — a prompt that provides two or more worked examples before stating the actual task. The model uses multiple examples to infer the expected pattern, level of detail, structure, and tone — producing more consistent and complete output than one-shot or zero-shot alone.

## Prompt Used

```txt
I need you to create a prompt for implementing a new feature. Here are examples of effective feature implementation prompts:

**EXAMPLE 1: Save/Delete Functionality Prompt**
Create a save and delete system for a prompt library application with the following requirements:

Technical Specifications:
- Save button that persists prompts to localStorage
- Delete button with confirmation dialog before removal
- Visual feedback on successful save (green checkmark animation)
- Trash icon with hover effect for delete action
- Auto-save indicator when changes are detected

Provide complete HTML, CSS, and JavaScript with:
1. Semantic HTML with data attributes for prompt IDs
2. CSS animations for save confirmation and delete hover states
3. JavaScript with proper event delegation for dynamically added prompts
4. localStorage integration with JSON serialization

The system should work with this data structure:
const prompts = [
  { id: 'prompt-001', title: "Blog Writer", content: "Generate blog posts...", savedAt: Date.now() }
];

Include error handling for localStorage quota exceeded and implement a "Recently Deleted" temporary storage (up to 5 items).

**EXAMPLE 2: Star Rating Component Prompt**
Build a 5-star rating system for rating prompt effectiveness with these specifications:

Core Requirements:
- Interactive 5-star display (click to rate, hover to preview)
- Half-star precision (4.5 stars possible)
- Shows average rating and total number of ratings
- Updates immediately without page refresh
- Allows users to change their rating

Implementation Details:
- SVG stars for crisp display at any size
- Gold fill for rated, gray outline for unrated
- Smooth hover animations (scale and glow effect)
- Display format: "4.5 ★ (23 ratings)"

Deliver production-ready code including:
1. HTML with accessible ARIA labels for screen readers
2. CSS with star animations and responsive sizing
3. JavaScript for rating logic and state management
4. Comments explaining calculation methods

Data model to support:
{
  promptId: 'prompt-001',
  ratings: [5, 4, 5, 3, 5],
  userRating: 4,
  averageRating: 4.4
}

**YOUR TASK:** Based on the examples above, create a detailed prompt for building a "notes section" feature where users can add, edit, save, and delete notes for each prompt in the library.
```

## Output

The model produced the following feature implementation prompt:

---

**Notes Section Feature Prompt**

Build a notes section for each prompt card in a prompt library application with the following specifications:

Core Requirements:
- Collapsible notes panel per prompt card (toggle open/closed)
- Add new notes with a text input and "Add Note" button
- Inline editing of existing notes (click note text to edit)
- Delete individual notes with a confirmation step
- Note count badge on the toggle button ("Notes (3)")

Implementation Details:
- Textarea that auto-expands as the user types
- Timestamp displayed on each note ("Added 2 hours ago" / "Edited just now")
- Unsaved changes indicator (dot on Save button) when edits are pending
- Smooth slide-down animation when panel opens

Provide complete HTML, CSS, and JavaScript with:
1. Semantic HTML using `<details>`/`<summary>` or ARIA-controlled `<div>` for the collapsible panel
2. CSS slide/fade animations for panel open and note entry/removal
3. JavaScript with event delegation to handle notes inside dynamically rendered prompt cards
4. localStorage integration — notes persisted under key `promptNotes_<promptId>`

The system should work with this data structure:
```js
const notes = [
  {
    id: 'note-001',
    promptId: 'prompt-001',
    content: 'Works well for short blog posts, struggles with technical topics.',
    createdAt: 1700000000000,
    updatedAt: 1700003600000
  }
];
```

Include:
- Character limit of 500 per note with a live counter ("320 / 500")
- Error state when localStorage is unavailable (display inline warning, do not throw)
- Empty state message when no notes exist yet ("No notes yet — add one above")

---

The prompt was then used to implement the notes section in `app.js` and `style.css`:
- `toggleNotes()` shows/hides the panel per card and updates the badge count
- `addNote()` creates a new note object, saves to localStorage, and re-renders the list
- `editNote()` switches a note row into an editable textarea on click, saves on blur or Enter
- `deleteNote()` shows an inline "Are you sure?" prompt before removal
- Auto-expanding textarea uses a `input` event listener to match `scrollHeight`
- Relative timestamps ("2 hours ago") computed with a small `timeAgo()` helper

## Model

**Claude Sonnet 4.6** (`claude-sonnet-4-6`)

## Effort

**LOW** (Minimal) — two examples were enough for the model to infer the exact structure (Core Requirements, Implementation Details, code delivery checklist, data model, and edge cases) and produce a complete, directly usable implementation prompt with no corrections needed. The second example visibly improved specificity compared to what one example alone would have produced.
