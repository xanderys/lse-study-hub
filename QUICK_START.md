# Quick Start Guide

Get LSE Study Hub running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node -v

# Check if pnpm is installed
pnpm -v

# Install pnpm if needed
npm install -g pnpm
```

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/lse-study-hub.git
cd lse-study-hub

# Install dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Or use the setup script
pnpm setup
```

Edit `.env` with your credentials:

```env
VITE_APP_ID=your-manus-app-id
JWT_SECRET=your-random-secret
DATABASE_URL=mysql://user:pass@host:port/db
OWNER_OPEN_ID=your-open-id
BUILT_IN_FORGE_API_KEY=your-api-key
```

### 3. Database Setup

```bash
# Run migrations
pnpm db:push
```

### 4. Start Development Server

```bash
# Start the app
pnpm dev
```

Open [http://localhost:5000](http://localhost:5000)

## First Steps

1. **Log In**: Click "Get Started" and authenticate
2. **Create Module**: Click "My Modules" → "New Module"
3. **Upload PDF**: Drag and drop a lecture PDF onto the module
4. **Study**: Click the PDF to enter Deep Focus mode
5. **Annotate**: Try the highlight and pen tools
6. **Ask AI**: Use the chat to ask questions about the material

## Common Issues

### Port Already in Use

```bash
# Change port in vite.config.ts
# Or kill the process using port 5000
lsof -ti:5000 | xargs kill
```

### Database Connection Failed

- Verify `DATABASE_URL` format
- Check database is running
- Test connection manually

### API Key Invalid

- Check Manus Platform dashboard
- Verify key has correct permissions
- Regenerate if needed

## Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm check

# Format code
pnpm format

# Run tests
pnpm test
```

## Architecture

```
┌─────────────────┐
│   React App     │  ← Frontend (Vite + React)
│   (Port 5000)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Express Server │  ← Backend (tRPC + Express)
│   (Same Port)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  MySQL Database │  ← Data Storage
└─────────────────┘
```

## Project Structure

```
lse-study-hub/
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   └── components/  # UI components
├── server/          # Express backend
│   ├── routers.ts   # API routes
│   └── db.ts        # Database operations
└── drizzle/         # Database schema
```

## What's Next?

- 📖 Read the full [README.md](README.md)
- 🚀 Deploy to Vercel: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🔧 Customize AI prompts in Deep Focus
- 📝 Organize your study materials
- 🎨 Customize the UI theme

## Getting Help

- Check [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for hosting
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Open an issue on GitHub for bugs

---

**Happy Studying! 🎓**

