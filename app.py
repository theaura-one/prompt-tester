import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

MODELS = {
    "gpt-5.4": "openai",
    "gpt-5.4-mini": "openai",
    "gpt-5.4-nano": "openai",
    "claude-sonnet-4-20250514": "anthropic",
    "claude-haiku-4-20250414": "anthropic",
    "claude-opus-4-20250514": "anthropic",
    "glm-5.1": "ollama",
    "kimi-2.6": "ollama",
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/models")
def list_models():
    return jsonify(
        [
            {"id": model_id, "provider": provider, "name": _display_name(model_id)}
            for model_id, provider in MODELS.items()
        ]
    )


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    model = data.get("model", "")
    system_prompt = data.get("system_prompt", "")
    messages = data.get("messages", [])
    max_tokens = data.get("max_tokens", 1024)

    provider = MODELS.get(model)
    if not provider:
        return jsonify({"error": f"Unknown model: {model}"}), 400

    try:
        if provider == "openai":
            content = _call_openai(model, system_prompt, messages, max_tokens)
        elif provider == "anthropic":
            content = _call_anthropic(model, system_prompt, messages, max_tokens)
        elif provider == "ollama":
            content = _call_ollama(model, system_prompt, messages, max_tokens)
        else:
            return jsonify({"error": f"Unknown provider: {provider}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"content": content})


def _call_openai(model, system_prompt, messages, max_tokens):
    from openai import OpenAI

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    msgs = []
    if system_prompt:
        msgs.append({"role": "system", "content": system_prompt})
    msgs.extend(messages)
    response = client.chat.completions.create(
        model=model, messages=msgs, max_tokens=max_tokens
    )
    return response.choices[0].message.content


def _call_anthropic(model, system_prompt, messages, max_tokens):
    import anthropic

    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    kwargs = {"model": model, "messages": messages, "max_tokens": max_tokens}
    if system_prompt:
        kwargs["system"] = system_prompt
    response = client.messages.create(**kwargs)
    return response.content[0].text


def _call_ollama(model, system_prompt, messages, max_tokens):
    import requests as req

    msgs = []
    if system_prompt:
        msgs.append({"role": "system", "content": system_prompt})
    msgs.extend(messages)
    resp = req.post(
        f"{OLLAMA_HOST}/api/chat",
        json={
            "model": model,
            "messages": msgs,
            "stream": False,
            "options": {"num_predict": max_tokens},
        },
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()["message"]["content"]


def _display_name(model_id):
    names = {
        "gpt-5.4": "GPT-5.4",
        "gpt-5.4-mini": "GPT-5.4 Mini",
        "gpt-5.4-nano": "GPT-5.4 Nano",
        "claude-sonnet-4-20250514": "Claude Sonnet",
        "claude-haiku-4-20250414": "Claude Haiku",
        "claude-opus-4-20250514": "Claude Opus",
        "glm-5.1": "Ollama: GLM 5.1",
        "kimi-2.6": "Ollama: Kimi 2.6",
    }
    return names.get(model_id, model_id)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
