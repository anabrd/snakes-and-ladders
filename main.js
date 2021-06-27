let playerNumberContainer = document.getElementById("player-number-container");
let playerCustomizationBtn = document.getElementById("player-customization-btn");
let players = [];
let playerNumber;

function playerCustomizationCardGenerator(index) {
    return `<div id="player${index}-card" class="content player-card">
                <div class="name">
                    <label for="player${index}-name">
                        Player ${index}, type your name:
                    </label>
                    <input class="player-name" type="text" id="player${index}-name" onChange="insertName(event, ${index})"required>
                </div>
                <div class="color">
                    <label for="player${index}-color">
                        Click to select color:
                    </label>
                    <ul id="player${index}-color">
                        <li><img class="red" src="./assets/piece-red.png" onClick="selectColor(${index}, 'red')"></li>
                        <li><img class="blue" src="./assets/piece-blue.png" onClick="selectColor(${index}, 'blue')"></li>
                        <li><img class="green" src="./assets/piece-green.png" onClick="selectColor(${index}, 'green')"></li>
                        <li><img class="yellow" src="./assets/piece-yellow.png" onClick="selectColor(${index}, 'yellow')"></li>
                    </ul>
                </div>
            </div>`
}

function selectColor(index, color) {
    if (!players[index-1]) {
        players.push({color});
    } else {
        players[index-1].color = color
    }
    
    console.log(players)
}

function insertName(e, index) {
    let name = e.target.value

    if (!players[index-1]) {
        players.push({name});
    } else {
        players[index-1].name = name
    }
    console.log("Players in name func", players);
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
        document.getElementById("to-game-btn").addEventListener("click", () => toGame(colorCheck, playerNumCheck, nameCheck));
    }

    const uls = document.querySelectorAll("li");
    for (let i = 0; i < uls.length; i++) {
        const element = uls[i];
        element.addEventListener("click", function (e) {
            let list = e.target.parentElement.parentElement;
            for (let i = 0; i < list.children.length; i++) {
                let piece = list.children[i];
                if (piece.firstChild.classList.contains("animated")) {
                    console.log(piece.firstChild.classList.contains("animated"))
                    piece.firstChild.classList.remove("animated");
                }
            }
            e.target.classList.add("animated");
        })
    }
}

function colorCheck() {
    let colors = [];
    for (const player of players) {
        colors.push(player.color);
        if (player.color == undefined) {
            return true;
        }
    }

    colors.sort();
    for (let i = 0; i < colors.length; i++) {
        for (let j = i+1; j < colors.length; j++) {
            if (colors[i] == colors[j]) {
                return true;
            }
        }
    }

    return false;
}

function playerNumCheck() {
    if (players.length > 1) {
        return false;
    }
    return true;
}

function nameCheck() {
    for (const player of players) {
        if (player.name == "") {
            return true;
        }
    }
    return false;
}

function toGame(color, name, nameandcolor) {
    if (color()) {
        alert("Please pick unique colors for each player.");
    } else if (name()) {
        alert("Please select name and color for all players.")
    } else if (nameandcolor()) {
        alert("Please insert a name for all players.")
    } else {
        console.log(players);
        localStorage.setItem("players", JSON.stringify(players));
        window.location.href = "./game.html";
    }
}