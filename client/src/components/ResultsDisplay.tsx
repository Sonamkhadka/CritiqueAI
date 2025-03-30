import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@shared/schema";
import { Loader2, Share, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Chart from "chart.js/auto";

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  selectedModel: string;
}

export default function ResultsDisplay({
  result,
  isLoading,
  error,
  selectedModel,
}: ResultsDisplayProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { toast } = useToast();

  // When the result changes, update the chart
  useEffect(() => {
    if (result && chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Anger", "Sadness", "Joy", "Fear", "Surprise"],
            datasets: [
              {
                label: "Emotion Intensity (1-5)",
                data: [
                  result.emotions.Anger,
                  result.emotions.Sadness,
                  result.emotions.Joy,
                  result.emotions.Fear,
                  result.emotions.Surprise,
                ],
                backgroundColor: [
                  "rgba(239, 68, 68, 0.7)",    // Red for Anger
                  "rgba(59, 130, 246, 0.7)",   // Blue for Sadness
                  "rgba(249, 115, 22, 0.7)",   // Orange for Joy
                  "rgba(107, 114, 128, 0.7)",  // Gray for Fear
                  "rgba(147, 51, 234, 0.7)",   // Purple for Surprise
                ],
                borderColor: [
                  "rgb(239, 68, 68)",
                  "rgb(59, 130, 246)",
                  "rgb(249, 115, 22)",
                  "rgb(107, 114, 128)",
                  "rgb(147, 51, 234)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [result]);

  // Function to share the results
  const shareResults = async () => {
    if (!result) return;

    const text = formatResultsAsText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Logos Argument Analysis",
          text: text,
        });
        toast({
          title: "Shared successfully",
          description: "The analysis has been shared."
        });
      } else {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard",
          description: "The analysis has been copied to your clipboard."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Share failed",
        description: "Unable to share the analysis."
      });
    }
  };

  // Function to download the results as a text file
  const downloadResults = () => {
    if (!result) return;

    const text = formatResultsAsText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logos-analysis.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "The analysis has been downloaded as a text file."
    });
  };

  // Function to print the results
  const printResults = () => {
    if (!result) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Logos Argument Analysis</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1 { color: #333; }
              h2 { color: #555; margin-top: 20px; }
              .section { margin-bottom: 20px; }
              .box { background: #f5f5f5; padding: 10px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>Logos Argument Analysis</h1>
            <div class="section">
              <h2>Main Claim</h2>
              <div class="box">${result.claim}</div>
            </div>
            <div class="section">
              <h2>Supporting Premises</h2>
              <div class="box">
                <ul>
                  ${result.premises.map(premise => `<li>${premise}</li>`).join("")}
                </ul>
              </div>
            </div>
            <div class="section">
              <h2>Emotional Tone Analysis</h2>
              <div class="box">
                <p>Anger: ${result.emotions.Anger}/5</p>
                <p>Sadness: ${result.emotions.Sadness}/5</p>
                <p>Joy: ${result.emotions.Joy}/5</p>
                <p>Fear: ${result.emotions.Fear}/5</p>
                <p>Surprise: ${result.emotions.Surprise}/5</p>
              </div>
            </div>
            <div class="section">
              <p><small>Generated by Logos Argument Analyzer using ${selectedModel}</small></p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      toast({
        variant: "destructive",
        title: "Print failed",
        description: "Unable to open print window. Please check your browser settings."
      });
    }
  };

  // Helper function to format results as text
  const formatResultsAsText = () => {
    if (!result) return "";

    return `
Logos Argument Analysis

MAIN CLAIM:
${result.claim}

SUPPORTING PREMISES:
${result.premises.map((premise, index) => `${index + 1}. ${premise}`).join("\n")}

EMOTIONAL TONE ANALYSIS:
Anger: ${result.emotions.Anger}/5
Sadness: ${result.emotions.Sadness}/5
Joy: ${result.emotions.Joy}/5
Fear: ${result.emotions.Fear}/5
Surprise: ${result.emotions.Surprise}/5

Generated by Logos Argument Analyzer using ${selectedModel}
    `.trim();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Analysis Results</h2>
          {result && (
            <div className="flex items-center space-x-2">
              <div className="rounded bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs text-white font-medium shadow-sm">
                {selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)}
              </div>
              {result.modelName && (
                <div className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600">
                  {result.modelName}
                </div>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-gray-600">Analyzing your argument...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Occurred</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : !result ? (
          <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No analysis yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Enter an argument and click "Analyze Argument" to see results.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Main Claim</h3>
              <p className="text-sm bg-gray-50 p-3 rounded-md">{result.claim}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Supporting Premises
              </h3>
              <ul className="space-y-2">
                {result.premises.map((premise, index) => (
                  <li key={index} className="text-sm bg-gray-50 p-3 rounded-md">
                    {premise}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Emotional Tone Analysis
              </h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <canvas ref={chartRef} height="200"></canvas>
                {result.emotionJustification && (
                  <p className="text-xs text-gray-600 mt-3 italic">{result.emotionJustification}</p>
                )}
              </div>
            </div>

            {result.fallacies && result.fallacies.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Logical Fallacies Detected
                </h3>
                <div className="space-y-2">
                  {result.fallacies.map((fallacy, index) => (
                    <div key={index} className="bg-amber-50 p-3 rounded-md border border-amber-100">
                      <h4 className="font-medium text-amber-800">{fallacy.name}</h4>
                      <p className="text-sm text-amber-700 mt-1">{fallacy.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.criticalEvaluation && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Critical Evaluation
                </h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div>
                    <h4 className="text-xs uppercase tracking-wide text-gray-500">Strength</h4>
                    <p className="text-sm text-gray-800 mt-1">{result.criticalEvaluation.strength}</p>
                  </div>
                  
                  {result.criticalEvaluation.weaknesses.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-gray-500">Weaknesses</h4>
                      <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
                        {result.criticalEvaluation.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.criticalEvaluation.assumptions.length > 0 && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-gray-500">Assumptions</h4>
                      <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
                        {result.criticalEvaluation.assumptions.map((assumption, index) => (
                          <li key={index}>{assumption}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.counterArguments && result.counterArguments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Potential Counter-Arguments
                </h3>
                <div className="space-y-2">
                  {result.counterArguments.map((counter, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-md border border-blue-100">
                      <p className="text-sm text-blue-800">{counter}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.structureMap && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Argument Structure
                </h3>
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <pre className="text-xs text-slate-800 whitespace-pre-wrap">{result.structureMap}</pre>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center"
                onClick={shareResults}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center"
                onClick={downloadResults}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center"
                onClick={printResults}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
