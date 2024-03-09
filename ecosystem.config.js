const { version } = require("./package.json");

module.exports.ecosystem = {
  apps: [
    {
      name: `app-${version}`,
      script: "index.js",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
