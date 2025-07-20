import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MainPage from "../pages/Main";

const mockImageData = {
  url: "https://example.com/image.jpg",
  title: "Astronomy Picture",
  description: "A beautiful space scene",
};

describe("MainPage", () => {
  it("renders title, description, and background", () => {
    render(
      <BrowserRouter>
        <MainPage imageData={mockImageData} onBack={jest.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByText("🌌 Cosmic Path 🌌")).toBeInTheDocument();
    expect(screen.getByText("Astronomy Picture")).toBeInTheDocument();
    expect(screen.getByText("A beautiful space scene")).toBeInTheDocument();
  });
});
