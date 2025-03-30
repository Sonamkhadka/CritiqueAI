import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisResult } from "@shared/schema";
import { analyzeArgument } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface ArgumentFormProps {
  onAnalysisRequested: (
    isLoading: boolean,
    error: string | null,
    result: AnalysisResult | null,
    model: string
  ) => void;
  isLoading: boolean;
}

export default function ArgumentForm({
  onAnalysisRequested,
  isLoading,
}: ArgumentFormProps) {
  const [text, setText] = useState("");
  const [model, setModel] = useState("openai");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      onAnalysisRequested(false, "Please enter an argument to analyze.", null, model);
      return;
    }

    // Notify the parent component that we're starting analysis
    onAnalysisRequested(true, null, null, model);

    try {
      const result = await analyzeArgument(text, model);
      onAnalysisRequested(false, null, result, model);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      onAnalysisRequested(false, message, null, model);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Analyze Your Argument
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="argumentText" className="mb-1">
              Enter your argument text:
            </Label>
            <Textarea
              id="argumentText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your argument here. For example: 'Climate change is primarily caused by human activities. The rapid increase in global temperatures correlates with industrial development. Scientists have found that greenhouse gas emissions from factories and vehicles trap heat in the atmosphere.'"
              className="resize-none min-h-[160px]"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="aiModel" className="mb-1">
              Select AI Model:
            </Label>
            <Select 
              value={model} 
              onValueChange={setModel}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-gray-500">
              Note: You need to set up an API key for the selected model in Replit Secrets.
            </p>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg
                    className="mr-2 h-4 w-4"
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
                  Analyze Argument
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
