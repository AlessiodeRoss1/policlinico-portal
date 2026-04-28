const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// DB
const db = new sqlite3.Database("db.sqlite");

db.run(`
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT,
  obj TEXT,
  desc TEXT,
  category TEXT,
  status TEXT DEFAULT 'Ricevuta'
)
`);

// -------------------- PAGES --------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/whistleblowing", (req, res) => {
  res.sendFile(__dirname + "/whistleblowing.html");
});

app.get("/responsabile", (req, res) => {
  res.sendFile(__dirname + "/responsabile.html");
});

// -------------------- API INVIO --------------------
app.post("/api/segnalazione", (req, res) => {
  const { obj, desc, category } = req.body;

  const code = Math.random().toString(36).substring(2, 10);

  db.run(
    "INSERT INTO reports (code, obj, desc, category, status) VALUES (?, ?, ?, ?, ?)",
    [code, obj, desc, category, "Ricevuta"]
  );

  res.json({ ok: true, code });
});

// -------------------- API VERIFICA --------------------
app.get("/api/verifica/:code", (req, res) => {
  db.get(
    "SELECT * FROM reports WHERE code = ?",
    [req.params.code],
    (err, row) => {
      if (!row) return res.json({ error: "non trovato" });

      res.json(row);
    }
  );
});

// -------------------- API LISTA RESPONSABILE --------------------
app.get("/api/reports", (req, res) => {
  db.all("SELECT * FROM reports", (err, rows) => {
    res.json(rows);
  });
});

// -------------------- API UPDATE STATUS --------------------
app.post("/api/status", (req, res) => {
  const { code, status } = req.body;

  db.run(
    "UPDATE reports SET status = ? WHERE code = ?",
    [status, code]
  );

  res.json({ ok: true });
});

// -------------------- START --------------------
app.listen(PORT, () => {
  console.log("Server attivo su porta " + PORT);
});