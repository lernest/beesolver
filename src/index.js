const readline = require('readline');
const solve = require('./solve');
const { writeWords, writeSummary } = require('./utils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getUserInput(prompt) {
  return new Promise((resolve, reject) => {
    rl.question(prompt, (input) => {
      resolve(input.trim());
    });
  });
}

async function main() {
  let letters, center;
  let awaitingInput = true;
  let interactiveMode = false;
  let validateGuesses = false;

  while (awaitingInput) {
    const lettersInput = await getUserInput(
      'Enter 6 letters separated by spaces: '
    );
    letters = lettersInput.toUpperCase().split(' ');
    awaitingInput = !isValidInput(letters, 'letters');
  }
  awaitingInput = true;
  while (awaitingInput) {
    center = await getUserInput('Enter the center letter: ');
    center = center.toUpperCase();
    awaitingInput = !isValidInput(center, 'center');
  }

  let response = await getUserInput('Validate guesses? (y/n): ');
  if (response.toUpperCase() === 'Y' || response.toUpperCase() === 'YES') {
    validateGuesses = true;
  }

  response = await getUserInput('Interactive mode? (y/n): ');
  if (response.toUpperCase() === 'Y' || response.toUpperCase() === 'YES') {
    interactiveMode = true;
  }

  console.log('-----------------------------');
  const { guesses, validatedGuesses } = await solve(
    letters,
    center,
    validateGuesses
  );

  if (interactiveMode) {
    for (const word of guesses) {
      console.log(word);
      response = await getUserInput('');
      if (response.toUpperCase() === 'Q') {
        break;
      }
    }
    console.log('-----------------------------');
  }

  if (validatedGuesses) {
    await writeWords(validatedGuesses, 'validatedGuesses');
  }
  await writeSummary(center, letters, guesses, validatedGuesses);
  await writeWords(guesses, 'guesses');

  rl.close();
}

function isLetter(char) {
  return /^[A-Za-z]$/.test(char);
}

function isValidInput(input, inputType) {
  if (inputType === 'center') {
    if (input.length != 1) return false;
    else if (!isLetter(input)) return false;
    else return true;
  }
  if (inputType === 'letters') {
    if (input.length != 6) return false;
    for (const letter of input) {
      if (letter.length > 1) {
        return false;
      }
    }
    return true;
  }
}

main().catch((error) => {
  console.error('An error occurred:', error);
});
