const boardSize = 8;
let board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
let currentPlayer = 'black';

document.body.innerHTML = `
    <h1 style="text-align: center;">オセロゲーム</h1>
    <div id="board" style="display: grid; grid-template-columns: repeat(8, 50px); grid-template-rows: repeat(8, 50px); gap: 2px; width: 416px; margin: 20px auto; background-color: green; border: 2px solid black;"></div>
`;

function initBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = null;
        }
    }
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.style.width = '50px';
            cell.style.height = '50px';
            cell.style.backgroundColor = 'darkgreen';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.cursor = 'pointer';
            cell.style.borderRadius = '50%';

            if (board[i][j] === 'black') {
                const disk = document.createElement('div');
                disk.style.backgroundColor = 'black';
                disk.style.borderRadius = '50%';
                disk.style.width = '80%';
                disk.style.height = '80%';
                cell.appendChild(disk);
            } else if (board[i][j] === 'white') {
                const disk = document.createElement('div');
                disk.style.backgroundColor = 'white';
                disk.style.borderRadius = '50%';
                disk.style.width = '80%';
                disk.style.height = '80%';
                cell.appendChild(disk);
            }

            cell.addEventListener('click', handleMove);
            boardElement.appendChild(cell);
        }
    }
}

function handleMove(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col] !== null) return;
    if (!isValidMove(row, col, currentPlayer)) return;

    board[row][col] = currentPlayer;
    flipDisks(row, col, currentPlayer);
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    renderBoard();
}

function isValidMove(row, col, player) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let [dx, dy] of directions) {
        let r = row + dx, c = col + dy, foundOpponent = false;

        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
            if (board[r][c] === null) break;
            if (board[r][c] !== player) {
                foundOpponent = true;
            } else {
                if (foundOpponent) return true;
                break;
            }
            r += dx;
            c += dy;
        }
    }
    return false;
}

function flipDisks(row, col, player) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let [dx, dy] of directions) {
        let r = row + dx, c = col + dy, flipped = [];

        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
            if (board[r][c] === null) break;
            if (board[r][c] !== player) {
                flipped.push([r, c]);
            } else {
                for (let [fr, fc] of flipped) {
                    board[fr][fc] = player;
                }
                break;
            }
            r += dx;
            c += dy;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    renderBoard();
});
