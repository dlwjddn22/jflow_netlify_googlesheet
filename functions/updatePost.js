import { google } from "googleapis";

export async function handler(event) {
  try {
    const { id, title, content } = JSON.parse(event.body);

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    // 현재 시트 데이터 읽기
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "posts!A2:D",
    });

    const rows = res.data.values || [];
    let found = false;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === id) {
        const rowNumber = i + 2; // A2가 row 2라서 보정
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.SHEET_ID,
          range: `posts!B${rowNumber}:C${rowNumber}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[title, content]],
          },
        });
        found = true;
        break;
      }
    }

    if (!found) {
      return { statusCode: 404, body: JSON.stringify({ status: "not found" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ status: "ok" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
