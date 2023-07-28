const area = document.querySelector(".area");
let grid = new Array(31);
let dinosaur  = [{"line": 1, "col": 3}, {"line": 1, "col": 5}, {"line": 2, "col": 3}, {"line": 2, "col": 4}, 
{"line": 2, "col": 5}, {"line": 3, "col": 2}, {"line": 3, "col": 3}, {"line": 3, "col": 4}, {"line": 3, "col": 5},
{"line": 4, "col": 5}, {"line": 5, "col": 5}, {"line": 5, "col": 6}, {"line": 6, "col": 5}, {"line": 6, "col": 6}];
let dinosaurUp = false, space = false;
let mover;
let phaseInd = 1;

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

//If the pressed Key is Space and the dinosaur is on the ground, the jump is released.
function releaseJump(e) {
    if (e.code === "Space" && dinosaurUp === false)  {
        console.log(e.code);
        dinosaurUp = true;
        mover = setInterval(jump, 35);
    }
}

//The dinosaur moves up and then down. When it touches back the ground, the jump move ends.
function jump() {
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

window.addEventListener('keydown', releaseJump);
