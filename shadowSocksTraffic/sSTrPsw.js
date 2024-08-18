const net = require("net");

// Simulate a map of passwords to data usage
const passwordDataUsage = {};

// Sample configuration mapping passwords to clients
const clientPasswords = {
  password123: "ClientA",
  password456: "ClientB",
};

// Create a proxy server that listens on port 8388
const server = net.createServer((clientSocket) => {
  // Assume we somehow know the password used for this connection
  const clientPassword = "password123"; // Replace this with actual password extraction logic
  const clientID = clientPasswords[clientPassword] || "Unknown Client";

  // Initialize data usage tracking for the client
  if (!passwordDataUsage[clientPassword]) {
    passwordDataUsage[clientPassword] = 0;
  }

  // Connect to the Shadowsocks server on port 8389
  const shadowsocksSocket = new net.Socket();
  shadowsocksSocket.connect(8389, "127.0.0.1", () => {
    clientSocket.pipe(shadowsocksSocket);
    shadowsocksSocket.pipe(clientSocket);
  });

  // Track data usage based on password
  clientSocket.on("data", (chunk) => {
    console.log("chunkdata", chunk);
    passwordDataUsage[clientPassword] += chunk.length;
    console.log(`${clientID} used ${passwordDataUsage[clientPassword]} bytes`);
  });

  // Handle client disconnection
  clientSocket.on("end", () => {
    console.log(
      `${clientID} disconnected, total usage: ${passwordDataUsage[clientPassword]} bytes`
    );
  });

  // Handle client and server errors
  clientSocket.on("error", (err) => {
    console.error(`Client error: ${err.message}`);
  });

  shadowsocksSocket.on("error", (err) => {
    console.error(`Shadowsocks server error: ${err.message}`);
  });
});

// Listen on port 8388
server.listen(8388, () => {
  console.log("Proxy server running on port 8388");
});
