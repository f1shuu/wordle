var currentID = 1, currentWord = '', length = 0;
var wordToGuess;
const keys = document.querySelectorAll('.key');
const resetButton = document.getElementById('reset');
const giveUpButton = document.getElementById('give_up');

fetch('data.txt')
    .then(response => response.text())
    .then(text => {
        const words = text.split('\n');
        wordToGuess = words[Math.floor(Math.random() * 26379)];
        console.log(`Random word: ${wordToGuess}`);
    })

keys.forEach(key => {
    key.addEventListener('click', function () {
        if (key.id === 'delete' && currentID > 1) {
            document.getElementById(currentID - 1).textContent = '';
            currentWord = currentWord.slice(0, -1);
            length--;
            if (currentID > 0) currentID--;
        } else if (key.id === 'enter') {
            if (((currentID - 1) % 5 !== 0)) alert('Za mało znaków!');
            else {
                var temporaryWord = currentWord.toLowerCase();
                fetch('data.txt')
                    .then(response => response.text())
                    .then(text => {
                        if (text.includes(temporaryWord)) {
                            if (temporaryWord === wordToGuess) {
                                if(confirm('Gratulacje! Chcesz rozpocząć nową grę?')) location.reload();
                            }
                        }
                        else alert('Podane słowo nie istnieje!');
                    });
                currentWord = '';
                length = 0;
            }
        } else if (key.id !== 'delete' && key.id !== 'enter' && length < 5) {
            document.getElementById(currentID).textContent = key.textContent;
            currentWord += key.textContent;
            length++;
            currentID++;
        }
    })
});

resetButton.addEventListener('click', function () {
    if (confirm('Czy na pewno?')) location.reload();
});

giveUpButton.addEventListener('click', function () {
    if (confirm('Czy na pewno?')) {
        alert('Porażka! Ukryte słowo: ' + wordToGuess)
        location.reload();
    }
});