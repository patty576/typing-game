const API_KEY = 'BiYWndKGr5/B/+CC68DhyQ==GrHaqaADUnuXpGPx';  // Replace with your actual API key
const RANDOM_QUOTE_API_URL = 'https://api.api-ninjas.com/v1/quotes?category=inspirational';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

// Add event listener to the input field
quoteInputElement.addEventListener('input', () => {
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

  if (correct) renderNewQuote();
});

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
    console.log('Fetched quote:', data[0].quote);  // Debugging to check response structure
    return data[0].quote;  // The quote is in the first element of the returned array
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
    return; // If no quote, exit the function
  }

  // Clear the display element before rendering the new quote
  quoteDisplayElement.innerHTML = '';

  // Render the new quote character by character
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });

  quoteInputElement.value = ''; // Clear the input field
  startTimer(); // Start the timer
}

let intervalId;
function startTimer() {
  if (intervalId) {
    clearInterval(intervalId); // Clear the previous interval
  }
  timerElement.innerText = 0;
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
