const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* =========================
   HOME PAGE
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =========================
   IL POLICLINICO
========================= */
app.get("/il-policlinico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "il-policlinico.html"));
});

/* =========================
   WHISTLEBLOWING (ISOLATO)
========================= */
app.use(
  "/whistleblowing",
  express.static(path.join(__dirname, "whistleblowing"))
);

/* =========================
   API (BASE FUTURA)
========================= */
let reports = [];

function generateCode() {
  return "WH-" + Math.floor(100000 + Math.random() * 900000);
}

/* CREA SEGNALAZIONE */
app.post("/api/segnalazione", (req, res) => {
  const code = generateCode();

  const report = {
    code,
    email: req.body.email,
    obj: req.body.obj,
    cat: req.body.cat,
    desc: req.body.desc,
    status: "Ricevuta"
  };

  reports.push(report);

  res.json({ code });
});

/* VERIFICA */
app.get("/api/verifica/:code", (req, res) => {
  const r = reports.find(x => x.code === req.params.code);

  if (!r) return res.json({ error: true });

  res.json(r);
});

/* LISTA ADMIN */
app.get("/api/list", (req, res) => {
  res.json(reports);
});

/* UPDATE STATO */
app.post("/api/update", (req, res) => {
  const r = reports.find(x => x.code === req.body.code);

  if (r) r.status = req.body.status;

  res.json({ ok: true });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server attivo su porta " + PORT);
});