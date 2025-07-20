import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Divider from "../components/Divider";
import "./Main.css";

function MainPage({ imageData, onBack }) {
  const navigate = useNavigate();

  return (
    <Divider
      className="main-container"
      style={{ backgroundImage: `url(${imageData.url})` }}
    >
      <h1 className="main-title">🌌 Cosmic Path 🌌</h1>
      <Divider className="image-overlay">
        <h2>{imageData.title}</h2>
        <p>{imageData.description}</p>
      </Divider>

      <Divider className="left-buttons-wrapper">
        <Divider className="asteroids-wrapper">
          <Button
            onClick={() => navigate("/asteroids")}
            className="floating-text"
          >
            Asteroids
          </Button>
        </Divider>

        <Divider className="rover-wrapper">
          <Button onClick={() => navigate("/rover")} className="floating-text">
            Mars Rover
          </Button>
        </Divider>

        <Divider className="tarot-wrapper">
          <Button onClick={() => navigate("/tarot")} className="floating-text">
            Tarot Reading
          </Button>
        </Divider>
      </Divider>

      <Button
        onClick={onBack}
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        Back
      </Button>
    </Divider>
  );
}

export default MainPage;
