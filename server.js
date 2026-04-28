const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* 🔥 SERVE ESATTAMENTE LA CARTELLA CORRETTA */
app.use(express.static(path.join(__dirname, "whistleblowing")));

/* 🔥 FORZA LA ROOT "/" */
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "whistleblowing", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server attivo su porta " + PORT);
});