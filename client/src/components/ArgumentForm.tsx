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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { AnalysisResult } from "@shared/schema";
import { analyzeArgument } from "@/lib/api";
import { LogoSvg } from "@/components/Logo";

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
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any previous errors
    setLocalError(null);

    if (!text.trim()) {
      setLocalError("Please enter an argument to analyze.");
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
      setLocalError(message);
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
                <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                <SelectItem value="deepseek">DeepSeek (DeepSeek Chat)</SelectItem>
                <SelectItem value="gemini">Google (Gemini 1.5 Pro)</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-gray-500">
              Note: You need to set up an API key for the selected model in Replit Secrets.
            </p>
          </div>
          
          {localError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {localError}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="mr-2 h-4 w-4">
                    <LogoSvg />
                  </span>
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
