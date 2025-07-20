jest.mock("axios");

const request = require("supertest");
const express = require("express");
const axios = require("axios");

const apodRouter = require("../api/apod");

const app = express();
app.use("/api/apod", apodRouter);

describe("GET /api/apod", () => {
  it("should return 400 if date is missing", async () => {
    const res = await request(app).get("/api/apod");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Date is required");
  });

  it("should return 400 for invalid date format", async () => {
    const res = await request(app).get("/api/apod?date=07-20-2025");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid date format/);
  });

  it("should return 400 for a date before 1995-07-16", async () => {
    const res = await request(app).get("/api/apod?date=1990-01-01");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Date cannot be before/);
  });

  it("should return APOD data for a valid date", async () => {
    axios.get.mockResolvedValue({
      data: {
        url: "https://example.com/image.jpg",
        title: "Mock APOD Title",
        explanation: "Mock explanation",
      },
    });

    const res = await request(app).get("/api/apod?date=2022-07-20");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      url: "https://example.com/image.jpg",
      title: "Mock APOD Title",
      description: "Mock explanation",
      date: "2022-07-20",
    });
  });
});
