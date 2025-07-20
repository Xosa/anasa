const config = {
  API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://your-production-backend.com"
      : "http://localhost:5001",
};

module.exports = config;
