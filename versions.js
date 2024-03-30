let { name, version } = require("./package.json");
version = version.replace(/\./g, "-");
console.log(`${name}-v${version}`);
