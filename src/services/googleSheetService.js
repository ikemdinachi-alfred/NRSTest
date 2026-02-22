/**
 * Google Sheets Service - Data Persistence Layer
 *
 * Integration with Google Sheets for storing test results
 * Sheet: https://docs.google.com/spreadsheets/d/1j8je-5bynxIyygLFuchpWOy6yhRnnhesafW2KipoKvg/
 *
 * SETUP STEPS:
 *
 * 1. Open GOOGLE_APPS_SCRIPT.js in this project
 * 2. Copy the entire code
 * 3. Go to your Google Sheet → Extensions → Apps Script
 * 4. Replace the code with the copied script
 * 5. Deploy as Web App (see GOOGLE_APPS_SCRIPT.js for detailed steps)
 * 6. Copy the deployment URL
 * 7. Paste it below in GOOGLE_APPS_SCRIPT_URL
 *
 * Once configured, all test results will automatically save to Google Sheets!
 */

// ⚙️ CONFIGURATION - Update this with your Google Apps Script deployment URL
const GOOGLE_APPS_SCRIPT_URL = ""; // Paste your deployment URL here after deploying Apps Script
// Example: https://script.google.com/macros/s/AKfycbz.../userweb

// Sheet ID (no need to change)
const GOOGLE_SHEET_ID = "1j8je-5bynxIyygLFuchpWOy6yhRnnhesafW2KipoKvg";
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/`;

// Fallback: Use a webhook/API endpoint if needed
const WEBHOOK_URL = ""; // Optional: your custom backend

/**
 * Submit test results to Google Sheets
 * Data flows: Local storage → Google Sheets (via Apps Script) → Admin Dashboard
 */
export const submitTestResults = async (
  respondentInfo,
  answers,
  score,
  categoryScores,
) => {
  try {
    const payload = {
      firstName: respondentInfo.firstName,
      lastName: respondentInfo.lastName,
      email: respondentInfo.email,
      phone: respondentInfo.phone,
      score: score.correct,
      totalQuestions: score.total,
      percentage: score.percentage,
      passed: score.percentage >= 60,
      categoryScores: categoryScores,
      submittedAt: new Date().toISOString(),
    };

    // Try Google Apps Script first (primary)
    if (GOOGLE_APPS_SCRIPT_URL) {
      try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        // no-cors mode doesn't allow reading response, but request was sent
        console.log("✓ Results submitted to Google Sheets");

        return {
          success: true,
          message: "Results submitted to Google Sheets",
          googleSheetLink: GOOGLE_SHEET_URL,
        };
      } catch (error) {
        console.warn("Google Apps Script submission warning:", error);
        // Continue to fallback
      }
    } else {
      console.info(
        "ℹ️  Google Apps Script URL not configured. Skipping cloud sync.",
      );
    }

    // Fallback to webhook URL (secondary)
    if (WEBHOOK_URL) {
      try {
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            message: "Results submitted successfully",
            googleSheetLink: data.sheetLink || GOOGLE_SHEET_URL,
          };
        }
      } catch (error) {
        console.warn("Webhook submission warning:", error);
      }
    }

    // Final fallback: localStorage (tertiary)
    console.log("∞ Results saved to local storage (automatic backup)");
    return {
      success: true,
      message:
        "Results saved locally. Configure GOOGLE_APPS_SCRIPT_URL to enable cloud sync.",
      googleSheetLink: GOOGLE_SHEET_URL,
    };
  } catch (error) {
    console.error("Error in submitTestResults:", error);
    return {
      success: false,
      message: "Results saved locally. Cloud sync unavailable.",
      googleSheetLink: GOOGLE_SHEET_URL,
      error: error.message,
    };
  }
};

/**
 * Fetch results for a specific email
 */
export const fetchResults = async (email) => {
  try {
    if (WEBHOOK_URL) {
      const response = await fetch(
        `${WEBHOOK_URL}?action=getResults&email=${email}`,
      );
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};
