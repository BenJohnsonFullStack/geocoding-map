require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const url = require("url");

const PORT = process.env.PORT || 9000;

// init express
const app = express();

// enable cors
app.use(cors());

// routes
app.get("/api/search/:query", async (req, res) => {
  try {
    // add API key and query strings
    const params = new URLSearchParams({
      access_token: process.env.API_KEY,
      ...url.parse(req.url, true).query,
    });
    console.log(params);
    const query = req.params.query;
    const results = await axios(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`
    );
    const data = results.data;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
