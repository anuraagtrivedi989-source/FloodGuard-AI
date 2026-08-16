const express = require("express");
const cors = require("cors");


const db = require("./db");
const axios = require("axios");

const multer = require("multer");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/flood-reports");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


const PORT = 5000;

app.use(cors());
app.use(express.json());
// ===================Upload report=============== //
app.post(
  "/api/flood-reports",
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        description,
        latitude,
        longitude
      } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          error: "Location is required"
        });
      }

      const photoPath = req.file
        ? `/uploads/flood-reports/${req.file.filename}`
        : null;

      const [result] = await db.query(
        `INSERT INTO flood_reports
        (description, latitude, longitude, photo)
        VALUES (?, ?, ?, ?)`,
        [
          description || "",
          latitude,
          longitude,
          photoPath
        ]
      );

      res.status(201).json({
        message: "Flood report submitted successfully",
        reportId: result.insertId,
        photo: photoPath
      });

    } catch (error) {
      console.error(
        "Error submitting flood report:",
        error
      );

      res.status(500).json({
        error: "Failed to submit flood report"
      });
    }
  }
);

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

// ===================Flood-Locations============= //
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
// ===================API For shelters===================== //
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
//  ========================Available Shelters====================== //
app.get("/api/shelters/available", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        city,
        latitude,
        longitude,
        capacity,
        occupied,
        (capacity - occupied) AS available_capacity,
        status
      FROM shelters
      WHERE status = 'Open'
        AND occupied < capacity
      ORDER BY available_capacity DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching available shelters:", error);

    res.status(500).json({
      error: "Failed to fetch available shelters",
    });
  }
});

// ============Shelter Recommendation==================== //
app.get("/api/shelters/recommend", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        error: "City is required",
      });
    }

    // 1. Find the selected flood location
    const [locationRows] = await db.query(
      `
      SELECT
        city,
        latitude,
        longitude,
        risk
      FROM flood_locations
      WHERE city = ?
      LIMIT 1
      `,
      [city]
    );

    if (locationRows.length === 0) {
      return res.status(404).json({
        error: "Flood location not found",
      });
    }

    const floodLocation = locationRows[0];

    // 2. Find all open shelters with available capacity
    const [shelterRows] = await db.query(`
      SELECT
        id,
        name,
        city,
        latitude,
        longitude,
        capacity,
        occupied,
        (capacity - occupied) AS available_capacity,
        status
      FROM shelters
      WHERE status = 'Open'
        AND occupied < capacity
    `);

    if (shelterRows.length === 0) {
      return res.status(404).json({
        error: "No available shelters found",
      });
    }

    // 3. Calculate distance between two coordinates
    const calculateDistance = (
      lat1,
      lon1,
      lat2,
      lon2
    ) => {
      const R = 6371;

      const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

      const dLon =
        ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return R * c;
    };

    // 4. Calculate distance for every shelter
    const sheltersWithDistance = shelterRows.map(
      (shelter) => {
        const distance = calculateDistance(
          Number(floodLocation.latitude),
          Number(floodLocation.longitude),
          Number(shelter.latitude),
          Number(shelter.longitude)
        );

        return {
          ...shelter,
          distance_km: Number(distance.toFixed(2)),
        };
      }
    );

    // 5. Sort nearest shelter first
    const risk = String(floodLocation.risk).toLowerCase();

    const riskWeight = {
      critical: 3,
      high: 2,
      medium: 1,
      low: 0,
    }[risk] ?? 0;

    const sheltersWithScore = sheltersWithDistance.map(
      (shelter) => {
        const capacityScore =
          Math.min(
            shelter.available_capacity / 500,
            1
          );

        const distanceScore =
          1 / (1 + shelter.distance_km);

        const score =
          distanceScore * 0.6 +
          capacityScore * 0.4;

        return {
          ...shelter,
          recommendation_score: Number(
            score.toFixed(4)
          ),
          risk_level: floodLocation.risk,
        };
      }
    );

    sheltersWithScore.sort(
      (a, b) =>
        b.recommendation_score -
        a.recommendation_score
    );


    // 6. Select nearest available shelter
    const recommendedShelter =
      sheltersWithScore[0];

    // 7. Return recommendation
    res.json({
      flood_location: floodLocation.city,
      flood_risk: floodLocation.risk,
      recommended_shelter: recommendedShelter,
    });

  } catch (error) {
    console.error(
      "Error recommending shelter:",
      error
    );

    res.status(500).json({
      error: "Failed to recommend shelter",
    });
  }
});

// ================wather Information====================== //
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

// ==========================Risk Prediction==================== //
app.post("/api/predict", async (req, res) => {
  try {
    const { rainfall, water_level, humidity } = req.body;

    const response = await axios.post(
      "http://localhost:5001/predict",
      {
        rainfall,
        water_level,
        humidity,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error connecting to ML service:",
      error.message
    );

    res.status(500).json({
      error: "Unable to get flood prediction",
    });
  }
});

app.post("/api/flood-reports", async (req, res) => {
  try {
    const {
      description,
      latitude,
      longitude,
      photo
    } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Location is required"
      });
    }

    const [result] = await db.query(
      `INSERT INTO flood_reports
       (description, latitude, longitude, photo)
       VALUES (?, ?, ?, ?)`,
      [
        description || "",
        latitude,
        longitude,
        photo || null
      ]
    );

    res.status(201).json({
      message: "Flood report submitted successfully",
      reportId: result.insertId
    });

  } catch (error) {
    console.error("Error submitting flood report:", error);

    res.status(500).json({
      error: "Failed to submit flood report"
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FloodGuard AI server running on port ${PORT}`);
});