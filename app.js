// app.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const DB_CONN = process.env.DB_CONN || "not-set";

app.get("/", (req, res) => {
  res.send(`Hello World! DB Connection: ${DB_CONN}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
