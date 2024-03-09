const { version } = require("./package.json");

module.exports = {
  apps: [
    {
      name: `app-${version}`,
      script: "./index.js",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
