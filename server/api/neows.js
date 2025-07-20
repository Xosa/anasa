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
      error: `Date must be between ${MIN_DATE} and ${MAX_DATE}`,
    };
  }

  return { valid: true };
}

function normalize(value, min, max, outMin, outMax) {
  const clamped = Math.max(min, Math.min(value, max));
  return outMin + ((clamped - min) / (max - min)) * (outMax - outMin);
}

router.get("/", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Date is required" });

  const { valid, error } = validateDate(date);
  if (!valid) return res.status(400).json({ error });

  try {
    const response = await axios.get(
      `${config.NASA_API_URL}/neo/rest/v1/feed`,
      {
        params: {
          start_date: date,
          end_date: date,
          api_key: process.env.NASA_API_KEY,
        },
      }
    );

    const raw = response.data.near_earth_objects?.[date] || [];

    const processed = raw
      .map((a) => {
        const approach = a.close_approach_data[0];
        if (!approach) return null;

        return {
          id: a.id,
          name: a.name,
          is_hazardous: a.is_potentially_hazardous_asteroid,
          diameter_km: a.estimated_diameter.kilometers.estimated_diameter_max,
          distance_km: parseFloat(approach.miss_distance.kilometers),
          speed_kph: parseFloat(approach.relative_velocity.kilometers_per_hour),
        };
      })
      .filter(Boolean);

    const speeds = processed.map((a) => a.speed_kph);
    const distances = processed.map((a) => a.distance_km);

    const minSpeed = Math.min(...speeds);
    const maxSpeed = Math.max(...speeds);

    const minDistance = Math.min(...distances);
    const maxDistance = Math.max(...distances);

    const asteroids = processed.map((a) => ({
      ...a,
      // Invert min/max output to get faster speed = shorter duration
      orbit_duration: normalize(a.speed_kph, minSpeed, maxSpeed, 30, 4),
      orbit_radius: normalize(a.distance_km, minDistance, maxDistance, 80, 200),
    }));

    res.json({ date, asteroids });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch NEOWS data" });
  }
});

module.exports = router;
