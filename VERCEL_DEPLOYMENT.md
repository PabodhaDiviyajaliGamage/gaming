# Vercel Deployment Fix for Login Issue

## ✅ Problem Identified
Your MongoDB has users with **plain-text passwords**:
- `pabodhagamage316@gmail.com` - Password: `123456789` (plain text)
- `pabodhagamage3@gmail.com` - Password: `123456789` (plain text)
- `pabodagamage093@gmail.com` - Password: bcrypt hashed ✅

## 🔧 Solution Implemented
The login code now:
1. Detects if password is bcrypt hash or plain text
2. Compares accordingly
3. Auto-migrates plain-text passwords to bcrypt on successful login

## 📋 Vercel Deployment Steps

### Step 1: Add Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

```env
JWT_SECRET=slgaminghub-secret-key-2025-production-secure-token
MONGODB_URI=mongodb+srv://pabodhagamage316_db_user:960vOXorkJkoDIdC@cluster0.l4kvyhc.mongodb.net/slgaminghub?retryWrites=true&w=majority
```

### Step 2: Deploy to Vercel

Option A: Push to GitHub
```bash
git add .
git commit -m "Fix login with plain-text password migration"
git push origin main
```

Option B: Redeploy from Vercel Dashboard
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

### Step 3: Test Login

After deployment, test with:
- Email: `pabodhagamage316@gmail.com`
- Password: `123456789`

**First login**: Auto-migrates password to bcrypt
**Second login**: Uses bcrypt (faster)

### Step 4: Check Vercel Logs

Go to Vercel project → Deployments → Click latest deployment → Functions → View Logs

Look for:
```
📝 Detected plain-text password for user: pabodhagamage316@gmail.com
✅ Plain-text password matched!
✅ Auto-migrated plain-text password to bcrypt for user: pabodhagamage316@gmail.com
```

## 🔒 Security Notes

- After first successful login, passwords are automatically upgraded to bcrypt
- New registrations always use bcrypt (handled by User model pre-save hook)
- Plain-text password detection is safe and doesn't expose data

## 🚀 Quick Test Commands

Check passwords in database:
```bash
node scripts/check-passwords.js
```

Expected output after successful logins:
```
📊 Total users: 3
✅ Hashed: 3
❌ Plain text: 0
```

## ⚠️ Important

Make sure these environment variables are set in Vercel:
- ✅ JWT_SECRET
- ✅ MONGODB_URI

Without these, login will fail!
