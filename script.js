var currentID = 0, currentWord = '', length = 0, wordToGuess, clickedKeys = [];
const keys = document.querySelectorAll('.key');
const giveUpButton = document.getElementById('give_up');
const resetButton = document.getElementById('reset');
const deleteButton = document.getElementById('delete');
const enterButton = document.getElementById('enter');

fetch('data.txt')
    .then(response => response.text())
    .then(text => {
        const words = text.split('\n');
        const wordToGuess = words[Math.floor(Math.random() * 26379)];
        console.log(`Random word: ${wordToGuess}`);
    })
    .catch(error => console.error(error));

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
    if (confirm('Czy na pewno?')) {
        alert('Porażka! Ukryte słowo: ' + wordToGuess)
        location.reload();
    }
});

resetButton.addEventListener('click', function () { if (confirm('Czy na pewno?')) location.reload(); });

deleteButton.addEventListener('click', function () {
    if (currentID > 0 && length > 0) {
        document.getElementById(currentID - 1).textContent = '';
        currentWord = currentWord.slice(0, -1);
        currentID--;
        length--;
    }
});

enterButton.addEventListener('click', function () {
    if (currentID === 30) {
        alert('Porażka! Ukryte słowo: ' + wordToGuess);
        location.reload();
    } else if (currentID % 5 !== 0) alert('Za mało znaków!');
    else {
        var temporaryWord = currentWord.toLowerCase();
        fetch('data.txt')
            .then(response => response.text())
            .then(text => {
                if (text.includes(temporaryWord)) {
                    if (temporaryWord === wordToGuess) {
                        for (let i = currentID - 5; i < currentID; i++) document.getElementById(i).style.backgroundColor = '#4caf50';
                        setTimeout(function () { if (confirm('Gratulacje! Chcesz rozpocząć nową grę?')) location.reload(); }, 100);
                    } else checkWord(temporaryWord, wordToGuess, currentID);
                } else {
                    alert('Nie znaleziono słowa!');
                    for (let i = currentID - 5; i < currentID; i++) document.getElementById(i).textContent = '';
                    currentID -= 5;
                }
            });
        currentWord = '';
        length = 0;
    }
});

function checkWord(temporaryWord, wordToGuess, currentID) {
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