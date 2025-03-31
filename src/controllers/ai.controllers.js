import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
  console.error("❌ Missing Groq API Key! Check your .env file.");
  process.exit(1);
}

// ✅ Handle text-based chat messages
export const chatWithGroq = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    console.log("🧠 Sending request to Groq API:", message);

    const response = await axios.post(
      GROQ_API_URL,
      { model: "llama3-8b-8192", messages: [{ role: "user", content: message }] },
      { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } }
    );

    console.log("✅ Groq API Response:", response.data);
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("🔥 Chat Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Chat processing failed" });
  }
};

// ✅ Analyze images using Base64
export const analyzeImageBase64 = async (req, res) => {
  try {
    const { image_base64 } = req.body;
    if (!image_base64) return res.status(400).json({ error: "No image provided" });

    // Ensure proper formatting (remove any data URI prefix)
    const cleanedBase64 = image_base64.replace(/^data:image\/\w+;base64,/, "");

    console.log("🖼️ Analyzing Base64 Image");

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image" },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${cleanedBase64}` } }
            ]
          }
        ]
      },
      { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } }
    );

    console.log("✅ Image Analysis Response:", response.data);
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("🔥 Image Analysis Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image processing failed" });
  }
};
