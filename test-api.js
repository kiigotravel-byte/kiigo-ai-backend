import fetch from "node-fetch";

async function testAI() {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": "你的API_KEY", // 改成你的 Key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temperature: 0.7,
          candidateCount: 1,
          contents: [
            { parts: [
                { text: "你是專業旅遊助手，幫助使用者規劃行程、介紹景點文化。" },
                { text: "你好" }
              ] }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("AI 回傳完整資料:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("測試失敗:", err);
  }
}

testAI();
