const area = document.querySelector(".area");
let grid = new Array(21);
let dinosaur  = [{"line": 1, "col": 3}, {"line": 1, "col": 5}, {"line": 2, "col": 3}, {"line": 2, "col": 4}, 
{"line": 2, "col": 5}, {"line": 3, "col": 2}, {"line": 3, "col": 3}, {"line": 3, "col": 4}, {"line": 3, "col": 5},
{"line": 4, "col": 5}, {"line": 5, "col": 5}, {"line": 5, "col": 6}, {"line": 6, "col": 5}, {"line": 6, "col": 6}];

createGrid();
createDinosaur();

function createGrid() {
    for (let i = 0; i < grid.length; ++i) {
        grid[i] = new Array(81);
    }
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