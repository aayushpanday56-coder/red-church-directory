# ✝ Red Church Family Directory

A beautiful family directory registration form — deployed on the cloud so anyone in India can fill it from anywhere.

---

## 🌐 Live Deployment Guide (MongoDB Atlas + Render.com)

Follow these steps exactly. Takes about 15–20 minutes.

---

## PART 1 — MongoDB Atlas (Free Cloud Database)

### Step 1 — Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or Email (free)

### Step 2 — Create a Free Cluster
1. Click **"Build a Database"**
2. Choose **"M0 Free"** tier
3. Select **AWS** → Region: **Mumbai (ap-south-1)** (best for India)
4. Click **"Create Cluster"** (takes 1-2 minutes)

### Step 3 — Create Database User
1. On left sidebar → **"Database Access"**
2. Click **"Add New Database User"**
3. Username: `redchurchadmin`
4. Password: create a strong password (save it!)
5. Role: **"Read and write to any database"**
6. Click **"Add User"**

### Step 4 — Allow All IPs (for Render)
1. On left sidebar → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** → `0.0.0.0/0`
4. Click **"Confirm"**

### Step 5 — Get Your Connection String
1. On left sidebar → **"Database"**
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string — looks like:
   ```
   mongodb+srv://redchurchadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before `?`:
   ```
   mongodb+srv://redchurchadmin:YOURPASSWORD@cluster0.xxxxx.mongodb.net/redchurchdirectory?retryWrites=true&w=majority
   ```
8. **Save this string** — you'll need it in Part 3

---

## PART 2 — Upload Code to GitHub

### Step 1 — Create GitHub Account
Go to https://github.com and sign up (free)

### Step 2 — Create New Repository
1. Click **"New"** (green button)
2. Repository name: `red-church-directory`
3. Set to **Public**
4. Click **"Create repository"**

### Step 3 — Upload Your Files
1. Click **"uploading an existing file"** link
2. Drag and drop ALL files from the project folder:
   - `server.js`
   - `package.json`
   - `.gitignore`
   - `public/` folder (index.html + admin.html)
3. Click **"Commit changes"**

---

## PART 3 — Deploy on Render.com

### Step 1 — Create Account
Go to https://render.com and sign up with GitHub (free)

### Step 2 — Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account
3. Select `red-church-directory` repository
4. Click **"Connect"**

### Step 3 — Configure Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `redchurchdirectoryform` |
| **Region** | Singapore (closest to India) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### Step 4 — Add Environment Variable
1. Scroll down to **"Environment Variables"**
2. Click **"Add Environment Variable"**
3. Key: `MONGO_URI`
4. Value: paste your MongoDB connection string from Part 1 Step 5
5. Click **"Save"**

### Step 5 — Deploy!
1. Click **"Create Web Service"**
2. Wait 2–3 minutes for deployment
3. You'll see: **"Your service is live 🎉"**

---

## 🎉 Your Live Links

| Page | URL |
|------|-----|
| **Registration Form** | `https://redchurchdirectoryform.onrender.com` |
| **Admin Panel** | `https://redchurchdirectoryform.onrender.com/admin.html` |

Share the form link on WhatsApp, Email — anyone in India can open it!

---

## 📋 Features

- ✅ Anyone in India can fill the form from phone or laptop
- ✅ Permanent link — never changes
- ✅ Data stored forever in MongoDB Atlas
- ✅ Add Spouse, Children, Other members (max 10)
- ✅ Admin panel to view all submissions
- ✅ Export all data to CSV/Excel
- ✅ Live member count + today's registrations
- ✅ Duplicate family card detection
- ✅ Mobile responsive

---

## ⚠️ Important Notes

- **Free Render plan** spins down after 15 min of inactivity — first load may take 30 seconds
- **MongoDB free tier** gives 512MB storage — enough for thousands of families
- **Admin panel** is public — consider adding a password later for security

---

## 💻 Running Locally (for testing)

1. Copy `.env.example` to `.env`
2. Fill in your `MONGO_URI`
3. Run:
   ```bash
   npm install
   npm start
   ```
4. Open http://localhost:3000

