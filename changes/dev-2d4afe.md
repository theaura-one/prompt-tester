Rewrote app from Python/Flask to Node.js/Express per reviewer request

## What changed

Converted the entire application from Python (Flask) to Node.js (Express) while preserving all functionality:

- **app.py** (deleted) -> **app.js** — Express server with same `/api/models` and `/api/chat` endpoints, same model routing to OpenAI, Anthropic, and Ollama providers.
- **requirements.txt** (deleted) -> **package.json** — Dependencies: express, openai, @anthropic-ai/sdk, dotenv.
- **templates/index.html** (deleted) -> **public/index.html** — Identical frontend, now served as static file via Express.
- **__pycache__/** (deleted) — Python bytecode removed.
- **.gitignore** (added) — Ignores node_modules/ and .env.

All 8 models, system prompt, chat messages, and max tokens UI preserved exactly.

## Test output

```
GET / => 200 OK
Models: ['GPT-5.4', 'GPT-5.4 Mini', 'GPT-5.4 Nano', 'Claude Sonnet', 'Claude Haiku', 'Claude Opus', 'Ollama: GLM 5.1', 'Ollama: Kimi 2.6']
Count: 8
POST /api/chat bad model => {"error":"Unknown model: bad"}
```
