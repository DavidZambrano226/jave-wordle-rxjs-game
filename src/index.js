import { fromEvent, Subject, } from "rxjs";
import WORDS_LIST from './wordsList.json';

const letterRows = document.getElementsByClassName('letter-row');
const messageText = document.getElementById('message-text');

// Observable
const onKeyDown$ = fromEvent(document, "keydown");

let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
const getRandomWord = () => WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord = getRandomWord();
console.log(rightWord);

const userWinOrLosse$ = new Subject();

// Observers
const keyDownObserver = {
    next: (event) => {
        const pressedKey = event.key.toUpperCase();
        if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i) && letterIndex < 5) {
            let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
            letterBox.textContent = pressedKey;
            userAnswer.push(pressedKey);
            letterBox.classList.add('filled-letter');
            letterIndex++;
        }
        
    }
}

const deleteLetter = {
    next: (event) => { 
        console.log(event);
        const pressedKey = event.key;
        if (pressedKey === 'Backspace' && letterIndex !== 0) {
            let currentRow = letterRows[letterRowIndex];
            let letterBox = currentRow.children[letterIndex - 1];
            letterBox.textContent = '';
            letterBox.classList.remove('filled-letter');
            letterIndex--;
            userAnswer.pop();
            
        }
    }
}

const checkWord = {
    next: (event) => {
        if (event.key === 'Enter') {
            const rightWordArray = Array.from(rightWord);
            if (userAnswer.length !== 5) {
                let missingWords = userAnswer.length;
                messageText.textContent = `Te faltan ${5 - missingWords} letras!`
                return;
            } 


            for (let index = 0; index < 5; index++) {
                let letterColor = "";
                let letterBox = Array.from(letterRows)[letterRowIndex].children[index];
                let letterPosition = rightWordArray.indexOf(userAnswer[index]);

                if (letterPosition === -1) {
                    letterColor = "letter-gray";
                } else {
                    if (rightWordArray[index] === userAnswer[index]) {
                        letterColor = "letter-green";
                    } else {
                        letterColor = "letter-yellow";
                    }
                }

                letterBox.classList.add(letterColor);
                
            }

            if (userAnswer.join("") === rightWord) {
                messageText.textContent = "¡Has ganado! 😃";
                userWinOrLosse$.next();
            }

            if (letterRowIndex > 4) {
                messageText.textContent = "¡Perdiste, intenta nuevamente! 😃";
                Array.from(letterRows).map((row) =>
                Array.from(row.children).map((letterBox) => {
                  letterBox.textContent = "";
                  letterBox.classList = "letter";
                }));

                setTimeout(() => {
                    messageText.textContent = '';
                }, 3000)
                
            }
            if (userAnswer.length === 5) {
                letterIndex = 0;
                letterRowIndex++;
                userAnswer = [];
            } 
        }
    }
}

// Subscriptions
onKeyDown$.subscribe(keyDownObserver);
onKeyDown$.subscribe(checkWord);
onKeyDown$.subscribe(deleteLetter);

userWinOrLosse$.subscribe(() => {
    let completeWordRow = Array.from(letterRows)[letterRowIndex];
    for (let index = 0; index < 5; index++) {
        completeWordRow.children[index].classList.add('letter-green');   
    }
})
