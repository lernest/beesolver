const fs = require('fs');
const path = require('path');

async function getWords(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    let wordsArray = data.split('\n');
    wordsArray = wordsArray.map((word) => word.trim().toUpperCase());
    return wordsArray;
  } catch (err) {
    console.error('Error reading file:', err);
    return [];
  }
}

async function writeWords(wordsArray, fileType) {
  try {
    const rootDir = path.resolve(__dirname, '..');
    const outputDir = path.join(rootDir, 'output');
    await fs.promises.mkdir(outputDir, { recursive: true });

    const now = new Date();
    const timestamp = `${(now.getMonth() + 1).toString().padStart(2, '0')}${now
      .getDate()
      .toString()
      .padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const filename = `${fileType}_${timestamp}.txt`;
    filePath = path.join(outputDir, filename);

    const wordsString = wordsArray.join('\n');
    await fs.promises.writeFile(filePath, wordsString, 'utf8');

    console.log(`${wordsArray.length} words have been written to ${filePath}`);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

module.exports = { getWords, writeWords };
