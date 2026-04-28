const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// serve file statici
app.use(express.static(__dirname));

// homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/whistleblowing", (req, res) => {
  res.sendFile(__dirname + "/whistleblowing.html");
});

app.get("/responsabile", (req, res) => {
  res.sendFile(__dirname + "/responsabile.html");
});

app.listen(PORT, () => {
  console.log("Server attivo su porta " + PORT);
});