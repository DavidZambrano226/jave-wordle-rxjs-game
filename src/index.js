import { fromEvent, Subject } from "rxjs";
import WORDS_LIST from './wordsList.json';

const letterRows = document.getElementsByClassName('letter-row');
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

const checkWord = {
    next: (event) => {
        if (event.key === 'Enter') {
            if (userAnswer.join("") === rightWord) {
                userWinOrLosse$.next();
            }
        }
    }
}

onKeyDown$.subscribe(keyDownObserver);
onKeyDown$.subscribe(checkWord);
userWinOrLosse$.subscribe(() => {
    let completeWordRow = Array.from(letterRows)[letterRowIndex];
    console.log(completeWordRow);
    for (let index = 0; index < 5; index++) {
        completeWordRow.children[index].classList.add('letter-green');
        
    }
})
