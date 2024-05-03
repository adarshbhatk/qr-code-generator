// To get the URL input from the user 

import fs from "fs";
import qr from "qr-image";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";  
import bodyParser from "body-parser";

var userURL = "";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.use(bodyParser.urlencoded({extended:true}));

function getURL (req, res, next) {
  userURL = req.body["urlInput"];
  console.log(userURL);
  // To generate Qr code image of the entered URL
  const qrImage = qr.image(userURL);
  qrImage.pipe(fs.createWriteStream("qr_img.png"));
  next();
}

app.use(getURL);

app.post("/generate", (req, res) => {
  fs.readFile(__dirname + "/generate.html", 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
    } else {
      const modifiedHTML = data.replace("{{userURL}}", userURL);
      res.send(modifiedHTML);
    }
  })});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});