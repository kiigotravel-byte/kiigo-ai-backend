import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // 讀取 .env

const app = express();

// 只允許你的 GitHub Pages 網域
app.use(cors({
  origin: "https://kiigotravel-byte.github.io",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 檢查 Hugging Face 金鑰有沒有讀到
console.log("HF API KEY:", process.env.HUGGINGFACE_API_KEY ? "讀到了" : "沒讀到");

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Missing message" });

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: userMessage })
    });

    const data = await response.json();
    console.log("AI 回傳完整資料:", JSON.stringify(data, null, 2));

    if (data?.length > 0 && data[0]?.generated_text) {
      res.json({ reply: data[0].generated_text });
    } else {
      res.status(500).json({
        error: "No valid reply from Hugging Face.",
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

