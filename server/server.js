const express = require("express");
const cors = require("cors");
const floodLocations = require("./data/floodLocations");

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

app.get("/api/flood-locations", (req, res) => {
  res.json(floodLocations);
});

app.listen(PORT, () => {
  console.log(`FloodGuard AI server running on port ${PORT}`);
});