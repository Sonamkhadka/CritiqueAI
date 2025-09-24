import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Info as InfoIcon } from "lucide-react";
import { AnalysisResult, OpenRouterModel } from "@shared/schema";
import { analyzeArgument } from "@/lib/api";
import { LogoSvg } from "@/components/Logo";
import { getAppConfig, AppConfig } from "@/lib/config";

interface ArgumentFormProps {
  onAnalysisRequested: (
    isLoading: boolean,
    error: string | null,
    result: AnalysisResult | null,
    model: string
  ) => void;
  isLoading: boolean;
}

// Popular example statements for testing
const EXAMPLE_STATEMENTS = [
  {
    title: "Climate Change Denial",
    text: "Climate change is fake because it snowed yesterday. If global warming was real, it would never be cold anywhere. Plus, scientists have been wrong before about many things."
  },
  {
    title: "Social Media Debate",
    text: "Social media is destroying our society because kids these days can't have real conversations anymore. Back in my day, we talked face-to-face and people were happier. Everyone on social media is fake and depressed."
  },
  {
    title: "Economic Argument",
    text: "Raising the minimum wage will destroy small businesses and increase unemployment. If companies have to pay more, they'll just hire fewer people. It's basic economics that government interference always makes things worse."
  },
  {
    title: "Education Policy",
    text: "Schools should ban all technology from classrooms because students learn better with traditional methods. Computers and tablets are just distractions that make kids lazy and unable to think for themselves."
  },
  {
    title: "Health & Nutrition",
    text: "Organic food is a complete scam created by marketing companies. There's no scientific difference between organic and regular food. People who buy organic are just wasting money on expensive labels and feeling superior."
  }
];

export default function ArgumentForm({
  onAnalysisRequested,
  isLoading,
}: ArgumentFormProps) {
  const [text, setText] = useState("");
  const [model, setModel] = useState("openrouter");
  const [openRouterModel, setOpenRouterModel] = useState<OpenRouterModel>("mistralai/mistral-7b-instruct:free");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false);
  const [config, setConfig] = useState<AppConfig | null>(null);

  // Load configuration on component mount
  useEffect(() => {
    getAppConfig().then((appConfig) => {
      setConfig(appConfig);
      setModel(appConfig.defaultAIModel);
      setOpenRouterModel(appConfig.defaultOpenRouterModel as OpenRouterModel);
    }).catch(console.error);
  }, []);

  // Update API key warning when model changes
  useEffect(() => {
    // Show warning for models that require API keys from the user
    setShowApiKeyWarning(model === "openai" || model === "deepseek" || model === "gemini");
  }, [model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any previous errors
    setLocalError(null);

    if (!text.trim()) {
      setLocalError("Please enter an argument to analyze.");
      onAnalysisRequested(false, "Please enter an argument to analyze.", null, model);
      return;
    }

    // Notify the parent component that we're starting analysis
    onAnalysisRequested(true, null, null, model);

    try {
      let result;
      if (model === "openrouter") {
        result = await analyzeArgument(text, model, openRouterModel);
      } else {
        result = await analyzeArgument(text, model);
      }
      onAnalysisRequested(false, null, result, model);
    } catch (error) {
      console.error("Error analyzing argument:", error);

      // Provide a more user-friendly error message
      let errorMessage = "An error occurred while analyzing your argument.";

      if (error instanceof Error) {
        if (error.message.includes("parse JSON") || error.message.includes("JSON response")) {
          errorMessage = "The AI model returned an invalid response. Please try using a different model or simplify your argument text.";
        } else if (error.message.includes("Rate limit")) {
          errorMessage = "You've reached the rate limit. Please wait a moment before trying again.";
        } else {
          errorMessage = error.message;
        }
      }

      setLocalError(errorMessage);
      onAnalysisRequested(false, errorMessage, null, model);
    }
  };

  return (
    <div className="neo-card p-6">
      <div className="bg-primary text-primary-foreground p-4 mb-6 neo-border neo-shadow-secondary">
        <h2 className="text-2xl font-bold uppercase tracking-wider font-arvo">
          🧠 ANALYZE YOUR ARGUMENT
        </h2>
      </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="exampleSelect" className="mb-1 font-arvo">
              🎯 Try a Popular Debate Topic:
            </Label>
            <Select
              onValueChange={(value) => {
                const example = EXAMPLE_STATEMENTS.find(ex => ex.title === value);
                if (example) setText(example.text);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="neo-select mb-3">
                <SelectValue placeholder="Choose an example to analyze..." />
              </SelectTrigger>
              <SelectContent>
                {EXAMPLE_STATEMENTS.map((example) => (
                  <SelectItem key={example.title} value={example.title}>
                    {example.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="argumentText" className="mb-1 font-arvo">
              Or Enter Your Own Argument:
            </Label>
            <Textarea
              id="argumentText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="DROP YOUR ARGUMENT HERE AND WATCH US DEMOLISH IT..."
              className="resize-none min-h-[160px] neo-input text-base font-bold"
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="aiModel" className="mb-1 font-arvo">
              Select AI Provider:
            </Label>
            <Select
              value={model}
              onValueChange={setModel}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openrouter">OpenRouter (Free)</SelectItem>
                <SelectItem value="openai">OpenAI (Clone repo to use)</SelectItem>
                <SelectItem value="deepseek">DeepSeek (Clone repo to use)</SelectItem>
                <SelectItem value="gemini">Google (Clone repo to use)</SelectItem>
              </SelectContent>
            </Select>
            {showApiKeyWarning && (
              <p className="mt-1 text-xs text-amber-600">
                <AlertCircle className="h-3 w-3 inline-block mr-1" />
                To use this model, you need to clone the repository from <a href="https://github.com/Sonamkhadka/Argument-Analyzer.git" target="_blank" rel="noopener noreferrer" className="underline">GitHub</a> and add your own API key.
              </p>
            )}
          </div>

          {model === "openrouter" && (
            <div className="mb-6">
              <Label htmlFor="openRouterModel" className="mb-1 font-arvo">
                Select OpenRouter Model:
              </Label>
              <Select
                value={openRouterModel}
                onValueChange={(value) => setOpenRouterModel(value as OpenRouterModel)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {config ? config.openRouterModels.map((modelId) => {
                    // Get friendly name for display
                    let displayName = modelId;
                    if (modelId === "google/gemini-2.5-pro-exp-03-25:free") displayName = "Gemini 2.5 Pro";
                    else if (modelId === "deepseek/deepseek-r1-zero:free") displayName = "DeepSeek R1 Zero";
                    else if (modelId === "openai/gpt-4o-mini") displayName = "GPT-4o Mini";
                    else if (modelId === "meta-llama/llama-3.3-70b-instruct:free") displayName = "Llama 3.3 70B";
                    else if (modelId === "mistralai/mistral-7b-instruct:free") displayName = "Mistral 7B";
                    else if (modelId === "x-ai/grok-4-fast:free") displayName = "Grok 4 Fast";

                    return (
                      <SelectItem key={modelId} value={modelId}>
                        {displayName}
                      </SelectItem>
                    );
                  }) : (
                    <SelectItem value="loading" disabled>Loading models...</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                These models are accessible through OpenRouter's free tier.  Please be aware that performance may vary due to OpenRouter's infrastructure. We appreciate your patience.
              </p>
            </div>
          )}

          {localError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {localError}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="neo-button bg-destructive text-destructive-foreground text-xl font-bold px-12 py-4 uppercase tracking-wider hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  DEMOLISHING...
                </>
              ) : (
                <>
                  💥 DESTROY THIS ARGUMENT
                </>
              )}
            </Button>
          </div>
        </form>
    </div>
  );
}