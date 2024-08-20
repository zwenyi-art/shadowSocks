const express = require("express");

// Create an Express.js API to manage and view data usage
const app = express();

app.get("/usage", (req, res) => {
  const shadowsocksURL =
    "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQxMjM@206.206.77.119:8388#Testing%20";

  res.json({
    shadowsocksURL: shadowsocksURL,
  });
});

app.listen(5000, () => {
  console.log("Express server running on port 3000");
});
