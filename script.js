var manual = "Jak grać?\n\nTwoim zadaniem jest zgadnięcie pięcioliterowego słowa z puli wszystkich takich słów z języka polskiego. Masz na to 6 prób.\nZ każdą próbą gra będzie podświetlać litery wpisanych przez Ciebie słów:\n- KOLOR SZARY oznacza, że dana litera w ogóle nie występuje w szukanym słowie,\n- KOLOR ŻÓŁTY oznacza, że dana litera występuje w szukanym słowie, ale nie na tym miejscu,\n- KOLOR ZIELONY oznacza, że dana litera występuje w szukanym słowie i znajduje się już na odpowiednimmiejscu.\n* Pamiętaj że słowo może zawierać dwie te same litery!\n\nOprócz klawiatury, masz do dyspozycji cztery klawisze:\n- PODDAJ SIĘ - reset rozgrywki i wyświetlenie ukrytego hasła,\n- RESET - szybki reset rozgrywki,\n- USUŃ - usunięcie ostatnio wpisanej litery,\n- ENTER - zatwierdzenie wpisywanego słowa i przejście do następnej linii.\n\nMiłej gry!";
var database = "assets/dtbs/databasePL.txt";
var numberOfWords = 26379;
var languageSwitchWarning = "Spowoduje to utratę postępów w obecnej rozgrywce. Kontynuować?";
var assuranceMessage = "Czy na pewno?";
var noWordProvidedWarning = "Nie podano żadnego słowa!";
var wrongWordWarning = "Za mało znaków!";
var winMessage = "Gratulacje! Chcesz rozpocząć nową grę?";
var loseMessage = "Porażka! Ukryte słowo: ";
var noWordWarning = "Nie znaleziono słowa!";
var confirmationOpened = false, currentID = 0, currentWord = "", length = 0, wordToGuess, clickedKeys = [];
const polishButton = document.getElementById("polish");
const englishButton = document.getElementById("english");
const darkButton = document.getElementById("dark");
const lightButton = document.getElementById("light");
const polish_keys = document.querySelectorAll(".polish_key");
const keys = document.querySelectorAll(".key");
const giveUpButton = document.getElementById("give_up");
const resetButton = document.getElementById("reset");
const deleteButton = document.getElementById("delete");
const enterButton = document.getElementById("enter");
const buttons = document.querySelectorAll(".button");
const yes1 = document.getElementById("yes1");
const no1 = document.getElementById("no1");
const yes2 = document.getElementById("yes2");
const no2 = document.getElementById("no2");

const polishContent = {
    give_up: "Poddaj się",
    delete: "Usuń",
    database: "assets/dtbs/databasePL.txt",
    numberOfWords: 26379,
    languageSwitchWarning: "Spowoduje to utratę postępów w obecnej rozgrywce. Kontynuować?",
    assuranceMessage: "Czy na pewno?",
    noWordProvidedWarning: "Nie podano żadnego słowa!",
    wrongWordWarning: "Za mało znaków!",
    winMessage: "Gratulacje! Chcesz rozpocząć nową grę?",
    loseMessage: "Porażka! Ukryte słowo: ",
    noWordWarning: "Nie znaleziono słowa!",
    yes1: "Tak",
    no1: "Nie",
    yes2: "Tak",
    no2: "Nie"
};

const englishContent = {
    manual: "xD",
    give_up: "Give up",
    delete: "Delete",
    database: "assets/dtbs/databaseENG.txt",
    numberOfWords: 12546,
    languageSwitchWarning: "This will result in the loss of progress in the current game. Continue?",
    assuranceMessage: "Are you sure?",
    noWordProvidedWarning: "No word provided!",
    wrongWordWarning: "Too few letters!",
    winMessage: "Congrats! Do you want to play again?",
    loseMessage: "You lose! Hidden word was: ",
    noWordWarning: "Word not found",
    yes1: "Yes",
    no1: "No",
    yes2: "Yes",
    no2: "No"
};

var currentLanguage = polishContent;

function translate() {
    giveUpButton.textContent = currentLanguage.give_up;
    deleteButton.textContent = currentLanguage.delete;
    manual = currentLanguage.manual;
    database = currentLanguage.database;
    numberOfWords = currentLanguage.numberOfWords;
    languageSwitchWarning = currentLanguage.languageSwitchWarning;
    assuranceMessage = currentLanguage.assuranceMessage;
    noWordProvidedWarning = currentLanguage.noWordProvidedWarning;
    wrongWordWarning = currentLanguage.wrongWordWarning;
    winMessage = currentLanguage.winMessage;
    loseMessage = currentLanguage.loseMessage;
    noWordWarning = currentLanguage.noWordWarning;
    yes1.textContent = currentLanguage.yes1;
    no1.textContent = currentLanguage.no1;
    yes2.textContent = currentLanguage.yes2;
    no2.textContent = currentLanguage.no2;
}

polishButton.addEventListener("click", () => {
    if (currentLanguage !== polishContent) {
        if (currentID !== 0) {
            if (confirm(languageSwitchWarning)) {
                clear();
                currentLanguage = polishContent;
                translate();
                document.querySelectorAll(".polish_key").forEach(function (button) { button.style.display = "block" });
            }
        } else {
            clear();
            currentLanguage = polishContent;
            translate();
            document.querySelectorAll(".polish_key").forEach(function (button) { button.style.display = "block" });
        }
    }
});

englishButton.addEventListener("click", () => {
    if (currentLanguage !== englishContent) {
        if (currentID !== 0) {
            if (confirm(languageSwitchWarning)) {
                clear();
                currentLanguage = englishContent;
                translate();
                document.querySelectorAll(".polish_key").forEach(function (button) { button.style.display = "none" });
            }
        } else {
            clear();
            currentLanguage = englishContent;
            translate();
            document.querySelectorAll(".polish_key").forEach(function (button) { button.style.display = "none" });
        }
    }
});

function clear() {
    buttons.forEach(button => {
        button.removeAttribute("style");
        button.textContent = "";
    })
    if (currentLanguage === polish) polish_keys.forEach(key => { key.removeAttribute("style"); })
    keys.forEach(key => { key.removeAttribute("style"); });
    currentID = 0;
    currentWord = "";
    length = 0;
    clickedKeys = [];
    generateRandomWord();
}

function openManual() {
    if (currentLanguage === polishContent) document.getElementById("polish_manual").classList.add("open-manual");
    else document.getElementById("english_manual").classList.add("open-manual");
}

function closeManual() {
    if (currentLanguage === polishContent) document.getElementById("polish_manual").classList.remove("open-manual");
    else document.getElementById("english_manual").classList.remove("open-manual");
}

var currentTheme = dark;

function switchThemeToDark() {
    document.body.style.backgroundColor = "#1e1e1e";
    document.getElementById("h1").style.color = "#fff";
    document.getElementById("h2").style.color = "#fff";
    document.getElementById("help").style.color = "#fff";
    currentTheme = dark;
}

function switchThemeToLight() {
    document.body.style.backgroundColor = "#fff";
    document.getElementById("h1").style.color = "#3e3e42";
    document.getElementById("h2").style.color = "#3e3e42";
    document.getElementById("help").style.color = "#3e3e42";
    currentTheme = light;
}

darkButton.addEventListener("click", function () { switchThemeToDark(); });

lightButton.addEventListener("click", function () { switchThemeToLight(); });

function openAlert(message) {
    document.getElementById("alertMessage").innerHTML = message;
    document.getElementById("alert").classList.add("open-alert");
}

function openAlertAndReset(message) {
    closeConfirmation();
    message = loseMessage + wordToGuess;
    document.getElementById("alertMessage").innerHTML = message;
    document.getElementById("alert").classList.add("open-alert");
    clear();
}

function closeAlert() { document.getElementById("alert").classList.remove("open-alert"); }

function openConfirmation(message) {
    confirmationOpened = true;
    document.getElementById("confirmationMessage").innerHTML = message;
    document.getElementById("confirmation").classList.add("open-confirmation");
}

function closeConfirmation() {
    confirmationOpened = false;
    document.getElementById("confirmation").classList.remove("open-confirmation");
}

function displayWinMessage(winMessage) {
    document.getElementById("winMessage").innerHTML = winMessage;
    document.getElementById("win").classList.add("display-win")
}

function closeAndClear() {
    document.getElementById("win").classList.remove("display-win");
    clear();
}

function justClose() { document.getElementById("win").classList.remove("display-win"); }

function generateRandomWord() {
    fetch(database)
        .then(response => response.text())
        .then(data => {
            const words = data.split("\n");
            wordToGuess = words[Math.floor(Math.random() * numberOfWords)];
            console.log(wordToGuess);
        });
}
generateRandomWord();

polish_keys.forEach(key => {
    key.addEventListener("click", function () {
        if (length < 5) {
            document.getElementById(currentID).textContent = key.textContent;
            currentWord += key.textContent;
            currentID++;
            length++;
        }
    })
});

keys.forEach(key => {
    key.addEventListener("click", function () {
        if (length < 5) {
            document.getElementById(currentID).textContent = key.textContent;
            currentWord += key.textContent;
            currentID++;
            length++;
        }
    })
});

giveUpButton.addEventListener("click", function () { openConfirmation(assuranceMessage); });

resetButton.addEventListener("click", function () { openConfirmation(assuranceMessage); });

deleteButton.addEventListener("click", function () {
    if (currentID > 0 && length > 0) {
        document.getElementById(currentID - 1).textContent = "";
        currentWord = currentWord.slice(0, -1);
        currentID--;
        length--;
    }
});

enterButton.addEventListener("click", function () {
    if (currentID === 0) {
        openAlert(noWordProvidedWarning);
        return;
    }
    else if (currentID % 5 !== 0) openAlert(wrongWordWarning);
    else {
        var temporaryWord = currentWord.toLowerCase();
        fetch(database)
            .then(response => response.text())
            .then(text => {
                if (text.includes(temporaryWord)) {
                    if (temporaryWord === wordToGuess) {
                        for (let i = currentID - 5; i < currentID; i++) document.getElementById(i).style.backgroundColor = "#4caf50";
                        displayWinMessage(winMessage);
                    } else if (currentID === 30) {
                        openAlert(loseMessage + wordToGuess);
                        location.reload();
                    } else checkWord(wordToGuess, currentID);
                } else {
                    openAlert(noWordWarning);
                    for (let i = currentID - 5; i < currentID; i++) document.getElementById(i).textContent = "";
                    currentID -= 5;
                }
            });
        currentWord = "";
        length = 0;
    }
});

function checkWord(wordToGuess, currentID) {
    var index = 0;
    for (let i = currentID - 5; i < currentID; i++) {
        if (wordToGuess.includes(document.getElementById(i).textContent.toLowerCase())) {
            if (wordToGuess.indexOf(document.getElementById(i).textContent.toLowerCase()) === index) {
                document.getElementById(i).style.backgroundColor = "#4caf50";
                keys.forEach(key => {
                    if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                        key.style.backgroundColor = "#4caf50";
                        clickedKeys.push(key.id);
                    }
                });
            } else {
                document.getElementById(i).style.backgroundColor = "#ffcb00";
                if (!clickedKeys.includes(document.getElementById(i).textContent.toLowerCase())) {
                    keys.forEach(key => {
                        if (document.getElementById(i).textContent.toLowerCase() === key.id) {
                            key.style.backgroundColor = "#ffcb00";
                            clickedKeys.push(key.id);
                        }
                    });
                }
            }
            var deleted = false;
            for (let j = 0; j < 5; j++) {
                if (!deleted) {
                    wordToGuess = wordToGuess.replace(new RegExp(document.getElementById(i).textContent.toLowerCase()), "X");
                    deleted = true;
                }
            }
        } else {
            document.getElementById(i).style.backgroundColor = "#2d2d30";
            if (!clickedKeys.includes(document.getElementById(i).textContent.toLowerCase())) {
                keys.forEach(key => {
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