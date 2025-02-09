import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

 
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
