# 🚀 Quick Setup - Google Sheets Integration

## Your Sheet is Ready!

📊 **Sheet URL:** https://docs.google.com/spreadsheets/d/1j8je-5bynxIyygLFuchpWOy6yhRnnhesafW2KipoKvg/

---

## ⚡ 3-Minute Setup

### Step 1: Deploy Google Apps Script

1. Open your Google Sheet
2. Click **Extensions → Apps Script**
3. Delete any existing code
4. Open the file `GOOGLE_APPS_SCRIPT.js` in this project folder
5. Copy ALL the code
6. Paste into the Apps Script editor
7. Click **Save** (or Ctrl+S)

### Step 2: Deploy as Web App

1. In Apps Script, click **Deploy** (top right)
2. Select **New deployment**
3. Choose Type: **Web app**
4. Execute as: **Your Google account**
5. Who has access: **Anyone**
6. Click **Deploy**

### Step 3: Copy Deployment URL

1. You'll see a URL like: `https://script.google.com/macros/s/AKfycbz...../userweb`
2. Copy this URL
3. Open `src/services/googleSheetService.js`
4. Find this line:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = "";
   ```
5. Paste your URL inside the quotes:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL =
     "https://script.google.com/macros/s/YOUR_URL_HERE/userweb";
   ```
6. Save the file

### Step 4: Test It!

1. Go to http://localhost:5173
2. Register and take a test
3. Submit the test
4. Check your Google Sheet - **the results should appear!** ✓

---

## 📋 What's Saved to Google Sheets?

Each submission automatically saves:

- ✓ First Name & Last Name
- ✓ Email & Phone
- ✓ Score (X out of 35)
- ✓ Percentage (X%)
- ✓ Pass/Fail Status
- ✓ Category Breakdown (JSON)
- ✓ Timestamp

---

## 🔍 Data Fallback System

```
User submits test
       ↓
Saves to browser (localStorage) ← Always works
       ↓
Attempts Google Sheets sync
       ↓
If Google Sheets fails → Data still saved locally
If Google Sheets succeeds → Data in cloud + local
```

**⚠️ Important:** Even if Google Sheets isn't configured, all data saves locally and appears in the Admin Dashboard!

---

## 🛠️ Troubleshooting

### "Error deploying" in Apps Script?

- Check all syntax is correct
- Make sure you're in the right Google account
- Try creating a NEW deployment instead of updating

### Data not appearing in Sheet?

- Check the deployment URL is correctly pasted
- Verify you deployed as "Web app"
- Check browser console (F12) for errors
- Data will still be in Admin Dashboard (localhost)

### Can't find the Sheet?

- Make sure you're in the right Google account
- Sheet ID: `1j8je-5bynxIyygLFuchpWOy6yhRnnhesafW2KipoKvg`
- Direct link: https://docs.google.com/spreadsheets/d/1j8je-5bynxIyygLFuchpWOy6yhRnnhesafW2KipoKvg/

---

## 📱 Admin Dashboard Access

**URL:** http://localhost:5173

**Login:**

- Click 👤 button on registration page
- Password: `admin123`
- View all results

All data (from Google Sheets OR local storage) appears here automatically!

---

## ✅ How to Verify It's Working

After deploying, in Apps Script:

1. Click the function dropdown (top)
2. Select `doGet`
3. Click the play button (▶)
4. Choose "Execute"
5. Check the logs (bottom) - should say "doGet" ran

Or test the URL directly:

- Add `?action=test` to your deployment URL
- Should return: `"message":"Google Apps Script is working correctly!"`

---

## 🔐 Security Notes

- Apps Script is deployed as "Anyone" so the endpoint is public
- ADD AUTHENTICATION if storing sensitive data
- Use environment variables for security (not recommended for this project)

---

## 📞 Need Help?

Check these files:

- `GOOGLE_APPS_SCRIPT.js` - Has full documentation
- `src/services/googleSheetService.js` - Service integration
- `ADMIN_SETUP.md` - Full admin guide

Your sheet is ready to go! 🎉
