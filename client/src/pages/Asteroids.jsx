import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Divider from "../components/Divider";
import Button from "../components/Button";
import Tooltip from "../components/Tooltip";
import Motion from "../components/Motion";
import config from "../config";
import "./Asteroids.css";

function AsteroidsPage({ date }) {
  const [asteroids, setAsteroids] = useState([]);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const res = await fetch(
          `${config.API_BASE_URL}/api/asteroids?date=${date}`
        );
        const json = await res.json();
        setAsteroids(json.asteroids || []);
      } catch {
        setError("Failed to load asteroid data.");
      }
    };
    if (date) fetchAsteroids();
  }, [date]);

  useEffect(() => {
    if (asteroids.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % asteroids.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [asteroids]);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getColor = (isHazardous) => (isHazardous ? "#FFB347" : "#4CAF50");

  return (
    <Divider className="asteroids-container">
      <Divider className="header-section">
        <h1 className="asteroids-title">
          🚨 Asteroid Watch — <span>{formattedDate}</span>
        </h1>
        <p className="asteroids-subtitle">
          A visual simulation of near-Earth objects detected by NASA on this day
        </p>
      </Divider>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {asteroids.length > 0 && (
        <Tooltip>
          <p>
            🪐 <strong>{asteroids[activeIndex].name}</strong>
          </p>
          <p>
            💥 Hazardous: {asteroids[activeIndex].is_hazardous ? "Yes" : "No"}
          </p>
          <p>📏 Diameter: {asteroids[activeIndex].diameter_km.toFixed(2)} km</p>
          <p>
            🛰️ Distance:{" "}
            {parseFloat(asteroids[activeIndex].distance_km).toLocaleString()} km
          </p>
          <p>
            🚀 Speed: {parseFloat(asteroids[activeIndex].speed_kph).toFixed(0)}{" "}
            km/h
          </p>
        </Tooltip>
      )}

      <Divider className="asteroids-universe">
        <img src="/assets/earth.jpg" className="earth-icon" alt="Earth" />
        {asteroids.map((asteroid, i) => {
          const isHazardous = asteroid.is_hazardous;
          const size = asteroid.diameter_km;
          const sizePx = Math.min(16 + size * 8, 36);

          const orbitRadius = asteroid.orbit_radius;
          const orbitDuration = asteroid.orbit_duration;

          const active = i === activeIndex;
          const orbitColor = active
            ? getColor(isHazardous)
            : "rgba(255, 255, 255, 0.2)";
          const asteroidColor = active
            ? getColor(isHazardous)
            : isHazardous
            ? "#FF4F4F"
            : "#C0C0C0";

          return (
            <Motion
              key={asteroid.id}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: orbitDuration,
                ease: "linear",
              }}
              className="motion-center"
            >
              <Motion
                animate={{ y: -orbitRadius }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: orbitDuration / 2,
                }}
                className={`asteroid ${
                  isHazardous ? "hazardous" : "non-hazardous"
                }`}
                style={{
                  width: `${sizePx}px`,
                  height: `${sizePx}px`,
                  backgroundColor: asteroidColor,
                  borderColor: active ? orbitColor : "transparent",
                  boxShadow: active ? `0 0 10px 3px ${orbitColor}` : undefined,
                  zIndex: 10,
                  position: "relative",
                }}
              />
            </Motion>
          );
        })}
      </Divider>

      <Divider className="asteroids-legend">
        <ul>
          <li>
            <span className="dot green" /> Selected Asteroid
          </li>
          <li>
            <span className="dot orange" /> Selected Hazardous Asteroid
          </li>
          <li>
            <span className="dot red" /> Non-Selected Hazardous Asteroid
          </li>
          <li>
            <span className="dot white" /> Non-Selected Asteroid
          </li>
        </ul>
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

export default AsteroidsPage;
