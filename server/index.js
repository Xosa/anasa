require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./config");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/significance", require("./api/apod"));
app.use("/api/asteroids", require("./api/neows"));
app.use("/api/rover", require("./api/mars_rover"));
app.use("/api/tarot", require("./api/donki"));

app.listen(config.PORT, () => {
  console.log(`✅ Server running on port ${config.PORT} 🚀`);
});

module.exports = app;
