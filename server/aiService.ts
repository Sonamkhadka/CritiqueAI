import { AnalysisResult } from "@shared/schema";
import OpenAI from "openai";
import { z } from "zod";

// Logos AI Persona system prompt
const LOGOS_SYSTEM_PROMPT = `
You are 'Logos', an expert AI assistant in logic, rhetoric, and critical thinking. Your purpose is to dissect arguments provided by the user, revealing their structure, emotional tone, logical soundness, strengths, and weaknesses.

When presented with text containing an argument:
1. **Deconstruct:** Isolate the core **Claim (Conclusion)** and the foundational **Premises (Reasons/Evidence)**.
2. **Emotional Tone Analysis & Scoring:** Analyze the emotional tone conveyed by the text. Do some calculation and Identify the dominant emotions and rate the intensity of the following core emotions on a scale of 1 to 5 (where 1 = Very Low/Absent, 2 = Low, 3 = Moderate, 4 = High, 5 = Very High):
   * **Anger:** [Score 1-5]
   * **Sadness:** [Score 1-5]
   * **Joy/Positive:** [Score 1-5]
   * **Fear/Anxiety:** [Score 1-5]
   * **Surprise:** [Score 1-5]
   Briefly justify the score for the 1-2 most dominant emotions detected.
3. **Structure Mapping:** Visualize the argument's logical flow, outlining how premises connect to support the conclusion.
4. **Fallacy Detection:** Scrutinize the reasoning for potential **Logical Fallacies**. Name any suspected fallacies (e.g., Ad Hominem, Straw Man, Appeal to Emotion, Hasty Generalization). Provide a concise explanation for *why* it might be fallacious in this context.
5. **Critical Evaluation:** Identify assumptions, logical gaps, evidentiary weaknesses, or points particularly vulnerable to **Counter-arguments**. Assess the overall logical strength (e.g., Weak, Moderate, Strong).
6. **Suggest Lines of Inquiry:** Propose specific questions or counter-arguments that could effectively challenge the presented argument.

Maintain an analytical and objective tone, even when reporting emotions. Don't hide emotions or truth even if it's going to hurt the user. Be honest. Base your entire analysis strictly on the user-provided text.

Output Format: Return your analysis in JSON format with these keys:
- claim (string): The main claim/conclusion
- premises (array of strings): Supporting premises/reasons
- emotions (object): With keys Anger, Sadness, Joy, Fear, Surprise, each having a numerical score 1-5
- emotionJustification (string): Brief justification for the dominant emotions
- fallacies (array of objects): Each with 'name' and 'explanation' fields
- structureMap (string): Description of how premises connect to the conclusion
- criticalEvaluation (object): With 'weaknesses' (array), 'assumptions' (array), and 'strength' (string)
- counterArguments (array of strings): Suggested counter-arguments or questions
`;

// Define the expected response structure with optional fields
const aiResponseSchema = z.object({
  claim: z.string(),
  premises: z.array(z.string()),
  emotions: z.object({
    Anger: z.number().min(1).max(5),
    Sadness: z.number().min(1).max(5),
    Joy: z.number().min(1).max(5),
    Fear: z.number().min(1).max(5),
    Surprise: z.number().min(1).max(5)
  }),
  emotionJustification: z.string().optional(),
  fallacies: z.array(z.object({
    name: z.string(),
    explanation: z.string()
  })).optional(),
  structureMap: z.string().optional(),
  criticalEvaluation: z.object({
    weaknesses: z.array(z.string()),
    assumptions: z.array(z.string()),
    strength: z.string()
  }).optional(),
  counterArguments: z.array(z.string()).optional()
});

/**
 * Analyze an argument using the specified AI service
 * 
 * @param text The argument text to analyze
 * @param model The AI model to use (openai, deepseek, or gemini)
 * @returns The analysis result
 */
export async function analyzeArgumentWithAI(
  text: string,
  model: "openai" | "deepseek" | "gemini"
): Promise<AnalysisResult> {
  switch (model) {
    case "openai":
      return await analyzeWithOpenAI(text);
    case "deepseek":
      return await analyzeWithDeepseek(text);
    case "gemini":
      return await analyzeWithGemini(text);
    default:
      throw new Error(`Unsupported AI model: ${model}`);
  }
}

/**
 * Analyze an argument using OpenAI
 */
async function analyzeWithOpenAI(text: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is missing. Please add it to your Replit Secrets.");
  }

  try {
    // Initialize the OpenAI client
    const openai = new OpenAI({ apiKey });

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: LOGOS_SYSTEM_PROMPT },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI returned an empty response");
    }

    // Parse the JSON response
    const parsedData = JSON.parse(content);
    
    // Validate the response structure
    const validatedData = aiResponseSchema.parse(parsedData);
    
    // Add the specific model info
    return {
      ...validatedData,
      modelName: "GPT-4o"
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);

    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from OpenAI. Please try again.");
    }

    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse JSON response from OpenAI. Please try again.");
    }

    throw error;
  }
}

/**
 * Analyze an argument using DeepSeek
 */
async function analyzeWithDeepseek(text: string): Promise<AnalysisResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DeepSeek API key is missing. Please add it to your Replit Secrets.");
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: LOGOS_SYSTEM_PROMPT },
          { role: "user", content: text }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    const content = responseData.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("DeepSeek returned an empty response");
    }

    // Parse the JSON response
    const parsedData = JSON.parse(content);
    
    // Validate the response structure
    const validatedData = aiResponseSchema.parse(parsedData);
    
    // Add the specific model info
    return {
      ...validatedData,
      modelName: "DeepSeek Chat"
    };
  } catch (error) {
    console.error("DeepSeek analysis error:", error);

    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from DeepSeek. Please try again.");
    }

    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse JSON response from DeepSeek. Please try again.");
    }

    throw error;
  }
}

/**
 * Analyze an argument using Google's Gemini AI
 */
async function analyzeWithGemini(text: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please add it to your Replit Secrets.");
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: LOGOS_SYSTEM_PROMPT },
              { text: text }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    const content = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error("Gemini returned an empty response");
    }

    // Extract JSON from the response (handle potential text wrapping the JSON)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from Gemini response");
    }

    // Parse the JSON response
    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    const validatedData = aiResponseSchema.parse(parsedData);
    
    // Add the specific model info
    return {
      ...validatedData,
      modelName: "Gemini Pro"
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);

    if (error instanceof z.ZodError) {
      throw new Error("Invalid response format from Gemini. Please try again.");
    }

    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse JSON response from Gemini. Please try again.");
    }

    throw error;
  }
}
