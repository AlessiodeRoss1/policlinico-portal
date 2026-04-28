const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* 🔥 QUESTO È IL PUNTO CHIAVE */
const publicPath = path.join(__dirname, "whistleblowing");

/* serve file statici */
app.use(express.static(publicPath));

/* 🔥 FORZA LA ROOT */
app.get("/", (req, res) => {
res.sendFile(path.join(publicPath, "index.html"));
});

/* TEST DI VERIFICA */
app.get("/health", (req, res) => {
res.send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server attivo su porta " + PORT);
});