import { useEffect, useState } from "react";
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
import { AlertCircle, Loader2 } from "lucide-react";
import { AnalysisResult, OpenRouterModel } from "@shared/schema";
import { analyzeArgument } from "@/lib/api";
import { getAppConfig, AppConfig } from "@/lib/config";
import { computeSimilarity, buildScorecard, ArgumentScorecard } from "@/lib/insights";

export interface DualArgumentResult {
  left: {
    text: string;
    result: AnalysisResult;
    scorecard: ArgumentScorecard;
  };
  right: {
    text: string;
    result: AnalysisResult;
    scorecard: ArgumentScorecard;
  };
  similarity: number;
}

interface ComparisonFormProps {
  onComparisonReady: (
    isLoading: boolean,
    error: string | null,
    result: DualArgumentResult | null,
    model: string
  ) => void;
}

const EXAMPLE_MATCHUPS = [
  {
    title: "Climate Policy",
    left:
      "Climate change is a hoax because winters are still cold and natural cycles explain temperature shifts better than human activity.",
    right:
      "Overwhelming scientific consensus shows human activity drives current warming trends, with record temperatures and extreme weather events providing evidence.",
  },
  {
    title: "Technology in Education",
    left:
      "Tablets in classrooms distract students and replace critical thinking with shallow internet searches.",
    right:
      "When guided well, educational technology offers personalized practice and expands access to high-quality materials for underserved students.",
  },
  {
    title: "Economic Stimulus",
    left:
      "Government spending packages balloon debt and inevitably trigger inflation that hurts working families the most.",
    right:
      "Strategic stimulus during downturns prevents layoffs, sustains consumer demand, and historically shortens recessions without long-term inflation spikes.",
  },
];

export function ComparisonForm({ onComparisonReady }: ComparisonFormProps) {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [model, setModel] = useState("openrouter");
  const [openRouterModel, setOpenRouterModel] = useState<OpenRouterModel>(
    "mistralai/mistral-7b-instruct:free"
  );
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    getAppConfig()
      .then((appConfig) => {
        setConfig(appConfig);
        setModel(appConfig.defaultAIModel);
        setOpenRouterModel(appConfig.defaultOpenRouterModel as OpenRouterModel);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (!leftText.trim() || !rightText.trim()) {
      const message = "Enter arguments for both sides to compare them.";
      setLocalError(message);
      onComparisonReady(false, message, null, model);
      return;
    }

    try {
      setIsLoading(true);
      onComparisonReady(true, null, null, model);

      const [leftResult, rightResult] = await Promise.all([
        model === "openrouter"
          ? analyzeArgument(leftText, model, openRouterModel)
          : analyzeArgument(leftText, model),
        model === "openrouter"
          ? analyzeArgument(rightText, model, openRouterModel)
          : analyzeArgument(rightText, model),
      ]);

      const comparison: DualArgumentResult = {
        left: {
          text: leftText,
          result: leftResult,
          scorecard: buildScorecard(leftResult),
        },
        right: {
          text: rightText,
          result: rightResult,
          scorecard: buildScorecard(rightResult),
        },
        similarity: computeSimilarity(leftText, rightText),
      };

      onComparisonReady(false, null, comparison, model);
    } catch (error) {
      console.error("Comparison analysis failed", error);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to analyze arguments. Please try again.";
      setLocalError(message);
      onComparisonReady(false, message, null, model);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neo-card p-6">
      <div className="bg-secondary text-secondary-foreground p-4 mb-6 neo-border neo-shadow-secondary">
        <h2 className="text-2xl font-bold uppercase tracking-wider font-arvo">
          ⚖️ Dual Argument Analyzer
        </h2>
        <p className="text-sm opacity-90 mt-2">
          Compare the structure, strength, and tone of two opposing arguments side-by-side.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="font-arvo">Quick start with an example matchup</Label>
          <Select
            onValueChange={(value) => {
              const preset = EXAMPLE_MATCHUPS.find((item) => item.title === value);
              if (preset) {
                setLeftText(preset.left);
                setRightText(preset.right);
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="neo-select mt-2">
              <SelectValue placeholder="Select a debate to auto-fill both sides" />
            </SelectTrigger>
            <SelectContent>
              {EXAMPLE_MATCHUPS.map((item) => (
                <SelectItem key={item.title} value={item.title}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leftArgument" className="font-arvo">
              Argument A
            </Label>
            <Textarea
              id="leftArgument"
              value={leftText}
              onChange={(event) => setLeftText(event.target.value)}
              placeholder="Paste the first argument here"
              className="resize-none min-h-[160px] neo-input font-semibold"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="rightArgument" className="font-arvo">
              Argument B
            </Label>
            <Textarea
              id="rightArgument"
              value={rightText}
              onChange={(event) => setRightText(event.target.value)}
              placeholder="Paste the opposing argument here"
              className="resize-none min-h-[160px] neo-input font-semibold"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Label className="font-arvo">Select AI Provider</Label>
          <Select value={model} onValueChange={setModel} disabled={isLoading}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select an AI provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openrouter">OpenRouter (Free)</SelectItem>
              <SelectItem value="openai">OpenAI (Clone repo to use)</SelectItem>
              <SelectItem value="deepseek">DeepSeek (Clone repo to use)</SelectItem>
              <SelectItem value="gemini">Google (Clone repo to use)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {model === "openrouter" && config && (
          <div>
            <Label className="font-arvo">OpenRouter Model</Label>
            <Select
              value={openRouterModel}
              onValueChange={(value) => setOpenRouterModel(value as OpenRouterModel)}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.openRouterModels.map((modelOption) => (
                  <SelectItem key={modelOption} value={modelOption}>
                    {modelOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {localError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing arguments...
            </span>
          ) : (
            "Run comparison"
          )}
        </Button>
      </form>
    </div>
  );
}

