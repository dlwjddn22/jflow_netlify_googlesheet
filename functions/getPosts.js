import { google } from "googleapis";

export async function handler() {
  try {
    console.log("🔹 getPosts function called");

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      // Netlify 환경변수에 저장된 PRIVATE_KEY는 줄바꿈 문제가 있으므로 replace 처리
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );    

    const sheets = google.sheets({ version: "v4", auth });
    console.log("✅ Sheets API initialized");

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "posts!A2:D",
    });

    console.log("✅ Sheets API response received");

    const rows = res.data.values || [];
    console.log("📌 Rows fetched:", rows);

    const posts = rows.map(r => ({
      id: r[0],
      title: r[1],
      content: r[2],
      createdAt: r[3],
    }));

    console.log("📌 Parsed posts:", posts);

    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    };
  } catch (err) {
    console.error("❌ Error in getPosts function:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
