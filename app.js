const cellsDOM = document.querySelectorAll(".table-cell div"),
    scoreDOM = document.querySelector(".score span"),
    modal = document.querySelector(".overlay"),
    modalScore = modal.querySelector(".modal-score"),
    restartBtn = modal.querySelector(".modal-btn");

const boardSize = 4,
    moveTimeout = 300,
    modalTimeout = 500;

let table, freeCells, animatedCells, score, gameOver, animating;

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

const initGame = () => {
    table = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    score = 0;
    animating = false;
    gameOver = false;
    freeCells = [];
    animatedCells = [];
    for (let i = 0; i < 16; i++) freeCells.push(i);

    //Initial numbers
    for (let i = 0; i < 2; i++) {
        let freePos = getFreePos();
        setRandom(getPos(freePos));
    }
    scoreDOM.innerHTML = score;
    modalScore.innerHTML = score;
    modal.classList.remove("show-modal");
    restartBtn.disabled = true;
    updateTable();
};

const checkGameOver = () => {
    for (let r = 0; r < boardSize; r++)
        for (let c = 0; c < boardSize; c++) {
            if (table[r][c] == 0) return false;
            if (
                (c < boardSize - 1 && table[r][c] === table[r][c + 1]) ||
                (c > 0 && table[r][c] === table[r][c - 1]) ||
                (r > 0 && table[r][c] === table[r - 1][c]) ||
                (r < boardSize - 1 && table[r][c] === table[r + 1][c])
            ) {
                return false;
            }
        }
    return true;
};

const handleGameOver = () => {
    setTimeout(() => {
        modal.classList.add("show-modal");
        modalScore.innerHTML = score;
        restartBtn.disabled = false;
    }, modalTimeout);
};

const updateScore = (val) => {
    score += val;
    scoreDOM.innerHTML = score;
};

const equalTables = (table = [], copiaTable = []) => {
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (table[r][c] != copiaTable[r][c]) return false;
        }
    }
    return true;
};

//dir: 1 up dir: 2 right dir: 3 down dir: 4 left
const moveTable = (dir) => {
    let finalPositions = [],
        mk = [];
    animatedCells = [];

    const copiaTable = [];
    for (let i = 0; i < boardSize; i++) {
        copiaTable.push(table[i].slice());
    }
    for (let i = 0; i < boardSize; i++) {
        finalPositions.push(new Array(boardSize));
        mk.push(new Array(boardSize));
        finalPositions[i].fill(undefined);
        mk[i].fill(0);
    }

    const canMove = (r, c, cell) => {
        if (dir == 1 || dir == 3) {
            let nCell = dir == 1 ? cell - 1 : cell + 1;
            return table[cell][c] === table[nCell][c] && !mk[nCell][c] && !mk[cell][c];
        } else if (dir == 2 || dir == 4) {
            let nCell = dir == 4 ? cell - 1 : cell + 1;
            return table[r][cell] === table[r][nCell] && !mk[r][nCell] && !mk[r][cell];
        }
        return false;
    };
    const modify = (r, c, cell) => {
        if (dir == 1 || dir == 3) {
            r = cell;
            let nCell = dir == 1 ? r - 1 : r + 1;
            table[r][c] = 0;
            table[nCell][c] *= 2;
            animatedCells.push(nCell * boardSize + c);
            mk[nCell][c] = true;
            updateScore(table[nCell][c]);
        } else if (dir == 2 || dir == 4) {
            let c = cell;
            let nCell = dir == 4 ? c - 1 : c + 1;
            table[r][c] = 0;
            table[r][nCell] *= 2;
            animatedCells.push(r * boardSize + nCell);
            mk[r][nCell] = true;
            updateScore(table[r][nCell]);
        }
    };

    if (dir == 1) {
        //to up
        for (let r = 1; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (table[r][c] === 0) continue;
                let cell = r;
                while (cell > 0) {
                    if (canMove(r, c, cell)) {
                        modify(r, c, cell);
                    } else if (table[cell - 1][c] === 0) {
                        //swap...
                        [table[cell][c], table[cell - 1][c]] = [table[cell - 1][c], table[cell][c]];
                    } else {
                        break;
                    }
                    cell--;
                    finalPositions[r][c] = cell;
                }
            }
        }
    } else if (dir === 2) {
        //to right
        for (let r = 0; r < boardSize; r++) {
            for (let c = boardSize - 1; c >= 0; c--) {
                if (table[r][c] === 0) continue;
                let cell = c;
                while (cell < boardSize - 1) {
                    if (canMove(r, c, cell)) {
                        modify(r, c, cell);
                    } else if (table[r][cell + 1] === 0) {
                        //swap...
                        [table[r][cell], table[r][cell + 1]] = [table[r][cell + 1], table[r][cell]];
                    } else {
                        break;
                    }
                    cell++;
                    finalPositions[r][c] = cell;
                }
            }
        }
    } else if (dir === 3) {
        //to down
        for (let r = boardSize - 1; r >= 0; r--) {
            for (let c = 0; c < boardSize; c++) {
                if (table[r][c] === 0) continue;
                let cell = r;
                while (cell < boardSize - 1) {
                    if (canMove(r, c, cell)) {
                        modify(r, c, cell);
                    } else if (table[cell + 1][c] === 0) {
                        //swap...
                        [table[cell][c], table[cell + 1][c]] = [table[cell + 1][c], table[cell][c]];
                    } else {
                        break;
                    }
                    cell++;
                    finalPositions[r][c] = cell;
                }
            }
        }
    } else if (dir === 4) {
        //to left
        for (let r = 0; r < boardSize; r++) {
            for (let c = 1; c < boardSize; c++) {
                if (table[r][c] === 0) continue;
                let cell = c;
                while (cell > 0) {
                    if (canMove(r, c, cell)) {
                        modify(r, c, cell);
                    } else if (table[r][cell - 1] === 0) {
                        //swap...
                        [table[r][cell], table[r][cell - 1]] = [table[r][cell - 1], table[r][cell]];
                    } else {
                        break;
                    }
                    cell--;
                    finalPositions[r][c] = cell;
                }
            }
        }
    }
    if (!equalTables(table, copiaTable)) {
        for (let r = 0, idx = 0; r < boardSize; r++)
            for (let c = 0; c < boardSize; c++) {
                if (finalPositions[r][c] !== undefined) {
                    const cellVal = finalPositions[r][c];

                    const cell = getComputedStyle(cellsDOM[idx].parentElement);
                    cellWidth = parseInt(cell.width) + parseInt(cell.margin) * 2;

                    if (dir === 1) {
                        cellsDOM[idx].style.transform = `translateY(${(cellVal - r) * cellWidth}px)`;
                    } else if (dir === 2) {
                        cellsDOM[idx].style.transform = `translateX(${(cellVal - c) * cellWidth}px)`;
                    } else if (dir === 3) {
                        cellsDOM[idx].style.transform = `translateY(${(cellVal - r) * cellWidth}px)`;
                    } else if (dir === 4) {
                        cellsDOM[idx].style.transform = `translateX(${(cellVal - c) * cellWidth}px)`;
                    }
                }
                idx++;
            }
        return true;
    }
    return false;
};

const updatePos = (idx, val, flag = 0) => {
    cellsDOM[idx].style.transform = "none";
    cellsDOM[idx].innerHTML = "";

    cellsDOM[idx].parentElement.dataset["number"] = val <= 2048 ? val : "bigNum";

    if (flag != 0) {
        cellsDOM[idx].style.animation = `${flag === true ? "join" : "new"}-bounce 0.3s ease forwards`;
        setTimeout(() => {
            cellsDOM[idx].style.transition = "all 0.3s ease";
            cellsDOM[idx].style.animation = "none";
        }, moveTimeout);
    }

    if (val != 0) cellsDOM[idx].innerHTML = val;
};

const updateTable = () => {
    freeCells = [];
    let idx = 0;
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            updatePos(idx, table[r][c], animatedCells.includes(idx));
            if (table[r][c] == 0) {
                console.log("La pos: ", { r, c }, "esta libre");
                freeCells.push(idx);
            }
            idx++;
        }
    }
    console.log("\n\n");

    setTimeout(() => {
        cellsDOM.forEach((cell) => {
            cell.style.transition = "all 0.3s ease";
        });
    }, 100);
};

const handleMovement = () => {
    cellsDOM.forEach((cell) => {
        cell.style.transition = "none";
    });

    updateTable();

    let freePos = getFreePos();
    let { row, col } = getPos(freePos);
    setRandom({ row, col });
    updatePos(freePos, table[row][col], 2);
};

const handleInput = (key) => {
    let movement = {
        ArrowUp: 1,
        ArrowRight: 2,
        ArrowDown: 3,
        ArrowLeft: 4,
    };
    //si no es un tecla de movimiento valida no hagas nada
    if (!movement[key]) return;

    let move = moveTable(movement[key]);

    animating = true;

    setTimeout(() => {
        if (move === true) {
            handleMovement();
        }

        gameOver = checkGameOver();
        if (gameOver) {
            handleGameOver();
        }
        animating = false;
    }, moveTimeout);
    // console.table(table);
};

document.addEventListener("keydown", (event) => {
    if (!gameOver && !animating) {
        handleInput(event.key);
    }
});

restartBtn.addEventListener("click", () => {
    initGame();
});

initGame();
