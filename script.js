const API_KEY = 'BiYWndKGr5/B/+CC68DhyQ==GrHaqaADUnuXpGPx';  // Replace with your actual API key
const RANDOM_QUOTE_API_URL = 'https://api.api-ninjas.com/v1/quotes?category=inspirational';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const wpmDisplayElement = document.getElementById('wpmDisplay');  // WPM display element
const settingsButton = document.getElementById('settingsButton');
const settingsPanel = document.getElementById('settingsPanel');
const winscreenToggle = document.getElementById('winscreenToggle');  // Winscreen toggle element
const skipQuoteButton = document.getElementById('skipQuoteButton');  // Skip Quote button

let timerStarted = false;
let intervalId;
let startTime;
let playAgain = false;
let currentMessage = '';

// Add event listener for the settings icon to toggle the settings panel
settingsButton.addEventListener('click', () => {
  settingsPanel.classList.toggle('hidden');  // Show/hide settings panel
});

// Add event listener for Skip Quote button
skipQuoteButton.addEventListener('click', () => {
  renderNewQuote();  // Fetch and display a new quote when clicked
});

// Disable copy events for the quote display element
quoteDisplayElement.addEventListener('copy', (event) => {
  event.preventDefault();  // Prevent copying
  alert("Copying is disabled for this text!");
});

// Add event listener to the input field
quoteInputElement.addEventListener('input', () => {
  if (!timerStarted && !playAgain) {
    startTimer();  // Start the timer on the first input during the quote typing phase
    timerStarted = true;
  }

  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });

  if (correct && !playAgain) {
    const wpm = calculateWPM();  // Calculate WPM when typing is complete
    if (winscreenToggle.checked) {
      showPlayAgainMessage(wpm);  // Only show "Good Job" message and WPM if Winscreen is enabled
    } else {
      renderNewQuote();  // Skip "Good Job" and WPM, and render new quote immediately
    }
  } else if (correct && playAgain) {
    renderNewQuote();  // If the replay message is typed correctly, fetch a new quote
  }
});

// Function to calculate Words Per Minute
function calculateWPM() {
  const elapsedTime = (new Date() - startTime) / 1000 / 60; // Time in minutes
  const characterCount = quoteInputElement.value.length;
  const wpm = Math.round((characterCount / 5) / elapsedTime); // Calculate WPM
  return wpm;
}

// Function to show "Good Job! Type this to play again" message along with WPM
function showPlayAgainMessage(wpm) {
  quoteDisplayElement.innerHTML = ''; // Clear the current quote
  const message = `Good job! You typed ${wpm} words per minute. Type this to play again.`;
  currentMessage = message;  // Store the replay message to compare with input

  message.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });

  // Only show WPM if Winscreen is enabled
  if (winscreenToggle.checked) {
    wpmDisplayElement.innerText = `Your WPM: ${wpm}`;  // Display the WPM
  } else {
    wpmDisplayElement.innerText = '';  // Hide the WPM if toggle is off
  }

  quoteInputElement.value = '';  // Clear the input field
  timerStarted = false;  // Reset the timer flag
  playAgain = true;  // Set the flag to indicate replay mode
}

// Function to fetch a random quote from API Ninjas
function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL, {
    headers: {
      'X-Api-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    return data[0].quote;
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

// Function to render a new quote on the page
async function renderNewQuote() {
  const quote = await getRandomQuote();

  if (!quote) {
    console.error('No quote fetched, skipping rendering');
    return;
  }

  quoteDisplayElement.innerHTML = '';

  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });

  wpmDisplayElement.innerText = '';  // Clear the WPM display for the next round
  quoteInputElement.value = ''; // Clear the input field
  currentMessage = quote;  // Set the current quote for the input comparison

  timerStarted = false;
  playAgain = false;
  clearInterval(intervalId);  // Stop the previous timer
  timerElement.innerText = 0;  // Reset the timer display
}

function startTimer() {
  if (intervalId) {
    clearInterval(intervalId); // Clear the previous interval if any
  }
  startTime = new Date();
  intervalId = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

// Initial rendering of a quote
renderNewQuote();
