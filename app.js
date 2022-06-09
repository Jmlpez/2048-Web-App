const cellsDOM = document.querySelectorAll(".table-col"),
    scoreDOM = document.querySelector(".score h3");

//this is temp
const moveBtn = document.querySelector(".btn");

let table = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

let score = 0;

let freeCells = [];
for (let i = 0; i < 16; i++) freeCells.push(i);

const getFreePos = () => {
    let rand = Math.floor(Math.random() * freeCells.length);
    let pos = freeCells[rand];
    freeCells.splice(rand, 1);
    return pos;
};

const getPos = (pos) => {
    let row = Math.floor(pos / 4);
    let col = pos % 4;
    return { row, col };
};

const setRandom = (pos = {}) => {
    let rand = Math.random();
    table[pos.row][pos.col] = rand <= 0.75 ? 2 : 4;
};

for (let i = 0; i < 2; i++) {
    let freePos = getFreePos();
    setRandom(getPos(freePos));
}

/*
dir: 1 up
dir: 2 right
dir: 3 down
dir: 4 left
*/

const updateScore = (val) => {
    score += val;
    scoreDOM.innerHTML = score;
};

const moveTable = (dir) => {
    if (dir == 1) {
        for (let r = 1; r < table.length; r++) {
            for (let c = 0; c < table.length; c++) {
                if (table[r][c] === 0) continue;
                let cell = r;
                while (cell > 0) {
                    if (table[cell][c] === table[cell - 1][c]) {
                        table[cell][c] = 0;
                        table[cell - 1][c] *= 2;
                        updateScore(table[cell - 1][c]);
                    } else if (table[cell - 1][c] === 0) {
                        //swap...
                        [table[cell][c], table[cell - 1][c]] = [table[cell - 1][c], table[cell][c]];
                    } else break;
                    cell--;
                }
            }
        }
    } else if (dir === 2) {
        for (let r = 0; r < table.length; r++) {
            for (let c = table.length - 1; c >= 0; c--) {
                if (table[r][c] === 0) continue;
                let cell = c;
                while (cell < table.length - 1) {
                    if (table[r][cell] === table[r][cell + 1]) {
                        table[r][cell] = 0;
                        table[r][cell + 1] *= 2;
                        updateScore(table[r][cell + 1]);
                    } else if (table[r][cell + 1] === 0) {
                        //swap...
                        [table[r][cell], table[r][cell + 1]] = [table[r][cell + 1], table[r][cell]];
                    } else break;
                    cell++;
                }
            }
        }
    } else if (dir === 3) {
        for (let r = table.length - 1; r >= 0; r--) {
            for (let c = 0; c < table.length; c++) {
                if (table[r][c] === 0) continue;
                let cell = r;
                while (cell < table.length - 1) {
                    if (table[cell][c] === table[cell + 1][c]) {
                        table[cell][c] = 0;
                        table[cell + 1][c] *= 2;
                        updateScore(table[cell + 1][c]);
                    } else if (table[cell + 1][c] === 0) {
                        //swap...
                        [table[cell][c], table[cell + 1][c]] = [table[cell + 1][c], table[cell][c]];
                    } else break;
                    cell++;
                }
            }
        }
    } else if (dir === 4) {
        //to left
        for (let r = 0; r < table.length; r++) {
            for (let c = 1; c < table.length; c++) {
                if (table[r][c] === 0) continue;
                let cell = c;
                while (cell > 0) {
                    if (table[r][cell] === table[r][cell - 1]) {
                        table[r][cell] = 0;
                        table[r][cell - 1] *= 2;
                        updateScore(table[r][cell - 1]);
                    } else if (table[r][cell - 1] === 0) {
                        //swap...
                        [table[r][cell], table[r][cell - 1]] = [table[r][cell - 1], table[r][cell]];
                    } else break;
                    cell--;
                }
            }
        }
    }
};

const updateTable = () => {
    let idx = 0;
    for (let r = 0; r < table.length; r++) {
        for (let c = 0; c < table.length; c++) {
            cellsDOM[idx].innerHTML = "";
            if (table[r][c] !== 0) cellsDOM[idx].innerHTML = table[r][c];
            idx++;
        }
    }
};

moveBtn.addEventListener("click", () => {
    moveTable(2);
    //debugging..
    console.table(table);
    updateTable();
});

console.table(table);

updateTable();
