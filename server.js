import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // 讀取 .env
const app = express();

// 🚨 移除或註解掉舊的 cors 設定
// app.use(cors({
//   origin: "https://kiigotravel-byte.github.io"
// }));

// ✅ 新增：手動設置 CORS 標頭
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://kiigotravel-byte.github.io');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 檢查 Hugging Face 金鑰有沒有讀到
console.log("HF API KEY:", process.env.HUGGINGFACE_API_KEY ? "讀到了" : "沒讀到");

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Missing message" });

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: userMessage })
    });


    const data = await response.json();
    console.log("🤖 Hugging Face API Response Status:", response.status);
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
    // 🚨 強制打印錯誤到日誌，無論如何
    console.error("🚨 [CRITICAL ERROR] 捕獲到異常:", err);
    console.error("🚨 [CRITICAL ERROR] 錯誤堆疊:", err.stack);

    // 將詳細錯誤返回給前端，方便您立即看到
    res.status(500).json({ 
      error: "Server Error", 
      details: err.message,
      stack: err.stack // 在開發階段可以返回堆疊，上線前應移除
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

