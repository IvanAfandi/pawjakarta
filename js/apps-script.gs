/**
 * PawJakarta — Google Apps Script v2
 * ─────────────────────────────────────────────────────────────────────
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire file (replace existing code)
 * 4. Save (Ctrl+S)
 * 5. Deploy → New deployment → Web app
 *    Execute as: Me | Who has access: Anyone
 * 6. Copy the Web App URL → paste into js/config.js as APPS_SCRIPT_URL
 *
 * SHEET COLUMN HEADERS (Row 1, exact order):
 *   id | name | area | type | address | hours | pet_size | rules | notes | photo_url | status | submitted_at
 *
 * IMPORTANT — type column values must be lowercase:
 *   park | cafe | mall | restaurant | other
 * ─────────────────────────────────────────────────────────────────────
 */

const SHEET_NAME = "Sheet1";

function doGet(e) {
  const action = e.parameter.action;
  if (action === "submitPlace") return submitPlace(e.parameter);
  return json({ error: "Unknown action" });
}

function submitPlace(params) {
  try {
    const ss  = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const newId = sheet.getLastRow(); // row 1 = headers, so this = next numeric id

    // Normalise type to lowercase so it always resolves in TYPE_META
    const type = (params.type || "other").toLowerCase().trim();

    sheet.appendRow([
      newId,
      params.name         || "",
      params.area         || "",
      type,
      params.address      || "",
      params.hours        || "",
      params.pet_size     || "All sizes",
      params.rules        || "",
      params.notes        || "",
      params.photo_url    || "",   // ← new column
      "pending",                   // status — change to "published" to go live
      params.submitted_at || new Date().toISOString(),
    ]);

    // Optional: email notification
    // MailApp.sendEmail(
    //   "ivanafandi88@gmail.com",
    //   "New PawJakarta submission: " + params.name,
    //   "Name: " + params.name + "\nArea: " + params.area + "\nType: " + type
    // );

    return json({ ok: true, message: "Submission received! We'll review and publish it shortly." });
  } catch (err) {
    return json({ ok: false, message: err.message });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
