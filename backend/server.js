require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// ===== DATABASE =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ===== FILE UPLOAD =====
const upload = multer({ dest: "uploads/" });

// ===== WEATHER API =====
app.get("/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    res.json({
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description
    });

  } catch (err) {
    console.log("Weather Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Weather fetch failed",
      details: err.response?.data || err.message
    });
  }
});

// ===== AI CHATBOT =====
const axios = require("axios");

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an Indian agriculture expert. Suggest fertilizers with quantity per acre."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "AI failed" });
  }
});
// ===== IMAGE ANALYSIS =====
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    // Placeholder AI logic
    res.json({
      disease: "Leaf Spot",
      fertilizer: "Copper Fungicide",
      quantity: "3g per liter water spray"
    });
  } catch (err) {
    res.status(500).json({ error: "Image analysis failed" });
  }
});

// ===== SCHEMES MODEL =====
const Scheme = mongoose.model("Scheme", {
  name: String,
  state: String,
  details: String
});

// ===== GET SCHEMES =====
app.get("/schemes", async (req, res) => {
  const schemes = await Scheme.find();
  res.json(schemes);
});

// ===== ADD SCHEME =====
app.post("/schemes", async (req, res) => {
  const scheme = new Scheme(req.body);
  await scheme.save();
  res.json({ message: "Scheme added successfully" });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
