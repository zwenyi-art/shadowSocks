const express = require("express");
const app = express();

app.get("/usage", (req, res) => {
  const shadowsocksURL =
    "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQxMjM@206.206.77.119:8388#Testing%20";
  const filename = "shadowsocks-url.txt";
  // Set headers to indicate it's a text file and force download
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "text/plain");

  // Send the Shadowsocks URL as the file content
  res.send(shadowsocksURL);
});

app.get("/client", (req, res) => {
  const shadowsocksURL =
    "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQxMjM@206.206.77.119:8388#Testing%20";

  res.json({
    shadowsocksURL: shadowsocksURL,
  });
});
app.listen(5000, () => {
  console.log("Express server running on port 5000");
});
