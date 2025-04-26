# Vercel Deployment Guide for Critique AI

This guide will help you deploy the Critique AI application to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. The required API keys:
   - OPENROUTER_API_KEY (required for basic functionality)
   - OPENAI_API_KEY (optional, for direct GPT-4o access)
   - DEEPSEEK_API_KEY (optional, for direct DeepSeek Chat access)
   - GEMINI_API_KEY (optional, for direct Gemini 2.5 Pro access)

## Deployment Steps

### 1. Fork or Clone the Repository

Make sure you have a copy of the repository in your GitHub account.

### 2. Connect to Vercel

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

### 3. Configure Environment Variables

Add the following environment variable in the Vercel project settings:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Optionally, add these if you want to use the premium models directly:

```
OPENAI_API_KEY=your_openai_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Troubleshooting

### Rate Limiting

The application implements rate limiting (5 requests per minute). In a serverless environment, this is implemented on a per-instance basis, which means the actual rate limit might be less restrictive than intended if your application scales to multiple instances.



### API Keys

Verify that all required API keys are correctly set in the environment variables.

## Monitoring and Logs

After deployment, you can monitor your application's performance and view logs in the Vercel dashboard.

## Local Development

For local development, you can still use the original development command:

```bash
npm run dev
```

This will start the Express server locally, which provides a development environment that closely matches the production environment.
