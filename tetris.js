// キャンバス（絵を描く場所）を作る
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 300; // 幅
canvas.height = 600; // 高さ
document.body.appendChild(canvas); // 画面に追加

// 一つのブロックの大きさ
const tileSize = 30;
const rows = 20; // 縦のマスの数
const cols = 10; // 横のマスの数

// ゲームのボード（マス目）を作る
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

// テトリスのブロックの形
const tetrominoes = [
    [[1, 1, 1, 1]], // I型
    [[1, 1], [1, 1]], // O型
    [[0, 1, 0], [1, 1, 1]], // T型
    [[1, 1, 0], [0, 1, 1]], // S型
    [[0, 1, 1], [1, 1, 0]], // Z型
    [[1, 1, 1], [0, 0, 1]], // L型
    [[1, 1, 1], [1, 0, 0]] // J型
];

// 今動いているブロックをランダムで決める
let currentPiece = { shape: tetrominoes[Math.floor(Math.random() * tetrominoes.length)], x: 3, y: 0 };

// ブロックを回転させる関数
function rotatePiece(piece) {
    return piece[0].map((_, i) => piece.map(row => row[i]).reverse());
}

// ボードを描く関数
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c]) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                ctx.strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }
    drawPiece();
}

// ブロックを描く関数
function drawPiece() {
    ctx.fillStyle = 'red';
    currentPiece.shape.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            if (cell) {
                ctx.fillRect((currentPiece.x + cIdx) * tileSize, (currentPiece.y + rIdx) * tileSize, tileSize, tileSize);
                ctx.strokeRect((currentPiece.x + cIdx) * tileSize, (currentPiece.y + rIdx) * tileSize, tileSize, tileSize);
            }
        });
    });
}

// ブロックが動けるかチェックする関数
function isValidMove(x, y, piece) {
    return piece.every((row, rIdx) =>
        row.every((cell, cIdx) => {
            let newX = x + cIdx;
            let newY = y + rIdx;
            return !cell || (newY < rows && newX >= 0 && newX < cols && !board[newY][newX]);
        })
    );
}

// ブロックを固定する関数
function placePiece() {
    currentPiece.shape.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            if (cell) {
                board[currentPiece.y + rIdx][currentPiece.x + cIdx] = 1;
            }
        });
    });
    // 新しいブロックを作る
    currentPiece = { shape: tetrominoes[Math.floor(Math.random() * tetrominoes.length)], x: 3, y: 0 };
}

// ブロックを下に動かす関数
function movePiece() {
    if (isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++;
    } else {
        placePiece(); // 底についたら固定する
    }
    drawBoard();
}

setInterval(movePiece, 500); // 0.5秒ごとにブロックを落とす

// キーボード操作
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && isValidMove(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x--; // 左移動
    } else if (event.key === 'ArrowRight' && isValidMove(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x++; // 右移動
    } else if (event.key === 'ArrowDown' && isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++; // 下移動
    } else if (event.key === 'ArrowUp') {
        let rotated = rotatePiece(currentPiece.shape);
        if (isValidMove(currentPiece.x, currentPiece.y, rotated)) {
            currentPiece.shape = rotated; // 回転
        }
    }
    drawBoard();
});

drawBoard(); // 初めのボードを描く