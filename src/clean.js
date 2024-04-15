/* 
Take an input file of line separated text.
Filter any entries with non alphabetic characters, including spaces
Write output to a new file

Use launch option or run `node ./src/clean.js rawWords.txt`
*/

const { getWords, writeWords } = require('./utils.js');

const fileName = 'words.txt';
// const fileName = process.argv[2];
cleanInput(fileName);

async function cleanInput(fileName) {
  const wordsArray = await getWords(fileName);
  const filteredWords = wordsArray.filter(isWordToKeep);
  const set = new Set(filteredWords);
  const deduplicatedArray = [...set];

  writeWords(deduplicatedArray, 'cleanOutput');
}

function isWordToKeep(word) {
  function isUppercaseLetter(char) {
    return /^[A-Z]$/.test(char);
  }

  if (word.length <= 3) return false;
  const wordArr = word.split('');
  for (const letter of wordArr) {
    if (!isUppercaseLetter(letter)) {
      return false;
    }
  }
  return true;
}
