const cellsDOM = document.querySelectorAll(".table-cell"),
    scoreDOM = document.querySelector(".score span");

let table = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

//list of key pressed, for gameOver state
let keyPress = [];

let score = 0,
    gameOver = false;

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
    if (pos !== NaN) table[pos.row][pos.col] = rand <= 0.75 ? 2 : 4;
};

for (let i = 0; i < 2; i++) {
    let freePos = getFreePos();
    setRandom(getPos(freePos));
}
//Initial numbers

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

const equalTables = (table = [], copiaTable = []) => {
    for (let r = 0; r < table.length; r++) {
        for (let c = 0; c < table.length; c++) {
            if (table[r][c] != copiaTable[r][c]) return false;
        }
    }
    return true;
};

const moveTable = (dir) => {
    let copiaTable = [];
    for (let r = 0; r < table.length; r++) {
        let tmp = [];
        for (let c = 0; c < table.length; c++) {
            tmp.push(table[r][c]);
        }
        copiaTable.push(tmp);
    }

    if (dir == 1) {
        //to up
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
                    } else {
                        break;
                    }
                    cell--;
                }
            }
        }
    } else if (dir === 2) {
        //to right
        for (let r = 0; r < table.length; r++) {
            for (let c = table.length - 1; c >= 0; c--) {
                if (table[r][c] === 0) continue;
                let cell = c;
                while (cell < table.length - 1) {
                    if (table[r][cell] === table[r][cell + 1]) {
                        table[r][cell] = 0;
                        table[r][cell + 1] *= 2;
                        updateScore(table[r][cell + 1]);
                        move = true;
                    } else if (table[r][cell + 1] === 0) {
                        //swap...
                        move = true;
                        [table[r][cell], table[r][cell + 1]] = [table[r][cell + 1], table[r][cell]];
                    } else {
                        break;
                    }
                    cell++;
                }
            }
        }
    } else if (dir === 3) {
        //to down
        for (let r = table.length - 1; r >= 0; r--) {
            for (let c = 0; c < table.length; c++) {
                if (table[r][c] === 0) continue;
                let cell = r;
                while (cell < table.length - 1) {
                    if (table[cell][c] === table[cell + 1][c]) {
                        table[cell][c] = 0;
                        table[cell + 1][c] *= 2;
                        updateScore(table[cell + 1][c]);
                        move = true;
                    } else if (table[cell + 1][c] === 0) {
                        //swap...
                        move = true;
                        [table[cell][c], table[cell + 1][c]] = [table[cell + 1][c], table[cell][c]];
                    } else {
                        break;
                    }
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
                        move = true;
                    } else if (table[r][cell - 1] === 0) {
                        //swap...
                        [table[r][cell], table[r][cell - 1]] = [table[r][cell - 1], table[r][cell]];
                    } else {
                        break;
                    }
                    cell--;
                }
            }
        }
    }
    return !equalTables(table, copiaTable);
};

const updateTable = () => {
    freeCells = [];
    let idx = 0;
    for (let r = 0; r < table.length; r++) {
        for (let c = 0; c < table.length; c++) {
            cellsDOM[idx].innerHTML = "";
            cellsDOM[idx].dataset["number"] = table[r][c];
            if (table[r][c] !== 0) {
                cellsDOM[idx].innerHTML = table[r][c];
            } else {
                freeCells.push(idx);
            }
            idx++;
        }
    }
};

const handleInput = (key) => {
    let movement = {
        ArrowUp: 1,
        ArrowRight: 2,
        ArrowDown: 3,
        ArrowLeft: 4,
    };
    if (!movement[key]) return;

    let move = moveTable(movement[key]);

    console.log(move);

    if (move === true) {
        updateTable();
        let freePos = getFreePos();
        if (!freePos) return;
        setRandom(getPos(freePos));
        updateTable();
        keyPress = [];
    } else {
        keyPress.push(movement[key]);
        let flag = undefined;
        for (let i = 1; i <= 4; i++) {
            flag = keyPress.find((e) => e == i);
            if (!flag) break;
        }
        console.log(flag, "EEE", keyPress);
        if (flag) {
            alert("Perdiste");
        }
    }
};

document.addEventListener("keydown", (event) => {
    handleInput(event.key);
});

updateTable();

let bta = [
    [1, 2],
    [3, 4],
];
let ata = [
    [1, 2],
    [3, 4],
];

console.log(equalTables(ata, bta));
