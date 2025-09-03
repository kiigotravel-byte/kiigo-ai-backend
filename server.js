import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent", {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.GOOGLE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "contents": [
          {
            "parts": [
              {
                "text": "你是專業旅遊助手，幫助使用者規劃行程、介紹景點文化。"
              },
              {
                "text": userMessage
              }
            ]
          }
        ]
      })
    });
    const data = await response.json();
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
      res.json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      console.error("No valid reply from AI:", data);
      res.status(500).json({ error: "No valid reply from AI." });
    }
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));

