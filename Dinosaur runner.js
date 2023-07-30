const area = document.querySelector(".area");
let grid = new Array(31);
let dinosaur  = [{"line": 1, "col": 3}, {"line": 1, "col": 5}, {"line": 2, "col": 3}, {"line": 2, "col": 4}, 
{"line": 2, "col": 5}, {"line": 3, "col": 2}, {"line": 3, "col": 3}, {"line": 3, "col": 4}, {"line": 3, "col": 5},
{"line": 4, "col": 5}, {"line": 5, "col": 5}, {"line": 5, "col": 6}, {"line": 6, "col": 5}, {"line": 6, "col": 6}];
let dinosaurUp = false, space = false;
let mover, timer;
let phaseInd = 1, minutes = 0, seconds = 0;
let start = false;

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

function createDinosaur() {
    for (let i = 0; i < dinosaur.length; ++i) {
        grid[dinosaur[i].line][dinosaur[i].col].classList.add("dinosaur");
    }
}

function deleteDinosaur() {
    for (let i = 0; i < dinosaur.length; ++i) {
        grid[dinosaur[i].line][dinosaur[i].col].classList.remove("dinosaur");
    }
}

/*If the key pressed is Space and the dinosaur is on the ground, the jump is released.
Also, if the game din't start or is over, it will start*/
function jumpOrStart(e) {
    if (e.code === "Space" && dinosaurUp === false)  {
        dinosaurUp = true;
        mover = setInterval(move, 35);
        if (start === false) {
            start = true;
            timer = setInterval(runTime, 1000);
        }
    }
}

//The dinosaur moves up and then down. When it touches back the ground, the jump move ends.
function move() {
    ++phaseInd;
    if (phaseInd <= 15) {
        for (let i = dinosaur.length - 1; i >= 0; --i) {
            grid[dinosaur[i].line][dinosaur[i].col].classList.remove("dinosaur");
            ++dinosaur[i].line;
            grid[dinosaur[i].line][dinosaur[i].col].classList.add("dinosaur");
        }
    } else if (phaseInd > 17) {
        for (let i = 0; i < dinosaur.length; ++i) {
            grid[dinosaur[i].line][dinosaur[i].col].classList.remove("dinosaur");
            --dinosaur[i].line;
            grid[dinosaur[i].line][dinosaur[i].col].classList.add("dinosaur");
        }
    }
    if (phaseInd === 31) {
        clearInterval(mover);
        phaseInd = 1;
        dinosaurUp = false;
    }
}

//We count the game time and make sure that the minutes and seconds are displayed with two digits
function runTime() {
    let prefixMin = "0", prefixSec = "0";
    ++seconds;
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

window.addEventListener('keydown', jumpOrStart);
