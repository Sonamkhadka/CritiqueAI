import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import ApiGuide from "@/components/ApiGuide";
import ArgumentForm from "@/components/ArgumentForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Footer } from "@/components/Footer"; // Fixed import - using named export

export default function Home() {
  const [result, setResult] = React.useState<any>(null);
  const [argumentText, setArgumentText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedModel, setSelectedModel] = React.useState("openai");
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Function to handle when analysis is requested
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
    
    // Scroll to results when they're available
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {/* Analysis Form */}
          <ArgumentForm 
            onAnalysisRequested={handleAnalysisRequested}
            isLoading={isLoading}
          />
          
          {/* Results Display (only shown when results are available) */}
          <div ref={resultsRef} className="mt-2">
            <ResultsDisplay
              result={result}
              isLoading={isLoading}
              error={error}
              selectedModel={selectedModel}
            />
          </div>
          
          {/* Information Section */}
          <div className="mt-6">
            <ApiGuide />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}