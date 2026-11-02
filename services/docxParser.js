/*
const mammoth = require("mammoth");

async function parseDocx(filePath) {
  const result = await mammoth.extractRawText({
    path: filePath
  });

  return result.value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

module.exports = parseDocx;
*/