import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Info, Lock, Brain, Code, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoSvg } from "@/components/Logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function ApiGuide() {
  return (
    <Card className="overflow-hidden border-gray-200">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-lg font-medium text-gray-900">Resources & Information</CardTitle>
        <CardDescription>
          Learn about the AI models and how to use this tool effectively
        </CardDescription>
      </CardHeader>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="setup">API Setup</TabsTrigger>
          <TabsTrigger value="about">About Critique</TabsTrigger>
          <TabsTrigger value="tips">Analysis Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="p-4">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              To use all AI models in the Critique AI, you'll need these API keys:
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start border border-gray-200 rounded-md p-3">
                <div className="p-2 rounded-md mr-3">
                  <Lock className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800">OPENAI_API_KEY</span>
                  <p className="text-xs text-gray-600 mt-1">
                    Powers GPT-4o analysis. Get from{" "}
                    <a href="https://platform.openai.com/account/api-keys" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      OpenAI Platform
                    </a>
                  </p>
                </div>
              </li>

              <li className="flex items-start border border-gray-200 rounded-md p-3">
                <div className="p-2 rounded-md mr-3">
                  <Lock className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800">DEEPSEEK_API_KEY</span>
                  <p className="text-xs text-gray-600 mt-1">
                    For DeepSeek Chat analysis. Get from{" "}
                    <a href="https://platform.deepseek.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      DeepSeek Platform
                    </a>
                  </p>
                </div>
              </li>

              <li className="flex items-start border border-gray-200 rounded-md p-3">
                <div className="p-2 rounded-md mr-3">
                  <Lock className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800">GEMINI_API_KEY</span>
                  <p className="text-xs text-gray-600 mt-1">
                    For Gemini Pro analysis. Get from{" "}
                    <a href="https://ai.google.dev/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      Google AI Studio
                    </a> (optional)
                  </p>
                </div>
              </li>
            </ul>
            <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>About OpenRouter Models</AlertTitle>
                <AlertDescription className="text-xs">
                  These models are accessible through <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenRouter's</a> free tier. Please be aware that performance may vary due to OpenRouter's infrastructure. We appreciate your patience if response times are slower than expected.
                </AlertDescription>
              </Alert>

            <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <p>
                  Using these AI services may incur costs based on your usage. Check each provider's pricing details before extensive use.
                </p>
              </div>
          </div>
        </TabsContent>

        <TabsContent value="about" className="p-4">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full mr-3">
                <div className="h-5 w-5 text-gray-600">
                  <LogoSvg />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">What is Critique?</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Critique AI is an open-source tool that uses AI to break down the structure
                  of arguments and identify logical fallacies, helping users improve their critical thinking skills.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 rounded-full mr-3">
                <Code className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Open Source & Privacy-Focused</h3>
                <p className="text-xs text-gray-600 mt-1">
                  This project is open source and free to use. You can fork, modify, and deploy your own version.
                  All analysis history is stored only in your browser's localStorage - we don't collect or store
                  any user data on servers.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="p-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-700">For best analysis results:</p>

            <ul className="space-y-2 text-xs text-gray-600 list-disc pl-5">
              <li>Provide complete arguments with clear claims and premises</li>
              <li>Include the context of the argument when relevant</li>
              <li>Separate multi-part arguments into distinct submissions</li>
              <li>Compare results from different AI models for a more comprehensive analysis</li>
              <li>Use the history feature to track how your arguments evolve over time</li>
            </ul>

            <div className="border border-gray-200 rounded-md p-3 mt-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-4 w-4 text-gray-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-700">
                    AI analysis is a helpful tool, but not a replacement for human judgment. Always critically evaluate the AI's assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CardFooter className="border-t border-gray-100 p-3">
        <div className="flex items-start w-full">
          <AlertTriangle className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600">
            Using these AI services may incur costs based on your usage. Check each provider's pricing details before extensive use.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}