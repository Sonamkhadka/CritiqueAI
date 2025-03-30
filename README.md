# Logos Argument Analyzer

Logos Argument Analyzer is a web application that enables users to analyze arguments using powerful AI models. It deconstructs arguments into claims and premises, analyzes emotional tones, and presents the results in a well-formatted report with visualizations.

## Features

- Input text containing an argument
- Select a preferred AI model (OpenAI, DeepSeek, or Gemini)
- Trigger analysis by external AI models using the "Logos" persona
- View AI-generated analysis with visualizations
- Save, share, download, or print the generated report
- View history of previous analyses

## Setup and Installation

### API Keys Setup (Required)

This application requires API keys for the AI models you wish to use. You need to set these up as Replit Secrets (Environment Variables):

1. **OPENAI_API_KEY**: Get from [OpenAI](https://platform.openai.com/account/api-keys)
2. **DEEPSEEK_API_KEY**: Get from [DeepSeek](https://platform.deepseek.com)
3. **GEMINI_API_KEY**: Get from [Google AI Studio](https://ai.google.dev/)

To add these to your Replit Secrets:

1. Open your Replit project
2. Click on the "Secrets" tab in the Tools panel
3. Add each API key with the exact variable names shown above

### Running the Application

1. Once the API keys are set up, the application should be ready to use
2. Click the "Run" button in Replit
3. The application will start on port 5000

## How to Use

1. Enter your argument text in the input area
2. Select which AI model you want to use (OpenAI, DeepSeek, or Gemini)
3. Click "Analyze Argument"
4. View the structured analysis, including:
   - The main claim identified in your argument
   - Supporting premises
   - Emotional tone analysis with visualization
5. Use the action buttons to share, download, or print your results
6. Previous analyses are saved automatically and can be accessed from the "Recent Analyses" section

## Important Notes

- Using these AI services may incur costs based on your usage. Check each provider's pricing details.
- The application securely handles API keys through environment variables and never exposes them to the client.
- Large or complex arguments may take longer to analyze.

## Technical Details

### Technology Stack

- Frontend: React, Tailwind CSS, Chart.js
- Backend: Express.js
- External APIs: OpenAI, DeepSeek, Google Gemini

### AI Analysis Instructions

The application sends the following instructions to the selected AI model:

