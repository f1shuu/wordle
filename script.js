var database = 'databasePL.txt';
var numberOfWords = 26379;
var manualName = 'JakGrać.txt';
var languageSwitchWarning = 'Spowoduje to utratę postępów w obecnej rozgrywce. Kontynuować?';
var assuranceMessage = 'Czy na pewno?';
var wrongWordWarning = 'Za mało znaków!';
var winMessage = 'Gratulacje! Chcesz rozpocząć nową grę?';
var loseMessage = 'Porażka! Ukryte słowo: ';
var noWordWarning = 'Nie znaleziono słowa!';
var cleared = false, currentID = 0, currentWord = '', length = 0, wordToGuess, clickedKeys = [];
const polishButton = document.getElementById('polish');
const englishButton = document.getElementById('english');
const giveUpButton = document.getElementById('give_up');
const resetButton = document.getElementById('reset');
const deleteButton = document.getElementById('delete');
const enterButton = document.getElementById('enter');
const buttons = document.querySelectorAll('.button');
const keys = document.querySelectorAll('.key');

const polishContent = {
    give_up: 'Poddaj się',
    delete: 'Usuń',
    database: 'databasePL.txt',
    numberOfWords: 26379,
    manualName: 'JakGrać.txt',
    languageSwitchWarning: 'Spowoduje to utratę postępów w obecnej rozgrywce. Kontynuować?',
    assuranceMessage: 'Czy na pewno?',
    wrongWordWarning: 'Za mało znaków!',
    winMessage: 'Gratulacje! Chcesz rozpocząć nową grę?',
    loseMessage: 'Porażka! Ukryte słowo: ',
    noWordWarning: 'Nie znaleziono słowa!'
};

const englishContent = {
    give_up: 'Give up',
    delete: 'Delete',
    database: 'databaseENG.txt',
    numberOfWords: 12546,
    manualName: 'README.txt',
    languageSwitchWarning: 'This will result in the loss of progress in the current game. Continue?',
    assuranceMessage: 'Are you sure?',
    wrongWordWarning: 'Too few letters!',
    winMessage: 'Congrats! Do you want to play again?',
    loseMessage: 'You lose! Hidden word was: ',
    noWordWarning: 'Word not found'
};

var currentLanguage = polishContent;

function translate() {
    giveUpButton.textContent = currentLanguage.give_up;
    deleteButton.textContent = currentLanguage.delete;
    database = currentLanguage.database;
    numberOfWords = currentLanguage.numberOfWords;
    manualName = currentLanguage.manualName;
    languageSwitchWarning = currentLanguage.languageSwitchWarning;
    assuranceMessage = currentLanguage.assuranceMessage;
    wrongWordWarning = currentLanguage.wrongWordWarning;
    winMessage = currentLanguage.winMessage;
    loseMessage = currentLanguage.loseMessage;
    noWordWarning = currentLanguage.noWordWarning;
}

polishButton.addEventListener('click', () => {
    if (currentLanguage !== polishContent) {
        if (currentID !== 0) {
            if (confirm(languageSwitchWarning)) {
                clear();
                currentLanguage = polishContent;
                translate();
                document.querySelectorAll('.polish_key').forEach(function (button) { button.style.display = 'block' });
                generateRandomWord();
            }
        } else {
            clear();
            currentLanguage = polishContent;
            translate();
            document.querySelectorAll('.polish_key').forEach(function (button) { button.style.display = 'block' });
            generateRandomWord();
        }
    }
});

englishButton.addEventListener('click', () => {
    if (currentLanguage !== englishContent) {
        if (currentID !== 0) {
            if (confirm(languageSwitchWarning)) {
                clear();
                currentLanguage = englishContent;
                translate();
                document.querySelectorAll('.polish_key').forEach(function (button) { button.style.display = 'none' });
                generateRandomWord();
            }
        } else {
            clear();
            currentLanguage = englishContent;
            translate();
            document.querySelectorAll('.polish_key').forEach(function (button) { button.style.display = 'none' });
            generateRandomWord();
        }
    }
});

function openManual() { window.open(manualName, 'newwindow', 'width=928, height=320'); }

function clear() {
    buttons.forEach(button => {
        button.textContent = '';
        button.style.backgroundColor = '#3e3e42';
    })
    keys.forEach(key => {
        key.style.backgroundColor = '#3e3e42';
        key.onmouseover = function () { key.style.backgroundColor = '#2d2d30'; }
        key.onmouseout = function () { key.style.backgroundColor = '#3e3e42'; }
    })
    currentID = 0;
    currentWord = '';
    length = 0;
    cleared = true;
}

function generateRandomWord() {
    fetch(database)
        .then(response => response.text())
        .then(data => {
            const words = data.split('\n');
            wordToGuess = words[Math.floor(Math.random() * numberOfWords)];
            console.log(wordToGuess);
        });
}
generateRandomWord();

keys.forEach(key => {
    key.addEventListener('click', function () {
        if (length < 5) {
            document.getElementById(currentID).textContent = key.textContent;
            currentWord += key.textContent;
            currentID++;
            length++;
        }
    })
});

giveUpButton.addEventListener('click', function () {
    if (confirm(assuranceMessage)) {
        alert(loseMessage + wordToGuess)
        location.reload();
    }
});

resetButton.addEventListener('click', function () { if (confirm(assuranceMessage)) location.reload(); });

deleteButton.addEventListener('click', function () {
    if (currentID > 0 && length > 0) {
        document.getElementById(currentID - 1).textContent = '';
        currentWord = currentWord.slice(0, -1);
        currentID--;
        length--;
    }
});

enterButton.addEventListener('click', function () {
    if (currentID % 5 !== 0) alert(wrongWordWarning);
    else {
        var temporaryWord = currentWord.toLowerCase();
        fetch(database)
            .then(response => response.text())
            .then(text => {
                if (text.includes(temporaryWord)) {
                    if (temporaryWord === wordToGuess) {
                        for (let i = currentID - 5; i < currentID; i++) document.getElementById(i).style.backgroundColor = '#4caf50';
                        setTimeout(function () { if (confirm(winMessage)) location.reload(); }, 100);
                    } else if (currentID === 30) {
                        alert(loseMessage + wordToGuess);
                        location.reload();
                    } else checkWord(wordToGuess, currentID);
                } else {
                    alert(noWordWarning);
                    for (let i = currentID - 5; i < currentID; i++) document.getElementById(i).textContent = '';
                    currentID -= 5;
                }
            });
        currentWord = '';
        length = 0;
    }
});

function checkWord(wordToGuess, currentID) {
    var index = 0;
    for (let i = currentID - 5; i < currentID; i++) {
        if (wordToGuess.includes(document.getElementById(i).textContent.toLowerCase())) {
            if (wordToGuess.indexOf(document.getElementById(i).textContent.toLowerCase()) === index) {
                document.getElementById(i).style.backgroundColor = '#4caf50';
                keys.forEach(key => {
                    if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                        key.style.backgroundColor = '#4caf50';
                        clickedKeys.push(key.id);
                    }
                });
            } else {
                document.getElementById(i).style.backgroundColor = '#ffcb00';
                if (!clickedKeys.includes(document.getElementById(i).textContent.toLowerCase())) {
                    keys.forEach(key => {
                        if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                            key.style.backgroundColor = '#ffcb00';
                            clickedKeys.push(key.id);
                        }
                    });
                }
            }
            var deleted = false;
            for (let j = 0; j < 5; j++) {
                if (!deleted) {
                    wordToGuess = wordToGuess.replace(new RegExp(document.getElementById(i).textContent.toLowerCase()), 'X');
                    deleted = true;
                }
            }
        } else {
            document.getElementById(i).style.backgroundColor = '#2d2d30';
            if (!clickedKeys.includes(document.getElementById(i).textContent.toLowerCase())) {
                keys.forEach(key => {
                    if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                        key.style.backgroundColor = '#2d2d30';
                        clickedKeys.push(key.id);
                    }
                });
            }
        }
        index++;
    }
}