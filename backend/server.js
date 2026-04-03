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
      city,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed
    });
  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

// ===== AI CHATBOT =====
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Replace with OpenAI API if needed
    const reply = `🌾 Based on your query "${message}", apply NPK 20:20:20 fertilizer at 50kg per acre. Ensure proper irrigation.`;

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Chatbot error" });
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