const path = require("path");

const buildEslintCommand = (filenames) =>
  `eslint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "**/*.{ts}": "prettier --write",
  "**/*.ts": [
    buildEslintCommand,
    "jest --bail --onlyChanged --passWithNoTests",
  ],
};
