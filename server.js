import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// 只允許你的 GitHub Pages 網域
app.use(cors({
  origin: "https://kiigotravel-byte.github.io"
}));

app.use(express.json());
console.log("API KEY:", process.env.GOOGLE_API_KEY ? "讀到了" : "沒讀到");


app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Missing message" });

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": process.env.GOOGLE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: "你是專業旅遊助手，幫助使用者規劃行程、介紹景點文化。" },
                { text: userMessage },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("AI 回傳完整資料:", JSON.stringify(data, null, 2));

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      res.json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({
        error: "No valid reply from AI.",
        details: data,
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
    console.error(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
