const net = require("net");
const express = require("express");
const fs = require("fs");

let clientDataUsage = {}; // Store data usage for each client port
let clientLog = []; // Store log of connected clients

// Function to log client connection
function logClientConnection(clientIP, clientPort) {
  const logEntry = {
    clientIP,
    clientPort,
    connectedAt: new Date().toISOString(),
  };
  clientLog.push(logEntry);

  // Write to a log file
  fs.appendFileSync(
    "client-connections.log",
    `Connected: ${clientIP}:${clientPort} at ${logEntry.connectedAt}\n`
  );
}

// Function to log client disconnection
function logClientDisconnection(clientIP, clientPort) {
  const disconnectedAt = new Date().toISOString();
  clientLog = clientLog.filter(
    (log) => log.clientIP !== clientIP || log.clientPort !== clientPort
  );

  // Write to a log file
  fs.appendFileSync(
    "client-connections.log",
    `Disconnected: ${clientIP}:${clientPort} at ${disconnectedAt}\n`
  );
}

// Create a TCP server to monitor Shadowsocks traffic
const server = net.createServer((socket) => {
  const clientIP = socket.remoteAddress;
  const clientPort = socket.localPort;

  // Log the client connection
  logClientConnection(clientIP, clientPort);

  socket.on("data", (data) => {
    if (!clientDataUsage[clientPort]) {
      clientDataUsage[clientPort] = 0;
    }
    clientDataUsage[clientPort] += data.length; // Track data usage

    // Set a data limit (e.g., 100MB)
    const dataLimit = 100 * 1024 * 1024;

    if (clientDataUsage[clientPort] > dataLimit) {
      socket.end("Data limit reached."); // Disconnect client
    }
  });

  socket.on("end", () => {
    console.log(
      `Client on port ${clientPort} disconnected. Total data used: ${clientDataUsage[clientPort]} bytes`
    );

    // Log the client disconnection
    logClientDisconnection(clientIP, clientPort);
  });
});

// Listen on the same ports as Shadowsocks
server.listen(8388, "0.0.0.0", () => {
  console.log("Monitoring server listening on port 8388");
});
server.listen(8389, "0.0.0.0", () => {
  console.log("Monitoring server listening on port 8389");
});
server.listen(8390, "0.0.0.0", () => {
  console.log("Monitoring server listening on port 8390");
});

// Create an Express.js API to manage and view data usage
const app = express();

app.get("/usage", (req, res) => {
  res.json(clientDataUsage); // Return data usage for all clients based on ports
});

app.get("/clients", (req, res) => {
  res.json(clientLog); // Return log of currently connected clients
});

app.listen(3000, () => {
  console.log("Express server running on port 3000");
});
