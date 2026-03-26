import { AppError } from "@/lib/utils/errors";

type OllamaMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OllamaChatRequest = {
  model: string;
  messages: OllamaMessage[];
  stream: false;
  format?: Record<string, unknown>;
  options?: {
    temperature?: number;
  };
};

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getOllamaConfig() {
  const baseUrl = trimTrailingSlash(process.env.OLLAMA_BASE_URL || "http://localhost:11434");
  const model = process.env.OLLAMA_MODEL || "llama3.1:8b";
  const isCloud = baseUrl === "https://ollama.com";
  const apiKey = process.env.OLLAMA_API_KEY;

  if (isCloud && !apiKey) {
    throw new AppError(
      "OLLAMA_NOT_CONFIGURED",
      "OLLAMA_API_KEY is missing for Ollama cloud mode.",
      "Set OLLAMA_API_KEY when OLLAMA_BASE_URL is https://ollama.com."
    );
  }

  return {
    baseUrl,
    model,
    apiKey,
    isCloud
  };
}

export async function createOllamaChatCompletion(request: OllamaChatRequest) {
  const config = getOllamaConfig();
  const headers: HeadersInit = {
    "content-type": "application/json"
  };

  if (config.isCloud && config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const response = await fetch(`${config.baseUrl}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ...request,
      model: config.model
    })
  });

  const rawText = await response.text();
  if (!response.ok) {
    throw new AppError("OLLAMA_REQUEST_FAILED", "Ollama analysis request failed.", rawText);
  }

  try {
    return JSON.parse(rawText) as OllamaChatResponse;
  } catch {
    throw new AppError("OLLAMA_RESPONSE_INVALID", "Ollama returned a non-JSON response.", rawText);
  }
}
