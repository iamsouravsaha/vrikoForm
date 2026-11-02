/**
 * Company Contact Form -> Google Sheets
 * 1) Create/open a Google Sheet.
 * 2) Extensions > Apps Script.
 * 3) Replace the editor contents with this code and save.
 * 4) Deploy > New deployment > Select type: Web app.
 * 5) Execute as: Me. Who has access: Anyone (or the access policy your organisation requires).
 * 6) Deploy, authorise access, and copy the Web App URL ending in /exec into index.html.
 */

const SHEET_NAME = "Company Leads";
const HEADERS = [
  "Timestamp",
  "Company Name",
  "Location",
  "Contact Person",
  "Contact Number",
  "Comments"
];

function doGet() {
  return ContentService
    .createTextOutput("Company Contact Form endpoint is active.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No request body received.");
    }

    const data = JSON.parse(e.postData.contents);

    const companyName = clean_(data.companyName);
    const location = clean_(data.location);
    const contactPerson = clean_(data.contactPerson);
    const contactNumber = clean_(data.contactNumber);
    const comments = clean_(data.comments);

    if (!companyName || !location || !contactPerson || !contactNumber) {
      throw new Error("Please provide all required fields.");
    }

    // Bind the script to the target spreadsheet for dependable destination selection.
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error("No active spreadsheet found. Open Apps Script from the target Google Sheet.");
    }

    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    // Prefix user-entered values beginning with formula characters to avoid spreadsheet formula injection.
    const safe = value => /^[=+\-@]/.test(value) ? "'" + value : value;

    sheet.appendRow([
      new Date(),
      safe(companyName),
      safe(location),
      safe(contactPerson),
      safe(contactNumber),
      safe(comments)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, message: "Saved" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error(err);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: String(err.message || err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function clean_(value) {
  return String(value == null ? "" : value).trim().slice(0, 2000);
}
