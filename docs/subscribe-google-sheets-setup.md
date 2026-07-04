# Subscribe Form → Google Sheets Setup

This form (`/subscribe`) sends submissions to a Google Sheet via a Google Apps
Script Web App. You need to create and deploy this yourself — it runs under
your own Google account, which nothing outside your browser session can do
for you.

## 1. Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. In row 1, add these column headers (matching what the script writes):
   `Timestamp | User Name | Email | GitHub Username | Company Name | Categories`

## 2. Add the Apps Script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete the default `myFunction() {}` placeholder code.
3. Paste in the following:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.userName || '',
    data.email || '',
    data.githubUsername || '',
    data.companyName || '',
    (data.categories || []).join(', ')
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click the disk/save icon (or Cmd/Ctrl+S). Name the project something like "Subscribe Form Handler".

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Description: e.g. "Subscribe form handler".
4. **Execute as:** Me.
5. **Who has access:** Anyone.
6. Click **Deploy**.
7. Google will show an "unverified app" warning since this is your own unpublished script — click **Advanced**, then **Go to (your project name) (unsafe)**, then **Allow**. This is expected for scripts you write yourself and isn't a security issue for your own account.
8. Copy the **Web app URL** shown (it ends in `/exec`). This is your `VITE_GOOGLE_SHEETS_WEBHOOK_URL`.

## 4. Configure the frontend

Add the URL to your local `.env` file (see `.env.example`):

```
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXXXXXX/exec
```

## 5. Test the deployment directly (before touching the frontend)

```bash
curl -X POST "https://script.google.com/macros/s/XXXXXXXXXXXX/exec" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"userName":"Test User","email":"test@example.com","githubUsername":"testuser","companyName":"Test Co","categories":["javascript","ai"]}'
```

Expected: curl prints `{"status":"success"}`, and a new row appears at the
bottom of your Sheet with today's date and the test data above.

## Notes

- This Web App has no authentication — anyone who obtains the URL can POST
  arbitrary rows to your Sheet. Acceptable for a low-stakes subscribe form;
  there's no rate limiting or spam filtering here.
- If you ever need to redeploy after editing the script, use **Deploy →
  Manage deployments → Edit (pencil icon) → New version → Deploy** to keep
  the same URL, rather than creating an entirely new deployment (which gets
  a different URL).
