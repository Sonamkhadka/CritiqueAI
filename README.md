# Logos Argument Analyzer

A web tool that analyzes the logical structure and emotional tone of argumentative text using state-of-the-art AI models (OpenAI GPT-4o, DeepSeek Chat, and Google Gemini 2.5 Pro).

## Project Objective

Logos aims to democratize access to advanced argument analysis techniques through AI. By breaking down the components of logical argumentation (claims, premises, fallacies) and providing insights on emotional tone and critical evaluation, Logos helps users:

- Better understand the structure and quality of arguments
- Identify logical fallacies and weaknesses in reasoning
- Discover unstated assumptions and counterarguments
- Improve critical thinking skills through detailed analysis

The project strives to make critical reasoning tools accessible to students, educators, writers, and anyone engaged in persuasive communication.

![Logos - Your AI-Powered Argument Analyzer](https://i.imgur.com/logos-screenshot.png)

## Core Features

- **Multiple AI Models**: Choose between OpenAI (GPT-4o), DeepSeek (DeepSeek Chat), and Google (Gemini 2.5 Pro) to analyze your arguments
- **Claim & Premises Extraction**: Automatically identify the main claim and supporting premises
- **Fallacy Detection**: Identify logical fallacies in arguments
- **Emotional Analysis**: Score emotional content across five dimensions (Anger, Sadness, Joy, Fear, Surprise)
- **Critical Evaluation**: Assess strengths, weaknesses, and unstated assumptions
- **Local Storage History**: Save your analysis results for future reference
- **Clean, Modern UI**: Intuitive interface with responsive design

## How It Works

1. Enter your argument text in the input area
2. Select your preferred AI model (OpenAI GPT-4o, DeepSeek Chat, or Google Gemini 2.5 Pro)
3. Click "Analyze" to process your text
4. View the comprehensive analysis results with logical structure, emotional tone, fallacies, and counter-arguments

Behind the scenes:
- The frontend UI sends the text to the backend
- The backend forwards it to the selected external AI API with "Logos" persona instructions
- The AI returns a structured JSON response
- The application parses and displays the results

Expected JSON structure:
```json
{
  "claim": "Main argument claim",
  "premises": ["Supporting premise 1", "Supporting premise 2"],
  "emotions": {
    "Anger": 0.2,
    "Sadness": 0.1,
    "Joy": 0.5,
    "Fear": 0.3,
    "Surprise": 0.4
  },
  "fallacies": [
    {
      "name": "Appeal to Authority",
      "explanation": "Relying on an authority figure's opinion..."
    }
  ],
  "criticalEvaluation": {
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "assumptions": ["Assumption 1", "Assumption 2"],
    "strength": "Overall argument strength assessment"
  },
  "counterArguments": ["Counter argument 1", "Counter argument 2"]
}
```

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI + Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Node.js with Express
- **Data Visualization**: Recharts
- **State Management**: React Hooks
- **AI Integration**: 
  - OpenAI API (GPT-4o - latest model as of March 2025)
  - DeepSeek API (DeepSeek Chat)
  - GoogleGenAI (@google/genai - using gemini-2.5-pro-exp-03-25)
- **Security**: Custom rate limiting middleware (5 requests per minute)
- **Package Manager**: npm

## Getting Started / Installation

### Prerequisites

- Node.js (v18.0.0 or later)
- npm or yarn
- Git

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/logos-project/logos-argument-analyzer.git
   cd logos-argument-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **API Key Configuration (CRITICAL)**:
   
   You **MUST** obtain your own API keys for the AI services:
   
   - [OpenAI API Key](https://platform.openai.com/api-keys)
   - [DeepSeek API Key](https://platform.deepseek.com/)
   - [Google Gemini API Key](https://ai.google.dev/)
   
   Configure them as environment variables (or Replit Secrets if deploying on Replit):
   ```
   OPENAI_API_KEY=your_openai_key_here
   DEEPSEEK_API_KEY=your_deepseek_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```
   
   **Note**: The application will not function without these API keys.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Enter the text you want to analyze in the input field
2. Select which AI model you want to use (OpenAI GPT-4o, DeepSeek Chat, or Google Gemini 2.5 Pro)
3. Click the "Analyze" button
4. View the comprehensive analysis of your argument with logical structure, emotional analysis, and critical evaluation
5. Save or revisit previous analyses from the history panel
6. Note: Rate limiting is in place (5 requests per minute) to prevent API abuse

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please check out our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get started.

## Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing to the project.

## Acknowledgments

- Special thanks to all contributors who have helped shape this project
- Inspired by principles of formal logic and critical thinking
- This project leverages the following AI technologies:
  - OpenAI's GPT-4o model for advanced natural language processing
  - DeepSeek's AI technologies for comprehensive argument analysis
  - Google's Gemini 2.5 Pro model for intelligent text processing
- Built with [Shadcn UI](https://ui.shadcn.com/) components and [Tailwind CSS](https://tailwindcss.com/)
- Open source and available for educational and research purposes