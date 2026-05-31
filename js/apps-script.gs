/**
 * PawJakarta — Google Apps Script
 * ─────────────────────────────────────────────────────────────────────
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire file into the editor (replace any existing code)
 * 4. Save (Ctrl+S)
 * 5. Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Click Deploy → copy the Web App URL
 * 7. Paste that URL into js/config.js as APPS_SCRIPT_URL
 * ─────────────────────────────────────────────────────────────────────
 *
 * SHEET STRUCTURE (Row 1 must be exactly these headers):
 *   id | name | area | type | address | hours | pet_size | rules | notes | status | submitted_at
 */

const SHEET_NAME = "Sheet1"; // Change if your tab has a different name

function doGet(e) {
  const action = e.parameter.action;

  if (action === "submitPlace") {
    return submitPlace(e.parameter);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ error: "Unknown action" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function submitPlace(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    // Get next ID
    const lastRow = sheet.getLastRow();
    const newId = lastRow; // Row 1 = headers, so lastRow = last data row index = new id

    sheet.appendRow([
      newId,
      params.name || "",
      params.area || "",
      params.type || "",
      params.address || "",
      params.hours || "",
      params.pet_size || "All sizes",
      params.rules || "",
      params.notes || "",
      "pending",          // status — admin reviews before changing to "published"
      params.submitted_at || new Date().toISOString(),
    ]);

    // Optional: send email notification to admin
    // MailApp.sendEmail("ivanafandi88@gmail.com", "New PawJakarta submission: " + params.name, JSON.stringify(params, null, 2));

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, message: "Submission received!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
