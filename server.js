<<<<<<< HEAD
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
        model: "moonshotai/kimi",
        messages: [
          { role: "system", content: "你是專業旅遊助手，幫助使用者規劃行程、介紹景點文化。" },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    
    // ✅ 新增的檢查，確保 AI 回覆有效
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
=======
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
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // 🔑 Key 存在環境變數，不會暴露
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "moonshotai/kimi",
        messages: [
          { role: "system", content: "你是專業旅遊助手，幫助使用者規劃行程、介紹景點文化。" },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
>>>>>>> cee7af990307ecb367810be4820b181534fa3d4a
