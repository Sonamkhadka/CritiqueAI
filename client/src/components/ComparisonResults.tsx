import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Scale, Flame, GitBranch } from "lucide-react";
import { DualArgumentResult } from "./ComparisonForm";

interface ComparisonResultsProps {
  result: DualArgumentResult | null;
  isLoading: boolean;
  error: string | null;
}

const metricLabel = (score: number) => `${score}%`;

export function ComparisonResults({ result, isLoading, error }: ComparisonResultsProps) {
  const fallacyRows = useMemo(() => {
    if (!result) return [] as string[];
    const names = new Set<string>();
    result.left.result.fallacies?.forEach((f) => names.add(f.name));
    result.right.result.fallacies?.forEach((f) => names.add(f.name));
    return Array.from(names);
  }, [result]);

  if (isLoading) {
    return (
      <Card className="neo-card">
        <CardContent className="py-16 text-center font-arvo text-lg">
          Crunching both arguments…
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="neo-card border-destructive/40">
        <CardContent className="py-8 text-destructive font-medium">{error}</CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const similarityPercent = Math.round(result.similarity * 100);

  const narrativePoints = (label: string, text: string, premises: string[], counters?: string[]) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">{label}</h3>
      </div>
      <div className="neo-subtle rounded-lg p-4 space-y-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Central Claim</p>
          <p className="font-semibold leading-relaxed">{text}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Supporting Premises</p>
          <ul className="list-disc list-inside space-y-1">
            {premises.map((premise, index) => (
              <li key={index} className="text-sm leading-snug">
                {premise}
              </li>
            ))}
          </ul>
        </div>
        {counters && counters.length > 0 && (
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Counter-moves</p>
            <ul className="list-disc list-inside space-y-1">
              {counters.map((item, index) => (
                <li key={index} className="text-sm leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="neo-card">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="font-arvo text-2xl uppercase tracking-wide">
              Comparative Insight Dashboard
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Highlighting structural strengths, fallacy risks, and alignment between the two arguments.
            </p>
          </div>
          <Badge className="text-base px-3 py-1 bg-primary/10 text-primary border-primary/40">
            Similarity {similarityPercent}%
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Scale className="h-4 w-4" /> Semantic alignment score
            </p>
            <Progress value={similarityPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              A higher score indicates overlapping language and concepts, while a lower score suggests divergent framing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[result.left, result.right].map((side, index) => (
              <Card key={index} className="neo-subtle">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {index === 0 ? "Argument A Scorecard" : "Argument B Scorecard"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Coherence</span>
                    <span className="font-semibold">{metricLabel(side.scorecard.coherence)}</span>
                  </div>
                  <Progress value={side.scorecard.coherence} className="h-1.5" />
                  <div className="flex justify-between">
                    <span>Support</span>
                    <span className="font-semibold">{metricLabel(side.scorecard.support)}</span>
                  </div>
                  <Progress value={side.scorecard.support} className="h-1.5" />
                  <div className="flex justify-between">
                    <span>Tone Stability</span>
                    <span className="font-semibold">{metricLabel(side.scorecard.tone)}</span>
                  </div>
                  <Progress value={side.scorecard.tone} className="h-1.5" />
                  <div className="flex justify-between">
                    <span>Fallacy Safety</span>
                    <span className="font-semibold">{metricLabel(side.scorecard.fallacyRisk)}</span>
                  </div>
                  <Progress value={side.scorecard.fallacyRisk} className="h-1.5" />
                  <Separator className="my-2" />
                  <p className="text-muted-foreground leading-relaxed">
                    {side.scorecard.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {fallacyRows.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-destructive" />
                <h3 className="font-semibold text-lg">Fallacy heatmap</h3>
              </div>
              <div className="overflow-hidden rounded-xl border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="p-3 font-semibold">Fallacy</th>
                      <th className="p-3 font-semibold">Argument A</th>
                      <th className="p-3 font-semibold">Argument B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fallacyRows.map((name) => {
                      const leftCount = result.left.result.fallacies?.filter((f) => f.name === name).length ?? 0;
                      const rightCount = result.right.result.fallacies?.filter((f) => f.name === name).length ?? 0;
                      const intensity = Math.min(leftCount + rightCount, 4) / 4;
                      const background = `rgba(239, 68, 68, ${0.1 + intensity * 0.4})`;
                      return (
                        <tr key={name} className="border-t">
                          <td className="p-3 font-medium">{name}</td>
                          <td className="p-3">
                            <span
                              className="px-2 py-1 rounded-md font-semibold"
                              style={{ backgroundColor: leftCount ? background : "transparent" }}
                            >
                              {leftCount || "—"}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className="px-2 py-1 rounded-md font-semibold"
                              style={{ backgroundColor: rightCount ? background : "transparent" }}
                            >
                              {rightCount || "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                Darker tones indicate higher frequency or severity of the highlighted fallacy.
              </p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No fallacies detected in either argument—excellent logical hygiene.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {narrativePoints(
              "Argument A narrative flow",
              result.left.result.claim,
              result.left.result.premises,
              result.left.result.counterArguments
            )}
            {narrativePoints(
              "Argument B narrative flow",
              result.right.result.claim,
              result.right.result.premises,
              result.right.result.counterArguments
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

