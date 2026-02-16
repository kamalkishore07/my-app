# Deployment Guide

Step-by-step guide to deploy Kamal's Diary to production.

## Deployment Options

This app can be deployed to:
- ✅ **Vercel** (Recommended - easiest)
- Netlify
- Railway
- Any Node.js hosting platform

---

## Deploy to Vercel (Recommended)

### Prerequisites
- GitHub/GitLab/Bitbucket account
- MongoDB Atlas database set up
- Vercel account (free tier works!)

### Step 1: Push to Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

In the Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/kamals-diary?retryWrites=true&w=majority` |

> **Important**: Use your actual MongoDB connection string!

3. Select environments: **Production**, **Preview**, and **Development**
4. Click **"Save"**

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-app.vercel.app`

### Step 5: Verify Deployment

1. Visit your deployed URL
2. Test the database connection: `https://your-app.vercel.app/api/test-db`
3. Expected response:
   ```json
   {
     "success": true,
     "message": "MongoDB connection successful!"
   }
   ```

---

## Deploy to Netlify

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Build the Project

```bash
npm run build
```

### Step 3: Deploy

```bash
netlify deploy --prod
```

### Step 4: Set Environment Variables

```bash
netlify env:set MONGODB_URI "your-mongodb-connection-string"
```

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |

### Getting Your MongoDB URI

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Database"** → **"Connect"**
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add database name: `/kamals-diary` before the `?`

**Example**:
```
mongodb+srv://kamal:MyP%40ssw0rd@cluster0.abc123.mongodb.net/kamals-diary?retryWrites=true&w=majority
```

> **Note**: URL-encode special characters in password:
> - `@` → `%40`
> - `#` → `%23`
> - `%` → `%25`

---

## Post-Deployment Checklist

- [ ] Database connection working (`/api/test-db` returns success)
- [ ] Can create todos, expenses, and notes
- [ ] Data persists after page refresh
- [ ] Responsive design works on mobile
- [ ] No console errors in browser
- [ ] MongoDB Atlas shows data in collections

---

## Custom Domain (Optional)

### Vercel

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

### Netlify

1. Go to **Domain Settings**
2. Add custom domain
3. Configure DNS records
4. Enable HTTPS (automatic)

---

## Monitoring & Maintenance

### MongoDB Atlas

- Monitor database usage in Atlas dashboard
- Free tier: 512MB storage
- Set up alerts for storage limits

### Vercel

- View deployment logs in Vercel dashboard
- Monitor function execution time
- Check bandwidth usage

---

## Troubleshooting

### Build Fails

**Error**: `MONGODB_URI is not defined`

**Solution**: Add environment variable in hosting platform settings

---

### Database Connection Fails

**Error**: `MongooseServerSelectionError`

**Solutions**:
1. Check MongoDB Atlas IP whitelist (should include `0.0.0.0/0` for Vercel)
2. Verify connection string is correct
3. Ensure password is URL-encoded

---

### 404 on API Routes

**Error**: API routes return 404

**Solution**: Ensure `src/app/api` directory structure is correct

---

## Rollback Deployment

### Vercel

1. Go to **Deployments**
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

### Netlify

1. Go to **Deploys**
2. Find previous deployment
3. Click **"Publish deploy"**

---

## Security Best Practices

### Production Checklist

- [ ] Environment variables set in hosting platform (not in code)
- [ ] `.env.local` in `.gitignore`
- [ ] MongoDB IP whitelist configured
- [ ] Strong database password used
- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] Security headers configured (already in `next.config.ts`)

### MongoDB Atlas Security

1. **Network Access**:
   - Add `0.0.0.0/0` for serverless platforms (Vercel, Netlify)
   - Or add specific IPs if known

2. **Database Access**:
   - Use strong passwords
   - Create separate users for dev/prod
   - Use read-only users where appropriate

3. **Backups**:
   - Enable automatic backups in Atlas
   - Free tier includes basic backups

---

## Scaling Considerations

### When to Upgrade

- **MongoDB**: Upgrade from free tier when approaching 512MB
- **Vercel**: Free tier includes 100GB bandwidth/month
- **Performance**: Monitor API response times

### Optimization Tips

1. **Database Indexes**: Already configured on `date` fields
2. **Caching**: Consider adding Redis for frequent queries
3. **CDN**: Vercel includes global CDN automatically

---

## Support

### Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

### Common Issues

Check the troubleshooting section above or open an issue in the repository.

---

**Congratulations! Your app is now live! 🎉**
