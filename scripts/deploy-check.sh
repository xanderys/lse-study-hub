#!/bin/bash

# Pre-deployment checklist script

echo "🚀 LSE Study Hub - Deployment Checklist"
echo "======================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check Node version
echo "📦 Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required (found v$node_version)${NC}"
    errors=$((errors + 1))
else
    echo -e "${GREEN}✅ Node.js version OK${NC}"
fi

# Check if pnpm is installed
echo "📦 Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm not installed${NC}"
    errors=$((errors + 1))
else
    echo -e "${GREEN}✅ pnpm installed${NC}"
fi

# Check if .env exists
echo "🔧 Checking environment configuration..."
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    errors=$((errors + 1))
else
    echo -e "${GREEN}✅ .env file exists${NC}"
    
    # Check required env vars
    required_vars=("VITE_APP_ID" "JWT_SECRET" "DATABASE_URL" "BUILT_IN_FORGE_API_KEY" "OWNER_OPEN_ID")
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env || grep -q "^${var}=$" .env || grep -q "^${var}=your-" .env; then
            echo -e "${RED}❌ ${var} not configured${NC}"
            errors=$((errors + 1))
        else
            echo -e "${GREEN}✅ ${var} configured${NC}"
        fi
    done
fi

# Check if dependencies are installed
echo "📚 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found - run 'pnpm install'${NC}"
    warnings=$((warnings + 1))
else
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Check if build works
echo "🏗️  Checking if build succeeds..."
if pnpm build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed - run 'pnpm build' to see errors${NC}"
    errors=$((errors + 1))
fi

# Check if dist directory exists
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ dist/ directory created${NC}"
else
    echo -e "${RED}❌ dist/ directory not found${NC}"
    errors=$((errors + 1))
fi

# Check .gitignore
echo "🔒 Checking .gitignore..."
if [ -f .gitignore ]; then
    if grep -q "^.env$" .gitignore && grep -q "^node_modules" .gitignore; then
        echo -e "${GREEN}✅ .gitignore properly configured${NC}"
    else
        echo -e "${YELLOW}⚠️  .gitignore may be incomplete${NC}"
        warnings=$((warnings + 1))
    fi
else
    echo -e "${RED}❌ .gitignore not found${NC}"
    errors=$((errors + 1))
fi

# Check git status
echo "📝 Checking git status..."
if [ -d .git ]; then
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✅ All changes committed${NC}"
    else
        echo -e "${YELLOW}⚠️  Uncommitted changes found${NC}"
        warnings=$((warnings + 1))
    fi
    
    # Check if remote is set
    if git remote get-url origin > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Git remote configured${NC}"
    else
        echo -e "${YELLOW}⚠️  No git remote configured${NC}"
        warnings=$((warnings + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Not a git repository${NC}"
    warnings=$((warnings + 1))
fi

# Check TypeScript
echo "🔍 Checking TypeScript..."
if pnpm check > /dev/null 2>&1; then
    echo -e "${GREEN}✅ No TypeScript errors${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript errors found - run 'pnpm check'${NC}"
    warnings=$((warnings + 1))
fi

# Summary
echo ""
echo "========================================="
echo "Summary:"
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready to deploy.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Push to GitHub: git push origin main"
    echo "  2. Go to Vercel and import repository"
    echo "  3. Configure environment variables"
    echo "  4. Deploy!"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $warnings warning(s) found${NC}"
    echo "Review warnings above and consider fixing them."
    exit 0
else
    echo -e "${RED}❌ $errors error(s) found${NC}"
    if [ $warnings -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $warnings warning(s) found${NC}"
    fi
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi

