QA pass: all card requirements met — models, system prompt, chat UI, and token control verified

## Evaluation

The card has no explicit acceptance criteria list, so requirements are derived from the card summary:

1. **Support gpt-5.4, 5.4-mini, 5.4-nano** — ✅ met
   All three OpenAI models present in `app.py:12-14` MODELS dict and confirmed via `/api/models` endpoint test.

2. **Support claude-sonnet, haiku, opus** — ✅ met
   All three Anthropic models present in `app.py:15-17` and confirmed via endpoint test.

3. **Support ollama with glm-5.1, kimi 2.6** — ✅ met
   Both Ollama models present in `app.py:18-19`, routed through `_call_ollama()` at `app.py:90-108`.

4. **Ability to set tokens in UI** — ✅ met
   Max tokens number input in `templates/index.html:40` (`<input type="number" id="max-tokens">`), sent to backend in `sendMessage()` at line 125, and consumed by all three provider functions.

5. **Basic app with system prompt and messages interface** (card title) — ✅ met
   System prompt textarea at `templates/index.html:49`, chat message bubbles and send functionality in JS. Backend `/api/chat` endpoint at `app.py:38-62` handles system prompt for all providers.

## Build & tests

- `py_compile` on `app.py`: syntax OK
- Flask test client smoke tests: GET `/` (200), GET `/api/models` (200, all 8 models), POST `/api/chat` with bad model (400) — all passed
- No test suite exists (no `test_*.py` files). The dev change-log shows inline tests were run manually.

## Verdict

**PASS** — All requirements from the card summary are implemented and verified.
