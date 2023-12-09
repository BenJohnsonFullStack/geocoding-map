require("dotenv").config();
const express = require("express");
const cors = require("cors");

const searchResults = require("./routes/searchResults");

const PORT = process.env.PORT || 9000;

// init express
const app = express();

// enable cors
app.use(cors());

// routes
app.use("/api/search", searchResults);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
