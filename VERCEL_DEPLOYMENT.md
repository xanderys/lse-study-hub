# 🚀 Vercel Deployment Guide - LSE Study Hub

## Prerequisites

- ✅ GitHub account with repository access
- ✅ Vercel account (free tier works!)
- ✅ OpenAI API key
- ✅ Supabase account (for production database + storage)

---

## Step 1: Set Up Supabase (10 minutes)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `lse-study-hub`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** (wait ~2 minutes for setup)

### Create Storage Bucket

1. In your Supabase project dashboard, click **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `study-hub-files`
   - **Public bucket**: ✅ **Check this box** (important!)
4. Click **"Create bucket"**

### Get Supabase Credentials

1. Go to **Settings** > **API** in the left sidebar
2. Copy these values (you'll need them for Vercel):
   - **Project URL**: `SUPABASE_URL`
   - **anon public**: `SUPABASE_ANON_KEY`
   - **service_role**: `SUPABASE_SERVICE_KEY` (click "Reveal" to see it)

### Get Database URL

1. Go to **Settings** > **Database** in the left sidebar
2. Scroll down to **"Connection string"**
3. Select **"URI"** tab
4. Copy the connection string (looks like: `postgresql://postgres:...`)
5. Replace `[YOUR-PASSWORD]` with your database password
6. This is your `DATABASE_URL`

---

## Step 2: Deploy to Vercel (5 minutes)

### Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** > **"Project"**
3. Click **"Import Git Repository"**
4. Find `xanderys/lse-study-hub` and click **"Import"**

### Configure Project

1. **Framework Preset**: Select **"Other"** (or leave as auto-detected)
2. **Build Command**: `pnpm build` (should be auto-filled)
3. **Output Directory**: `dist` (should be auto-filled)
4. **Install Command**: `pnpm install` (should be auto-filled)

### Add Environment Variables

Click **"Environment Variables"** and add these (one by one):

| Key | Value | Where to Get It |
|-----|-------|----------------|
| `DATABASE_URL` | `postgresql://postgres:...` | From Supabase > Settings > Database |
| `OPENAI_API_KEY` | `sk-proj-...` | From OpenAI Platform > API Keys |
| `SUPABASE_URL` | `https://xxx.supabase.co` | From Supabase > Settings > API |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | From Supabase > Settings > API |
| `SUPABASE_SERVICE_KEY` | `eyJhbGci...` | From Supabase > Settings > API (click Reveal) |
| `LOCAL_MODE` | `false` | Type this manually |
| `NODE_ENV` | `production` | Type this manually |
| `JWT_SECRET` | `your-random-secret-string` | Generate a random string (min 32 chars) |

**To generate JWT_SECRET**, run this in terminal:
```bash
openssl rand -base64 32
```

### Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. 🎉 Your app will be live at `https://lse-study-hub.vercel.app` (or similar)

---

## Step 3: Set Up Database Tables (2 minutes)

Your database needs tables! Vercel will create them automatically on first run, but let's verify:

### Option A: Automatic (Recommended)

1. Visit your deployed app
2. The app will automatically create tables on first load
3. Check Supabase > Table Editor to verify tables exist

### Option B: Manual (If needed)

If tables don't auto-create, run this locally:

```bash
# Set production DATABASE_URL in .env temporarily
DATABASE_URL="postgresql://..." pnpm db:push
```

---

## Step 4: Test Your Deployment ✅

1. Open your Vercel URL
2. You should see the LSE Study Hub homepage
3. Create a module
4. Upload a PDF (should save to Supabase Storage)
5. Open Deep Focus mode
6. Annotate the PDF
7. Ask the AI a question about the PDF
8. Refresh - annotations should persist!

---

## 🐛 Troubleshooting

### "Database connection error"
- ✅ Verify `DATABASE_URL` is correct
- ✅ Check Supabase project is running (not paused)
- ✅ Ensure password in connection string is correct

### "OPENAI_API_KEY is not configured"
- ✅ Add `OPENAI_API_KEY` to Vercel environment variables
- ✅ Redeploy after adding

### "Storage upload failed"
- ✅ Ensure Supabase bucket `study-hub-files` exists
- ✅ Ensure bucket is **public**
- ✅ Verify `SUPABASE_SERVICE_KEY` is correct

### PDF not loading
- ✅ Check browser console for errors
- ✅ Verify Supabase Storage bucket is public
- ✅ Check file was uploaded successfully in Supabase dashboard

### "Too many requests" on OpenAI
- ✅ You've hit the rate limit - wait a few minutes
- ✅ Check your OpenAI billing settings

---

## 💰 Cost Estimate (Monthly)

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| **Vercel** | 100GB bandwidth, 100GB-hrs compute | Personal use | **$0** |
| **Supabase** | 500MB database, 1GB storage, 2GB bandwidth | PDF storage + annotations | **$0** |
| **OpenAI** | $5 free credit (new users) | ~50-100 study sessions | **$1-5** |
| **Total** | | | **$1-5/month** |

---

## 🔄 Updating Your Deployment

When you make code changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically deploy the update! 🚀

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** (already in `.gitignore`)
2. **Use strong JWT_SECRET** (min 32 random characters)
3. **Rotate API keys periodically**
4. **Monitor OpenAI usage** (set billing alerts)
5. **Keep dependencies updated**: `pnpm update`

---

## 📞 Support

- **Vercel Issues**: Check [vercel.com/docs](https://vercel.com/docs)
- **Supabase Issues**: Check [supabase.com/docs](https://supabase.com/docs)
- **OpenAI Issues**: Check [platform.openai.com/docs](https://platform.openai.com/docs)
- **App Issues**: Check GitHub Issues or logs

---

## 🎉 You're Done!

Your LSE Study Hub is now live in production! Share the URL with friends and enjoy studying! 📚✨

**Your app**: `https://your-project.vercel.app`

Happy studying! 🎓

