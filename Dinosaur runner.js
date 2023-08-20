const area = document.querySelector(".area");
let grid = new Array(31), dinosaur  = new Array(0);
let dinosaurUp = false, start = false, end = false;
let jumper, timer, obstacleGenerator, obstacleMover;
let phaseInd = 1, minutes = 0, seconds = 0, recordMin = 0, recordSec = 0;
let obstInd = 1, obstMoveInterval = 40, obstGenInterval = 500, obstDelayMult = 1000;
let obstacles = new Array(0);
let keysPressed = new Array(0);

createGrid();
createDinosaur();

function createGrid() {
    for (let i = 0; i < grid.length; ++i) {
        grid[i] = new Array(101);
    }
    //We created the run area and the ground
    for (let i = 0; i < grid.length; ++i) {
        const row = document.createElement("tr");
        for (let j = 1; j < grid[i].length; ++j) {
            grid[i][j] = document.createElement("td");
            if (i === 0) {
                grid[i][j].classList.add("ground");
            }
            row.appendChild(grid[i][j]);
        }
        area.prepend(row);
    }
}

//A new dinosaur is created on the initial position
function createDinosaur() {
    dinosaur = [{"line": 1, "col": 3}, {"line": 1, "col": 5}, {"line": 2, "col": 3}, {"line": 2, "col": 4}, 
    {"line": 2, "col": 5}, {"line": 3, "col": 2}, {"line": 3, "col": 3}, {"line": 3, "col": 4}, {"line": 3, "col": 5},
    {"line": 4, "col": 5}, {"line": 5, "col": 5}, {"line": 5, "col": 6}, {"line": 6, "col": 5}, {"line": 6, "col": 6}];
    for (let i = 0; i < dinosaur.length; ++i) {
        grid[dinosaur[i].line][dinosaur[i].col].classList.add("dinosaur");
    }
}

function deleteDinosaur() {
    const dinosaurCells = document.getElementsByClassName("dinosaur");
    while (dinosaurCells.length) {
        dinosaurCells[0].classList.remove("dinosaur");
    }
    dinosaur = [];
}

function deleteObstacles() {
    const cactusCells = document.getElementsByClassName("cactus");
    while (cactusCells.length) {
        cactusCells[0].classList.remove("cactus");
    }
    const birdCells = document.getElementsByClassName("bird");
    while (birdCells.length) {
        birdCells[0].classList.remove("bird");
    }
    obstacles = [];
}

/*If the key pressed is Space and the dinosaur is on the ground, the jump is released.
Also, if the game din't start or is over, it will start*/
function jumpCrouchOrStart(e) {
    if (keysPressed.length < 1 || e.code != keysPressed[keysPressed.length - 1]) {
        keysPressed.push(e.code);
    }
    if ((e.code === "Space" || e.key === "ArrowUp") && !keysPressed.includes("ArrowDown"))  {
        e.preventDefault();
        if (dinosaurUp === false && !end) {
            dinosaurUp = true;
            jumper = setInterval(jump, 22);
        }
        if (!start) {
            startGame();
        }
    } else if (e.key === "ArrowDown" && dinosaurUp === false) {
        e.preventDefault();
        crouch();
    }
}

function startGame() {
    start = true;
    end = false;
    dinosaurUp = false;
    deleteDinosaur();
    createDinosaur();
    deleteObstacles();
    phaseInd = 1, minutes = 0, seconds = 0, obstMoveInterval = 40;
    obstGenInterval = 500, obstInd = 1, obstDelayMult = 1000;
    document.getElementsByClassName("endGamePopUp")[0].style.visibility = "hidden";
    timer = setInterval(runTime, 1000);
    obstacleGenerator = setTimeout(generateObstacles, obstGenInterval);
    obstacleMover = setInterval(moveObstacles, obstMoveInterval);
}

/*The dinosaur moves up and then down. When it touches back the ground, the jump move ends.
If it detects an obstacle, the game ends*/
function jump() {
    ++phaseInd;
    if (phaseInd <= 15 && !end) {
        for (let i = dinosaur.length - 1; i >= 0; --i) {
            ++dinosaur[i].line;
            checkCollision(dinosaur, i, "cactus", "bird");
        }
        for (let i = dinosaur.length - 1; i >= 0; --i) {
            grid[dinosaur[i].line - 1][dinosaur[i].col].classList.remove("dinosaur");
            grid[dinosaur[i].line][dinosaur[i].col].classList.add("dinosaur");
        } 
    } else if (phaseInd > 17 && !end) {
        for (let i = 0; i < dinosaur.length && !end; ++i) {
            --dinosaur[i].line;
            checkCollision(dinosaur, i, "cactus", "bird");
        }
        for (let i = 0; i < dinosaur.length && !end; ++i) {
            grid[dinosaur[i].line + 1][dinosaur[i].col].classList.remove("dinosaur");
            grid[dinosaur[i].line][dinosaur[i].col].classList.add("dinosaur");
        }
    }
    if (phaseInd === 31 && !end) {
        clearInterval(jumper);
        phaseInd = 1;
        dinosaurUp = false;
    }
}

//If we press the down arrow and if there is no collision, the dinosaur crouches
function crouch() {
    let crouchPos = [{"line": 3, "col": 6}, {"line": 3, "col": 7}, {"line": 2, "col": 7},
    {"line": 3, "col": 8}, {"line": 2, "col": 8}];
    for (let i = 0; i < crouchPos.length && !end; ++i) {
        checkCollision(crouchPos, i, "cactus", "bird");
    }
    for (let i = 0, j = 9; i < crouchPos.length && !end; ++i, ++j) {
        grid[dinosaur[j].line][dinosaur[j].col].classList.remove("dinosaur");
        dinosaur[j].line = crouchPos[i].line;
        dinosaur[j].col = crouchPos[i].col;
        grid[dinosaur[j].line][dinosaur[j].col].classList.add("dinosaur");
    }
}

//After the down arrow button is released, the dinosaur returns in the stand position
function stand(e) {
    keysPressed.pop();
    if (e.key === "ArrowDown" && dinosaurUp === false) {
        deleteDinosaur();
        createDinosaur();
        for (let i = 9; i < dinosaur.length && !end; ++i) {
            checkCollision(dinosaur, i, "cactus","bird");
        }
    }
}

/*Cactuses or bird obstacles are generated. The cactuses can have different heights.
The birds appear after the first minute*/
function generateObstacles() {
    let obstacle = new Array(0);
    if (minutes > 1) {
        obstInd = Math.ceil(Math.random() * 3);
    }
    if (obstInd < 3) {
        let height = Math.ceil(Math.random() * 5);
        for (let i = 1; i <= height; ++i) {
            obstacle.push({"line": i, "col": 101, "type": "cactus"});
        }
    } else {
        let altitude = Math.ceil(Math.random() * 5 + 1);
        obstacle.push({"line": altitude + 1, "col": 101, "type": "bird"}, {"line": altitude, "col": 101, "type": "bird"},
        {"line": altitude + 1, "col": 102, "type": "bird"}, {"line": altitude, "col": 102, "type": "bird"}, 
        {"line": altitude, "col": 103, "type": "bird"});
    }
    obstacles.push(obstacle);
    let delayValue = Math.ceil(Math.random() * 2) * obstDelayMult;
    obstacleGenerator = setTimeout(generateObstacles, delayValue);
}

/*The obstacles are moved. First, we check if there is collision with the dinosaur and if not, 
the cells are properly actualized. Special cases are with obstacles that enter the area from the right
or leaving the area in the left*/
function moveObstacles() {
    for (let i = 0; i < obstacles.length && !end; ++i) {
        for (let j = 0; !end && j < obstacles[i].length; ++j) {
            --obstacles[i][j].col;
            if (obstacles[i][j].col > 0 && obstacles[i][j].col < 100) {
                checkCollision(obstacles[i], j, "dinosaur");
            }
        }
        if (!end) {
            for (let j = 0; j < obstacles[i].length; ++j) {
                if (obstacles[i][j].col < 100) {
                    grid[obstacles[i][j].line][obstacles[i][j].col + 1].classList.remove(obstacles[i][j].type);
                    if(obstacles[i][j].col < 3) {
                    }
                }
                if (obstacles[i][j].col > 0 && obstacles[i][j].col <= 100) {
                    grid[obstacles[i][j].line][obstacles[i][j].col].classList.add(obstacles[i][j].type);
                } else if (obstacles[i][j].col <= 0) {
                    obstacles[i].splice(j, 1);
                    --j;
                }
            }
            if (obstacles[i].length === 0) {
                obstacles.shift();
                --i;
            }
        }
    }    
}

//The collision with different obstacles is checked for the objects moving
function checkCollision(object, pos, opponent1, opponent2) {
    if (grid[object[pos].line][object[pos].col].classList.contains(opponent1) || 
    grid[object[pos].line][object[pos].col].classList.contains(opponent2) ) {
        endGame();
    }
}

/*We count the game time and make sure that the minutes and seconds are displayed with two digits
Also, between the 1'st and the 7'th minute, with each new minute, the obstacle speed is increased*/
function runTime() {
    ++seconds;
    let prefixMin = "0", prefixSec = "0";
    if (seconds === 60) {
        ++minutes;
        seconds = 0;
    }
    if (seconds >= 10) {
        prefixSec = "";
    }
    if (minutes >= 10) {
        prefixMin = "";
    }
    document.getElementsByClassName("timer")[0].innerHTML = prefixMin + minutes + ":" + prefixSec + seconds;
    if (minutes > 0 && minutes <= 5 && seconds === 0) {
        increaseObstacleSpeed();
    }
}

//The obstacle speed is increased
function increaseObstacleSpeed() {
    clearInterval(obstacleMover);
    obstMoveInterval -= 5;
    obstGenInterval -= 100;
    obstDelayMult -= 60;
    obstacleMover = setInterval(moveObstacles, obstMoveInterval);
}

//If the game that just ended establishes a time record, it is displayed
function updateRecord() {
    if (minutes > recordMin || seconds > recordSec) {
        recordMin = minutes;
        recordSec = seconds;
        let prefixRecordSec = 0, prefixMinSec = 0;
        if (recordSec >= 10) {
            prefixRecordSec = "";
        }
        if (recordMin >= 10) {
            prefixMinSec = "";
        }
        document.getElementsByClassName("flagTimer")[0].innerHTML = prefixMinSec + recordMin + ":" + prefixRecordSec + recordSec;
        document.getElementsByClassName("record")[0].style.visibility = "visible";
    }
}

function endGame() {
    clearInterval(jumper);
    clearTimeout(obstacleGenerator);
    clearInterval(obstacleMover);
    clearInterval(timer);
    keysPressed = [];
    document.getElementsByClassName("endGamePopUp")[0].style.visibility = "visible";
    updateRecord();
    end = true;
    start = false;
}

window.addEventListener('keydown', jumpCrouchOrStart);
window.addEventListener('keyup', stand);
