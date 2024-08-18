const net = require("net");

// Store client data usage
const clients = {};

const DATA_LIMIT = 10 * 1024 * 1024; // 100 MB limit

// Create a proxy server listening on port 8388
const server = net.createServer((clientSocket) => {
  const clientIP = clientSocket.remoteAddress;

  if (!clients[clientIP]) {
    clients[clientIP] = { usage: 0 };
  }

  // Connect to the Shadowsocks server on port 8389
  const serverSocket = new net.Socket();
  serverSocket.connect(8389, "localhost", () => {
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
  });

  // Track data usage
  clientSocket.on("data", (chunk) => {
    clients[clientIP].usage += chunk.length;

    // Check if data limit exceeded
    if (clients[clientIP].usage > DATA_LIMIT) {
      clientSocket.end("Data limit exceeded");
      serverSocket.end();
    }
  });

  // Log client disconnection
  clientSocket.on("end", () => {
    console.log(
      `Client ${clientIP} disconnected, used ${clients[clientIP].usage} bytes`
    );
  });

  // Handle client and server errors
  clientSocket.on("error", (err) => {
    console.error(`Client error: ${err.message}`);
  });

  serverSocket.on("error", (err) => {
    console.error(`Server error: ${err.message}`);
  });
});

// Listen on the original Shadowsocks port
server.listen(8388, () => {
  console.log("Proxy server running on port 8388");
});
