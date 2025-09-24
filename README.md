# Critique AI

A web tool that analyzes the logical structure and emotional tone of argumentative text using state-of-the-art AI models via OpenRouter (free), with options for OpenAI GPT-4o, DeepSeek Chat, and Google Gemini 2.5 Pro when you provide your own API keys.

## Project Objective

Critique AI aims to democratize access to advanced argument analysis techniques through AI. By breaking down the components of logical argumentation (claims, premises, fallacies) and providing insights on emotional tone and critical evaluation, Critique helps users:

- Better understand the structure and quality of arguments
- Identify logical fallacies and weaknesses in reasoning
- Discover unstated assumptions and counterarguments
- Improve critical thinking skills through detailed analysis

The project strives to make critical reasoning tools accessible to students, educators, writers, and anyone engaged in persuasive communication.

![Critique AI - Your AI-Powered Argument Analyzer](https://i.imgur.com/logos-screenshot.png)

## Core Features

- **Free Access via OpenRouter**: Access free models including Grok, DeepSeek, Google Gemini, and more through OpenRouter
- **Popular Example Arguments**: Quick-start with pre-loaded controversial topics like climate change, social media, economics, and education
- **Configurable Models**: Easily customize available AI models through environment variables
- **Premium AI Models**: For those who want to use their own API keys, choose between OpenAI (GPT-4o), DeepSeek (DeepSeek Chat), and Google (Gemini 2.5 Pro)
- **Claim & Premises Extraction**: Automatically identify the main claim and supporting premises
- **Fallacy Detection**: Identify logical fallacies in arguments with detailed explanations
- **Emotional Analysis**: Score emotional content across five dimensions (Anger, Sadness, Joy, Fear, Surprise)
- **Critical Evaluation**: Assess strengths, weaknesses, and unstated assumptions
- **Neobrutalism Design**: Bold, aggressive UI that matches the app's confrontational approach
- **Rate Limiting**: 5 requests per minute to prevent API abuse
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## How It Works

1. **Choose an Example or Enter Your Own**: Select from popular debate topics (climate change denial, social media debates, economic arguments, etc.) or write your own argument
2. **Select AI Model**: Choose from configurable OpenRouter free models or use your own API keys for premium services
3. **Analyze**: Click the bold "DESTROY THIS ARGUMENT" button to process your text
4. **Review Results**: View comprehensive analysis with logical structure, emotional tone, fallacies, and counter-arguments

Behind the scenes:
- The frontend UI sends the text to the backend
- The backend forwards it to the selected AI API with "Logos" persona instructions
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
  - OpenRouter API (default, providing free access to various AI models)
  - OpenAI API (GPT-4o - latest model as of March 2025, requires API key)
  - DeepSeek API (DeepSeek Chat, requires API key)
  - GoogleGenAI (@google/genai - using gemini-2.5-pro-exp-03-25, requires API key)
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

3. **API Key Configuration**:

   The application comes with OpenRouter integration for free access to AI models.

   If you want to use premium AI services directly, clone this repository and add the following API keys to your `.env` file:

   - [OpenRouter API Key](https://openrouter.ai/) (included by default)
   - [OpenAI API Key](https://platform.openai.com/api-keys) (optional, for direct OpenAI access)
   - [DeepSeek API Key](https://platform.deepseek.com/) (optional, for direct DeepSeek access)
   - [Google Gemini API Key](https://ai.google.dev/) (optional, for direct Google Gemini access)

   Configure them in your `.env` file:
   ```
   # Required for free model access
   OPENROUTER_API_KEY=your_openrouter_key_here

   # Optional for premium direct access
   OPENAI_API_KEY=your_openai_key_here
   DEEPSEEK_API_KEY=your_deepseek_key_here
   GEMINI_API_KEY=your_gemini_key_here

   # Model Configuration (customize available models)
   DEFAULT_AI_MODEL=openrouter
   DEFAULT_OPENROUTER_MODEL=x-ai/grok-4-fast:free
   OPENROUTER_MODELS=x-ai/grok-4-fast:free,deepseek/deepseek-chat-v3.1:free,openai/gpt-4o-mini
   ```

   **Note**: The OPENROUTER_API_KEY is required for free model access. You can customize which models appear in the dropdown by modifying the OPENROUTER_MODELS environment variable.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Deployment

### Vercel Deployment

This application is configured for deployment on Vercel. For detailed instructions, see the [Vercel Deployment Guide](VERCEL_DEPLOYMENT.md).

Quick steps:
1. Fork or clone this repository to your GitHub account
2. Connect your repository to Vercel
3. Configure the environment variables (OPENROUTER_API_KEY and optionally other API keys)
4. Deploy!

## Usage

1. **Quick Start with Examples**: Select from pre-loaded controversial arguments (climate change denial, social media debates, economic policy, etc.) to see the analyzer in action
2. **Or Enter Your Own**: Write your own argument in the text area
3. **Choose AI Model**:
   - **OpenRouter** (free, default): Access models like Grok 4 Fast, DeepSeek, Google Gemini, and more
   - **Premium Services** (requires your own API key): Direct access to OpenAI GPT-4o, DeepSeek Chat, or Google Gemini
4. **Analyze**: Click "💥 DESTROY THIS ARGUMENT" to process your text
5. **Review Results**: Get comprehensive analysis including:
   - Logical structure (claims and premises)
   - Emotional tone analysis with numerical scores
   - Identified logical fallacies with explanations
   - Critical evaluation of weaknesses and assumptions
   - Suggested counter-arguments
6. **Rate Limiting**: 5 requests per minute to prevent API abuse and ensure fair access

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
  - [OpenRouter](https://openrouter.ai/) for free access to various AI models
  - OpenAI's GPT-4o model for advanced natural language processing
  - DeepSeek's AI technologies for comprehensive argument analysis
  - Google's Gemini 2.5 Pro model for intelligent text processing
- Built with [Shadcn UI](https://ui.shadcn.com/) components and [Tailwind CSS](https://tailwindcss.com/)
- Open source and available for educational and research purposes