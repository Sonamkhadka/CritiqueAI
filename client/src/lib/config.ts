// Client-side configuration that fetches from server
export interface AppConfig {
  openRouterModels: string[];
  defaultAIModel: string;
  defaultOpenRouterModel: string;
}

let configCache: AppConfig | null = null;

export async function getAppConfig(): Promise<AppConfig> {
  if (configCache) {
    return configCache;
  }

  try {
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }

    const config = await response.json();
    configCache = config;
    return config;
  } catch (error) {
    console.error('Error fetching app config:', error);

    // Return fallback config
    return {
      openRouterModels: [
        "mistralai/mistral-7b-instruct:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemini-2.5-pro-exp-03-25:free",
        "deepseek/deepseek-r1-zero:free",
        "openai/gpt-4o-mini"
      ],
      defaultAIModel: "openrouter",
      defaultOpenRouterModel: "mistralai/mistral-7b-instruct:free"
    };
  }
}