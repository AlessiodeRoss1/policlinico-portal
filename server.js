const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

let reports = [];

function code(){
return "WH-"+Math.floor(100000+Math.random()*900000);
}

/* EMAIL CONFIG (GMAIL) */
const transporter = nodemailer.createTransport({
service:"gmail",
auth:{
user:"TUO_EMAIL@gmail.com",
pass:"PASSWORD_APP_GMAIL"
}
});

/* API INSERIMENTO */
app.post("/api/segnalazione",(req,res)=>{

let c = code();

let report={
code:c,
email:req.body.email,
obj:req.body.obj,
cat:req.body.cat,
desc:req.body.desc,
status:"Ricevuta"
};

reports.push(report);

/* EMAIL */
transporter.sendMail({
from:"Whistleblowing <TUO_EMAIL@gmail.com>",
to:req.body.email,
subject:"Conferma segnalazione "+c,
text:`
Segnalazione ricevuta

Codice: ${c}
Oggetto: ${req.body.obj}
Categoria: ${req.body.cat}
Stato: Ricevuta

Conserva questo codice per il tracking.
`
});

res.json({code:c});

});

/* VERIFICA */
app.get("/api/verifica/:code",(req,res)=>{

let r=reports.find(x=>x.code===req.params.code);

if(!r) return res.json({error:true});

res.json(r);

});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("Server attivo "+PORT));