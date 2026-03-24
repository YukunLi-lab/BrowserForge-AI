# Contributing to BrowserForge AI

Thank you for your interest in contributing to BrowserForge AI! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a welcoming and respectful environment for all contributors and users.

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- pnpm (recommended)
- Git

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/browserforge-ai.git
cd browserforge-ai
```

3. **Add upstream remote**
```bash
git remote add upstream https://github.com/original-owner/browserforge-ai.git
```

4. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

5. **Set up development environment**
```bash
# Copy environment file
cp .env.example .env

# Install dependencies
pnpm install

# Start services
docker-compose up -d
```

## Development Workflow

### Running the Application

```bash
# Start all services
docker-compose up -d

# Or run individually:
cd app && pnpm dev    # Frontend on :3000
cd api && uvicorn main:app --reload  # Backend on :8000
```

### Code Style

We use automated tooling to maintain consistent code style:

```bash
# Format code (Prettier)
pnpm format

# Lint (ESLint + Ruff)
pnpm lint

# Type check
pnpm typecheck
```

### Testing

```bash
# Run all tests
pnpm test

# Run frontend tests
cd app && pnpm test

# Run backend tests
cd api && pytest

# E2E tests
pnpm test:e2e
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new agent type for code review
fix: resolve sandbox timeout issue
docs: update README with deployment instructions
style: format code with prettier
refactor: extract agent logic into separate module
test: add unit tests for researcher agent
chore: update dependencies
```

## Project Structure

### Frontend (`/app`)

```
app/src/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Authentication pages
│   ├── (dashboard)/  # Dashboard pages
│   └── editor/       # Code editor page
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utilities and API client
├── stores/          # Zustand state stores
└── types/           # TypeScript definitions
```

### Backend (`/api`)

```
api/app/
├── agents/          # AI agent implementations
│   ├── researcher/  # Web research agent
│   ├── coder/       # Code generation agent
│   ├── tester/      # Testing agent
│   └── deployer/    # Deployment agent
├── api/routes/      # API endpoints
├── core/            # Core utilities
│   ├── config.py    # Settings
│   ├── database.py  # Database connection
│   └── security.py  # Auth utilities
├── models/          # SQLAlchemy models
├── schemas/         # Pydantic schemas
└── services/        # Business logic
```

## Making Changes

1. **Keep changes focused** - One feature or fix per PR
2. **Write tests** - Include relevant tests with your changes
3. **Update documentation** - Update docs if needed
4. **Follow the code style** - Run linters before committing

## Pull Request Process

1. **Update your branch** - Rebase on latest `main`
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** - Use the PR template

4. **Address feedback** - Make requested changes

## Types of Contributions

### 🐛 Bug Fixes
- Include a clear description of the bug
- Add tests to prevent regression
- Reference any related issues

### ✨ New Features
- Discuss major changes in an Issue first
- Provide clear implementation plan
- Include tests and documentation

### 📖 Documentation
- Fix typos and improve clarity
- Add examples where helpful
- Keep docs up-to-date with code

### 🎨 UI/UX
- Maintain design consistency
- Test on multiple screen sizes
- Consider accessibility

## Reporting Issues

When reporting issues, please include:

- **Browser and OS** - e.g., Chrome 120 on macOS
- **Steps to reproduce** - Clear reproduction steps
- **Expected vs Actual** - What you expected vs what happened
- **Screenshots** - If applicable
- **Logs** - Any error messages or stack traces

## Questions?

- 💬 Join our [Discord](https://discord.gg/browserforge)
- 💭 Start a [Discussion](https://github.com/yourusername/browserforge-ai/discussions)
- 🐛 Check [Existing Issues](https://github.com/yourusername/browserforge-ai/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
