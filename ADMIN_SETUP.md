# NRS Onboarding Assessment - Admin & Data Persistence Guide

## 🎯 Overview

The system now includes:

- ✅ Admin Dashboard for viewing all participant performance
- ✅ Google Sheets integration for data persistence
- ✅ CSV export functionality
- ✅ localStorage backup (automatic local storage)
- ✅ Real-time score tracking

---

## 📊 Admin Access

### Accessing the Admin Dashboard

1. **Click the floating admin button** (👤) on the registration page
2. **Enter password**: `admin123` (change this in `src/context/TestContext.jsx`)
3. **View all participant data** with filtering, sorting, and export options

### Admin Dashboard Features

- 📈 **Real-time Statistics**: Total participants, pass rate, average score
- 🔍 **Search**: Filter by name, email, or phone
- 📊 **Sort Options**: By score, name, or submission date
- 📥 **Export to CSV**: Download all results as a spreadsheet
- 🗑️ **Delete Records**: Remove individual participant records
- 🔗 **Google Sheet Links**: Direct links to participant data in Google Sheets

---

## 🔌 Google Sheets Integration (Setup Required)

The system is **ready to connect to Google Sheets** but requires configuration. Choose one of these methods:

### Method 1: Google Apps Script (Recommended)

#### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new sheet named "Test Results"
3. Add headers in row 1:
   - A: Timestamp
   - B: First Name
   - C: Last Name
   - D: Email
   - E: Phone
   - F: Score
   - G: Total Questions
   - H: Percentage
   - I: Status (Passed/Failed)
   - J: Categories (JSON format)

#### Step 2: Create Google Apps Script Web App

1. Open your Google Sheet
2. Click **Extensions → Apps Script**
3. Replace the code with this:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  const newRow = [
    new Date(),
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.score,
    data.totalQuestions,
    data.percentage,
    data.passed ? "PASSED" : "FAILED",
    JSON.stringify(data.categoryScores),
  ];

  sheet.appendRow(newRow);

  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      sheetLink:
        "https://docs.google.com/spreadsheets/d/" +
        SpreadsheetApp.getActiveSpreadsheet().getId(),
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Deploy → New deployment**
5. Select **Type: Web app**
6. Execute as: Your account
7. Who has access: Anyone
8. Copy the deployment URL

#### Step 3: Configure URL in App

1. Open `src/services/googleSheetService.js`
2. Replace `GOOGLE_APPS_SCRIPT_URL` with your deployment URL:

```javascript
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/userweb";
```

---

### Method 2: REST API / Webhook

If you have your own backend or use a service like:

- **Formspree**: https://formspree.io
- **Webhook.site**: https://webhook.site
- **AWS Lambda + DynamoDB**
- **Firebase**
- **Your custom Node.js backend**

Add the webhook URL to `src/services/googleSheetService.js`:

```javascript
const WEBHOOK_URL = "https://your-backend.com/api/submit-test";
```

---

### Method 3: Firebase Realtime Database (Alternative)

1. Set up Firebase project
2. Enable Realtime Database
3. Modify `googleSheetService.js` to use Firebase SDK
4. Data automatically persists in the cloud

---

## 💾 Data Persistence

### Storage Hierarchy (Automatic Fallback)

1. **Primary**: Google Apps Script → Google Sheets
2. **Fallback**: Custom Webhook/API
3. **Final Fallback**: localStorage (browser storage)

All submitted data is **automatically saved locally** even if cloud connection fails.

### Accessing Local Data

Data is stored in browser localStorage under key: `testParticipants`

To view it in browser console:

```javascript
const data = JSON.parse(localStorage.getItem("testParticipants"));
console.log(data);
```

To clear local data:

```javascript
localStorage.removeItem("testParticipants");
```

---

## 📁 File Structure

```
src/
├── context/TestContext.jsx          # Manages all test state & participant data
├── services/
│   └── googleSheetService.js        # Google Sheets integration
├── components/pages/
│   ├── AdminLoginPage.jsx           # Admin authentication
│   └── AdminDashboard.jsx           # Admin panel
└── App.jsx                          # Routing logic
```

---

## 🔐 Security Notes

### Change Admin Password

File: `src/context/TestContext.jsx`

```javascript
const loginAdmin = useCallback((password) => {
  if (password === "your-new-password") {
    // Change here
    setIsAdmin(true);
    return true;
  }
  return false;
}, []);
```

### Google Apps Script Security

- Use **Deploy → New deployment** to update the script
- Add authentication headers if needed:

```javascript
// In Google Apps Script
function doPost(e) {
  const authHeader = e.parameter.auth;
  if (authHeader !== "your-secret-key") {
    return ContentService.createTextOutput("Unauthorized");
  }
  // ... rest of code
}
```

---

## 📊 Exported CSV Format

When exporting data, CSV includes:

- ID
- First Name
- Last Name
- Email
- Phone
- Total Score
- Percentage
- Pass/Fail Status
- Submission Date/Time
- Google Sheet Link

---

## 🐛 Troubleshooting

### "Failed to resolve import" Errors

- Clear browser cache and restart dev server
- Files are in correct locations

### Data Not Saving to Google Sheets

1. Check Google Apps Script URL is correct
2. Verify sheet headers match expected format
3. Check browser console for errors: `F12 → Console`
4. Data will still save locally (fallback)

### Admin Login Not Working

- Default password is `admin123`
- Check if you modified it in TestContext.jsx
- Clear browser cache if issues persist

### CSV Export Shows "No data"

- Ensure at least 1 participant has submitted
- Check localStorage isn't cleared

---

## 🚀 Next Steps

1. **Immediate**: System works locally with full fallback
2. **Recommended**: Set up Google Apps Script (5 min setup)
3. **Optional**: Connect custom webhook/API
4. **Security**: Change admin password before deployment

---

## 📈 Example Dashboard Workflow

```
1. Users take test → Results auto-saved locally
2. Results submitted → Attempt cloud save (Google Sheets)
3. Admin logs in (password: admin123)
4. Views: Statistics, search, sort, export
5. Export to CSV or view individual Google Sheet links
```

---

## 💡 Tips

- **Backup**: Regularly export CSV data
- **Monitor**: Check Google Sheet for submissions
- **Archive**: Create new sheet monthly and rotate URLs
- **Analyze**: Use Google Sheets formulas for analytics

---

For questions or issues, check the component comments in the source code!
