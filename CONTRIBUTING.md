# Contributing to LSE Study Hub

Thank you for your interest in contributing to LSE Study Hub!

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lse-study-hub.git
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Copy `.env.example` to `.env` and configure
5. Run database migrations:
   ```bash
   pnpm db:push
   ```
6. Start development server:
   ```bash
   pnpm dev
   ```

## Code Style

- TypeScript strict mode enabled
- Use functional components with hooks
- Follow existing code patterns
- Run `pnpm format` before committing
- Run `pnpm check` to verify types

## Commit Messages

Use conventional commits format:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

Example:
```
feat: add export to PDF functionality
fix: resolve annotation persistence issue
docs: update deployment guide
```

## Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push to your fork
6. Open a Pull Request

## Feature Requests

Open an issue with:
- Clear description of the feature
- Use case explanation
- Any relevant mockups or examples

## Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser/OS information

## Questions?

Feel free to open an issue for any questions!

