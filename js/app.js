/**
 * Title: Typing App
 * Description: Load random quote and if you can type whole text within time then you win!
 * Author: Samin Yasar
 * Date: 19/August/2021
 */

// DOM Select
const typingSection = document.getElementById("typingSection");
const timerSpan = document.getElementById("timerSpan");
const correctSpan = document.getElementById("correctSpan");
const incorrectSpan = document.getElementById("incorrectSpan");
const scoreSpan = document.getElementById("scoreSpan");
const typingContainer = document.getElementById("typingContainer");
const contentEl = document.getElementById("contentEl");
const typingInput = document.getElementById("typingInput");
const modalSection = document.getElementById("modalSection");
const modalHeading = document.getElementById("modalHeading");
const totalScoreSpan = document.getElementById("totalScoreSpan");

// Global Variables
const API_URL = `http://api.quotable.io/random`;
let currentTime = 0;
let countCorrect = (countIncorrect = currentScore = 0);
let coutnDownIntervalId = null;

timerSpan.innerText = `${currentTime}s`;
correctSpan.innerText = countCorrect;
incorrectSpan.innerText = countIncorrect;
scoreSpan.innerText = currentScore;

// Functionalities
/**
 * Popup a modal box and show the given message.
 *
 * @param {string} message - Message to show the modal box heading.
 */
function popup(message) {
    typingInput.blur();
    typingSection.style.filter = `blur(0.5rem)`;
    modalSection.style.display = "block";
    modalHeading.innerText = message;
    totalScoreSpan.innerText = currentScore;
}

/**
 * Count down the given time in every single second.
 */
function countDownTimer() {
    if (currentTime === 0) {
        clearInterval(coutnDownIntervalId);
        popup("times up!");
    } else {
        timerSpan.innerText = `${currentTime}s`;
        currentTime--;
    }
}

/**
 * Reset the typing app for a new quote.
 */
function reset() {
    clearInterval(coutnDownIntervalId);
    currentTime = countCorrect = countIncorrect = 0;
    currentScore++;
    contentEl.innerHTML = "";
    typingInput.value = "";
}

/**
 * If user successfully can typed a quote then this function will render a new quote to type for user.
 */
function nextQuote() {
    reset();
    init();
}

/**
 * Update the result elements every time when user insert anything on typing textarea.
 */
function updateResult() {
    countCorrect = document.querySelectorAll(".correct-span").length;
    countIncorrect = document.querySelectorAll(".incorrect-span").length;
    correctSpan.innerText = countCorrect;
    incorrectSpan.innerText = countIncorrect;
    scoreSpan.innerText = currentScore;
}

/**
 * Trigger every time when user insert anything on typing textarea.
 *
 * @param {Event} e - The `input` event.
 */
function handleTyping(e) {
    const contentArray = contentEl.querySelectorAll("span");
    const inputArray = typingInput.value.split("");
    let correct = true;
    contentArray.forEach((contentSpan, ind) => {
        const currentContent = contentSpan.innerText;
        const currentInput = inputArray[ind];
        if (!currentInput) {
            contentSpan.classList.remove("incorrect-span");
            contentSpan.classList.remove("correct-span");
            correct = false;
        } else if (currentContent === currentInput) {
            contentSpan.classList.remove("incorrect-span");
            contentSpan.classList.add("correct-span");
            updateResult();
        } else {
            contentSpan.classList.add("incorrect-span");
            contentSpan.classList.remove("correct-span");
            correct = false;
            updateResult();
        }
    });
    if (correct) {
        nextQuote();
    } else if (inputArray.length === contentArray.length && !correct) {
        reset();
        popup("you have mistakes!");
    }
}

/**
 * Get a API request from the server.
 *
 * @returns {Promise} - Return the promise which the server returned.
 */
async function getRandomQuote() {
    try {
        const responseQuote = await fetch(API_URL);
        throw await responseQuote.json();
    } catch (err) {
        return err;
    }
}

/**
 * Render a new quote for user when user can successfully typed the given quote.
 */
async function renderQuote() {
    try {
        const {
            content:
                randomeQuote = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda veniam ullam quas aliquid ab obcaecati?",
        } = await getRandomQuote();
        currentTime = randomeQuote.split(" ").length + 5;
        randomeQuote.split("").forEach((quoteCharacter) => {
            const quoteSpan = document.createElement("span");
            quoteSpan.innerText = quoteCharacter;
            contentEl.appendChild(quoteSpan);
        });
        typingContainer.style.display = "flex";
        typingInput.focus();
        typingInput.addEventListener("input", handleTyping);
        typingInput.addEventListener("copy", (e) => e.preventDefault());
        typingInput.addEventListener("cut", (e) => e.preventDefault());
        typingInput.addEventListener("paste", (e) => e.preventDefault());
    } catch (err) {
        return err;
    }
}

/**
 * Initializer function of this project.
 */
async function init() {
    try {
        await renderQuote();
        coutnDownIntervalId = setInterval(countDownTimer, 1000);
    } catch (err) {
        console.log(err);
    }
}

init();
