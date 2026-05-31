# Chain of Thought — Exercise

## Technique

**Chain of Thought Prompt** — a prompt that instructs the model to reason through a problem step by step before producing code, rather than jumping straight to an implementation. Breaking the task into numbered steps (analyse → design → build → validate → recover) forces the model to surface dependencies and edge cases at each stage, resulting in more coherent multi-part features.

## Prompt Used

```txt
Let's build a complete export/import system step by step.

Step 1: First, analyze what data we need to export:
- All prompts with their metadata

Step 2: Design the export JSON schema that includes:
- Version number for future compatibility
- Export timestamp
- Statistics (total prompts, average rating, most used model)
- Complete prompts array

Step 3: Create the export function that:
- Gathers all data from localStorage
- Validates data integrity
- Creates a blob and triggers download with timestamp

Step 4: Create the import function that:
- Reads the uploaded file
- Validates the JSON structure and version
- Checks for duplicate IDs
- Merges or replaces existing data based on user choice

Step 5: Add error recovery:
- Backup existing data before import
- Rollback on failure
- Provide detailed error messages

Add the import and export buttons and merge conflict resolution prompts

Implement this complete system with all steps. Think step by step.
```

## Model

**Claude Sonnet 4.6** (`claude-sonnet-4-6`)


## Effort

**MEDIUM** — the step-by-step decomposition in the prompt meant each sub-problem (schema design, validation, conflict resolution, rollback) was addressed in order with no gaps. The chain-of-thought structure prevented the common failure mode of generating an import function that skips error recovery or forgets to back up before writing.
