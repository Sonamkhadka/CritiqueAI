import { AnalysisResult } from "@shared/schema";

export interface ArgumentScorecard {
  coherence: number;
  support: number;
  tone: number;
  fallacyRisk: number;
  summary: string;
}

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function buildScorecard(result: AnalysisResult): ArgumentScorecard {
  const hasClaim = result.claim.trim().length > 0;
  const premiseCount = result.premises?.filter((p) => p.trim().length > 0).length ?? 0;
  const fallacyCount = result.fallacies?.length ?? 0;
  const counterCount = result.counterArguments?.length ?? 0;

  const coherenceBase = hasClaim ? 60 : 40;
  const coherence = clampScore(
    coherenceBase + Math.min(premiseCount * 6, 30) + Math.min(counterCount * 4, 10)
  );

  const support = clampScore(35 + Math.min(premiseCount * 12, 55));

  const emotionValues = Object.values(result.emotions || {});
  const avgEmotion = emotionValues.length
    ? emotionValues.reduce((acc, value) => acc + (value ?? 0), 0) / emotionValues.length
    : 0;
  const tone = clampScore(80 - Math.abs(avgEmotion - 2.5) * 15);

  const fallacyRisk = clampScore(100 - Math.min(fallacyCount * 18, 70));

  const insights: string[] = [];
  if (premiseCount >= 3) {
    insights.push("Well supported with multiple premises.");
  } else if (premiseCount === 0) {
    insights.push("Needs evidence to back up the main claim.");
  } else {
    insights.push("Could benefit from additional supporting evidence.");
  }

  if (fallacyCount === 0) {
    insights.push("No fallacies detected—strong logical footing.");
  } else if (fallacyCount <= 2) {
    insights.push("Minor fallacy risk worth addressing.");
  } else {
    insights.push("High fallacy risk—review reasoning carefully.");
  }

  if (counterCount > 0) {
    insights.push("Considers opposing viewpoints.");
  }

  const summary = insights.join(" ");

  return {
    coherence,
    support,
    tone,
    fallacyRisk,
    summary,
  };
}

const tokenize = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);

export function computeSimilarity(textA: string, textB: string): number {
  const tokensA = new Set(tokenize(textA));
  const tokensB = new Set(tokenize(textB));

  if (tokensA.size === 0 || tokensB.size === 0) {
    return 0;
  }

  let intersection = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) {
      intersection += 1;
    }
  });

  const combined = new Set<string>();
  tokensA.forEach((token) => combined.add(token));
  tokensB.forEach((token) => combined.add(token));
  const union = combined.size;
  return union === 0 ? 0 : intersection / union;
}

export interface DebateMomentum {
  affirmative: number;
  negative: number;
}

export interface DebateRoundInsight {
  speaker: "affirmative" | "negative";
  text: string;
  result: AnalysisResult;
  scorecard: ArgumentScorecard;
}

export function calculateMomentum(rounds: DebateRoundInsight[]): DebateMomentum {
  return rounds.reduce(
    (acc, round) => {
      const contribution =
        round.scorecard.coherence * 0.25 +
        round.scorecard.support * 0.35 +
        round.scorecard.fallacyRisk * 0.2 +
        round.scorecard.tone * 0.2;
      if (round.speaker === "affirmative") {
        acc.affirmative += contribution;
      } else {
        acc.negative += contribution;
      }
      return acc;
    },
    { affirmative: 0, negative: 0 }
  );
}

