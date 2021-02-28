//TODO: Clean up, function scopes, move animation, drag&drop, two or more players in same position visual

import roll from './components/dice.js'

let currentPlayer = 0;
let steppedOn;
let newPos;
let messageTop = "Roll the die to begin playing.";
let messageBottom = "";
let players = localStorage.getItem("players");
players = JSON.parse(players);
let diceNum;

// Display number of every field
for (let i = document.querySelectorAll(".pos").length - 1; i > 0; i--) {
    const element = document.querySelectorAll(".pos")[i];
    element.insertAdjacentHTML("beforeend", `<p>${element.id.slice(3)}</p>`);
}

// Remember initial state the board
const initialState = document.querySelector("body").outerHTML;

// Render pieces in starting position
for (let i = 0; i < players.length; i++) {
    players[i].position = 0;
    document.getElementById("pos0").innerHTML += `<img class="piece" id="${players[i].color}-piece" src="./assets/piece-${players[i].color}.png">`
}

// Inital board display
displayBoard(0, messageTop, messageBottom);

function checkDice(callback, playingNow) {
    diceNum = callback();
    players[playingNow].position += diceNum;
    messageTop = `${players[currentPlayer].name} rolled ${diceNum}.`;
    console.log(players)
    if (checkGameOver(players[playingNow].position)) {
        messageBottom = `<p>${players[currentPlayer].name} wins.</p>`;
        displayBoard(currentPlayer, messageTop, "", true);
    } else if (changeCheck(players[currentPlayer].position)) {
        if (checkGameOver(newPos)) {
            messageBottom = `<p>${players[currentPlayer].name} wins.</p>`;
            displayBoard(currentPlayer, messageTop, messageBottom, true);
        } else {
            players[playingNow].position = newPos;
            messageTop = `<p>${players[currentPlayer].name} rolled ${diceNum} and stepped on a ${steppedOn}! Move to position ${newPos}.</p>`;
            playerEndCheck(currentPlayer);
            messageBottom = `<p>It's ${players[currentPlayer].name}'s turn now.</p>`;
            displayBoard(currentPlayer, messageTop, messageBottom, false);
        }
    } else {
        if (checkGameOver(players[currentPlayer].position)) {
            messageBottom = `<p>${players[currentPlayer].name} wins.</p>`;
            displayBoard(currentPlayer, messageTop, messageBottom, true);
        } else {
            if (diceNum < 6) {
                playerEndCheck(currentPlayer);
                messageBottom = `<p>It's ${players[currentPlayer].name}'s turn now.</p>`;
                displayBoard(currentPlayer, messageTop, messageBottom, false);
            } else {
                displayBoard(currentPlayer, messageTop, messageBottom, false);
            }
        }
    }

}

function playerEndCheck(playingNow) {
    if (playingNow >= players.length - 1) {
        console.log(playingNow)
        currentPlayer = 0;
    } else {
        console.log(playingNow)
        currentPlayer++;
    }
}

function checkGameOver(pos) {
    if (pos >= 100) {
        return true;
    }
    return false;
}

function changeCheck(pos) {
    let newPosElement = document.getElementById(`pos${pos}`);
    let hasChildren = document.getElementById(`pos${pos}`).hasChildNodes();
    console.log(newPosElement);
    if (hasChildren) {
        if (newPosElement.firstElementChild.nodeName.toLowerCase() == `img` && pos < 100) {
            let changeId = newPosElement.firstElementChild.id;
            steppedOn = newPosElement.firstElementChild.classList[0];
            console.log(steppedOn)
            let sliceIndex;
            for (let i = 0; i < changeId.length; i++) {
                if (changeId[i] == "-") {
                    sliceIndex = i + 1;
                }
            }
            changeId = changeId.slice(sliceIndex);
            console.log(changeId);

            if (!isNaN(changeId)) {
                newPos = parseInt(changeId);
                return true;
            }
        }
    }
    return false;
}

function displayBoard(playingNow, message1, message2, gameOver) {

    function clickHandler() {
        checkDice(roll, currentPlayer);
    }

    while (document.querySelector("body").firstChild) {
        document.querySelector("body").removeChild(document.querySelector("body").lastChild);
    }

    document.querySelector("body").insertAdjacentHTML("beforeend", initialState);

    if (gameOver) {
        alert(`${players[playingNow].name} wins!`);
        document.getElementById(`pos100`).innerHTML += `<img class="piece" id="piece-${players[playingNow].color}" src="./assets/piece-${players[playingNow].color}.png">`
        document.querySelector("main").style.filter = `grayscale(80%)`;
        document.querySelector("header").style.filter = `grayscale(80%)`;
        document.getElementById("start-container").style.visibility = "hidden";
        let newGame = `<div id="new-game" class="player-card"><h2>Game over!</h2>
        <a href="./index.html">Play again</a></div>`
        document.querySelector("body").insertAdjacentHTML("beforeend", newGame);
    } else {
        document.getElementById("dice").addEventListener("click", clickHandler, true);
        document.getElementById("info").innerHTML = message1;

        setTimeout(function () {
            document.getElementById("info").insertAdjacentHTML('afterend', message2);
        }, 400)

        for (let i = 0; i < players.length; i++) {
            document.getElementById(`pos${players[i].position}`).innerHTML += `<img class="piece" id="piece-${players[i].color}" src="./assets/piece-${players[i].color}.png">`
        }

        if (document.getElementById("pos0").hasChildNodes() == false) {
            document.getElementById("start-container").style.visibility = "hidden";
        } else {
            document.getElementById("starting-point").innerHTML = "Starting point:";
        }
    }
}


console.log(players)