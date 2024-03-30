const { version } = require("./package.json");
const path = require("path");
module.exports = {
  apps: [
    {
      name: `app-${version}`,
      script: path.join(__dirname, "index.js"),
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
