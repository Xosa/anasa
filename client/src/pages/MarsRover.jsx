import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Divider from "../components/Divider";
import Button from "../components/Button";
import "./MarsRover.css";
import config from "../config";

const ROVERS = ["Curiosity", "Opportunity", "Spirit", "Perseverance"];

function MarsRoverPage({ date }) {
  const [rover, setRover] = useState("Curiosity");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (photos.length > 1) {
      const id = setInterval(
        () => setIndex((i) => (i + 1) % photos.length),
        2000
      );
      return () => clearInterval(id);
    }
  }, [photos]);

  const load = async () => {
    setError("");
    setPhotos([]);
    setIndex(0);
    setLoading(true);
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/rover?rover=${rover}&date=${date}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setPhotos(json.photos);
      if (json.photos.length === 0) setError("No photos found for that date");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Divider className="timelapse-container">
      <h1 className="timelapse-title">🚀 Mars Rover Timelapse 🚀</h1>
      <p className="timelapse-subtitle">
        Select a rover from the dropdown to load photos from Curiosity,
        Opportunity, Spirit, or Perseverance for your significant date
      </p>
      <Divider className="controls">
        <select value={rover} onChange={(e) => setRover(e.target.value)}>
          {ROVERS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <Button onClick={load}>Load Photos</Button>
      </Divider>
      {error && <p className="error">{error}</p>}
      {photos.length > 0 ? (
        <Divider className="photo-viewer">
          <img src={photos[index].img_src} alt={photos[index].camera} />
          <p>{photos[index].camera}</p>
          <p>
            {index + 1} / {photos.length}
          </p>
        </Divider>
      ) : loading ? (
        <p>Loading...</p>
      ) : null}
      <Button
        onClick={() => navigate("/cosmos")}
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        Back to Cosmos
      </Button>
    </Divider>
  );
}

export default MarsRoverPage;
