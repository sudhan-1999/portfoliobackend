import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import nodemailer from "nodemailer";
import {MongoClient} from 'mongodb';


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const MONGO=process.env.mong_url;
async function connectmongo(){
    try{
     const client = new MongoClient(MONGO);
    await client.connect();
    console.log("mongodb connected");
    return client;
    }catch(err){
        console.log("Error conncting to the MongoDB",err);
    }
}
export let client = await connectmongo();


app.get("/projects", async (req, res) => {
  try {
    await client.connect();
    const result = await client.db("Portfolio").collection("projects").find().toArray();
    res.send(result);
  } catch (err) {
    console.error("Backend error fetching projects:", err);
    res.status(500).send("Error fetching projects");
  }
});



app.post("/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).send({ error: "All fields are required" });
  }
 
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });
  
  var mailoption = {
    from: email,
    to: process.env.sendto,
    subject: subject,
    text:`Name: ${name}\nPhone:${phone}\nMessage:${message}`,
  };
  transporter.sendMail(mailoption, function (err, info) {
    if (err) {
      return res.status(500).json({ error: "Failed to send email" });
    } else {
      return res.status(200).json({ message: "Email sent successfully" });
    }
  });

});

app.listen(port, () => {
  console.log("server started at", port);
});
