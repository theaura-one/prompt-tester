QA pass: all card requirements met — models, system prompt, chat UI, and token control verified (Node.js rewrite)

## Per-criterion verdicts

1. ✅ **GPT-5.4, 5.4-mini, 5.4-nano support** — `app.js:12-14` registers all three models with OpenAI provider; `/api/models` endpoint returns them.
2. ✅ **Claude Sonnet, Haiku, Opus support** — `app.js:15-17` registers all three Anthropic models; confirmed via `/api/models` response.
3. ✅ **Ollama with GLM 5.1, Kimi 2.6** — `app.js:18-19` registers both Ollama models; Ollama provider function (`callOllama`) handles chat at lines 93-115.
4. ✅ **Ability to set tokens in UI** — `public/index.html:40` has a `max-tokens` number input (1–128000, step 256), wired to the API body at line 125; backend reads `max_tokens` and passes to all three providers.
5. ✅ **System prompt interface** — `public/index.html:44-50` provides a collapsible textarea; value is sent to `/api/chat` and forwarded per-provider.
6. ✅ **Messages/chat interface** — Chat area with user/assistant bubbles, send button, Enter-to-send, and clear-chat functionality.
7. ✅ **Node.js** — App is Express/Node.js (`package.json` confirms), per Abhi's comment requesting Node.js.

## Build/startup verification

- `node app.js` starts successfully on port 5000.
- `GET /api/models` returns all 8 models with correct provider assignments.

## Overall

**PASS** — All requirements satisfied.
