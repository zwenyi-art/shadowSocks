const net = require("net");
const express = require("express");
const fs = require("fs");

// Create an Express.js API to manage and view data usage
const app = express();

app.get("/usage", (req, res) => {
  console.log("User Hitted"); // Return data usage for all clients based on ports
});

app.get("/clients", (req, res) => {
  console.log("User clients");
  // Return log of currently connected clients
});

app.listen(5000, () => {
  console.log("Express server running on port 3000");
});
