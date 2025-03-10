// オセロのボードサイズ（8x8）
const boardSize = 8;
// ボードの状態を二次元配列で管理
let board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
// 現在のプレイヤー（最初は黒）
let currentPlayer = 'black';

// HTMLのボードを作成
document.body.innerHTML = `
    <h1 style="text-align: center;">オセロゲーム</h1>
    <div id="board" style="display: grid; grid-template-columns: repeat(8, 50px); grid-template-rows: repeat(8, 50px); gap: 2px; width: 416px; margin: 20px auto; background-color: green; border: 2px solid black;"></div>
`;

// ボードを初期化する関数
function initBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = null;
        }
    }
    // オセロの初期配置
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';
}

// ボードをHTMLに描画する関数
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

            // 石を描画
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

            // セルをクリックしたときの処理
            cell.addEventListener('click', handleMove);
            boardElement.appendChild(cell);
        }
    }
}

// 石を置く処理
function handleMove(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    // すでに石がある場合は無視
    if (board[row][col] !== null) return;
    // 有効な手でない場合は無視
    if (!isValidMove(row, col, currentPlayer)) return;

    // 石を置く
    board[row][col] = currentPlayer;
    // 石をひっくり返す
    flipDisks(row, col, currentPlayer);
    // プレイヤーを交代
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    // ボードを再描画
    renderBoard();
}

// 有効な手かどうか判定
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

// 石をひっくり返す処理
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
                // 途中で対戦相手の石があれば、それらをひっくり返す
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

// ページが読み込まれたらゲームを開始
document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    renderBoard();
});