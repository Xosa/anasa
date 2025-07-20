const express = require("express");
const axios = require("axios");
const config = require("../config");

const router = express.Router();

const LANDING_DATES = {
  curiosity: "2012-08-06",
  opportunity: "2004-01-25",
  spirit: "2004-01-04",
  perseverance: "2021-02-18",
};

router.get("/", async (req, res) => {
  const { rover = "curiosity", date } = req.query;
  if (!date) return res.status(400).json({ error: "date is required" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return res.status(400).json({ error: "Date format must be YYYY-MM-DD" });
  const land = LANDING_DATES[rover.toLowerCase()];
  if (!land) return res.status(400).json({ error: "Unknown rover" });
  if (date < land)
    return res.status(400).json({
      error: `Images from ${rover} rover are available only from ${land}`,
    });

  const all = [];
  let page = 1;
  try {
    while (true) {
      const resp = await axios.get(
        `${config.NASA_API_URL}/mars-photos/api/v1/rovers/${rover}/photos`,
        {
          params: { earth_date: date, api_key: process.env.NASA_API_KEY, page },
        }
      );
      const photos = resp.data.photos;
      if (!photos || photos.length === 0) break;
      all.push(
        ...photos.map((p) => ({
          id: p.id,
          camera: p.camera.full_name,
          img_src: p.img_src,
        }))
      );
      if (photos.length < 25) break;
      page++;
    }
    res.json({ date, rover, photos: all });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed retrieving rover photos" });
  }
});

module.exports = router;
