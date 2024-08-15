const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for tracking data usage
const usageTracker = {};

// Middleware to handle client authentication and data tracking
app.use((req, res, next) => {
  const clientPassword = req.headers["x-auth-password"]; // Password sent in custom header

  // Initialize data usage for the client if not already tracked
  if (!usageTracker[clientPassword]) {
    usageTracker[clientPassword] = { bytes: 0 };
  }

  res.on("finish", () => {
    const dataTransferred = parseInt(res.getHeader("Content-Length")) || 0;
    usageTracker[clientPassword].bytes += dataTransferred;

    // Log the current data usage for the client
    console.log(
      `Client with password ${clientPassword} has used ${usageTracker[clientPassword].bytes} bytes of data.`
    );
  });

  next();
});

// Proxy middleware to forward requests to Shadowsocks server
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:8388", // Shadowsocks server address
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy error");
    },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
