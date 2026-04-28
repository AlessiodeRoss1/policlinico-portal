const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* =========================
   ROUTE ESPLICITE (NO CONFLITTI)
========================= */

/* HOME */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ALTRE PAGINE */
app.get("/il-policlinico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "il-policlinico.html"));
});

/* WHISTLEBLOWING */
app.get("/whistleblowing", (req, res) => {
  res.sendFile(path.join(__dirname, "whistleblowing", "index.html"));
});

/* STATIC FILES SEPARATI (NO OVERLAP) */
app.use("/assets", express.static(path.join(__dirname, "public")));
app.use("/whistle-assets", express.static(path.join(__dirname, "whistleblowing")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server attivo su porta " + PORT);
});