const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* =========================
   FORZA CARTELLA PUBLIC
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   HOME PAGE ESPLICITA
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =========================
   WHISTLEBLOWING ISOLATO
========================= */
app.use(
  "/whistleblowing",
  express.static(path.join(__dirname, "whistleblowing"))
);

/* =========================
   HEALTH CHECK (RENDER)
========================= */
app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server attivo su porta " + PORT);
});