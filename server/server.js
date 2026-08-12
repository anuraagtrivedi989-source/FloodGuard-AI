const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "FloodGuard AI backend is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "FloodGuard AI API is healthy",
  });
});

app.get("/api/flood-locations", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM flood_locations"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching flood locations:", error);

    res.status(500).json({
      error: "Failed to fetch flood locations",
    });
  }
});

app.get("/api/shelters", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM shelters"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching shelters:", error);

    res.status(500).json({
      error: "Failed to fetch shelters",
    });
  }
});

app.get("/api/weather", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM weather_data ORDER BY recorded_at DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching weather:", error);

    res.status(500).json({
      error: "Failed to fetch weather data",
    });
  }
});

db.query("SELECT 1")
  .then(() => {
    console.log("MySQL connected successfully!");
  })
  .catch((error) => {
    console.error("MySQL connection failed:", error.message);
  });

app.listen(PORT, () => {
  console.log(`FloodGuard AI server running on port ${PORT}`);
});