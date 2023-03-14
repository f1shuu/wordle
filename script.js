var started = false, currentLanguage = polish, resetting = false, currentID = 0, currentWord = "", length = 0, wordToGuess, clickedKeys = [];

translate(polish);

function translate(languageToTranslateTo) {
    if (languageToTranslateTo === polish) {
        if (started === false || currentLanguage !== polish) {
            started = true;
            if (currentID !== 0) openConfirmation(languageSwitchWarning);
            else {
                currentLanguage = polish;
                document.getElementById("give_up").textContent = "Poddaj się";
                document.getElementById("delete").textContent = "Usuń";
                database = "assets/dtbs/databasePL.txt";
                numberOfWords = 26379;
                languageSwitchWarning = "Spowoduje to utratę postępów w obecnej rozgrywce. Kontynuować?";
                assuranceMessage = "Czy na pewno?";
                wrongWordWarning = "Za mało znaków!";
                winMessage = "Gratulacje! Chcesz rozpocząć nową grę?";
                loseMessage = "Porażka! Ukryte słowo: ";
                noWordWarning = "Nie znaleziono słowa";
                document.getElementById("yes1").textContent = "Tak";
                document.getElementById("no1").textContent = "Nie";
                document.getElementById("yes2").textContent = "Tak";
                document.getElementById("no2").textContent = "Nie";
                clear();
                document.querySelectorAll(".polish_key").forEach(function (button) { button.style.display = "block" });
            }
        }
    } else {
        if (currentLanguage !== english) {
            if (currentID !== 0) openConfirmation(languageSwitchWarning);
            else {
                currentLanguage = english;
                document.getElementById("give_up").textContent = "Give up";
                document.getElementById("delete").textContent = "Delete";
                database = "assets/dtbs/databaseENG.txt";
                numberOfWords = 12550;
                languageSwitchWarning = "This will result in the loss of progress in the current game. Continue?";
                assuranceMessage = "Are you sure?";
                wrongWordWarning = "Too few letters!";
                winMessage = "Congrats! Do you want to play again?";
                loseMessage = "You lose! Hidden word was: ";
                noWordWarning = "Word not found";
                document.getElementById("yes1").textContent = "Yes";
                document.getElementById("no1").textContent = "No";
                document.getElementById("yes2").textContent = "Yes";
                document.getElementById("no2").textContent = "No";
                clear();
                document.querySelectorAll(".polish_key").forEach(function (button) { button.style.display = "none" });
            }
        }
    }
}

function clear() {
    document.querySelectorAll(".button").forEach(button => {
        button.removeAttribute("style");
        button.textContent = "";
    })
    if (currentLanguage === polish) document.querySelectorAll(".polish_key").forEach(key => { key.removeAttribute("style"); })
    document.querySelectorAll(".key").forEach(key => { key.removeAttribute("style"); });
    currentID = 0;
    currentWord = "";
    length = 0;
    clickedKeys = [];
    generateRandomWord();
}

document.getElementById("polish").onclick = function () { translate(polish) };

document.getElementById("english").onclick = function () { translate(english) };

function openManual() {
    if (currentLanguage === polish) document.getElementById("polish_manual").classList.add("open-manual");
    else document.getElementById("english_manual").classList.add("open-manual");
}

function closeManual() {
    if (currentLanguage === polish) document.getElementById("polish_manual").classList.remove("open-manual");
    else document.getElementById("english_manual").classList.remove("open-manual");
}

function switchTheme(color1, color2) {
    document.body.style.backgroundColor = color1;
    document.getElementById("h1").style.color = color2;
    document.getElementById("h2").style.color = color2;
    document.getElementById("help").style.color = color2;
}

document.getElementById("dark").addEventListener("click", function () { switchTheme("#1e1e1e", "#fff"); });

document.getElementById("light").addEventListener("click", function () { switchTheme("#fff", "#3e3e42"); });

function openAlert(message) {
    document.getElementById("alertMessage").innerHTML = message;
    document.getElementById("alert").classList.add("open-alert");
}

function openAlertAndReset(message) {
    closeConfirmation();
    if (resetting) {
        message = loseMessage + wordToGuess;
        document.getElementById("alertMessage").innerHTML = message;
        document.getElementById("alert").classList.add("open-alert");
        clear();
        resetting = false;
    } else {
        if (currentLanguage === polish) translate(english);
        else translate(polish);
    }
}

function closeAlert() { document.getElementById("alert").classList.remove("open-alert"); }

function openConfirmation(message) {
    document.getElementById("confirmationMessage").innerHTML = message;
    document.getElementById("confirmation").classList.add("open-confirmation");
}

function closeConfirmation() { document.getElementById("confirmation").classList.remove("open-confirmation"); }

function displayWinMessage(winMessage) {
    document.getElementById("winMessage").innerHTML = winMessage;
    document.getElementById("win").classList.add("display-win");
}

function closeWinMessageAndClear() {
    document.getElementById("win").classList.remove("display-win");
    clear();
}

function justCloseWinMessage() { document.getElementById("win").classList.remove("display-win"); }

function generateRandomWord() {
    fetch(database)
        .then(response => response.text())
        .then(data => {
            const words = data.split("\n");
            wordToGuess = words[Math.floor(Math.random() * numberOfWords)];
            if (wordToGuess.length > 5) wordToGuess = wordToGuess.slice(0, -1);
            console.log(wordToGuess);
        });
}

document.querySelectorAll(".polish_key").forEach(key => {
    key.addEventListener("click", function () {
        if (length < 5) {
            document.getElementById(currentID).textContent = key.textContent;
            currentWord += key.textContent;
            currentID++;
            length++;
        }
    })
});

document.querySelectorAll(".key").forEach(key => {
    key.addEventListener("click", function () {
        if (length < 5) {
            document.getElementById(currentID).textContent = key.textContent;
            currentWord += key.textContent;
            currentID++;
            length++;
        }
    })
});

document.addEventListener("keydown", function (event) {
    if (event.keyCode === 8) { deleteFunction(); }
    else if (event.keyCode === 13) { enterFunction(); }
    else if (event.keyCode >= 65 && event.keyCode <= 90) {
        if (length < 5) {
            document.getElementById(currentID).textContent = event.key.toUpperCase();
            currentWord += event.key;
            currentID++;
            length++;
        }
    }
});

document.getElementById("give_up").addEventListener("click", function () {
    resetting = true;
    openConfirmation(assuranceMessage);
});

document.getElementById("reset").addEventListener("click", function () {
    resetting = true;
    openConfirmation(assuranceMessage);
});

function deleteFunction() {
    if (currentID > 0 && length > 0) {
        document.getElementById(currentID - 1).textContent = "";
        currentWord = currentWord.slice(0, -1);
        currentID--;
        length--;
    }
}

document.getElementById("delete").addEventListener("click", deleteFunction);

function enterFunction() {
    if (currentID === 0 || currentID % 5 !== 0) openAlert(wrongWordWarning);
    else {
        var temporaryWord = currentWord.toLowerCase();
        fetch(database)
            .then(response => response.text())
            .then(text => {
                if (text.includes(temporaryWord)) {
                    if (temporaryWord === wordToGuess) {
                        for (let i = currentID - 5; i < currentID; i++) document.getElementById(i).style.backgroundColor = "#4caf50";
                        displayWinMessage(winMessage);
                    }
                    else if (currentID === 30) {
                        resetting = true;
                        openAlertAndReset(loseMessage + wordToGuess);
                    }
                    else checkWord(wordToGuess, currentID);
                } else {
                    openAlert(noWordWarning);
                    for (let i = currentID - 5; i < currentID; i++) document.getElementById(i).textContent = "";
                    currentID -= 5;
                }
            });
        currentWord = "";
        length = 0;
    }
}

document.getElementById("enter").addEventListener("click", enterFunction);

function checkWord(wordToGuess, currentID) {
    var index = 0;
    for (let i = currentID - 5; i < currentID; i++) {
        if (wordToGuess.includes(document.getElementById(i).textContent.toLowerCase())) {
            if (wordToGuess.indexOf(document.getElementById(i).textContent.toLowerCase()) === index) {
                document.getElementById(i).style.backgroundColor = "#4caf50";
                document.querySelectorAll(".polish_key").forEach(key => {
                    if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                        key.style.backgroundColor = "#4caf50";
                        clickedKeys.push(key.id);
                    }
                });
                document.querySelectorAll(".key").forEach(key => {
                    if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                        key.style.backgroundColor = "#4caf50";
                        clickedKeys.push(key.id);
                    }
                });
                wordToGuess = wordToGuess.replace(new RegExp(document.getElementById(i).textContent.toLowerCase()), "X");
            } else {
                document.getElementById(i).style.backgroundColor = "#ffcb00";
                if (!clickedKeys.includes(document.getElementById(i).textContent.toLowerCase())) {
                    document.querySelectorAll(".polish_key").forEach(key => {
                        if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                            key.style.backgroundColor = "#ffcb00";
                            clickedKeys.push(key.id);
                        }
                    });
                    document.querySelectorAll(".key").forEach(key => {
                        if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                            key.style.backgroundColor = "#ffcb00";
                            clickedKeys.push(key.id);
                        }
                    });
                }
            }
        } else {
            document.getElementById(i).style.backgroundColor = "#2d2d30";
            if (!clickedKeys.includes(document.getElementById(i).textContent.toLowerCase())) {
                document.querySelectorAll(".polish_key").forEach(key => {
                    if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                        key.style.backgroundColor = "#2d2d30";
                        clickedKeys.push(key.id);
                    }
                });
                document.querySelectorAll(".key").forEach(key => {
                    if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                        key.style.backgroundColor = "#2d2d30";
                        clickedKeys.push(key.id);
                    }
                });
            }
        }
        index++;
    }
}