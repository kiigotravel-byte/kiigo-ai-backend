import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
       model: "google/gemini-pro-1.5",
        messages: [
          { role: "system", content: "你是專業旅遊助手，幫助使用者規劃行程、介紹景點文化。" },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    
    // ✅ 確保 AI 回覆有效
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      res.json({ reply: data.choices[0].message.content });
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


