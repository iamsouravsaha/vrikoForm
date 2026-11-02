# Company Contact Form — Google Sheets Setup

This package contains:
- `index.html` — polished, responsive company contact form
- `Code.gs` — Google Apps Script backend that appends submitted records to Google Sheets

## Fields
1. Company Name (required)
2. Location (required)
3. Contact Person (required)
4. Contact Number (required)
5. Comments (optional)

The sheet also records a Timestamp automatically.

## Setup (one-time)

### 1. Create the Google Sheet
1. Open Google Sheets and create a blank spreadsheet.
2. Give it a name such as `Company Contact Leads`.
3. From the sheet menu, open **Extensions → Apps Script**.

### 2. Add the backend
1. Remove the sample code in the Apps Script editor.
2. Open `Code.gs` from this package and copy all its contents into the editor.
3. Click **Save**.
4. The script uses the spreadsheet it was opened from and creates a tab named `Company Leads` on the first submission.

### 3. Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Select the gear/type menu and choose **Web app**.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone**, if your organisation permits public submissions. If this is not permitted by your Workspace admin, use an approved access policy instead.
5. Click **Deploy** and complete Google's authorisation prompts.
6. Copy the **Web app URL**. It normally ends with `/exec`. Do not use the Apps Script editor URL.

**Security note:** Anyone with access to a public web app URL may be able to submit entries. Do not put confidential or sensitive data in this public form. For internal-only use, use your organisation's approved authentication/access policy.

### 4. Connect the HTML form
1. Open `index.html` in a text editor such as Notepad or VS Code.
2. Find this line near the bottom:

   `const WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";`

3. Replace the placeholder with your copied Web App URL, keeping the quotation marks.
4. Save the file.

### 5. Test it
1. Open `index.html` in Chrome.
2. Enter a test company and submit.
3. Open the Google Sheet and check the `Company Leads` tab for the new row.

## Important browser limitation
The HTML uses `fetch` with `mode: "no-cors"` because Apps Script web-app responses can be blocked from being read by a local HTML file due to browser CORS rules. The form can send the request, but the browser cannot reliably verify that Google Sheets saved it. Always verify the row in the sheet during testing.

## Troubleshooting
- **No row appears:** Confirm the Web App URL ends in `/exec`, not `/dev`.
- **Deployment updated but still old behaviour:** Open **Deploy → Manage deployments**, edit the deployment, and deploy a new version.
- **Permission/access error:** Check the deployment's access setting and Workspace administrator policy.
- **Wrong spreadsheet:** Ensure Apps Script was opened using **Extensions → Apps Script** from the target spreadsheet.
