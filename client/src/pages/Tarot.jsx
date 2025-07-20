import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./Tarot.css";
import Divider from "../components/Divider";
import Tooltip from "../components/Tooltip";
import config from "../config";

const TAROT_CARDS = [
  {
    id: 0,
    name: "The Fool",
    image: "assets/tarot/fool.jpg",
    defaultMeaning: "New beginnings, spontaneity, free spirit",
  },
  {
    id: 1,
    name: "The Magician",
    image: "assets/tarot/magician.jpg",
    defaultMeaning: "Manifestation, power, resourcefulness",
  },
  {
    id: 2,
    name: "The High Priestess",
    image: "assets/tarot/high_priestess.jpg",
    defaultMeaning: "Intuition, mystery, subconscious mind",
  },
  {
    id: 3,
    name: "The Empress",
    image: "assets/tarot/empress.jpg",
    defaultMeaning: "Fertility, beauty, nurturing, abundance",
  },
  {
    id: 4,
    name: "The Emperor",
    image: "assets/tarot/emperor.jpg",
    defaultMeaning: "Authority, structure, leadership, father figure",
  },
  {
    id: 5,
    name: "The Hierophant",
    image: "assets/tarot/hierophant.jpg",
    defaultMeaning: "Tradition, spiritual wisdom, conformity",
  },
  {
    id: 6,
    name: "The Lovers",
    image: "assets/tarot/lovers.jpg",
    defaultMeaning: "Love, harmony, partnerships, choices",
  },
  {
    id: 7,
    name: "The Chariot",
    image: "assets/tarot/chariot.jpg",
    defaultMeaning: "Willpower, control, determination, success",
  },
  {
    id: 8,
    name: "Strength",
    image: "assets/tarot/strength.jpg",
    defaultMeaning: "Courage, inner strength, patience",
  },
  {
    id: 9,
    name: "The Hermit",
    image: "assets/tarot/hermit.jpg",
    defaultMeaning: "Solitude, introspection, inner guidance",
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    image: "assets/tarot/wheel.jpg",
    defaultMeaning: "Cycles, fate, turning point, karma",
  },
  {
    id: 11,
    name: "Justice",
    image: "assets/tarot/justice.jpg",
    defaultMeaning: "Truth, fairness, law, accountability",
  },
  {
    id: 12,
    name: "The Hanged Man",
    image: "assets/tarot/hanged_man.jpg",
    defaultMeaning: "Pause, surrender, letting go",
  },
  {
    id: 13,
    name: "Death",
    image: "assets/tarot/death.jpg",
    defaultMeaning: "Transformation, endings, transition",
  },
  {
    id: 14,
    name: "Temperance",
    image: "assets/tarot/temperance.jpg",
    defaultMeaning: "Balance, moderation, purpose, patience",
  },
  {
    id: 15,
    name: "The Devil",
    image: "assets/tarot/devil.jpg",
    defaultMeaning: "Addiction, materialism, shadow self",
  },
  {
    id: 16,
    name: "The Tower",
    image: "assets/tarot/tower.jpg",
    defaultMeaning: "Sudden change, chaos, revelation",
  },
  {
    id: 17,
    name: "The Star",
    image: "assets/tarot/star.jpg",
    defaultMeaning: "Hope, inspiration, renewal, faith",
  },
  {
    id: 18,
    name: "The Moon",
    image: "assets/tarot/moon.jpg",
    defaultMeaning: "Illusion, fear, intuition, dreams",
  },
  {
    id: 19,
    name: "The Sun",
    image: "assets/tarot/sun.jpg",
    defaultMeaning: "Joy, success, celebration, positivity",
  },
  {
    id: 20,
    name: "Judgement",
    image: "assets/tarot/judgement.jpg",
    defaultMeaning: "Reflection, reckoning, inner calling",
  },
  {
    id: 21,
    name: "The World",
    image: "assets/tarot/world.jpg",
    defaultMeaning: "Completion, achievement, wholeness",
  },
];

function TarotPage({ date }) {
  const [flipped, setFlipped] = useState([false, false, false]);
  const [tarotCards, setTarotCards] = useState({
    past: null,
    present: null,
    future: null,
  });
  const [error, setError] = useState(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!date) return;

    const fetchTarot = async () => {
      try {
        const res = await fetch(
          `${config.API_BASE_URL}/api/tarot?date=${date}`
        );
        const json = await res.json();
        setTarotCards(json.tarot);
        setFlipped([false, false, false]);
      } catch {
        setError("Failed to load asteroid data.");
      }
    };
    if (date) fetchTarot();
  }, [date]);

  const handleFlip = (index) => {
    setFlipped((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const labels = ["PAST", "PRESENT", "FUTURE"];
  const keys = ["past", "present", "future"];

  return (
    <Divider className="tarot-container">
      <h1>Cosmic Tarot Reading</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Divider className="cards">
        {keys.map((key, i) => {
          const card = tarotCards[key];
          const flippedClass = flipped[i] ? "flipped" : "";

          const fullCard = card
            ? TAROT_CARDS.find((c) => c.name === card.name)
            : null;

          return (
            <Divider
              key={key}
              className={`tarot-card ${flippedClass}`}
              onClick={() => handleFlip(i)}
              onMouseEnter={() => setHoveredCardIndex(i)}
              onMouseLeave={() => setHoveredCardIndex(null)}
              style={{ position: "relative" }}
            >
              <Divider className="label">{labels[i]}</Divider>
              <Divider className="card-inner">
                <Divider className="card-front">🔮</Divider>
                <Divider className="card-back">
                  {fullCard ? (
                    <>
                      <img
                        src={fullCard.image}
                        alt={fullCard.name}
                        style={{ width: "100%", height: "auto" }}
                      />
                      {hoveredCardIndex === i && card.description && (
                        <Tooltip position="overlay">
                          <Divider style={{ maxWidth: "200px" }}>
                            <p style={{ fontSize: "1.2rem" }}>
                              {fullCard.name}
                            </p>
                            <p style={{ marginBottom: "0.25rem" }}>
                              {fullCard.defaultMeaning}
                            </p>
                            <p>{card.description}</p>
                          </Divider>
                        </Tooltip>
                      )}
                    </>
                  ) : (
                    <p>Loading...</p>
                  )}
                </Divider>
              </Divider>
            </Divider>
          );
        })}
      </Divider>
      <Button
        onClick={() => navigate("/cosmos")}
        style={{
          position: "absolute",
          bottom: "6rem",
          right: "2rem",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        Back to Cosmos
      </Button>
    </Divider>
  );
}

export default TarotPage;
