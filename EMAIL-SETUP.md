# 📧 Email Setup Required

## Quick Start

To enable email notifications for orders, you need to configure your email settings.

### Step 1: Get Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Create new app password for "Mail"
3. Copy the 16-character password

### Step 2: Update .env File

Open `.env` and update these lines:

```env
EMAIL_USER=slgaminghub09@gmail.com
EMAIL_PASSWORD=paste-your-16-char-app-password-here
```

Replace `paste-your-16-char-app-password-here` with the password from Step 1.

### Step 3: Restart the Server

```bash
npm run dev
```

## What Emails Are Sent?

### When a customer creates an order:
✅ Customer receives order confirmation  
✅ Admin receives new order notification

### When admin marks order as completed:
✅ Customer receives completion notification  
✅ Admin receives completion confirmation

## Need Help?

See detailed instructions in `docs/email-setup.md`

---

**⚠️ Important:** Without email configuration, orders will still be created in the database, but no email notifications will be sent.
