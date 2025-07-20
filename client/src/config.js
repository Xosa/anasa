const config = {
  API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://anasa.vercel.app"
      : "http://localhost:5001",
};

module.exports = config;
