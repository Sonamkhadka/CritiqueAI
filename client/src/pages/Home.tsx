import { useState } from "react";
import ArgumentForm from "@/components/ArgumentForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import HistoryList from "@/components/HistoryList";
import ApiGuide from "@/components/ApiGuide";
import { AnalysisResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { LogoSvg } from "@/components/Logo";

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
    <div className="bg-gray-50 font-sans text-gray-800">
      {/* Welcome Hero Section */}
      <div className="border-b border-gray-200 mb-8 py-8">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center justify-center p-2 rounded-full mb-4">
            <LogoSvg />
          </div>
          <h1 className="text-3xl font-medium text-gray-900">
            Logos Argument Analyzer
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Analyze arguments with precision using advanced AI models. Identify logical fallacies, 
            evaluate premises, and strengthen your critical thinking skills.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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
      </div>
    </div>
  );
}
