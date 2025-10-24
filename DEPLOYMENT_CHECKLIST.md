# Deployment Checklist for LSE Study Hub

Use this checklist before deploying to ensure everything is ready.

## Pre-Deployment

### Code Quality
- [ ] All TypeScript files compile without errors (`pnpm check`)
- [ ] No linter errors
- [ ] Code formatted (`pnpm format`)
- [ ] Build succeeds (`pnpm build`)

### Environment Variables
- [ ] `.env.example` is up to date
- [ ] `.env` is in `.gitignore`
- [ ] All required environment variables documented
- [ ] No secrets in code or committed files

### Git & GitHub
- [ ] Repository initialized
- [ ] All changes committed
- [ ] `.gitignore` properly configured
- [ ] No sensitive files tracked
- [ ] Pushed to GitHub
- [ ] README.md is complete
- [ ] Repository description added

### Database
- [ ] Database schema finalized
- [ ] Migrations tested
- [ ] Production database created
- [ ] Database credentials secured
- [ ] Connection string tested

### Manus Platform
- [ ] App created on Manus Platform
- [ ] `VITE_APP_ID` obtained
- [ ] `BUILT_IN_FORGE_API_KEY` obtained
- [ ] `OWNER_OPEN_ID` obtained
- [ ] OAuth redirect URLs configured

## Deployment

### Vercel Setup
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Build settings configured
  - Build Command: `pnpm build`
  - Output Directory: `dist`
  - Install Command: `pnpm install`

### Environment Variables in Vercel
- [ ] `VITE_APP_ID`
- [ ] `JWT_SECRET`
- [ ] `DATABASE_URL`
- [ ] `OAUTH_SERVER_URL`
- [ ] `OWNER_OPEN_ID`
- [ ] `BUILT_IN_FORGE_API_URL`
- [ ] `BUILT_IN_FORGE_API_KEY`
- [ ] `NODE_ENV=production`

### First Deployment
- [ ] Deployment initiated
- [ ] Build logs reviewed
- [ ] No build errors
- [ ] Deployment successful
- [ ] URL accessible

## Post-Deployment Testing

### Basic Functionality
- [ ] Homepage loads
- [ ] Login works
- [ ] Can create module
- [ ] Can upload PDF
- [ ] PDF displays correctly

### Deep Focus Mode
- [ ] PDF viewer loads
- [ ] Zoom in/out works
- [ ] Page navigation works
- [ ] Highlight tool works
- [ ] Pen tool works
- [ ] Annotations save
- [ ] Annotations persist on reload

### Questions & Notes
- [ ] Can add questions
- [ ] Questions save
- [ ] Can delete questions
- [ ] List scrolls correctly

### AI Chat
- [ ] Chat interface loads
- [ ] Can send messages
- [ ] AI responds
- [ ] AI has PDF context
- [ ] System prompt can be updated
- [ ] Chat history persists

### File Operations
- [ ] Drag and drop works
- [ ] File upload validates (PDF only)
- [ ] Files store correctly
- [ ] Files retrieve correctly
- [ ] Can view uploaded files

### Database
- [ ] Data persists across sessions
- [ ] No duplicate entries
- [ ] Relations work correctly
- [ ] Queries are efficient

### Performance
- [ ] Page load time acceptable (<3s)
- [ ] PDF rendering smooth
- [ ] Annotations responsive
- [ ] Chat responds quickly (<5s)
- [ ] No memory leaks

### Security
- [ ] Authentication required
- [ ] Users see only their data
- [ ] No XSS vulnerabilities
- [ ] No SQL injection possible
- [ ] HTTPS enabled
- [ ] Cookies secure

## Finalization

### Documentation
- [ ] README.md updated with live URL
- [ ] API documentation complete
- [ ] Deployment guide tested
- [ ] Troubleshooting guide complete

### Repository
- [ ] Code committed and pushed
- [ ] Release tag created (v1.0.0)
- [ ] GitHub release created
- [ ] Topics added to repository
- [ ] Social preview image added

### Monitoring
- [ ] Error tracking configured (optional)
- [ ] Analytics configured (optional)
- [ ] Uptime monitoring (optional)

### User Experience
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile (responsive)
- [ ] Test with slow connection
- [ ] Test with large PDFs

### Backup & Recovery
- [ ] Database backup strategy defined
- [ ] Know how to rollback deployment
- [ ] Have emergency contact info
- [ ] Document recovery procedures

## Launch

### Pre-Launch
- [ ] All checklist items complete
- [ ] Stakeholders notified
- [ ] Support ready

### Launch
- [ ] Deploy to production
- [ ] Verify production URL
- [ ] Share with users
- [ ] Monitor for issues

### Post-Launch
- [ ] Monitor error logs (first 24h)
- [ ] Check database performance
- [ ] Gather user feedback
- [ ] Plan next iteration

## Rollback Plan

If something goes wrong:

1. **Immediate Issues**:
   ```bash
   # Revert to previous deployment in Vercel
   # Go to Deployments → Previous → Promote to Production
   ```

2. **Database Issues**:
   - Have database backup ready
   - Document restore procedure
   - Test restore process

3. **Critical Bugs**:
   - Hot fix branch
   - Quick fix and test
   - Deploy to production

## Success Criteria

Deployment is successful when:
- ✅ All tests pass
- ✅ No critical errors in logs
- ✅ User can complete full workflow
- ✅ Performance metrics met
- ✅ Security checks pass

## Notes

- **Deployment Time**: ~5-10 minutes
- **First Build**: May take longer
- **DNS Propagation**: 5-30 minutes if using custom domain
- **Database Migration**: Automatic on first connection

## Contact Information

- **Vercel Support**: https://vercel.com/support
- **Manus Platform**: https://manus.im/support
- **Database Provider**: [Your database support]

---

**Ready to Deploy!** 🚀

Remember: Test everything locally before deploying!

