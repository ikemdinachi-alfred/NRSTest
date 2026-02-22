# Configuration Guide - Google Sheets Integration

## 📝 Quick Configuration Reference

### File: `src/services/googleSheetService.js`

Find this section:

```javascript
// ⚙️ CONFIGURATION - Update this with your Google Apps Script deployment URL
const GOOGLE_APPS_SCRIPT_URL = ""; // Paste your deployment URL here after deploying Apps Script
// Example: https://script.google.com/macros/s/AKfycbz.../userweb
```

### After Deploying Google Apps Script

Replace the empty string with your deployment URL:

**Before:**

```javascript
const GOOGLE_APPS_SCRIPT_URL = "";
```

**After:**

```javascript
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/userweb";
```

---

## 🔗 Your Google Sheet

📊 **https://docs.google.com/spreadsheets/d/1j8je-5bynxIyygLFuchpWOy6yhRnnhesafW2KipoKvg/**

---

## 📋 Files Included

1. **GOOGLE_APPS_SCRIPT.js** - Copy this to Google Apps Script editor
2. **SETUP_GOOGLE_SHEETS.md** - Step-by-step deployment guide
3. **src/services/googleSheetService.js** - Where to paste your deployment URL

---

## ✅ One-Time Setup

1. Deploy `GOOGLE_APPS_SCRIPT.js` as Web App
2. Copy deployment URL
3. Paste into `googleSheetService.js`
4. Restart dev server (npm run dev)
5. Done! Results auto-save to Google Sheets

---

## 🎯 System Flow

```
Test Submission
    ↓
Saves to localStorage (browser)
    ↓
Attempts to sync with Google Apps Script
    ↓
Data appended to your Google Sheet
    ↓
Admin Dashboard shows all results
```

---

See **SETUP_GOOGLE_SHEETS.md** for detailed instructions!
