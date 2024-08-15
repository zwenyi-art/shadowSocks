const shadowsocks = require("shadowsocks");
const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;

// File to store client usage data
const usageFile = "./clientUsage.json";

// Load existing usage data from the file, or initialize an empty object
let clientUsage = fs.existsSync(usageFile)
  ? JSON.parse(fs.readFileSync(usageFile, "utf8"))
  : {};

// Middleware to parse JSON requests in Express.js
app.get("/hello", (req, res) => {
  console.log("user hitted");
});

// Get client data usage by password
app.get("/usage/:password", (req, res) => {
  const password = req.params.password;
  const usage = clientUsage[password] || { dataSent: 0, dataReceived: 0 };
  res.json(usage);
});

// Set data usage limit for a client by password
app.post("/limit/:password", (req, res) => {
  const password = req.params.password;
  const limit = req.body.limit; // Data limit in bytes

  console.log("I am zwe", password, limit);
  if (!clientUsage[password]) {
    clientUsage[password] = { dataSent: 0, dataReceived: 0, dataLimit: limit };
  } else {
    clientUsage[password].dataLimit = limit;
  }

  fs.writeFileSync(usageFile, JSON.stringify(clientUsage));
  res.json({ message: `Limit set for password ${password}` });
});

// Reset usage for a client by password
app.post("/reset/:password", (req, res) => {
  const password = req.params.password;

  if (clientUsage[password]) {
    clientUsage[password].dataSent = 0;
    clientUsage[password].dataReceived = 0;
    fs.writeFileSync(usageFile, JSON.stringify(clientUsage));
  }

  res.json({ message: `Usage reset for password ${password}` });
});

// Start Express.js server
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});

// Shadowsocks server configuration
const server = shadowsocks.createServer({
  serverPort: 8388,
  password: "password123",
  method: "aes-256-cfb",
});

// Handle client connections and data usage
server.on("connection", (clientSocket) => {
  console.log("Client connected:", clientSocket.remoteAddress);
});

server.on("error", (err) => {
  console.error("Shadowsocks server error:", err);
});

// Start Shadowsocks server
server.listen("0.0.0.0", 8388, () => {
  console.log("Shadowsocks server running on port 8388");
});
