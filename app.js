require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";

const MODELS = {
  "gpt-5.4": "openai",
  "gpt-5.4-mini": "openai",
  "gpt-5.4-nano": "openai",
  "claude-sonnet-4-20250514": "anthropic",
  "claude-haiku-4-20250414": "anthropic",
  "claude-opus-4-20250514": "anthropic",
  "glm-5.1": "ollama",
  "kimi-2.6": "ollama",
};

const DISPLAY_NAMES = {
  "gpt-5.4": "GPT-5.4",
  "gpt-5.4-mini": "GPT-5.4 Mini",
  "gpt-5.4-nano": "GPT-5.4 Nano",
  "claude-sonnet-4-20250514": "Claude Sonnet",
  "claude-haiku-4-20250414": "Claude Haiku",
  "claude-opus-4-20250514": "Claude Opus",
  "glm-5.1": "Ollama: GLM 5.1",
  "kimi-2.6": "Ollama: Kimi 2.6",
};

app.get("/api/models", (req, res) => {
  const models = Object.entries(MODELS).map(([id, provider]) => ({
    id,
    provider,
    name: DISPLAY_NAMES[id] || id,
  }));
  res.json(models);
});

app.post("/api/chat", async (req, res) => {
  const { model, system_prompt, messages, max_tokens } = req.body;
  const tokens = max_tokens || 1024;
  const provider = MODELS[model];

  if (!provider) {
    return res.status(400).json({ error: `Unknown model: ${model}` });
  }

  try {
    let content;
    if (provider === "openai") {
      content = await callOpenAI(model, system_prompt, messages, tokens);
    } else if (provider === "anthropic") {
      content = await callAnthropic(model, system_prompt, messages, tokens);
    } else if (provider === "ollama") {
      content = await callOllama(model, system_prompt, messages, tokens);
    }
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function callOpenAI(model, systemPrompt, messages, maxTokens) {
  const OpenAI = require("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const msgs = [];
  if (systemPrompt) {
    msgs.push({ role: "system", content: systemPrompt });
  }
  msgs.push(...messages);
  const response = await client.chat.completions.create({
    model,
    messages: msgs,
    max_tokens: maxTokens,
  });
  return response.choices[0].message.content;
}

async function callAnthropic(model, systemPrompt, messages, maxTokens) {
  const Anthropic = require("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const kwargs = { model, messages, max_tokens: maxTokens };
  if (systemPrompt) {
    kwargs.system = systemPrompt;
  }
  const response = await client.messages.create(kwargs);
  return response.content[0].text;
}

async function callOllama(model, systemPrompt, messages, maxTokens) {
  const msgs = [];
  if (systemPrompt) {
    msgs.push({ role: "system", content: systemPrompt });
  }
  msgs.push(...messages);
  const resp = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: msgs,
      stream: false,
      options: { num_predict: maxTokens },
    }),
    signal: AbortSignal.timeout(120000),
  });
  if (!resp.ok) {
    throw new Error(`Ollama returned ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.json();
  return data.message.content;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Prompt Tester running on http://localhost:${PORT}`);
});
