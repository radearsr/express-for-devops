const express = require("express");
const version = require("package.json").version;
const app = express();

app.get("/", (req, res) => {
  res.send(`<center><h1>App v${version}</h1></center>`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
