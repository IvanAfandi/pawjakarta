/**
 * PawJakarta — Configuration
 *
 * SETUP INSTRUCTIONS:
 * ─────────────────────────────────────────────────────────────────────
 * 1. Create a Google Sheet with these columns in Row 1 (exact names):
 *      id | name | area | type | address | hours | pet_size | rules | notes | status
 *
 * 2. Publish the sheet to the web:
 *      File → Share → Publish to web → Choose "Sheet1" → CSV → Publish
 *      Copy the generated URL.
 *
 * 3. For the Submit Form (write access), set up a Google Apps Script:
 *      In your Sheet: Extensions → Apps Script
 *      Paste the script from: js/apps-script.gs  (see that file for instructions)
 *      Deploy as Web App → Anyone can access → Copy the Web App URL.
 *
 * 4. Replace the placeholder URLs below with your actual URLs.
 * ─────────────────────────────────────────────────────────────────────
 */

const CONFIG = {

  /**
   * READ — Published Google Sheet CSV URL
   * Get from: File → Share → Publish to web → CSV → Publish
   * Format: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?gid=0&single=true&output=csv
   *
   * Replace the URL below with yours:
   */
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?gid=0&single=true&output=csv",

  /**
   * WRITE — Google Apps Script Web App URL
   * Get from: Apps Script → Deploy → Web App → Copy URL
   * Replace the URL below with yours:
   */
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",

  /**
   * Fallback to bundled data if the sheet can't be reached
   */
  USE_FALLBACK_ON_ERROR: true,

  /**
   * Cache duration in milliseconds (default: 5 minutes)
   */
  CACHE_TTL: 5 * 60 * 1000,

};
