import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import SignificantDatePage from "../pages/SignificantDate";
import MainPage from "../pages/Main";
import AsteroidPage from "../pages/Asteroids";
import config from "../config";
import TarotPage from "../pages/Tarot";
import MarsRoverPage from "../pages/MarsRover";

function AppRoutes() {
  const [imageData, setImageData] = useState(() => {
    const saved = localStorage.getItem("imageData");
    return saved ? JSON.parse(saved) : null;
  });

  const [error, setError] = useState(null);
  const [date, setDate] = useState(() => {
    const saved = localStorage.getItem("significantDate");
    return saved || "";
  });

  const handleDateSubmit = async (selectedDate) => {
    setError(null);
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/significance?date=${selectedDate}`
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to fetch significant date data");

      setImageData(data);
      setDate(selectedDate);
      localStorage.setItem("imageData", JSON.stringify(data));
      localStorage.setItem("significantDate", selectedDate);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    setImageData(null);
    localStorage.removeItem("imageData");
    localStorage.removeItem("significantDate");
  };

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        <h1>Something went wrong</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          imageData ? (
            <Navigate to="/cosmos" replace />
          ) : (
            <SignificantDatePage onDateSelected={handleDateSubmit} />
          )
        }
      />
      <Route
        path="/cosmos"
        element={
          imageData ? (
            <MainPage imageData={imageData} onBack={handleBack} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="/asteroids" element={<AsteroidPage date={date} />} />
      <Route path="/rover" element={<MarsRoverPage date={date} />} />
      <Route path="/tarot" element={<TarotPage date={date} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
