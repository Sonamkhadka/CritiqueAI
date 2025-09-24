// Server-side configuration that reads from environment variables
export const getServerConfig = () => {
  const defaultModels = [
    "mistralai/mistral-7b-instruct:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.5-pro-exp-03-25:free",
    "deepseek/deepseek-r1-zero:free",
    "openai/gpt-4o-mini"
  ];

  // Get models from environment or use defaults
  const openRouterModels = process.env.OPENROUTER_MODELS
    ? process.env.OPENROUTER_MODELS.split(',').map(m => m.trim())
    : defaultModels;

  const defaultAIModel = process.env.DEFAULT_AI_MODEL || "openrouter";
  const defaultOpenRouterModel = process.env.DEFAULT_OPENROUTER_MODEL || openRouterModels[0];

  return {
    openRouterModels,
    defaultAIModel,
    defaultOpenRouterModel
  };
};

// Validate if a model is allowed based on current configuration
export const isValidOpenRouterModel = (model: string): boolean => {
  const config = getServerConfig();
  return config.openRouterModels.includes(model);
};