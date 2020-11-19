require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

const port = process.env.PORT || 3000;
let originalUrl;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get(`/api/shorturl/:random`, function (req, res) {
  res.redirect(originalUrl);
});

app.post("/api/shorturl/new", function (req, res) {
  let randomNumber = Math.floor(Math.random() * 1000 + 1);
  originalUrl = req.body.url;
  dns.lookup(originalUrl, (err, addresses) => {
    if (err && originalUrl[0] === "h") {
      res.json({ original_url: originalUrl, short_url: randomNumber });
    } else if (err) {
      res.json({ error: "invalid url" });
    } else {
      res.json({ original_url: originalUrl, short_url: randomNumber });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
