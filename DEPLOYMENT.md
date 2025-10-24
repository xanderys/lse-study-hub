# Deployment Guide

This guide will help you deploy LSE Study Hub to Vercel and connect it to your MySQL database.

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- MySQL database (PlanetScale recommended for free tier)
- Manus Platform account for API keys

## Step 1: Prepare Your Repository

### 1.1 Create GitHub Repository

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: LSE Study Hub"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/lse-study-hub.git
git branch -M main
git push -u origin main
```

### 1.2 Verify .gitignore

Ensure `.env` and sensitive files are in `.gitignore`:
- `.env`
- `node_modules/`
- `dist/`
- `local.db`

## Step 2: Set Up Database

### Option A: PlanetScale (Recommended - Free)

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up/log in
3. Create new database:
   - Name: `lse-study-hub`
   - Region: Choose closest to you
4. Create credentials:
   - Go to "Settings" → "Passwords"
   - Click "New password"
   - Select "General purpose"
   - Copy the connection string
5. Your `DATABASE_URL` will look like:
   ```
   mysql://username:password@host.connect.psdb.cloud/lse-study-hub?sslaccept=strict
   ```

### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add MySQL database
4. Copy connection URL from dashboard

### Option C: AWS RDS

1. Go to AWS Console → RDS
2. Create MySQL database
3. Configure security groups
4. Get connection string

## Step 3: Get Manus Platform Credentials

1. Go to [Manus Platform](https://manus.im)
2. Create/log into your account
3. Create a new app
4. Get the following:
   - `VITE_APP_ID`: Your app ID
   - `BUILT_IN_FORGE_API_KEY`: API key for AI features
   - `OWNER_OPEN_ID`: Your user ID (for admin access)

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select `lse-study-hub` repository

### 4.2 Configure Build Settings

Vercel should auto-detect settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 4.3 Add Environment Variables

In Vercel dashboard, go to "Settings" → "Environment Variables" and add:

```env
VITE_APP_ID=your-manus-app-id
JWT_SECRET=generate-a-random-string-here
DATABASE_URL=your-mysql-connection-string
OAUTH_SERVER_URL=https://auth.manus.im
OWNER_OPEN_ID=your-owner-open-id
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
NODE_ENV=production
```

**Important Tips:**
- Generate a strong `JWT_SECRET` (32+ random characters)
- Use the full MySQL connection string for `DATABASE_URL`
- Don't commit these to GitHub!

### 4.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Once deployed, click on the deployment URL

## Step 5: Initialize Database

After first deployment:

1. Your database tables will be auto-created on first connection
2. Verify by:
   - Log into your app
   - Create a test module
   - Upload a test PDF
   - Check if data persists

If tables aren't created automatically:

```bash
# Run locally with production database
DATABASE_URL=your-production-db-url pnpm db:push
```

## Step 6: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

## Step 7: Update Manus App Configuration

1. Go to Manus Platform dashboard
2. Update your app settings:
   - Add Vercel URL to allowed origins
   - Add custom domain (if using)
   - Configure OAuth redirect URLs

## Monitoring and Maintenance

### Check Logs

View logs in Vercel dashboard:
- Go to your project
- Click on deployment
- View "Functions" tab for server logs

### Database Monitoring

**PlanetScale:**
- Dashboard shows query insights
- Monitor connection count
- Check database size

**Railway:**
- Built-in metrics dashboard
- CPU and memory usage

### Update Environment Variables

To update environment variables:
1. Vercel dashboard → Settings → Environment Variables
2. Edit the variable
3. Redeploy: Deployments → Click three dots → Redeploy

### Continuous Deployment

Every push to `main` branch will automatically:
1. Trigger new Vercel build
2. Run tests (if configured)
3. Deploy if successful
4. Update production URL

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check `package.json` dependencies
- Ensure pnpm lock file is committed

**Error: "Environment variable not set"**
- Verify all required env vars in Vercel
- Check variable names (case-sensitive)

### Database Connection Issues

**Error: "ECONNREFUSED"**
- Check `DATABASE_URL` format
- Verify database is accessible
- Check IP whitelist (some providers require it)

**Error: "Too many connections"**
- Your database plan may have connection limits
- Use connection pooling
- Upgrade database plan

### OAuth Issues

**Error: "Redirect URI mismatch"**
- Update allowed origins in Manus Platform
- Include both Vercel URL and custom domain

### Storage/Upload Issues

**Error: "Storage upload failed"**
- Verify `BUILT_IN_FORGE_API_KEY`
- Check API key permissions
- Review Manus Platform quotas

### AI Not Working

**Error: "LLM invoke failed"**
- Check `BUILT_IN_FORGE_API_KEY` is correct
- Verify API credits/quota
- Review Manus Platform status

## Performance Optimization

### 1. Database Optimization
- Add indexes for frequently queried fields
- Use connection pooling
- Consider read replicas for high traffic

### 2. Caching
```typescript
// Example: Cache module list
const { data: modules } = trpc.modules.list.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 3. CDN for PDFs
- Consider moving PDFs to dedicated CDN
- Use Cloudflare R2 or AWS S3 with CloudFront

### 4. Code Splitting
- Already configured with Vite
- Lazy load heavy components

## Scaling Considerations

### Free Tier Limits

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless functions: 100 GB-hours

**PlanetScale Free:**
- 5 GB storage
- 1 billion row reads/month

### Upgrade When:
- \>100 users: Upgrade database
- \>10k PDFs: Consider dedicated storage
- \>1M API calls: Review API tier

## Security Checklist

- [ ] All sensitive data in environment variables
- [ ] `.env` in `.gitignore`
- [ ] Database has strong password
- [ ] JWT_SECRET is random and secure
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] OAuth correctly configured
- [ ] Database not publicly accessible
- [ ] Regular backups configured

## Backup Strategy

### Database Backups

**PlanetScale:**
- Automatic daily backups (paid plan)
- Manual backups: Settings → Backups

**Railway:**
- Manual export from dashboard
- Set up automated backups with cron job

**AWS RDS:**
- Configure automated backups
- Set retention period

### Code Backups
- GitHub is your source of truth
- Tag releases: `git tag v1.0.0`
- Keep production branch stable

## Maintenance Schedule

**Weekly:**
- Check error logs
- Monitor database size
- Review API usage

**Monthly:**
- Update dependencies: `pnpm update`
- Review and optimize slow queries
- Check security advisories

**Quarterly:**
- Database cleanup (old data)
- Performance audit
- User feedback review

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review database logs
3. Check Manus Platform status page
4. Review this guide's troubleshooting section

---

**Congratulations! Your LSE Study Hub is now live! 🎉**

Share your deployment URL and start studying smarter!

