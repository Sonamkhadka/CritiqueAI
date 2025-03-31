import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { AnalysisResult, Fallacy } from "@shared/schema";
import { 
  Loader2, Share, Download, Printer, Info, 
  AlertCircle, Brain, BarChart3, Sparkles, 
  ThumbsUp, ThumbsDown, MessageSquareQuote 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Chart from "chart.js/auto";
import { LogoSvg } from "@/components/Logo";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


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
                  "rgba(239, 68, 68, 0.8)",    // Red for Anger
                  "rgba(59, 130, 246, 0.8)",   // Blue for Sadness
                  "rgba(249, 115, 22, 0.8)",   // Orange for Joy
                  "rgba(107, 114, 128, 0.8)",  // Gray for Fear
                  "rgba(147, 51, 234, 0.8)",   // Purple for Surprise
                ],
                borderColor: [
                  "rgb(220, 38, 38)",          // Darker red border
                  "rgb(37, 99, 235)",          // Darker blue border
                  "rgb(234, 88, 12)",          // Darker orange border
                  "rgb(75, 85, 99)",           // Darker gray border
                  "rgb(126, 34, 206)",         // Darker purple border
                ],
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: [
                  "rgba(239, 68, 68, 1)",      // Full opacity on hover
                  "rgba(59, 130, 246, 1)",
                  "rgba(249, 115, 22, 1)",
                  "rgba(107, 114, 128, 1)",
                  "rgba(147, 51, 234, 1)",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 500,
              easing: 'easeOutCubic'
            },
            devicePixelRatio: 1.5, // Improve rendering quality
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1,
                  font: {
                    size: 11
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    size: 11
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                padding: 10,
                titleFont: {
                  size: 13
                },
                bodyFont: {
                  size: 12
                },
                callbacks: {
                  label: function(context) {
                    return `Intensity: ${context.raw}/5`;
                  }
                }
              }
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
Anger: ${result.emotions?.Anger}/5
Sadness: ${result.emotions?.Sadness}/5
Joy: ${result.emotions?.Joy}/5
Fear: ${result.emotions?.Fear}/5
Surprise: ${result.emotions?.Surprise}/5

Generated by Logos Argument Analyzer using ${selectedModel}
    `.trim();
  };

  // Help text for explaining key concepts
  const [selectedFallacy, setSelectedFallacy] = useState<Fallacy | null>(null);
  const [selectedAssumption, setSelectedAssumption] = useState<string | null>(null);

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                AI-powered logical and rhetorical analysis
              </CardDescription>
            </div>
            {result && (
              <div className="flex items-center space-x-2">
                <div className="rounded-full px-3 py-1 text-xs text-white font-medium bg-gradient-to-r from-primary to-primary/80 shadow-sm">
                  {selectedModel.startsWith("openrouter-") 
                    ? "OpenRouter" 
                    : selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)}
                </div>
                {result.modelName && (
                  <div className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600 bg-white/80">
                    {result.modelName}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">

          {isLoading ? (
            <div className="py-12 flex flex-col items-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5">
                    <span className="font-semibold text-xs text-primary">C</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-md font-medium text-gray-700">Analyzing your argument...</p>
              <p className="text-sm text-gray-500 max-w-md text-center mt-2">
                Our AI is carefully examining the logical structure, premises, and potential fallacies in your argument.
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error.includes("Rate limit") ? "Rate Limit Reached" : "Error Occurred"}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                    {error.includes("Rate limit") && (
                      <p className="mt-2 text-xs">
                        To protect our services and ensure fair usage, we limit the number of requests per user.
                        Please wait a moment before trying again.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : !result ? (
            <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="mx-auto h-16 w-16 text-gray-400">
                <span className="font-semibold text-primary">Critique</span>
              </div>
              <h3 className="mt-4 text-md font-semibold text-gray-900">No analysis yet</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Enter an argument in the field above and click "Analyze Argument" to see a 
                comprehensive breakdown of its logical structure and rhetorical elements.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* MAIN CLAIM SECTION */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-2 bg-gray-50">
                  <div className="flex items-center">
                    <MessageSquareQuote className="w-5 h-5 text-primary mr-2" />
                    <CardTitle className="text-base font-medium text-gray-800">Main Claim</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <Info className="h-4 w-4 text-gray-400" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            The main claim is the central point or conclusion that the argument is trying to establish.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-sm leading-relaxed text-gray-800 p-2 bg-white border-l-4 border-primary rounded-r-md shadow-sm">
                    {result.claim}
                  </p>
                </CardContent>
              </Card>

              {/* PREMISES SECTION */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-2 bg-gray-50">
                  <div className="flex items-center">
                    <Brain className="w-5 h-5 text-primary mr-2" />
                    <CardTitle className="text-base font-medium text-gray-800">Supporting Premises</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <Info className="h-4 w-4 text-gray-400" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Premises are the statements that provide evidence or reasons to support the main claim.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <ul className="space-y-3">
                    {result.premises.map((premise, index) => (
                      <li key={index} className="text-sm leading-relaxed text-gray-800 bg-white p-3 rounded-md shadow-sm border border-gray-100">
                        <span className="inline-flex items-center justify-center bg-primary text-white text-xs font-semibold rounded-full h-5 w-5 mr-2">
                          {index + 1}
                        </span>
                        {premise}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* EMOTIONAL TONE ANALYSIS */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-2 bg-gray-50">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-primary mr-2" />
                    <CardTitle className="text-base font-medium text-gray-800">Emotional Tone Analysis</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <Info className="h-4 w-4 text-gray-400" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            This analysis identifies the emotional undertones in the argument, which can influence how the argument is received, regardless of its logical merit.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="h-[160px]">
                      <canvas ref={chartRef} height="160"></canvas>
                    </div>
                    <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
                      <div className="text-red-500 font-medium">Anger</div>
                      <div className="text-blue-500 font-medium">Sadness</div>
                      <div className="text-orange-500 font-medium">Joy</div>
                      <div className="text-gray-500 font-medium">Fear</div>
                      <div className="text-purple-500 font-medium">Surprise</div>
                    </div>
                    {result.emotionJustification && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-700">{result.emotionJustification}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* FALLACIES SECTION */}
              {result.fallacies && result.fallacies.length > 0 && (
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2 bg-gray-50">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-primary mr-2" />
                      <CardTitle className="text-base font-medium text-gray-800">Logical Fallacies Detected</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-help">
                              <Info className="h-4 w-4 text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Logical fallacies are flaws in reasoning that can undermine the validity of an argument.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <div className="space-y-3">
                      {result.fallacies.map((fallacy, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <div 
                              className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => setSelectedFallacy(fallacy)}
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-800">{fallacy.name}</h4>
                                <span className="text-xs text-primary">Click for details</span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1 line-clamp-2">{fallacy.explanation}</p>
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="text-lg font-semibold text-gray-900">{fallacy.name}</DialogTitle>
                              <DialogDescription>
                                <div className="mt-4 text-sm text-gray-700">
                                  {fallacy.explanation}
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CRITICAL EVALUATION */}
              {result.criticalEvaluation && (
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2 bg-gray-50">
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5 text-primary mr-2" />
                      <CardTitle className="text-base font-medium text-gray-800">Critical Evaluation</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-help">
                              <Info className="h-4 w-4 text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              A comprehensive assessment of the argument's strengths, weaknesses, and underlying assumptions.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <div className="bg-white rounded-md border border-gray-100 shadow-sm">
                      <div className="border-b border-gray-200 p-3">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 text-green-500 mr-2" />
                          <h4 className="text-sm font-medium text-gray-800">Strength</h4>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{result.criticalEvaluation.strength}</p>
                      </div>

                      {result.criticalEvaluation.weaknesses.length > 0 && (
                        <div className="border-b border-gray-200 p-3">
                          <div className="flex items-center">
                            <ThumbsDown className="h-4 w-4 text-red-500 mr-2" />
                            <h4 className="text-sm font-medium text-gray-800">Weaknesses</h4>
                          </div>
                          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                            {result.criticalEvaluation.weaknesses.map((weakness, index) => (
                              <li key={index}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.criticalEvaluation.assumptions.length > 0 && (
                        <div className="p-3">
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                            <h4 className="text-sm font-medium text-gray-800">Assumptions</h4>
                          </div>
                          <ul className="text-sm text-gray-700 mt-2 space-y-2">
                            {result.criticalEvaluation.assumptions.map((assumption, index) => (
                              <Dialog key={index}>
                                <DialogTrigger asChild>
                                  <li 
                                    className="cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded transition-colors flex items-center"
                                    onClick={() => setSelectedAssumption(assumption)}
                                  >
                                    <span className="mr-2">•</span>
                                    {assumption}
                                    <span className="text-xs text-primary ml-1">(explain)</span>
                                  </li>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle className="text-lg font-semibold text-gray-900">Hidden Assumption</DialogTitle>
                                    <DialogDescription>
                                      <div className="mt-4 text-sm text-gray-700">
                                        <p>{assumption}</p>
                                        <div className="mt-4 bg-gray-50 p-3 rounded-md">
                                          <p className="text-sm">
                                            <span className="font-medium">Why this matters:</span> Hidden assumptions can weaken an argument if they're not explicitly stated or supported. A strong argument should address its underlying assumptions.
                                          </p>
                                        </div>
                                      </div>
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* COUNTER ARGUMENTS */}
              {result.counterArguments && result.counterArguments.length > 0 && (
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2 bg-gray-50">
                    <div className="flex items-center">
                      <MessageSquareQuote className="w-5 h-5 text-primary mr-2" />
                      <CardTitle className="text-base font-medium text-gray-800">
                        Potential Counter-Arguments
                      </CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-help">
                              <Info className="h-4 w-4 text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              These are alternative viewpoints or rebuttals that challenge the main argument.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <div className="space-y-3">
                      {result.counterArguments.map((counter, index) => (
                        <div key={index} className="bg-white p-3 rounded-md shadow-sm border-l-4 border-amber-400">
                          <p className="text-sm text-gray-700">{counter}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ARGUMENT STRUCTURE */}
              {result.structureMap && (
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2 bg-gray-50">
                    <div className="flex items-center">
                      <Brain className="w-5 h-5 text-primary mr-2" />
                      <CardTitle className="text-base font-medium text-gray-800">
                        Argument Structure
                      </CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-help">
                              <Info className="h-4 w-4 text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              A visual representation of how the premises connect to support the conclusion.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 overflow-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{result.structureMap}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Share or save your analysis</h3>
                  <div className="text-xs text-gray-500">
                    Generated using <span className="font-medium">{result.modelName || selectedModel}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex items-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-sm transition-all"
                    onClick={shareResults}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center hover:bg-gray-50 transition-colors"
                    onClick={downloadResults}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center hover:bg-gray-50 transition-colors"
                    onClick={printResults}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}