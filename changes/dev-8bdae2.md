Built basic prompt tester app with system prompt, chat UI, multi-provider model support, and token control

## What changed

Created the full application from an empty repo:

- **app.py** — Flask backend with `/api/chat` endpoint routing to OpenAI, Anthropic, and Ollama providers. `/api/models` endpoint serves the model list. Supports GPT-5.4/5.4-mini/5.4-nano, Claude Sonnet/Haiku/Opus, and Ollama glm-5.1/kimi-2.6.
- **templates/index.html** — Single-page UI with model selector dropdown, max tokens number input, collapsible system prompt textarea, scrollable chat area with message bubbles, and user input with Enter-to-send.
- **requirements.txt** — flask, openai, anthropic, requests, python-dotenv.
- **.env.example** — Documents required API keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, OLLAMA_HOST).

## Design decisions

- Stateless backend: browser holds full conversation history, sends all messages each request.
- No streaming for simplicity.
- Lazy imports for provider SDKs (only loaded when that provider is used).

## Test output

```
GET / OK
Models: ['GPT-5.4', 'GPT-5.4 Mini', 'GPT-5.4 Nano', 'Claude Sonnet', 'Claude Haiku', 'Claude Opus', 'Ollama: GLM 5.1', 'Ollama: Kimi 2.6']
GET /api/models OK
POST /api/chat bad model returns 400 OK
All tests passed
```
