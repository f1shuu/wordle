var currentID = 0, currentWord = '', length = 0;
var wordToGuess;
const keys = document.querySelectorAll('.key');
const giveUpButton = document.getElementById('give_up');
const resetButton = document.getElementById('reset');
const deleteButton = document.getElementById('delete');
const enterButton = document.getElementById('enter');

// reading words database and picking a random word
fetch('data.txt')
    .then(response => response.text())
    .then(text => {
        const words = text.split('\n');
        wordToGuess = words[Math.floor(Math.random() * 26379)];
        console.log(`Random word: ${wordToGuess}`);
    })

// virtual keyboard input
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

// give up button input
giveUpButton.addEventListener('click', function () {
    if (confirm('Czy na pewno?')) {
        alert('Porażka! Ukryte słowo: ' + wordToGuess)
        location.reload();
    }
});

// reset button input
resetButton.addEventListener('click', function () {
    if (confirm('Czy na pewno?')) location.reload();
});

// delete button input
deleteButton.addEventListener('click', function () {
    if (currentID > 0) {
        document.getElementById(currentID - 1).textContent = '';
        currentWord = currentWord.slice(0, -1);
        currentID--;
        length--;
    }
});

// enter button input
enterButton.addEventListener('click', function () {
    if (currentID === 30) {
        alert('Porażka! Ukryte słowo: ' + wordToGuess);
        location.reload();
    }
    if (currentID % 5 !== 0) alert('Za mało znaków!');
    else {
        var temporaryWord = currentWord.toLowerCase();
        fetch('data.txt')
            .then(response => response.text())
            .then(text => {
                if (text.includes(temporaryWord)) {
                    if (temporaryWord === wordToGuess) {
                        if (confirm('Gratulacje! Chcesz rozpocząć nową grę?')) location.reload();
                    }
                }
                else alert('Podane słowo nie istnieje!');
            });
        currentWord = '';
        length = 0;
    }
});