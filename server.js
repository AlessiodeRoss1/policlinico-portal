const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

let reports=[];

function code(){
return "WH-"+Math.floor(100000+Math.random()*900000);
}

/* EMAIL */
const transporter = nodemailer.createTransport({
service:"gmail",
auth:{
user:"policlinicogemellirrp@gmail.com",
pass:"wxdy rwnu nixn iexs"
}
});

/* INSERIMENTO */
app.post("/api/segnalazione",(req,res)=>{

let c = code();

let r={
code:c,
email:req.body.email,
obj:req.body.obj,
cat:req.body.cat,
desc:req.body.desc,
status:"Ricevuta"
};

reports.push(r);

/* EMAIL */
transporter.sendMail({
from:"Whistleblowing <policlinicogemellirrp@gmail.com>",
to:req.body.email,
subject:"Segnalazione "+c,
text:`Codice: ${c}\nStato: Ricevuta`
});

res.json({code:c});

});

/* VERIFICA */
app.get("/api/verifica/:code",(req,res)=>{

let r=reports.find(x=>x.code===req.params.code);
if(!r) return res.json({error:true});

res.json(r);

});

/* LISTA ADMIN */
app.get("/api/list",(req,res)=>{
res.json(reports);
});

/* UPDATE STATO */
app.post("/api/update",(req,res)=>{

let r=reports.find(x=>x.code===req.body.code);
if(r) r.status=req.body.status;

res.json({ok:true});

});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log("Server attivo "+PORT));