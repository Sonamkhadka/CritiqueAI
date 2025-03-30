import { useState } from "react";
import ArgumentForm from "@/components/ArgumentForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import HistoryList from "@/components/HistoryList";
import ApiGuide from "@/components/ApiGuide";
import { AnalysisResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// SVG for the logo
const LogoSvg = () => (
  <svg
    className="h-8 w-8 text-blue-500"
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
);

export interface HistoryItem {
  id: string;
  inputText: string;
  result: AnalysisResult;
  aiModel: string;
  timestamp: Date;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedModel, setSelectedModel] = useState("openai");
  const { toast } = useToast();
  
  // This function will be passed to the ArgumentForm component
  const onAnalysisRequested = (isLoading: boolean, error: string | null, result: AnalysisResult | null, model: string) => {
    setLoading(isLoading);
    setError(error);
    setResult(result);
    setSelectedModel(model);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error
      });
    } else if (result) {
      toast({
        title: "Analysis Complete",
        description: "Your argument has been successfully analyzed."
      });
    }
  };

  return (
    <div className="bg-gray-50 font-sans text-gray-800 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <LogoSvg />
              </div>
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                Logos Argument Analyzer
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form and History */}
          <div className="lg:col-span-2 space-y-8">
            <ArgumentForm 
              onAnalysisRequested={onAnalysisRequested} 
              isLoading={loading} 
            />
            <HistoryList 
              onHistoryItemSelected={(item) => {
                setResult(item.result);
                setSelectedModel(item.aiModel);
              }}
            />
          </div>

          {/* Right Column - Results and API Guide */}
          <div className="lg:col-span-1 space-y-8">
            <ResultsDisplay 
              result={result} 
              isLoading={loading} 
              error={error} 
              selectedModel={selectedModel} 
            />
            <ApiGuide />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Logos Argument Analyzer • Built with modern web technologies
          </p>
        </div>
      </footer>
    </div>
  );
}
