const express = require("express");
const axios = require("axios");
const url = require("url");

const router = express.Router();

router.get("/:query", async (req, res) => {
  try {
    // add API key and query strings
    const params = new URLSearchParams({
      access_token: process.env.API_KEY,
      ...url.parse(req.url, true).query,
    });

    // user search
    const query = req.params.query;

    // mapbox url
    const results = await axios(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`
    );

    results.data.features.forEach((item) => {
      // initialize to null
      item.city = null;
      item.state = null;

      // cycle through content results
      item.context.forEach((type) => {
        if (type.id.includes("place")) {
          item.city = type.text;
        }
        if (type.id.includes("region")) {
          item.state = type.text;
        }
      });
    });

    const data = results.data;

    // return data to user
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
