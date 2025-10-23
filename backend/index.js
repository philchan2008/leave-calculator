const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3001;

// Enable CORS for all origins (or specify allowed origins)
app.use(cors());

app.get("/holidays", async (req, res) => {
  try {
    const response = await axios.get("https://www.1823.gov.hk/common/ical/en.json");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      name: error.name,
      stack: error.stack
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
