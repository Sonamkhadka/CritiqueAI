import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function ApiGuide() {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">API Setup Guide</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            To use the Logos Argument Analyzer, you need to set up API keys for the AI models in your Replit Secrets:
          </p>
          <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
            <li>
              OPENAI_API_KEY - Get from{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenAI
              </a>
            </li>
            <li>
              DEEPSEEK_API_KEY - Get from{" "}
              <a
                href="https://platform.deepseek.com"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                DeepSeek
              </a>
            </li>
            <li>
              GEMINI_API_KEY - Get from{" "}
              <a
                href="https://ai.google.dev/"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google AI
              </a>
            </li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-yellow-700">
                  Note: Using these AI services may incur costs based on your usage. Check each provider's pricing details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
