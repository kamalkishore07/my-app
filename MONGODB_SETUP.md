# MongoDB Atlas Setup Guide

Follow these steps to set up MongoDB Atlas and get your connection string:

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or sign in if you already have one)
3. Verify your email address

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose the **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click **"Create Cluster"** (this may take 1-3 minutes)

## Step 3: Create Database User

1. On the left sidebar, click **"Database Access"** under Security
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `kamal`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **IMPORTANT**: Copy and save this password somewhere safe!
7. Under "Database User Privileges", select **"Read and write to any database"**
8. Click **"Add User"**

## Step 4: Whitelist Your IP Address

1. On the left sidebar, click **"Network Access"** under Security
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` to the whitelist
   - For production, you should restrict this to specific IPs
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go back to **"Database"** on the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** as the driver
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update .env.local

1. Open the `.env.local` file in your project root
2. Replace the placeholder with your actual connection string:
   ```
   MONGODB_URI=mongodb+srv://kamal:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kamals-diary?retryWrites=true&w=majority
   ```
3. **Replace**:
   - `<username>` with your database username (e.g., `kamal`)
   - `<password>` with the password you saved
   - `<cluster-url>` with your cluster URL (e.g., `cluster0.abc123.mongodb.net`)
   - Add `/kamals-diary` before the `?` to specify the database name

## Step 7: Restart Development Server

1. Stop the current dev server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

## Step 8: Test the Connection

1. Open your browser to `http://localhost:3000`
2. Click on any date
3. Add a todo, expense, or note
4. Refresh the page - your data should persist!
5. Check MongoDB Atlas dashboard:
   - Go to "Database" → "Browse Collections"
   - You should see your `kamals-diary` database with collections: `todos`, `expenses`, `notes`

---

## Troubleshooting

### "MongoServerError: bad auth"
- Your username or password is incorrect
- Make sure you copied the password correctly
- Check for special characters that might need URL encoding

### "MongooseServerSelectionError: Could not connect"
- Check your internet connection
- Verify your IP is whitelisted in Network Access
- Make sure the connection string is correct

### "MONGODB_URI is not defined"
- Make sure `.env.local` exists in the project root
- Restart the dev server after adding the variable
- Check that the variable name is exactly `MONGODB_URI`

---

## Security Notes

- **Never commit `.env.local` to version control** (it's already in `.gitignore`)
- For production, use environment variables from your hosting platform
- Restrict IP whitelist to specific addresses in production
- Use strong, unique passwords for database users

---

## Next Steps

Once connected, all your diary data will be stored in MongoDB Atlas:
- ✅ Data persists across page refreshes
- ✅ Access from any device (with the same database)
- ✅ Free tier includes 512MB storage
- ✅ Automatic backups and monitoring
