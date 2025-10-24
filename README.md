# LSE Study Hub - Independent Edition 🎓

A completely independent study platform for LSE Economics students. Manage lecture slides, annotate PDFs, take notes, and chat with AI - all without requiring any third-party platforms!

## ⚡ Quick Start (3 Steps!)

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env file (or use the default - it just works!)
echo 'DATABASE_URL=file:./local.db
LOCAL_MODE=true
OPENAI_API_KEY=' > .env

# 3. Start the app!
pnpm dev
```

**That's it!** Open [http://localhost:5000](http://localhost:5000) 🚀

Everything works locally - no signups, no API keys needed (except AI chat).

## 🎯 What Works Out of the Box

With zero configuration:
- ✅ Upload and view PDFs
- ✅ Annotate with highlights and pen tools
- ✅ Create modules and organize slides
- ✅ Take notes and questions
- ✅ Everything saves to local SQLite database
- ✅ Files stored in `local_storage/` folder

**Only need API key for:** AI chat feature (~$0.01-0.10 per conversation)

## 🚀 Features

### 📚 Module Management
- Create and organize modules by course
- Upload lecture slides (PDFs) via drag-and-drop
- Cloud storage with automatic fallback to local files

### 📝 Deep Focus Mode
- **PDF Viewer (2/3 screen)**: 
  - View slides with zoom and navigation
  - Highlight tool with text detection
  - Pen tool for freehand drawing
  - **Persistent annotations** - saved automatically
  - Drag-and-drop PDF import

- **Study Sidebar (1/3 screen)**:
  - **Questions & Notes**: Block-based note-taking
  - **AI Study Assistant**: GPT-powered chat with PDF context (RAG)
  - Customizable system prompts

### 🤖 AI Features (Optional)
- Direct OpenAI API integration
- Uses `gpt-4o-mini` (cost-effective) by default
- Context-aware: AI reads your PDFs
- Customizable behavior

## 💰 Cost Breakdown

### Completely Free
- Local development: **$0**
- SQLite database: **$0**
- File storage (local): **$0**
- All core features: **$0**

### Optional AI Chat
- OpenAI API: **~$0.01-0.10 per study session**
- First $5 free credit for new accounts
- Change to `gpt-4o` for better quality (slightly more expensive)

### Production Deployment (Optional)
- Vercel hosting: **Free** (100GB bandwidth)
- Supabase (database + storage): **Free** (500MB + 1GB)
- Total: **~$1-5/month** for personal use with AI

## 🤖 Adding AI Chat (Optional)

1. Get OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Add to your `.env`:

```env
OPENAI_API_KEY=sk-proj-...your-key
```

That's it! AI chat will work instantly.

## ☁️ Production Deployment

### Option 1: Vercel + Supabase (Recommended - All Free Tier)

**Setup Supabase** (5 minutes):
1. Sign up at [supabase.com](https://supabase.com)
2. Create project → Get credentials
3. Create storage bucket: `study-hub-files` (make public)

**Deploy to Vercel** (3 minutes):
1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add environment variables:

```env
OPENAI_API_KEY=your-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
DATABASE_URL=postgresql://... (from Supabase)
LOCAL_MODE=false
NODE_ENV=production
```

4. Deploy!

### Option 2: Keep It Simple (MySQL + Local Files)

```env
DATABASE_URL=mysql://user:pass@host/db
OPENAI_API_KEY=your-key
LOCAL_MODE=false
```

Files save to `local_storage/` on your server.

## 📖 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Express, tRPC (type-safe APIs)
- **Database**: SQLite (local) or MySQL/Postgres (production)
- **Storage**: Local filesystem or Supabase Storage
- **AI**: Direct OpenAI API integration
- **PDF**: react-pdf, pdf-parse
- **UI**: Radix UI, shadcn/ui components

## 📁 Project Structure

```
lse-study-hub/
├── local.db              # SQLite database (auto-created)
├── local_storage/        # Uploaded files (local mode)
├── .env                  # Your configuration
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/        # Main pages
│   │   └── components/   # UI components
├── server/               # Express backend
│   ├── auth.ts          # Simple local auth
│   ├── storage.ts       # File storage (local/Supabase)
│   ├── db.ts            # Database operations
│   └── _core/
│       └── llm.ts       # OpenAI integration
└── drizzle/             # Database schema
```

## 🛠 Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm check

# Format code
pnpm format

# Database migrations
pnpm db:push
```

## 🎨 Customization

### Change AI Model

Edit `server/_core/llm.ts`:

```typescript
model: "gpt-4o-mini"  // Change to: "gpt-4o", "gpt-4-turbo"
```

### Change Theme

Edit `client/src/App.tsx`:

```typescript
<ThemeProvider
  defaultTheme="dark"  // "light" or "dark"
  switchable           // Allow user toggle
>
```

### Customize AI Prompt

Edit `server/routers.ts` (line ~188):

```typescript
systemPrompt: "You are a helpful LSE Economics tutor..."
```

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute

## 🆘 Troubleshooting

### "OPENAI_API_KEY is not configured"
- AI chat won't work without it
- All other features work fine
- Get key from [platform.openai.com](https://platform.openai.com)

### Database not connecting
- Check `DATABASE_URL` in `.env`
- For local: `DATABASE_URL=file:./local.db`
- Delete `local.db` to reset database

### Port 5000 in use
Add to `.env`:
```env
PORT=3000
```

### PDFs not loading
- Check `local_storage/` folder exists
- Check browser console for errors
- Try re-uploading the PDF

## 🎓 Usage Guide

### 1. Create a Module
- Click "My Modules" → "New Module"
- Enter name (e.g., "Microeconomics")
- Add code (e.g., "EC201") and description

### 2. Upload Slides
- **Drag-and-drop** PDF onto module card, or
- Click "Upload Slide" → Select PDF

### 3. Study in Deep Focus
- Click any slide to enter Deep Focus mode
- Use highlight tool to mark important text
- Use pen tool for freehand notes
- Add questions in the right sidebar
- Chat with AI about the material

## 🌟 Why This Version?

**Independent**: No third-party platform required
**Free**: Core features cost nothing  
**Privacy**: Your data stays with you
**Flexible**: Choose your own services (OpenAI, Supabase, etc.)
**Simple**: Works locally with zero configuration
**Open**: Full source code, modify as you like

## 🚀 Roadmap

Potential future features:
- [ ] Export annotations as PDF
- [ ] Search across all slides
- [ ] Study analytics dashboard
- [ ] Pomodoro timer integration
- [ ] Flashcard generation
- [ ] Collaborative study rooms
- [ ] Mobile app version
- [ ] Offline mode (PWA)

## 📄 License

MIT License - Use freely for your studies!

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/xanderys/lse-study-hub/issues)
- **Docs**: Check the guides in this repo
- **Email**: Open an issue for support

---

**Made with ❤️ for LSE Economics students**

**Happy Studying! 📚✨**
