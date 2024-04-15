const { getWords } = require('./utils');
const fileName = 'words.txt'; // File in ./data

async function solve(letters, center, validateGuesses = false) {
  console.log(`Letters: [${letters.join(', ')}]`);
  console.log(`Center: ${center}`);
  console.log('-----------------------------');
  letters.push(center);
  const wordsArray = await getWords(fileName);
  const filteredWords = wordsArray.filter((word) =>
    isValidWord(word, letters, center)
  );
  if (validateGuesses) {
    const validatedGuesses = await checkDefinitions(filteredWords);
    return validatedGuesses;
  }
  return filteredWords;
}

function isValidWord(word, validLetters, center) {
  const wordArr = word.split('');
  if (!wordArr.includes(center)) {
    return false;
  }
  for (const letter of wordArr) {
    if (!validLetters.includes(letter)) {
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
    ((guesses.length - validatedGuesses.length) / guesses.length) * 100;
  console.log(`Validation summary:
  Input: ${guesses.length} words
  Output: ${validatedGuesses.length} words
  Reduced by ${reductionPercentage}%`);
  console.log('-----------------------------');
  return validatedGuesses;
}

module.exports = solve;
