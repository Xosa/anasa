const express = require("express");
const axios = require("axios");
const config = require("../config");

const router = express.Router();

const MAJOR_ARCANA = [
  { id: 0, name: "The Fool" },
  { id: 1, name: "The Magician" },
  { id: 2, name: "The High Priestess" },
  { id: 3, name: "The Empress" },
  { id: 4, name: "The Emperor" },
  { id: 5, name: "The Hierophant" },
  { id: 6, name: "The Lovers" },
  { id: 7, name: "The Chariot" },
  { id: 8, name: "Strength" },
  { id: 9, name: "The Hermit" },
  { id: 10, name: "Wheel of Fortune" },
  { id: 11, name: "Justice" },
  { id: 12, name: "The Hanged Man" },
  { id: 13, name: "Death" },
  { id: 14, name: "Temperance" },
  { id: 15, name: "The Devil" },
  { id: 16, name: "The Tower" },
  { id: 17, name: "The Star" },
  { id: 18, name: "The Moon" },
  { id: 19, name: "The Sun" },
  { id: 20, name: "Judgement" },
  { id: 21, name: "The World" },
];

const CLASS_TYPE_SEVERITY = {
  X: 5,
  M: 4,
  C: 3,
  B: 2,
  A: 1,
};

const SEVERITY_CARD_MAP = {
  0: [0, 2, 4, 9, 14, 19], // Low severity - peaceful, calm cards (The Fool, The High Priestess, Emperor, Hermit, Temperance, The Sun)
  1: [1, 3, 5, 6, 8, 10, 11, 17], // Moderate severity - balanced cards (Magician, Empress, Hierophant, Lovers, Strength, Wheel, Justice, Star)
  2: [7, 12, 18, 20, 21], // High severity - intense cards (Chariot, Hanged Man, Moon, Judgement, World)
  3: [13, 15, 16], // Very High severity - transformative cards (Death, Devil, Tower)
};

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getWeekRange(dateStr) {
  const start = new Date(dateStr);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function severityScoreForClassType(classType) {
  if (!classType) return 0;
  const prefix = classType[0].toUpperCase();
  return CLASS_TYPE_SEVERITY[prefix] || 0;
}

function generateTarotDescription(events, label) {
  if (!events.length) {
    return `The ${label} week was calm and uneventful. No major solar flares were detected.`;
  }

  const counts = events.reduce((acc, ev) => {
    const cls = ev.classType?.[0]?.toUpperCase();
    if (cls) acc[cls] = (acc[cls] || 0) + 1;
    return acc;
  }, {});

  const total = events.length;
  const strong = (counts["X"] || 0) + (counts["M"] || 0);

  return `During the ${label} week, ${total} solar flare event${
    total !== 1 ? "s" : ""
  } occurred. ${strong} ${strong === 1 ? "was" : "were"} strong (M/X class).`;
}

function pickUniqueCardsBySeverity(pastScore, presentScore, futureScore) {
  const selectedIds = new Set();

  function pickUniqueCard(score) {
    let bucket = 0;
    if (score >= 8) bucket = 3;
    else if (score >= 6) bucket = 2;
    else if (score >= 2) bucket = 1;

    const candidates = SEVERITY_CARD_MAP[bucket].filter(
      (id) => !selectedIds.has(id)
    );

    const fallback = MAJOR_ARCANA.map((card) => card.id).filter(
      (id) => !selectedIds.has(id)
    );
    const available = candidates.length > 0 ? candidates : fallback;

    const chosenId = available[Math.floor(Math.random() * available.length)];
    selectedIds.add(chosenId);

    return MAJOR_ARCANA.find((card) => card.id === chosenId);
  }

  return {
    past: pickUniqueCard(pastScore),
    present: pickUniqueCard(presentScore),
    future: pickUniqueCard(futureScore),
  };
}

async function fetchDonkiEvents(startDate, endDate) {
  try {
    const res = await axios.get(`${config.NASA_API_URL}/DONKI/FLR`, {
      params: {
        startDate: startDate,
        endDate: endDate,
        api_key: process.env.NASA_API_KEY,
      },
    });
    return res.data || [];
  } catch (err) {
    console.error("DONKI API error:", err.message);
    return [];
  }
}

router.get("/", async (req, res) => {
  const { date } = req.query;
  if (!date)
    return res.status(400).json({ error: "Date parameter is required" });

  try {
    const { start: presentStart, end: presentEnd } = getWeekRange(date);
    const pastStart = formatDate(addDays(new Date(presentStart), -7));
    const pastEnd = formatDate(addDays(new Date(presentEnd), -7));
    const futureStart = formatDate(addDays(new Date(presentStart), 7));
    const futureEnd = formatDate(addDays(new Date(presentEnd), 7));

    const [pastEvents, presentEvents, futureEvents] = await Promise.all([
      fetchDonkiEvents(pastStart, pastEnd),
      fetchDonkiEvents(presentStart, presentEnd),
      fetchDonkiEvents(futureStart, futureEnd),
    ]);

    function calcSeverity(events) {
      return events.reduce(
        (sum, ev) => sum + severityScoreForClassType(ev.classType),
        0
      );
    }

    const pastSeverity = calcSeverity(pastEvents);
    const presentSeverity = calcSeverity(presentEvents);
    const futureSeverity = calcSeverity(futureEvents);

    const rawTarot = pickUniqueCardsBySeverity(
      pastSeverity,
      presentSeverity,
      futureSeverity
    );

    const tarot = {
      past: {
        ...rawTarot.past,
        description: generateTarotDescription(pastEvents, "past"),
      },
      present: {
        ...rawTarot.present,
        description: generateTarotDescription(presentEvents, "present"),
      },
      future: {
        ...rawTarot.future,
        description: generateTarotDescription(futureEvents, "future"),
      },
    };
    res.json({ date, tarot });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch DONKI data" });
  }
});

module.exports = router;
