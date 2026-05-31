# Practical Prompt Engineering — Notes & Projects

My notes and hands-on projects from the [**Practical Prompt Engineering**](https://frontendmasters.com/courses/prompt-engineering/) course by [Sabrina Goldfarb](https://www.linkedin.com/in/sabrinagoldfarb/) (working at GitHub at the time of recording) on Frontend Masters.

It covers how to communicate effectively with large language models — from foundational concepts like temperature and context windows, through core techniques like zero-shot and few-shot prompting, all the way to advanced strategies like Chain of Thought, structured output, and personas.

- 📚 **Course:** https://frontendmasters.com/courses/prompt-engineering/
- 📝 **Official notes:** https://sgoldfarb2.github.io/practical-prompt-engineering
- 👤 **My learning profile:** https://frontendmasters.com/u/okshanaby/

---

## What's inside

Each numbered folder is one section of the course. The `.md` files are my written notes; the `code-exercise-repo/` folder contains the hands-on exercises built along the way.

### Notes

| Section | Topic | Highlights |
| --- | --- | --- |
| **1. Introduction** | Foundations of prompt engineering | What prompt engineering is, temperature & top-p, tokens & context windows |
| **2. Core Prompting Techniques** | Building-block prompt patterns | Standard prompts, zero-shot, one-shot, few-shot, context placement |
| **3. Advanced Prompting Techniques** | Higher-level strategies | Structured output, Chain of Thought, emotional stimuli, delimiters, personas |

### Code exercises

Each subfolder in `code-exercise-repo/` is a small browser-based app that demonstrates a prompting technique in practice:

| Exercise | Technique |
| --- | --- |
| `1. standard prompt` | Baseline prompt construction |
| `2. zero shot prompt` | Zero-shot classification / generation |
| `3. one shot prompt` | One-shot in-context learning |
| `4. Few-Shot prompt` | Few-shot examples to steer output |
| `5. Structured output` | Getting JSON / structured responses from a model |
| `6. Chain of Thought` | Step-by-step reasoning prompts |

---

## Key concepts covered

- **Temperature & Top-P** — how sampling parameters control output randomness and diversity.
- **Tokens & context windows** — understanding the model's input/output budget and why it matters for prompt design.
- **Zero / one / few-shot prompting** — teaching the model a task through examples embedded directly in the prompt.
- **Context placement** — where you put information in a prompt affects how much the model attends to it.
- **Structured output** — prompting a model to return machine-readable formats (JSON, tables) reliably.
- **Chain of Thought (CoT)** — instructing the model to reason step-by-step before giving a final answer, improving accuracy on complex tasks.
- **Emotional stimuli** — how framing and tone in a prompt can influence model behavior and response quality.
- **Delimiters** — using explicit markers (`"""`, `<tag>`, `---`) to separate instructions from content and reduce ambiguity.
- **Personas** — assigning a role or identity to the model to shape its voice, expertise, and style.

---

## Acknowledgements

All credit for the course material goes to **Sabrina Goldfarb** and **Frontend Masters**. This repository is my personal study log while taking the course.
