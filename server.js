const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* HOME PAGE (DEVE ESSERE /public/index.html) */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ALTRE PAGINE PUBBLICHE */
app.get("/il-policlinico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "il-policlinico.html"));
});

/* WHISTLEBLOWING SEPARATO */
app.use(
  "/whistleblowing",
  express.static(path.join(__dirname, "whistleblowing"))
);

/* TEST */
app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server attivo su porta " + PORT);
});