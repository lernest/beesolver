const { getWords, writeSummary } = require('./utils');
const fileName = 'words.txt'; // File in ./data

async function solve(letters, center, validateGuesses = false) {
  console.log(`Letters: [${letters.join(', ')}]`);
  console.log(`Center: ${center}`);
  console.log('-----------------------------');
  const wordsArray = await getWords(fileName);
  const guesses = wordsArray.filter((word) =>
    isValidWord(word, letters, center)
  );
  let validatedGuesses;
  if (validateGuesses) {
    validatedGuesses = await checkDefinitions(guesses);
  }
  return { guesses, validatedGuesses };
}

function isValidWord(word, validLetters, center) {
  const wordArr = word.split('');
  if (!wordArr.includes(center)) {
    return false;
  }
  for (const letter of wordArr) {
    if (![center, ...validLetters].includes(letter)) {
      return false;
    }
  }
  return true;
}

async function checkDefinitions(guesses) {
  const validatedGuesses = [];
  const invalidGuesses = [];
  for (const guess of guesses) {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`
      );
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      validatedGuesses.push(guess);
    } catch (error) {
      invalidGuesses.push(guess);
    }
  }

  const reductionPercentage =
    ((guesses.length - validatedGuesses.length) / guesses.length).toFixed(4) *
    100;
  console.log(`Validation summary:
  Input: ${guesses.length} words
  Output: ${validatedGuesses.length} words
  Reduced by ${reductionPercentage}%`);
  console.log('-----------------------------');
  return validatedGuesses;
}

module.exports = solve;
