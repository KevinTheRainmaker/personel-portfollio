import os

import httpx

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
PRIMARY_MODEL = "liquid/lfm-2.5-1.2b-instruct:free"
FALLBACK_MODEL = "google/gemma-4-26b-a4b-it:free"


class OpenRouterError(Exception):
    pass


async def call_openrouter(messages: list[dict], model: str) -> str:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise OpenRouterError("OPENROUTER_API_KEY is not set")

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://portfolio.kangbeen.my",
                "X-Title": "Kangbeen Ko Portfolio",
            },
            json={"model": model, "messages": messages},
        )

        if response.status_code != 200:
            raise OpenRouterError(f"HTTP {response.status_code}: {response.text[:200]}")

        data = response.json()

        if "error" in data:
            raise OpenRouterError(str(data["error"]))

        choices = data.get("choices", [])
        if not choices:
            raise OpenRouterError("No choices returned from model")

        content = choices[0].get("message", {}).get("content")
        if not content:
            raise OpenRouterError("Empty content in response")

        return content


async def chat_with_fallback(messages: list[dict]) -> tuple[str, str]:
    """Returns (response_text, model_used). Falls back to FALLBACK_MODEL on error."""
    try:
        response = await call_openrouter(messages, PRIMARY_MODEL)
        return response, PRIMARY_MODEL
    except OpenRouterError:
        response = await call_openrouter(messages, FALLBACK_MODEL)
        return response, FALLBACK_MODEL
