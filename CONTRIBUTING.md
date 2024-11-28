# Contributing to StudyFlow

## Welcome!

We're thrilled that you're interested in contributing to StudyFlow. This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the Repository**
   - Click the "Fork" button at the top right of the GitHub page
   - Clone your forked repository: 
     ```bash
     git clone https://github.com/your-username/studyflow.git
     cd studyflow
     ```

2. **Set Up Development Environment**
   - Ensure you have Node.js (v14+) and npm installed
   - Install dependencies:
     ```bash
     npm install
     ```
   - Copy `.env.example` to `.env` and fill in your Firebase configuration

## Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow existing code style
   - Add tests for new functionality
   - Ensure all tests pass: `npm run test`

3. **Commit Changes**
   - Use descriptive commit messages
   - Follow conventional commits format:
     ```
     type(scope): description
     
     Examples:
     feat(auth): add password reset functionality
     fix(study-logger): resolve session tracking bug
     docs(readme): update installation instructions
     ```

## Code Style

- Use TypeScript
- Follow ESLint and Prettier configurations
- Run `npm run lint` before committing
- Use meaningful variable and function names
- Add comments for complex logic

## Pull Request Process

1. Ensure your code passes all tests
2. Update documentation if needed
3. Open a pull request with:
   - Clear title
   - Description of changes
   - Link to any related issues

## Reporting Bugs

- Use GitHub Issues
- Provide detailed description
- Include steps to reproduce
- Mention your environment (OS, browser, etc.)

## Feature Requests

- Open a GitHub Issue
- Clearly describe the proposed feature
- Explain the use case and potential benefits

## Code of Conduct

- Be respectful and inclusive
- Collaborate constructively
- Help create a positive community

## Questions?

Open an issue or reach out to the maintainers.

**Thank you for contributing!**
