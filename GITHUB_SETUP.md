# GitHub Setup Guide

This guide will help you publish LSE Study Hub to your GitHub account.

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to [github.com](https://github.com)
2. Click the "+" icon (top right) → "New repository"
3. Fill in the details:
   - **Repository name**: `lse-study-hub`
   - **Description**: "Study platform for LSE Economics - manage slides, annotate PDFs, and chat with AI"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create lse-study-hub --public --source=. --remote=origin --push
```

## Step 2: Initialize Git (if not already done)

Check if git is initialized:

```bash
cd /Users/xanderlim/lse-study-hub
git status
```

If you see "not a git repository", initialize it:

```bash
git init
git branch -M main
```

## Step 3: Verify .gitignore

Make sure these are in your `.gitignore`:

```
node_modules/
dist/
.env
.env.local
*.db
local_storage/
.DS_Store
```

## Step 4: Commit Your Code

### First Time Setup

```bash
# Add all files
git add .

# Commit with a message
git commit -m "Initial commit: LSE Study Hub v1.0.0"
```

### Verify What Will Be Committed

Before committing, check what's being tracked:

```bash
# See what will be committed
git status

# Make sure .env is NOT in the list
# If you see .env, add it to .gitignore and run:
git rm --cached .env
```

## Step 5: Connect to GitHub

Copy the commands from your new GitHub repository page, or use:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/lse-study-hub.git

# Or if you use SSH:
git remote add origin git@github.com:YOUR_USERNAME/lse-study-hub.git

# Verify the remote
git remote -v
```

## Step 6: Push to GitHub

```bash
# Push your code
git push -u origin main
```

If you get an authentication error:
- **HTTPS**: GitHub will prompt for credentials (use personal access token)
- **SSH**: Make sure your SSH key is added to GitHub

### Creating a Personal Access Token (if needed)

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token and use it as your password when pushing

## Step 7: Verify on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/lse-study-hub`
2. You should see all your files
3. **IMPORTANT**: Verify `.env` is NOT visible (it should be in .gitignore)

## Step 8: Create Repository Secrets (for Actions)

If you plan to use GitHub Actions:

1. Go to your repository on GitHub
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Add secrets for:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `BUILT_IN_FORGE_API_KEY`
   - etc.

## Step 9: Add Topics and Description

Make your repository discoverable:

1. Go to your repository
2. Click the gear icon next to "About"
3. Add topics:
   - `study-app`
   - `lse`
   - `economics`
   - `pdf-annotation`
   - `ai-assistant`
   - `typescript`
   - `react`
   - `education`
4. Add website URL (after deploying to Vercel)

## Step 10: Create a Beautiful README Badge

Add these badges to your README:

```markdown
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19-blue)
```

## Common Issues

### Issue: "fatal: remote origin already exists"

```bash
# Remove existing remote
git remote remove origin

# Add your new remote
git remote add origin https://github.com/YOUR_USERNAME/lse-study-hub.git
```

### Issue: ".env file is tracked by git"

```bash
# Remove from git (but keep local file)
git rm --cached .env

# Add to .gitignore if not already there
echo ".env" >> .gitignore

# Commit the change
git add .gitignore
git commit -m "Remove .env from tracking"
git push
```

### Issue: "Large files causing push to fail"

```bash
# Check file sizes
find . -type f -size +50M

# If you find large files (PDFs, videos), add to .gitignore:
echo "path/to/large/file" >> .gitignore
git rm --cached path/to/large/file
git commit -m "Remove large files"
```

### Issue: "Authentication failed"

For HTTPS:
```bash
# Use a personal access token instead of password
# Create one at: github.com/settings/tokens
```

For SSH:
```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: github.com/settings/keys
cat ~/.ssh/id_ed25519.pub
```

## Git Workflow for Future Updates

### Making Changes

```bash
# 1. Make your changes to code
# 2. See what changed
git status
git diff

# 3. Stage changes
git add .

# 4. Commit
git commit -m "feat: add export feature"

# 5. Push
git push
```

### Creating Releases

```bash
# Tag a release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create release on GitHub
# Go to: github.com/YOUR_USERNAME/lse-study-hub/releases
# Click "Create a new release"
```

## Best Practices

1. **Commit Often**: Small, focused commits
2. **Clear Messages**: Use conventional commits (feat:, fix:, docs:)
3. **Never Commit Secrets**: Check .gitignore before committing
4. **Test Before Pushing**: Run `pnpm check` and `pnpm build`
5. **Write Good READMEs**: Keep documentation up to date
6. **Use Branches**: For major features, create feature branches
7. **Review Before Push**: Use `git diff` to review changes

## Next Steps

After publishing to GitHub:

1. ✅ Repository is live
2. 📱 Add social image (Settings → General → Social preview)
3. 🏷️ Add topics for discoverability
4. 🚀 Deploy to Vercel (see DEPLOYMENT.md)
5. 🔗 Update README with live demo link
6. ⭐ Star your own repo!

## Security Checklist

Before pushing:

- [ ] `.env` is in `.gitignore`
- [ ] No API keys in code
- [ ] No database passwords in code
- [ ] `node_modules/` in `.gitignore`
- [ ] `dist/` in `.gitignore`
- [ ] `.DS_Store` in `.gitignore`
- [ ] Local database files ignored

## Collaboration

If others want to contribute:

1. They fork your repository
2. Clone their fork
3. Make changes
4. Push to their fork
5. Create Pull Request to your repository

See `CONTRIBUTING.md` for detailed contribution guidelines.

---

**Ready to push? Let's go! 🚀**

```bash
git add .
git commit -m "feat: LSE Study Hub v1.0.0"
git push -u origin main
```

