# Contributing to Logos Argument Analyzer

Thank you for considering contributing to the Logos Argument Analyzer! This document outlines the process for contributing to this AI-powered argument analysis tool.

## Supported AI Models

The application currently supports three AI models:

1. **OpenAI GPT-4o**: The latest model from OpenAI with enhanced reasoning capabilities
2. **DeepSeek Chat**: A powerful model from DeepSeek
3. **Google Gemini 2.5 Pro**: Google's advanced Gemini model (gemini-2.5-pro-exp-03-25)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

## How to Report Bugs

We track bugs using GitHub Issues. If you've found a bug, please create an issue and provide the following information:

1. A clear and descriptive title
2. Steps to reproduce the bug
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment information:
   - Browser and version
   - Operating system
   - Device type (desktop/mobile)
7. Any additional context that might help diagnose the issue

### Security Vulnerabilities

If you discover a security vulnerability, please do NOT open a public issue. Instead, submit a confidential security report through the repository's security advisories.

## How to Suggest Features

We welcome feature suggestions! To suggest a feature:

1. Check if the feature has already been suggested or discussed in the Issues tab
2. Create a new issue with the label "enhancement"
3. Clearly describe the feature and why it would be valuable
4. If possible, outline how the feature might be implemented
5. Consider including mockups or examples to illustrate your idea

## Pull Request Process

1. Fork the repository
2. Create a new branch from `main` with a descriptive name: `feature/your-feature-name` or `fix/issue-you-are-fixing`
3. Make your changes, following our coding standards
4. Add or update tests as necessary
5. Update documentation to reflect your changes
6. Ensure your code passes all tests and linting rules
7. Submit a pull request to the `main` branch with a clear description of your changes

### Pull Request Guidelines

- Keep your changes focused on a single issue/feature
- Write descriptive commit messages in the present tense
- Reference issues or PRs where appropriate
- Update documentation accordingly
- Add tests for new features
- Ensure your code follows the project's coding standards

## Development Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies with `npm install`
4. **Important**: Setup API keys as described in the [README](README.md)
   - OPENAI_API_KEY (for GPT-4o access)
   - DEEPSEEK_API_KEY (for DeepSeek Chat access)
   - GEMINI_API_KEY (for Gemini 2.5 Pro access)
5. Run the development server with `npm run dev`
6. Note: The application implements rate limiting (5 requests per minute)

## Coding Standards

- Follow the existing code style and patterns
- Write clear, commented code
- Avoid unnecessary dependencies
- Write tests for your code when applicable
- Document your code when necessary

## License

By contributing to Logos Argument Analyzer, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

Thank you for contributing to make Logos Argument Analyzer better!