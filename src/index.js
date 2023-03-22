import { fromEvent, Subject } from "rxjs";
import WORDS_LIST from './wordsList.json';

const letterRows = document.getElementsByClassName('letter-row');
const messageText = document.getElementById('message-text');

const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
const getRandomWord = () => WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord = getRandomWord();
console.log(rightWord);

const userWinOrLosse$ = new Subject();

const keyDownObserver = {
    next: (event) => {
        const pressedKey = event.key.toUpperCase();
        if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
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
                messageText.textContent = "Te faltan algunas letras!"
                return;
            } else {
                messageText.textContent = "";
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

            if (userAnswer.length === 5) {
                letterIndex = 0;
                letterRowIndex++;
                userAnswer = [];
            } 

            if (userAnswer.join("") === rightWord) {
                userWinOrLosse$.next();
            }
        }
    }
}

onKeyDown$.subscribe(keyDownObserver);
onKeyDown$.subscribe(checkWord);
onKeyDown$.subscribe(deleteLetter);

userWinOrLosse$.subscribe(() => {
    let completeWordRow = Array.from(letterRows)[letterRowIndex];
    console.log(completeWordRow);
    for (let index = 0; index < 5; index++) {
        completeWordRow.children[index].classList.add('letter-green');
        
    }
})
