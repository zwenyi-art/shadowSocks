const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

// Load SSL certificate and private key
const sslOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/ss.zwenyi.xyz/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/ss.zwenyi.xyz/fullchain.pem"),
};

app.get("/", (req, res) => {
  res.send("Hello, your connection is secure!");
});

// Create an HTTPS server with the SSL options
https.createServer(sslOptions, app).listen(443, () => {
  console.log("HTTPS Express server running on port 443");
});
