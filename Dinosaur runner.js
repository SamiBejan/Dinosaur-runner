const area = document.querySelector(".area");
let grid = new Array(31), dinosaur  = new Array(0);
let dinosaurUp = false, start = false, end = false;
let jumper, timer, intervalGenerator, obstacleMover;
let phaseInd = 1, minutes = 0, seconds = 0, recordMin = 0, recordSec = 0;
let obstacles = new Array(0);

createGrid();
createDinosaur();

function createGrid() {
    for (let i = 0; i < grid.length; ++i) {
        grid[i] = new Array(101);
    }
    //We create the run area and the ground.
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

//A new dinosaur is created on the initial position.
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

/*If the key pressed is Space and the dinosaur is on the ground, the jump is released.
Also, if the game din't start or is over, it will start*/
function jumpOrStart(e) {
    if (e.code === "Space" || e.key === "ArrowUp")  {
        if (dinosaurUp === false && !end) {
            dinosaurUp = true;
            jumper = setInterval(jump, 30);
        }
        if (!start) {
            startGame();
        }
    }
}

function startGame() {
    start = true;
    end = false;
    dinosaurUp = false;
    deleteDinosaur();
    createDinosaur();
    const obstacleCells = document.getElementsByClassName("obstacle");
    while (obstacleCells.length) {
        obstacleCells[0].classList.remove("obstacle");
    }
    obstacles = [];
    phaseInd = 1, minutes = 0, seconds = 0;
    timer = setInterval(runTime, 1000);
    intervalGenerator = setInterval(generateIntervals, 3000);
    obstacleMover = setInterval(moveObstacles, 40);
}

/*The dinosaur moves up and then down. When it touches back the ground, the jump move ends.
If it detects an obstacle, the game ends*/
function jump() {
    ++phaseInd;
    if (phaseInd <= 15 && !end) {
        for (let i = dinosaur.length - 1; i >= 0; --i) {
            ++dinosaur[i].line;
            if (grid[dinosaur[i].line][dinosaur[i].col].classList.contains("obstacle")) {
                endGame();
            }
        }
        for (let i = dinosaur.length - 1; i >= 0; --i) {
            grid[dinosaur[i].line - 1][dinosaur[i].col].classList.remove("dinosaur");
            grid[dinosaur[i].line][dinosaur[i].col].classList.add("dinosaur");
        } 
    } else if (phaseInd > 17 && !end) {
        for (let i = 0; i < dinosaur.length && !end; ++i) {
            --dinosaur[i].line;
            if (grid[dinosaur[i].line][dinosaur[i].col].classList.contains("obstacle")) {
                endGame();
            }
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

//We count the game time and make sure that the minutes and seconds are displayed with two digits.
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
}

/*To ensure that the obstacles are positioned at the same distance, a randoom delay is generated and implemented*/
function generateIntervals() {
    let delayValue = Math.ceil(Math.random() * 3) * 1000;
    const delay = setTimeout(generateObstacles, delayValue);
    console.log(delayValue);
}

//Obstacles of different height are generated and displayed
function generateObstacles() {
    let height = Math.ceil(Math.random() * 5);
    let obstacle = new Array(0);
    for (let i = 1; i <= height; ++i) {
        obstacle.push({"line": i, "col": 101});
    }
    obstacles.push(obstacle);
}

/*The obstacles are moved. First, we check if there is collision with the dinosaur and if not, 
the cells are properly actualized. Special cases are with obstacles that enter the area from the right.
or leaving the area in the left*/
function moveObstacles() {
    for (let i = 0; i < obstacles.length && !end; ++i) {
        let removeObstacle = false;
        for (let j = 0; !end && j < obstacles[i].length; ++j) {
            --obstacles[i][j].col;
            if (obstacles[i][j].col != 0 && grid[obstacles[i][j].line][obstacles[i][j].col].classList.contains("dinosaur")) { 
                endGame();
            }
        }
        if (!end) {
            for (let j = 0; j < obstacles[i].length; ++j) {
                if (obstacles[i][j].col != 100) {
                    grid[obstacles[i][j].line][obstacles[i][j].col + 1].classList.remove("obstacle");
                }
                if (obstacles[i][j].col != 0) {
                    grid[obstacles[i][j].line][obstacles[i][j].col].classList.add("obstacle");
                } else {
                    obstacles[i].splice(j, 1);
                    removeObstacle = true;
                    --j;
                }
            }
            if (removeObstacle) {
                obstacles.shift();
                --i;
            }
        }
    }    
}

function endGame() {
    clearInterval(jumper);
    clearInterval(intervalGenerator);
    clearInterval(obstacleMover);
    clearInterval(timer);
    updateRecord();
    end = true;
    start = false;
}

//If the game that just ended establishes a time record, it is displayed.
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

window.addEventListener('keydown', jumpOrStart);
