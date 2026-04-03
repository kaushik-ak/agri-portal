import { useState } from "react";
import axios from "axios";

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState({});
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  // ===== WEATHER =====
  const getWeather = async () => {
    const res = await axios.get(`${API}/weather/${city}`);
    setWeather(res.data);
  };

  // ===== CHATBOT =====
  const askAI = async () => {
    const res = await axios.post(`${API}/chat`, {
      message: question
    });
    setAnswer(res.data.reply);
  };

  // ===== IMAGE ANALYSIS =====
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", image);

    const res = await axios.post(`${API}/analyze`, formData);
    setResult(res.data);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🌾 Indian Agriculture Portal</h1>

      {/* WEATHER */}
      <h2>Weather</h2>
      <input value={city} onChange={(e) => setCity(e.target.value)} />
      <button onClick={getWeather}>Get Weather</button>

      {weather.temperature && (
        <div>
          <p>🌡 Temp: {weather.temperature} °C</p>
          <p>💧 Humidity: {weather.humidity}</p>
          <p>🌥 {weather.description}</p>
        </div>
      )}

      {/* CHATBOT */}
      <h2>AI Farming Assistant</h2>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask farming question..."
      />
      <button onClick={askAI}>Ask</button>

      <p>{answer}</p>

      {/* IMAGE ANALYSIS */}
      <h2>Crop Disease Detection</h2>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={uploadImage}>Analyze</button>

      {result && (
        <div>
          <p>🦠 Disease: {result.disease}</p>
          <p>🌱 Fertilizer: {result.fertilizer}</p>
          <p>📏 Quantity: {result.quantity}</p>
        </div>
      )}
    </div>
  );
}