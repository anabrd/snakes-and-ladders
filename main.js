// TODO: Blank input check, player card animation, single check function for legit input

let playerNumberContainer = document.getElementById("player-number-container");
let playerCustomizationBtn = document.getElementById("player-customization-btn");
let players = [];
let playerNumber;

function generatePieces() {
    let colorList = ["red", "blue", "green", "yellow"];
    let choiceLiElements = "";

    for (let index = 0; index < colorList.length; index++) {
        const element = colorList[index];
        choiceLiElements += `<li><img class="${element}" src="./assets/piece-${element}.png"></li>`
    }

    return choiceLiElements;
}

function playerCustomizationCardGenerator(index) {
    return `<div id="player${index}-card" class="content player-card">
                <div class="name">
                    <label for="player${index}-name">
                        Player ${index}, type your name:
                    </label>
                    <input class="player-name" type="text" id="player${index}-name" required>
                </div>
                <div class="color">
                    <label for="player${index}-color">
                        Click to select color:
                    </label>
                    <ul id="player${index}-color">
                        ${generatePieces()}
                    </ul>
                </div>
                </div>`
}

function playerCustomization() {
    playerNumber = document.getElementById("player-number").value;

    if (playerNumber < 2 || playerNumber > 4) {
        alert("Please select a number between 1 and 4.")
    } else {
        playerNumberContainer.style.display = "none";
        document.querySelector("body").style.height = "100%";
        document.querySelector("body").insertAdjacentHTML("beforeend", `<section id="customize-players"></section>`)

        for (let i = 1; i <= playerNumber; i++) {
            document.querySelector("#customize-players").insertAdjacentHTML("beforeend", playerCustomizationCardGenerator(i));
        }

        for (let i = 1; i <= playerNumber; i++) {
            document.getElementById(`player${i}-card`).style.display = "block";
        }

        for (let i = 1; i < playerNumber; i++) {
            document.getElementById(`player${i}-card`).insertAdjacentHTML("beforeend", `<a href="#player${i+1}-card"/>Next</a>`)
        }
        document.querySelector("body").innerHTML += `<button id="to-game-btn" class="button">Start Game!</button>`
        document.getElementById("to-game-btn").addEventListener("click", () => toGame(isSameColor, tooFewPlayers));
    }

    const uls = document.querySelectorAll("li");
    for (let i = 0; i < uls.length; i++) {
        const element = uls[i];
        element.addEventListener("click", function (e) {

            let list = e.target.parentElement.parentElement;
            console.log(list.children)

            for (let i = 0; i < list.children.length; i++) {
                let piece = list.children[i];
                console.log(piece)
                if (piece.firstChild.classList.contains("animated")) {
                    console.log(piece.firstChild.classList.contains("animated"))
                    piece.firstChild.classList.remove("animated");
                }
            }

            e.target.classList.add("animated");
            let player = {};
            let playerColor = e.target.classList[0];
            let playerID = e.target.parentElement.parentElement.id.slice(6, 7);
            let playerName = document.getElementById(`player${playerID}-name`).value;
            if (!players[playerID - 1]) {
                player["name"] = playerName;
                player["color"] = playerColor;
                players.push(player);
            } else {
                players[playerID - 1].color = playerColor;
            }

        })
    }
}

function isSameColor() {
    let colors = [];
    for (const index in players) {
        colors.push(players[index].color);
    }

    if (colors.length == new Set(colors).size) {
        return false;
    }

    return true;
}

function tooFewPlayers() {
    if (players.length > 1) {
        return false;
    }
    return true;
}

function toGame(callback, callback2) {
    if (callback()) {
        alert("Please pick unique colors for each player.");
    } else if (callback2()) {
        alert("Please select name and color for all players.")
    } else {
        console.log(players);
        localStorage.setItem("players", JSON.stringify(players));
        window.location.href = "./game.html";
    }
}