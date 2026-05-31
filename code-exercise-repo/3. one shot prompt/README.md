# One-Shot Prompt — Exercise

## Technique

**One-Shot Prompt** — a prompt that provides exactly one example (a worked demonstration) before stating the actual task. The model uses the example to infer the expected format, structure, and level of detail for its response.

## Prompt Used

```txt 
You are helping develop a prompt library application. Here's an example of how to analyze and implement a new feature:

**EXAMPLE:** Feature Request: "Add a favorites/bookmarking system"

Implementation Plan:

1. **User Story**: As a user, I want to mark prompts as favorites so I can quickly access my most-used prompts without scrolling through the entire library.
2. **Technical Requirements**:
    - Add a heart/bookmark icon to each prompt card
    - Store favorite status in localStorage or database
    - Create a filter to show only favorited prompts
    - Visual indicator when a prompt is favorited (filled vs outlined icon)
3. **Code Structure**:

javascript
// Data model update
prompt = {
  id: 'prompt-123',
  title: 'Marketing Email Generator',
  content: '...',
  isFavorite: false,  // New field
  createdAt: '2024-01-15',
  rating: 4.5
}

// Toggle favorite function
function toggleFavorite(promptId) {
  const prompt = prompts.find(p => p.id === promptId);
  prompt.isFavorite = !prompt.isFavorite;
  saveToStorage(prompts);
  updateUI();
}

4. **UI/UX Considerations**:
    - Place favorite icon in consistent location (top-right of card)
    - Use intuitive icons (heart or star)
    - Provide visual feedback on click (animation/color change)
    - Add "Favorites" filter tab in navigation

---

**YOUR TASK:** Analyze the following feature request using the EXACT same format as the example above (User Story, Technical Requirements with bullet points, Code Structure with JavaScript examples, and UI/UX Considerations).

Feature Request: "Add a 5-star rating component to rate prompt effectiveness"
```

## Output

The model produced a structured implementation plan matching the example format exactly:

1. **User Story** — rate prompts 1–5 stars to track effectiveness
2. **Technical Requirements** — star icons per card, localStorage persistence, hover preview, optional sort-by-rating
3. **Code Structure** — `setRating()` and `renderStars()` functions with updated data model (`rating: null`)
4. **UI/UX Considerations** — star placement, filled/outlined states, hover highlight, unrated label, 24px minimum tap target

The plan was then implemented in `app.js` and `style.css`:
- `renderStars()` builds 5 clickable `<span>` stars per card
- Clicking a star saves the rating; clicking the same star again clears it
- Hover previews stars with a scale animation
- Filled stars render in gold (`#e3b341`); unrated stars use the border color

## Model

**Claude Sonnet 4.6** (`claude-sonnet-4-6`)

## Effort

**LOW** (Minimal) — one example was enough for the model to infer the exact output format and produce a complete, implementable plan with no corrections needed.
