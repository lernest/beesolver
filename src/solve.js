const { getWords, writeWords } = require('./utils');

const filePath = './data/words.txt';

// Board game
const letters = ['D', 'U', 'M', 'N', 'E', 'A'];
const center = 'G';

async function solve(letters, center, validateGuesses = false) {
  letters.push(center);
  const wordsArray = await getWords(filePath);
  const filteredWords = wordsArray.filter((word) =>
    isValidWord(word, letters, center)
  );
  return filteredWords;
}

async function solveAndPrint(letters, center, validateGuesses = false) {
  const filteredWords = await solve(letters, center, validateGuesses);
  if (validateGuesses) {
    const validatedGuesses = await checkValidity(filteredWords);
    writeWords(validatedGuesses, 'validatedGuesses');
  }
  writeWords(filteredWords, 'guesses');
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

async function checkValidity(guesses) {
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
  console.log('Invalid words:');
  console.log(invalidGuesses);
  return validatedGuesses;
}

solveAndPrint(letters, center, true);
