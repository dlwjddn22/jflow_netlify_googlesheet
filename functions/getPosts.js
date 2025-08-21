import { google } from "googleapis";

export async function handler() {
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "posts!A2:D",
    });

    const rows = res.data.values || [];
    const posts = rows.map(r => ({
      id: r[0],
      title: r[1],
      content: r[2],
      createdAt: r[3],
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
