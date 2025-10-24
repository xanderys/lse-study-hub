# 🚀 LSE Study Hub - Independent Setup Guide

Your study platform is now independent! No Manus Platform required.

## ⚡ Quick Start (No Sign-ups Required!)

### 1. Create a `.env` file

```bash
# Copy the example
cp .env.example .env
```

The `.env` will look like this:

```env
# Database (SQLite for local - works out of the box!)
DATABASE_URL=file:./local.db

# OpenAI API (only needed for AI chat - optional for testing)
OPENAI_API_KEY=

# Local mode (no auth required)
LOCAL_MODE=true

# JWT Secret (auto-generated or use any random string)
JWT_SECRET=your-random-secret
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run the App!

```bash
pnpm dev
```

Open [http://localhost:5000](http://localhost:5000) - **That's it!** 🎉

## 🎯 What Works Out of the Box

With the default `.env`:
- ✅ Upload and view PDFs
- ✅ Annotate with highlights and pen
- ✅ Create modules and organize slides
- ✅ Take questions/notes
- ✅ Everything saves to local database
- ⚠️ AI chat requires OpenAI API key

## 🤖 Adding AI Features (Optional)

### Get OpenAI API Key (5 minutes)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / Log in
3. Go to API Keys
4. Create new secret key
5. Copy and add to `.env`:

```env
OPENAI_API_KEY=sk-proj-...your-key-here
```

**Cost**: ~$0.01-0.05 per conversation (very cheap!)
- Uses `gpt-4o-mini` by default (cheapest)
- Change to `gpt-4o` in `server/_core/llm.ts` for better quality

## ☁️ Production Deployment (When Ready)

### Option 1: Free Tier Setup

**Database: Supabase** (Free: 500MB + Auth + Storage)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Get credentials from Settings → API:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
DATABASE_URL=postgresql://...
```

4. Create storage bucket:
   - Go to Storage → Create bucket
   - Name: `study-hub-files`
   - Make it public

5. Turn off local mode:

```env
LOCAL_MODE=false
```

### Option 2: Current MySQL Setup

If you want to use MySQL (PlanetScale, Railway, etc.):

```env
DATABASE_URL=mysql://user:pass@host:port/database
SUPABASE_URL=  # leave empty
LOCAL_MODE=false
```

Files will save locally in `local_storage/` folder.

## 📁 Project Structure

```
lse-study-hub/
├── local.db              # SQLite database (created automatically)
├── local_storage/        # Uploaded files (local mode)
├── .env                  # Your configuration
└── server/
    ├── auth.ts          # Simple auth (no Manus!)
    ├── storage.ts       # Supabase or local storage
    └── _core/
        └── llm.ts       # Direct OpenAI integration
```

## 🔧 Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Check TypeScript
pnpm check

# Format code
pnpm format
```

## 🎨 Customization

### Change AI Model

Edit `server/_core/llm.ts`:

```typescript
const payload: Record<string, unknown> = {
  model: "gpt-4o-mini", // Change to: "gpt-4o", "gpt-4-turbo", etc.
  messages: messages.map(normalizeMessage),
};
```

### Change Default System Prompt

Edit `server/routers.ts` (line ~188):

```typescript
systemPrompt: "You are a helpful LSE Economics tutor. Help students understand complex concepts."
```

### Enable Dark Mode

Edit `client/src/App.tsx`:

```typescript
<ThemeProvider
  defaultTheme="dark"  // Change from "light"
  switchable           // Allow user to toggle
>
```

## 🌐 Deploy to Vercel

1. Push to GitHub (already done!)
2. Go to [vercel.com](https://vercel.com)
3. Import `xanderys/lse-study-hub`
4. Add environment variables:

```env
OPENAI_API_KEY=your-key
SUPABASE_URL=your-supabase-url (or empty)
SUPABASE_ANON_KEY=your-key (or empty)
SUPABASE_SERVICE_KEY=your-key (or empty)
DATABASE_URL=your-database-url
LOCAL_MODE=false
NODE_ENV=production
```

5. Deploy!

## 📊 Feature Comparison

| Feature | Local (Free) | + OpenAI ($) | + Supabase (Free) |
|---------|--------------|--------------|-------------------|
| PDF Upload | ✅ | ✅ | ✅ |
| Annotations | ✅ | ✅ | ✅ |
| Notes | ✅ | ✅ | ✅ |
| AI Chat | ❌ | ✅ | ✅ |
| Cloud Storage | ❌ | ❌ | ✅ |
| Auth/Users | Local only | Local only | ✅ Multi-user |
| Database | SQLite | SQLite | Postgres |

## 🆘 Troubleshooting

### "OPENAI_API_KEY is not configured"
- AI chat won't work without it
- Other features work fine
- Get key from [platform.openai.com](https://platform.openai.com)

### "Database not available"
- Make sure `DATABASE_URL=file:./local.db` in `.env`
- Delete `local.db` and restart to reset

### Port 5000 already in use
- Change in `vite.config.ts` or `.env`:
  ```env
  PORT=3000
  ```

### PDFs not loading
- Check `local_storage/` folder exists
- Check browser console for errors

## 💰 Cost Breakdown

### Completely Free
- Local development: $0
- SQLite database: $0
- Local file storage: $0

### With AI (Paid)
- OpenAI API: ~$0.01-0.10 per study session
- First $5 credit free for new accounts

### Production (Free Tier)
- Vercel: Free (100GB bandwidth)
- Supabase: Free (500MB database + 1GB storage)
- OpenAI: Pay as you go

**Total for personal use**: ~$1-5/month

## 🎓 You're All Set!

Your LSE Study Hub is now:
- ✅ Independent (no Manus Platform)
- ✅ Works locally out of the box
- ✅ Uses OpenAI directly
- ✅ Free for most features
- ✅ Easy to deploy

**Start studying:** `pnpm dev` 🚀

---

Questions? Check the other docs or open a GitHub issue!

