import { useEffect, useMemo, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Swords, Crown, TrendingUp } from "lucide-react";
import { analyzeArgument } from "@/lib/api";
import { AnalysisResult, OpenRouterModel } from "@shared/schema";
import { getAppConfig, AppConfig } from "@/lib/config";
import { DebateRoundInsight, buildScorecard, calculateMomentum, DebateMomentum } from "@/lib/insights";
import { Progress } from "@/components/ui/progress";

interface DebateArenaProps {
  onDebateUpdate?: (rounds: DebateRoundInsight[], momentum: DebateMomentum, model: string) => void;
}

interface DebateRound extends DebateRoundInsight {
  turn: number;
}

export function DebateArena({ onDebateUpdate }: DebateArenaProps) {
  const [affirmativeName, setAffirmativeName] = useState("Affirmative");
  const [negativeName, setNegativeName] = useState("Negative");
  const [model, setModel] = useState("openrouter");
  const [openRouterModel, setOpenRouterModel] = useState<OpenRouterModel>(
    "mistralai/mistral-7b-instruct:free"
  );
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [currentText, setCurrentText] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState<"affirmative" | "negative">("affirmative");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rounds, setRounds] = useState<DebateRound[]>([]);

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
    setError(null);

    if (!currentText.trim()) {
      setError("Enter a statement to keep the debate moving.");
      return;
    }

    try {
      setIsLoading(true);

      const result: AnalysisResult =
        model === "openrouter"
          ? await analyzeArgument(currentText, model, openRouterModel)
          : await analyzeArgument(currentText, model);

      const insight: DebateRound = {
        turn: rounds.length + 1,
        speaker: currentSpeaker,
        text: currentText,
        result,
        scorecard: buildScorecard(result),
      };

      const updatedRounds = [...rounds, insight];
      setRounds(updatedRounds);
      setCurrentText("");
      setCurrentSpeaker(currentSpeaker === "affirmative" ? "negative" : "affirmative");

      const momentum = calculateMomentum(updatedRounds);
      onDebateUpdate?.(updatedRounds, momentum, model);
    } catch (analysisError) {
      console.error("Debate analysis failed", analysisError);
      const message =
        analysisError instanceof Error
          ? analysisError.message
          : "Unable to analyze this turn.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const activeName = currentSpeaker === "affirmative" ? affirmativeName : negativeName;

  const momentum = useMemo(() => calculateMomentum(rounds), [rounds]);

  const totalMomentum = momentum.affirmative + momentum.negative || 1;
  const affirmativeMomentum = Math.round((momentum.affirmative / totalMomentum) * 100);
  const negativeMomentum = 100 - affirmativeMomentum;

  return (
    <div className="space-y-6">
      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="font-arvo text-2xl uppercase tracking-wide flex items-center gap-2">
            <Swords className="h-5 w-5" /> Live Debate Arena
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Alternate turns, analyze each response, and watch momentum shift as the debate unfolds.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="font-arvo">Affirmative side label</Label>
              <Textarea
                value={affirmativeName}
                onChange={(event) => setAffirmativeName(event.target.value)}
                className="neo-input resize-none"
                rows={1}
              />
            </div>
            <div>
              <Label className="font-arvo">Negative side label</Label>
              <Textarea
                value={negativeName}
                onChange={(event) => setNegativeName(event.target.value)}
                className="neo-input resize-none"
                rows={1}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
                    {config.openRouterModels.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Label className="font-arvo">
              {activeName} — craft your next move
            </Label>
            <Textarea
              value={currentText}
              onChange={(event) => setCurrentText(event.target.value)}
              placeholder="Compose your rebuttal or next point"
              className="neo-input resize-none min-h-[160px]"
              disabled={isLoading}
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing turn…
                </span>
              ) : (
                "Submit turn"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {rounds.length > 0 && (
        <Card className="neo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary" /> Momentum Tracker
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Scores combine coherence, evidence, tone, and logical safety to illustrate debate strength over time.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span>{affirmativeName}</span>
                <span>{negativeName}</span>
              </div>
              <Progress value={affirmativeMomentum} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{affirmativeMomentum}% momentum</span>
                <span>{negativeMomentum}% momentum</span>
              </div>
            </div>

            <div className="space-y-3">
              {rounds.map((round) => (
                <div key={round.turn} className="border rounded-lg p-4 neo-subtle space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      Round {round.turn}: {round.speaker === "affirmative" ? affirmativeName : negativeName}
                    </span>
                    <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
                      <Crown className="h-3 w-3" /> Score {Math.round(
                        (round.scorecard.coherence +
                          round.scorecard.support +
                          round.scorecard.tone +
                          round.scorecard.fallacyRisk) /
                          4
                      )}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{round.text}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <InsightMeter label="Coherence" value={round.scorecard.coherence} />
                    <InsightMeter label="Support" value={round.scorecard.support} />
                    <InsightMeter label="Tone" value={round.scorecard.tone} />
                    <InsightMeter label="Fallacy Safety" value={round.scorecard.fallacyRisk} />
                  </div>
                  <p className="text-xs text-muted-foreground">{round.scorecard.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InsightMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="font-semibold">{Math.round(value)}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

