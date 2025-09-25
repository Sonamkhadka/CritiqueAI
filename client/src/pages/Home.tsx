import React from "react";
import Hero from "@/components/Hero";
import ApiGuide from "@/components/ApiGuide";
import ArgumentForm from "@/components/ArgumentForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import { ComparisonForm, DualArgumentResult } from "@/components/ComparisonForm";
import { ComparisonResults } from "@/components/ComparisonResults";
import { DebateArena } from "@/components/DebateArena";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Trophy } from "lucide-react";
import { DebateMomentum, DebateRoundInsight } from "@/lib/insights";

export default function Home() {
  const [result, setResult] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedModel, setSelectedModel] = React.useState("openai");
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const comparisonRef = React.useRef<HTMLDivElement>(null);
  const debateRef = React.useRef<HTMLDivElement>(null);

  const [mode, setMode] = React.useState("single");

  const [comparisonResult, setComparisonResult] = React.useState<DualArgumentResult | null>(null);
  const [comparisonLoading, setComparisonLoading] = React.useState(false);
  const [comparisonError, setComparisonError] = React.useState<string | null>(null);

  const [debateRounds, setDebateRounds] = React.useState<DebateRoundInsight[]>([]);
  const [debateMomentum, setDebateMomentum] = React.useState<DebateMomentum | null>(null);
  const [debateModel, setDebateModel] = React.useState("openrouter");

  const handleAnalysisRequested = (
    isLoading: boolean,
    error: string | null,
    result: any,
    model: string
  ) => {
    setIsLoading(isLoading);
    setError(error);
    setResult(result);
    setSelectedModel(model);

    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleComparisonRequested = (
    isLoading: boolean,
    error: string | null,
    result: DualArgumentResult | null,
    model: string
  ) => {
    setComparisonLoading(isLoading);
    setComparisonError(error);
    if (!isLoading) {
      setComparisonResult(result);
      if (result && comparisonRef.current) {
        comparisonRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleDebateUpdate = (
    rounds: DebateRoundInsight[],
    momentum: DebateMomentum,
    model: string
  ) => {
    setDebateRounds(rounds);
    setDebateMomentum(momentum);
    setDebateModel(model);

    if (rounds.length > 0 && debateRef.current) {
      debateRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          <Tabs value={mode} onValueChange={setMode} className="space-y-4">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2 neo-subtle p-2">
              <TabsTrigger value="single" className="text-sm font-semibold">
                Single critique
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-sm font-semibold">
                Dual analyzer
              </TabsTrigger>
              <TabsTrigger value="debate" className="text-sm font-semibold">
                Live debate mode
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-4">
              <ArgumentForm
                onAnalysisRequested={handleAnalysisRequested}
                isLoading={isLoading}
              />
              <div ref={resultsRef} className="mt-2">
                <ResultsDisplay
                  result={result}
                  isLoading={isLoading}
                  error={error}
                  selectedModel={selectedModel}
                />
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <ComparisonForm onComparisonReady={handleComparisonRequested} />
              <div ref={comparisonRef} className="mt-2">
                <ComparisonResults
                  result={comparisonResult}
                  isLoading={comparisonLoading}
                  error={comparisonError}
                />
              </div>
            </TabsContent>

            <TabsContent value="debate" className="space-y-4">
              <DebateArena onDebateUpdate={handleDebateUpdate} />
              <div ref={debateRef}>
                {debateRounds.length > 0 && debateMomentum && (
                  <Card className="neo-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Activity className="h-5 w-5 text-primary" /> Debate summary snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Total rounds</p>
                        <p className="text-2xl font-bold">{debateRounds.length}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">AI model</p>
                        <p className="text-lg font-semibold">{debateModel}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <span>
                          Momentum edge: {debateMomentum.affirmative > debateMomentum.negative ? "Affirmative" : "Negative"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Momentum spread</p>
                        <p className="font-semibold">
                          {Math.round(debateMomentum.affirmative)} vs {Math.round(debateMomentum.negative)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <ApiGuide />
          </div>
        </div>
      </div>
    </div>
  );
}

