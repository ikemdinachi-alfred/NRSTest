/**
 * GOOGLE APPS SCRIPT - Deploy as Web App
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1j8je-5bynxIyygLFuchpWOy6yhRnnhesafW2KipoKvg/
 * 2. Go to Extensions → Apps Script
 * 3. Delete all existing code
 * 4. Copy and paste THIS ENTIRE FILE
 * 5. Save the project
 * 6. Click "Deploy" → "New deployment"
 * 7. Select Type: "Web app"
 * 8. Execute as: Your email
 * 9. Who has access: "Anyone"
 * 10. Click "Deploy"
 * 11. Copy the deployment URL (it will look like: https://script.google.com/macros/s/YOUR_ID/userweb)
 * 12. Paste into the GOOGLE_APPS_SCRIPT_URL variable in src/services/googleSheetService.js
 *
 * IMPORTANT: After updating code, create a NEW deployment (don't update existing one)
 */

const SHEET_ID = "1j8je-5bynxIyygLFuchpWOy6yhRnnhesafW2KipoKvg";
const SHEET_NAME = "Results"; // First sheet tab name

// Column headers (A-J)
const HEADERS = [
  "Timestamp",
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "Score",
  "Total Questions",
  "Percentage",
  "Status",
  "Category Breakdown",
];

/**
 * Main POST handler - receives test results
 */
function doPost(e) {
  try {
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return createResponse(false, "Missing required fields");
    }

    // Get the active sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    // Prepare row data
    const newRow = [
      new Date().toISOString(),
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

    // Append to sheet
    sheet.appendRow(newRow);

    // Return success with sheet link
    return createResponse(true, "Results recorded successfully", {
      sheetLink: `https://docs.google.com/spreadsheets/d/${SHEET_ID}`,
      rowNumber: sheet.getLastRow(),
    });
  } catch (error) {
    Logger.log("Error: " + error);
    return createResponse(false, "Server error: " + error.toString());
  }
}

/**
 * GET handler for testing the endpoint
 */
function doGet(e) {
  const action = e.parameter.action;

  if (action === "test") {
    return createResponse(true, "Google Apps Script is working correctly!");
  }

  if (action === "getResults") {
    const email = e.parameter.email;
    try {
      const sheet =
        SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      const data = sheet.getDataRange().getValues();

      // Find rows matching email (skip header)
      const results = [];
      for (let i = 1; i < data.length; i++) {
        if (data[i][3] === email) {
          // Email is in column D (index 3)
          results.push({
            timestamp: data[i][0],
            firstName: data[i][1],
            lastName: data[i][2],
            email: data[i][3],
            phone: data[i][4],
            score: data[i][5],
            percentage: data[i][7],
            status: data[i][8],
          });
        }
      }

      return createResponse(true, "Results retrieved", { results: results });
    } catch (error) {
      return createResponse(false, "Error retrieving results: " + error);
    }
  }

  if (action === "getAllResults") {
    try {
      const sheet =
        SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      const data = sheet.getDataRange().getValues();

      // Skip header row and map all results
      const results = [];
      for (let i = 1; i < data.length; i++) {
        results.push({
          id: Date.now() + i, // Generate unique ID
          timestamp: data[i][0],
          firstName: data[i][1],
          lastName: data[i][2],
          email: data[i][3],
          phone: data[i][4],
          score: data[i][5],
          totalQuestions: data[i][6],
          percentage: data[i][7],
          status: data[i][8],
          categoryBreakdown: data[i][9],
        });
      }

      return createResponse(true, "All results retrieved", {
        results: results,
      });
    } catch (error) {
      return createResponse(false, "Error retrieving all results: " + error);
    }
  }

  return createResponse(false, "Unknown action");
}

/**
 * Helper function to create consistent response format
 */
function createResponse(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString(),
    ...data,
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Optional: Retrieve all results
 */
function getAllResults() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    // Skip header row
    const results = data.slice(1).map((row) => ({
      timestamp: row[0],
      firstName: row[1],
      lastName: row[2],
      email: row[3],
      phone: row[4],
      score: row[5],
      percentage: row[7],
      status: row[8],
    }));

    return results;
  } catch (error) {
    Logger.log("Error retrieving all results: " + error);
    return [];
  }
}

/**
 * Optional: Clear all results (use with caution!)
 */
function clearAllResults() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const range = sheet.getRange(
      2,
      1,
      sheet.getLastRow() - 1,
      sheet.getLastColumn(),
    );
    range.clearContent();
    Logger.log("All results cleared");
  } catch (error) {
    Logger.log("Error clearing results: " + error);
  }
}
