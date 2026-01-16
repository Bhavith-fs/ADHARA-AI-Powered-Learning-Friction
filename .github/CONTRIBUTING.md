# Branch Protection and Workflow Guide

## Branch Structure

| Branch | Purpose | Owner |
|--------|---------|-------|
| `main` | Production-ready code, frontend/core | Aravind |
| `Jithu` | AI/LLM development | Jithu |

## Workflow

### For Feature Development

1. **Create a feature branch** from your working branch:
   ```bash
   git checkout main  # or Jithu
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "feat: description of your change"
   ```

3. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

### Merging Jithu → Main

When AI features are ready to merge into main:

1. Jithu creates PR from `Jithu` → `main`
2. CI runs automatically (build, lint checks)
3. Review and resolve any conflicts
4. Merge after approval

### Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests

## GitHub Settings (Manual Setup)

### Enable Branch Protection (Recommended)

Go to: **Settings → Branches → Add rule**

For `main` branch:
- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - Select: `Build Client`, `Build Check`
- [x] Require branches to be up to date before merging

This ensures no direct pushes to main without passing CI.

## CI/CD Pipelines

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Push to main, PRs | Build and lint |
| `pr-check.yml` | All PRs | Validate PR, check conflicts |
