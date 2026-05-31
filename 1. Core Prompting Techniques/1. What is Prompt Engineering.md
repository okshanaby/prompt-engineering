## Prompt Engineering

**Prompt engineering** is the practice of writing clear and effective instructions for an AI model so it produces better, more accurate, and more consistent results.

#### Key Points

* A **prompt** is simply the instruction you give an AI.
* Prompt engineering combines **art and science** because AI responses are not always deterministic (the same prompt can produce slightly different outputs).
* Using better prompts can significantly improve the quality of responses from the same AI model.
* Prompt engineering can be used in:

  * Chat interfaces (like ChatGPT or Claude)
  * APIs and AI-powered applications

#### Why It Matters

* Produces more reliable and predictable outputs.
* Improves the performance of AI applications such as chatbots.
* Can reduce API costs by getting better results with fewer requests.
* Helps developers work faster and more efficiently.

#### What Prompt Engineering Is Not

* **Not magic** — it follows principles and best practices.
* **Not the only way** to improve AI systems; other techniques exist.
* **Not a replacement for critical thinking**. Humans still need to:

  * Verify outputs
  * Apply domain knowledge
  * Follow security and development best practices
  * Ensure applications are production-ready

### Large Language Models (LLM)

- **LLMs** are pattern predictors that generate one token at a time. 
- They predict the next most likely token based on the input provided. 
- The generation happens token by token with no planning ahead, meaning LLMs only 'think' while they are typing. 
- They will most often predict the next most likely token, but sometimes may predict other likely tokens instead.

#### Deterministic vs Nondeterministic systems
**Deterministic systems**, like calculators, always produce the same output for a given input (e.g., 2 + 2 always equals 4). 

**Nondeterministic systems** can produce different outputs for the same input. LLMs are nondeterministic, meaning if you enter the same prompt multiple times, you will likely get different answers each time. This is because they predict tokens based on probability, not fixed rules.

#### LLM Limitations
LLMs are trained on data collected up to a certain **cutoff date**. While many LLMs now have **multi-modality features** like internet searching that allow them to find information after their cutoff date, information before the cutoff date tends to be **more reliable**. This is because post-cutoff information may only exist in limited sources, making the LLM's responses potentially **less accurate** for very recent events or new technologies.

#### 'Attention Is All You Need' Research Paper
The 2017 'Attention Is All You Need' research paper introduced the **transformer architecture** with an **attention mechanism**. 
- This allowed models to pay attention to **thousands of words at a time** instead of just 5-10 words like phone autocomplete. 
- The architecture also enabled models to learn **which tokens mattered most** for predictions. 
- Additionally, the paper revealed **scaling laws** showing that when model size increased by **10X**, capability increased by **100X**, leading to models that can now handle over a million tokens.

### One-Sentence Summary

**Prompt engineering is the skill of giving AI clear, effective instructions to get better, more accurate, and more consistent results while still relying on human judgment and expertise.**
