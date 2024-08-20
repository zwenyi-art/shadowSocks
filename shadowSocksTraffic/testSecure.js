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
app.get("/ss", (req, res) => {
  const shadowsocksURL =
    "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQxMjM@206.206.77.119:8388#Testing%20";
  const filename = "shadowsocks-url.txt";
  // Set headers to indicate it's a text file and force download
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "text/plain");

  // Send the Shadowsocks URL as the file content
  res.send(shadowsocksURL);
});
// Create an HTTPS server with the SSL options
https.createServer(sslOptions, app).listen(443, () => {
  console.log("HTTPS Express server running on port 443");
});
