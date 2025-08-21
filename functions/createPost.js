import { google } from "googleapis";

export async function handler(event) {
  try {
    const { title, content } = JSON.parse(event.body);
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "posts!A:D",
      valueInputOption: "RAW",
      requestBody: {
        values: [[id, title, content, createdAt]],
      },
    });

    return { statusCode: 200, body: JSON.stringify({ status: "ok", id }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
