const express = require("express");
const path = require("path");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   PAGINE
========================= */
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/whistleblowing", (req, res) => {
res.sendFile(path.join(__dirname, "whistleblowing", "index.html"));
});

app.get("/responsabile", (req, res) => {
res.sendFile(path.join(__dirname, "responsabile.html"));
});

/* =========================
   DATABASE
========================= */
const db = new sqlite3.Database("db.sqlite");

db.run(`
CREATE TABLE IF NOT EXISTS reports (
id INTEGER PRIMARY KEY AUTOINCREMENT,
code TEXT,
obj TEXT,
desc TEXT,
anonimo TEXT,
email TEXT,
file TEXT,
status TEXT
)
`);

/* =========================
   UPLOAD FILE
========================= */
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, "whistleblowing/uploads/"),
filename: (req, file, cb) => cb(Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

/* =========================
   CREA SEGNALAZIONE
========================= */
app.post("/api/report", upload.single("file"), (req,res)=>{

const code = "WH-" + Math.floor(100000 + Math.random()*900000);

db.run(`
INSERT INTO reports (code,obj,desc,anonimo,email,file,status)
VALUES (?,?,?,?,?,?,?)
`,
[
code,
req.body.obj,
req.body.desc,
req.body.anonimo,
req.body.email,
req.file ? req.file.filename : null,
"Ricevuta"
]);

res.json({ code });

});

/* =========================
   VERIFICA
========================= */
app.get("/api/report/:code",(req,res)=>{

db.get(
"SELECT code,status FROM reports WHERE code=?",
[req.params.code],
(err,row)=>{

if(!row) return res.json({error:true});

res.json(row);

});

});

/* =========================
   LISTA RESPONSABILE
========================= */
app.get("/api/reports",(req,res)=>{

db.all("SELECT * FROM reports ORDER BY id DESC",(err,rows)=>{
res.json(rows || []);
});

});

/* =========================
   AGGIORNA STATO
========================= */
app.post("/api/report", upload.single("file"), (req,res)=>{

try{

const code = "WH-" + Math.floor(100000 + Math.random()*900000);

db.run(`
INSERT INTO reports (code,obj,desc,anonimo,email,file,status)
VALUES (?,?,?,?,?,?,?)
`,
[
code,
req.body.obj || "",
req.body.desc || "",
req.body.anonimo || "",
req.body.email || "",
req.file ? req.file.filename : null,
"Ricevuta"
]);

console.log("NUOVA SEGNALAZIONE:", code);

res.json({ code });

}catch(err){
console.log("ERRORE REPORT:", err);
res.status(500).json({error:true});
}

});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server attivo");
console.log("Porta:", PORT);
console.log("URL locale (solo sviluppo): http://localhost:" + PORT);
console.log("Whistleblowing: /whistleblowing");
console.log("Responsabile: /responsabile");
});