const express = require("express");
const axios = require("axios");
const config = require("../config");

const router = express.Router();

const MIN_DATE = "1995-07-16";
const MAX_DATE = new Date().toISOString().split("T")[0];

function validateDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { valid: false, error: "Invalid date format, expected YYYY-MM-DD" };
  }

  if (dateStr < MIN_DATE || dateStr > MAX_DATE) {
    return {
      valid: false,
      error: `Date cannot be before ${MIN_DATE} or in the future`,
    };
  }

  return { valid: true };
}

router.get("/", async (req, res) => {
  const { date } = req.query;

  if (!date) return res.status(400).json({ error: "Date is required" });

  const { valid, error } = validateDate(date);
  if (!valid) return res.status(400).json({ error });

  try {
    const response = await axios.get(`${config.NASA_API_URL}/planetary/apod`, {
      params: {
        api_key: process.env.NASA_API_KEY,
        date,
      },
    });
    const { url, title, explanation } = response.data;

    res.json({ url, title, description: explanation, date });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch APOD data" });
  }
});

module.exports = router;
