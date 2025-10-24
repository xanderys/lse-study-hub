#!/bin/bash

# Setup script for LSE Study Hub environment

echo "🎓 LSE Study Hub - Environment Setup"
echo "===================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Copy .env.example
if [ ! -f .env.example ]; then
    echo "❌ .env.example not found!"
    exit 1
fi

cp .env.example .env
echo "✅ Created .env file from template"
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
echo "🔐 Generated JWT_SECRET"

# Update .env file with generated secret
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|JWT_SECRET=your-random-jwt-secret-here|JWT_SECRET=$JWT_SECRET|g" .env
else
    # Linux
    sed -i "s|JWT_SECRET=your-random-jwt-secret-here|JWT_SECRET=$JWT_SECRET|g" .env
fi

echo ""
echo "📝 Please update the following in your .env file:"
echo ""
echo "Required:"
echo "  - VITE_APP_ID (from Manus Platform)"
echo "  - DATABASE_URL (your MySQL connection string)"
echo "  - OWNER_OPEN_ID (from Manus Platform)"
echo "  - BUILT_IN_FORGE_API_KEY (from Manus Platform)"
echo ""
echo "Optional (defaults provided):"
echo "  - OAUTH_SERVER_URL (default: https://auth.manus.im)"
echo "  - BUILT_IN_FORGE_API_URL (default: https://forge.manus.im)"
echo ""
echo "✅ Environment setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your credentials"
echo "  2. Run: pnpm install"
echo "  3. Run: pnpm db:push"
echo "  4. Run: pnpm dev"
echo ""

