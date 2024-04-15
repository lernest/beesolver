const fs = require('fs');
const path = require('path');

async function getWords(fileName) {
  try {
    const rootDir = path.resolve(__dirname, '../data/');
    const filePath = path.join(rootDir, fileName);
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

    const timestamp = getTimeStamp();

    const filename = `${fileType}_${timestamp}.txt`;
    filePath = path.join(outputDir, filename);

    const wordsString = wordsArray.join('\n');
    await fs.promises.writeFile(filePath, wordsString, 'utf8');

    console.log(`${wordsArray.length} words have been written to ${filePath}`);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

function getTimeStamp() {
  const now = new Date();
  const timestamp = `${(now.getMonth() + 1).toString().padStart(2, '0')}${now
    .getDate()
    .toString()
    .padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return timestamp;
}

function writeSummary(center, letters, guesses, validatedGuesses) {
  const headers = [
    'center',
    'letters',
    'guesses',
    'verified-guesses',
    'reduction#',
    'reduction%',
    'timestamp',
  ];
  let newRow;
  if (validatedGuesses) {
    const reductionPercentage =
      ((guesses.length - validatedGuesses.length) / guesses.length) * 100;
    newRow = [
      center,
      letters.join(''),
      guesses.length,
      validatedGuesses.length,
      guesses.length - validatedGuesses.length,
      Math.round(reductionPercentage * 1000) / 1000,
      getTimeStamp(),
    ];
  } else {
    newRow = [
      center,
      letters.join(''),
      guesses.length,
      '-',
      '-',
      '-',
      getTimeStamp(),
    ];
  }

  const csvFilePath = './summary.csv';

  if (fs.existsSync(csvFilePath)) {
    fs.appendFileSync(csvFilePath, newRow.join(',') + '\n');
  } else {
    fs.writeFileSync(csvFilePath, headers.join(',') + '\n');
    fs.appendFileSync(csvFilePath, newRow.join(',') + '\n');
  }
}

module.exports = { getWords, writeWords, writeSummary };
