# 🚀 DEPLOY NOW - Quick Start Guide

## ✅ What's Done

Your code is now **LIVE on GitHub**: https://github.com/xanderys/lse-study-hub

All features are implemented and ready for production! 🎉

---

## 📋 Deploy to Vercel in 15 Minutes

### Step 1: Set Up Supabase (8 minutes)

#### A. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - Name: `lse-study-hub`
   - Database Password: **Save this!** You'll need it
   - Region: Choose closest to you
4. Wait 2 minutes for setup

#### B. Create Storage Bucket
1. Click **"Storage"** in sidebar
2. Click **"Create a new bucket"**
3. Name: `study-hub-files`
4. ✅ **Check "Public bucket"** ← IMPORTANT!
5. Click **"Create bucket"**

#### C. Copy These Credentials
Go to **Settings > API**:
- `SUPABASE_URL`: Copy "Project URL"
- `SUPABASE_ANON_KEY`: Copy "anon public"
- `SUPABASE_SERVICE_KEY`: Click "Reveal" and copy "service_role"

Go to **Settings > Database**:
- Scroll to "Connection string" > "URI" tab
- Copy the URL (replace `[YOUR-PASSWORD]` with your database password)
- This is your `DATABASE_URL`

---

### Step 2: Deploy to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..." > "Project"**
3. Import **"xanderys/lse-study-hub"**
4. **Don't click Deploy yet!**

#### Add Environment Variables

Click **"Environment Variables"** and add these **8 variables**:

```bash
# Database (from Supabase > Settings > Database)
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# OpenAI (you already have this)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Supabase Storage (from Supabase > Settings > API)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Settings (type these exactly)
LOCAL_MODE=false
NODE_ENV=production
JWT_SECRET=<generate-random-string-32-chars>
```

#### Generate JWT_SECRET
Open terminal and run:
```bash
openssl rand -base64 32
```
Copy the output and use it as `JWT_SECRET`

---

### Step 3: Deploy! 🚀

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Click the generated URL
4. 🎉 Your app is LIVE!

---

## 🧪 Test Your Deployment

1. Visit your Vercel URL
2. Create a module (e.g., "Microeconomics")
3. Upload a PDF
4. Click the slide to enter Deep Focus
5. Annotate with highlight & pen tools
6. Add a question in the sidebar
7. Ask AI about the PDF content
8. Refresh the page - annotations should persist!

---

## 📊 Your Live URLs

- **GitHub Repo**: https://github.com/xanderys/lse-study-hub
- **Vercel App**: Will be like `https://lse-study-hub-xxx.vercel.app`
- **Supabase Dashboard**: Your project dashboard at supabase.com

---

## 🐛 Common Issues

### "Database connection error"
- Check `DATABASE_URL` is correct
- Ensure password is correct (no spaces)
- Verify Supabase project is active

### "Storage upload failed"
- Ensure bucket `study-hub-files` exists
- Ensure bucket is **public** (very important!)
- Verify `SUPABASE_SERVICE_KEY` is correct

### "OPENAI_API_KEY is not configured"
- Add the API key in Vercel environment variables
- Redeploy after adding

### PDF doesn't load after upload
- Check Supabase Storage bucket is public
- Verify file appears in Supabase > Storage > study-hub-files
- Check browser console for errors

---

## 💰 Cost Estimate

- **Vercel**: Free (100GB bandwidth/month)
- **Supabase**: Free (500MB DB + 1GB storage)
- **OpenAI API**: ~$1-5/month for personal use
- **Total**: **$1-5/month** 🎉

---

## 🔄 Future Updates

When you make changes to the code:

```bash
git add .
git commit -m "Your update description"
git push origin main
```

Vercel will automatically redeploy! No manual steps needed.

---

## 📚 Full Documentation

- Detailed Guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- Project README: [README.md](./README.md)
- Environment Setup: [env.template](./env.template)

---

## 🎓 What You Built

✅ **Module Management**: Create, organize, and manage course modules
✅ **PDF Upload**: Drag & drop with cloud storage
✅ **Deep Focus Mode**: Distraction-free study environment
✅ **PDF Annotations**: Highlight & pen tools with persistence
✅ **AI Study Assistant**: GPT-powered chat with PDF context (RAG)
✅ **Custom Prompts**: Engineer your own AI behavior
✅ **Responsive UI**: Beautiful, modern interface
✅ **Full Stack**: React + TypeScript + tRPC + SQLite/MySQL

---

## 🎉 You're Ready!

Everything is set up and ready to deploy. Follow the steps above and you'll have your LSE Study Hub live in production in about 15 minutes!

**Happy Studying! 📚✨**

---

## ❓ Need Help?

- Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for troubleshooting
- Review Vercel deployment logs if build fails
- Check Supabase logs if database issues occur
- Verify all 8 environment variables are set correctly

**Good luck with your deployment! 🚀**

