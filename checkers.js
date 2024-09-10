const WHITE_TILE = 0;
const BLACK_TILE = 1;

const WHITE_PIECE = 2;
const BLACK_PIECE = 3;

// possible future user
const WHITE_KING = 4;
const BLACK_KING = 5;
const MARKED_TILE = 6;

const WHITE_PLAYER = "White";
const BLACK_PLAYER = "Black";

// not neccesary, possible future use
const ROWS = 8;
const COLS = ROWS;

let useBot = false;
let trackOfTurn = 0;
let wasWin = false;



const DISTANCE_TO_MOVE = 1;
const DISTANCE_TO_EAT = 2;


const STARTING_BOARD = [
    [WHITE_TILE, BLACK_PIECE, WHITE_TILE, BLACK_PIECE, WHITE_TILE, BLACK_PIECE, WHITE_TILE, BLACK_PIECE],
    [BLACK_PIECE, WHITE_TILE, BLACK_PIECE, WHITE_TILE, BLACK_PIECE, WHITE_TILE, BLACK_PIECE, WHITE_TILE],
    [WHITE_TILE, BLACK_PIECE, WHITE_TILE, BLACK_PIECE, WHITE_TILE, BLACK_PIECE, WHITE_TILE, BLACK_PIECE],
    [BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE],
    [WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE, WHITE_TILE, BLACK_TILE],
    [WHITE_PIECE, WHITE_TILE, WHITE_PIECE, WHITE_TILE, WHITE_PIECE, WHITE_TILE, WHITE_PIECE, WHITE_TILE],
    [WHITE_TILE, WHITE_PIECE, WHITE_TILE, WHITE_PIECE, WHITE_TILE, WHITE_PIECE, WHITE_TILE, WHITE_PIECE],
    [WHITE_PIECE, WHITE_TILE, WHITE_PIECE, WHITE_TILE, WHITE_PIECE, WHITE_TILE, WHITE_PIECE, WHITE_TILE]
];

// setup board
var playBoard = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

// function sets up the board
function setupBoard(targetBoard=playBoard) {
    for (let r = 0; r < STARTING_BOARD.length; r++) {
        for (let c = 0; c < STARTING_BOARD[0].length; c++) {
            targetBoard[r][c] = STARTING_BOARD[r][c];
        }
    }
}

function setToDeafult() {
    trackOfTurn = 0; // reset the turn
    setupBoard(); // set up the board
    wasWin = false; // reset the win flag
    document.getElementById("startButton").innerText = "RESTART";  // make the start button text "RESTART"
}

// create the table
function createTable(startingPos = false, boardToBuild=playBoard) {
    if (startingPos) {
        setToDeafult();
    }
    if (bot = true) {
        useBot = true
    }
    let r = 0, c = 0, num = 0;      // r - rows, c - column, only used for building the table, num - to give each cell an id

    let table = "";    // String to hold the table
    table += "<table border='1' id='table' style='margin-left:auto; margin-right:auto  ; background-repeat:no-repeat'>";     // Creating the table tag
    while (r < ROWS) {
        c = 0;
        table += "<tr>";
        while (c < COLS) {       // Creating the cells in the table
            let id = r + '.' + c;
            let button = "<td id='" + id + "' style='width:50px; height:50px;'></td>";
            table += button;
            c++;
            num++;      // Increasing the id by 1...
        }
        r++;
        table += "</tr>";       // Ending a row
    }
    table += "</table>";        // Closing the table tag

    document.getElementById("board").innerHTML = table;     // Making the table apear on the screen
    manageCells(boardToBuild); // manage the cells
}

// function manages each sell on the playing board
function manageCells(board = playBoard) {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            let id = r + '.' + c;
            if ((r + c) % 2 == 0) { // white tile
                document.getElementById(id).classList.add("white_tile");
            }
            else { // black tile
                document.getElementById(id).classList.add("black_tile");
                switch (board[r][c]) { // check the value in the cell

                    case WHITE_PIECE: // white piece
                        document.getElementById(id).classList.add("white_piece");
                        document.getElementById(id).setAttribute("onclick", "whitePieceOnclick(this)");
                        break;
                    case BLACK_PIECE: // black piece
                        document.getElementById(id).classList.add("black_piece");
                        document.getElementById(id).setAttribute("onclick", "blackPieceOnclick(this)");
                        break;
                    case MARKED_TILE: // marked tile
                        document.getElementById(id).classList.add("")
                        break;
                }
            }
        }
    }
}


// function to check if a given index wont crash the program
function validateIndex(row, col) {
    return !(row < 0 || row > playBoard.length - 1 || col < 0 || col > playBoard[0].length - 1);

}

// function runs the black player actions
function blackPieceOnclick(playerPiece) {
    if (currentPlayer() != BLACK_PIECE) {
        return;
    }

    // re-draw the board
    createTable();
    let pieceID = playerPiece.id;
    let splittedValues = pieceID.split('.');
    let row = parseInt(splittedValues[0]), col = parseInt(splittedValues[1]);

    if (validateIndex(row + 1, col - 1)) {
        let bottomLeftValue = playBoard[row + 1][col - 1];
        switch (bottomLeftValue) {
            case BLACK_TILE:
                markTile(row, col, row + 1, col - 1);
                break;
            case BLACK_PIECE:

                break;
            case WHITE_PIECE:
                if (validateIndex(row + 2, col - 2)) {
                    let potentialTile = playBoard[row + 2][col - 2];
                    if (potentialTile == BLACK_TILE) {
                        markTile(row, col, row + 2, col - 2, row + 1, col - 1);
                    }
                }
                break;
        }
    }

    if (validateIndex(row + 1, col + 1)) {
        let bottomRightValue = playBoard[row + 1][col + 1];
        switch (bottomRightValue) {
            case BLACK_TILE:
                markTile(row, col, row + 1, col + 1);
                break;
            case BLACK_PIECE:

                break;
            case WHITE_PIECE:
                if (validateIndex(row + 2, col + 2)) {
                    let potentialTile = playBoard[row + 2][col + 2];
                    if (potentialTile == BLACK_TILE) {
                        markTile(row, col, row + 2, col + 2, row + 1, col + 1);
                    }
                }
                break;
        }
    }

}


// function runs the white player actions
function whitePieceOnclick(playerPiece) {
    if (currentPlayer() != WHITE_PIECE) {
        return;
    }

    // re-draw the board
    createTable(); 
    let pieceID = playerPiece.id;
    let splittedValues = pieceID.split('.');
    let row = parseInt(splittedValues[0]), col = parseInt(splittedValues[1]);

    if (validateIndex(row - 1, col - 1)) {
        let topLeftValue = playBoard[row - 1][col - 1];
        switch (topLeftValue) {
            case BLACK_TILE:
                markTile(row, col, row - 1, col - 1);
                break;
            case BLACK_PIECE:
                if (validateIndex(row - 2, col - 2)) {
                    let potentialTile = playBoard[row - 2][col - 2];
                    if (potentialTile == BLACK_TILE) {
                        markTile(row, col, row - 2, col - 2, row - 1, col - 1);
                    }
                }
                break;
            case WHITE_PIECE:
                break;
        }
    }

    if (validateIndex(row - 1, col + 1)) {
        let topRightValue = playBoard[row - 1][col + 1];
        switch (topRightValue) {
            case BLACK_TILE:
                markTile(row, col, row - 1, col + 1);
                break;
            case BLACK_PIECE:
                if (validateIndex(row - 2, col + 2)) {
                    let potentialTile = playBoard[row - 2][col + 2];
                    if (potentialTile == BLACK_TILE) {
                        markTile(row, col, row - 2, col + 2, row - 1, col + 1);
                    }
                }
                break;
            case WHITE_PIECE:
                break;
        }
    }
}

// function marks a tile
function markTile(souceTileRow, sourceTileCol, markTileRow, markTileCol, eatableTileRow = -1, eatableTileCol = -1) {
    let markTileID = markTileRow + '.' + markTileCol;
    document.getElementById(markTileID).classList.add("marked");
    document.getElementById(markTileID).setAttribute("onclick", "movePiece(" + souceTileRow + "," + sourceTileCol + "," + markTileRow + "," + markTileCol + "," + eatableTileRow + "," + eatableTileCol + "); changeTurn()");
}


// function moves a piece
function movePiece(sourceTileRow, sourceTileCol, markTileRow, markTileCol, eatableTileRow, eatableTileCol) {
    playBoard[markTileRow][markTileCol] = playBoard[sourceTileRow][sourceTileCol]; // make target tile the original piece
    playBoard[sourceTileRow][sourceTileCol] = BLACK_TILE; // remove source piece
    if (eatableTileCol != -1) { // remove eatable if exists
        playBoard[eatableTileRow][eatableTileCol] = BLACK_TILE;
    }
    checkWin(markTileRow, markTileCol);
    
    // re-draw the table
    createTable();
}


function changeTurn() {
    if (!wasWin) {
        trackOfTurn++;
        if (currentPlayer() == BLACK_PIECE && useBot) {
            runBot();
        }
    }
}



// function checks if the player in given coords won
function checkWin(row, col) { // getting row (and col for possible future use)
    if (row == playBoard.length - 1 || row == 0) {
        winProtocol()
        document.getElementById("startButton").innerText = "Play Again!";
    }
}

// function creates a win popup for the winner
function winProtocol() {
    
    // vars
    let winPopup, content, playerMessage, playAgainButton;
    
    
    // create the popup

    // create the winPopup element
    winPopup = document.createElement("div");
    winPopup.classList.add("popup");
    winPopup.setAttribute("id", "winPopup");
    winPopup.style.left = "50%";
    winPopup.style.top = "50%";
    winPopup.style.transform = "translate(-50%, -50%)";

    // make the content in winPopup
    content = document.createElement("div");
    content.classList.add("content");

    // make the playerMessage header in the content
    let playerWon = currentPlayer() == BLACK_PIECE ? BLACK_PLAYER : WHITE_PLAYER

    playerMessage = document.createElement("h1");
    playerMessage.innerText = `Congratulations ${playerWon}! You have won the game!`;

    // make the button in the popup to play again
    playAgainButton = document.createElement("button");
    playAgainButton.innerText = "Play Again?";
    playAgainButton.setAttribute("onclick", "createTable(true); document.body.removeChild(winPopup)");


    //encapsulate
    content.appendChild(playerMessage);
    content.appendChild(playAgainButton);
    winPopup.appendChild(content);
    document.body.appendChild(winPopup);

    // run the popup animation
    winPopup.style.animation = "fade-in 0.5s ease-in-out";
    wasWin = true;


}


// get current player turn
function currentPlayer() {
    if (trackOfTurn % 2 == 0) {
        return WHITE_PIECE;
    }
    else {
        return BLACK_PIECE;
    }
}


// bot functions

function runBot() {

    // bot is black
    if (currentPlayer() == BLACK_PIECE) {
        // calculation runs too fast so we set a timeout for it to look semi-human
        setTimeout(() => {
            let { originalRow, originalCol, moveToRow, moveToCol, eatableRow, eatableCol } = GetBestMove(playBoard, BLACK_PIECE, 1);
            movePiece(originalRow, originalCol, moveToRow, moveToCol, eatableRow, eatableCol);
            changeTurn();
        }, 500)
    }
}

/**
 * Calculates the score of the board for the given turn.
 *
 * @param {Array} board The board state.
 * @param {number} turn The current turn.
 * @returns {number} The score of the board.
 */
function calculateBoardScore(board, turn) {
    let score = 0;
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            switch (board[r][c]) {
                case WHITE_PIECE:
                    if (turn == WHITE_PIECE && canEat(r, c, board)) { // if the piece can eat and its the turn of the piece
                        score -= 20; // give it a bonus
                    }
                    if (r == 0) { // if the piece is in the last row
                        score = -10000; // set the score to -10000 because he won
                        return score;
                        // score -= 10000; // make a huge bonus for making a piece a king
                    }
                    // score--; // give a small bonus for being a piece
                    score -= ((board.length - r)) * 10; // give a bonus based on the row
                    break;
                case BLACK_PIECE:
                    if (turn == BLACK_PIECE && canEat(r, c, board)) { // if the piece can eat and its the turn of the piece
                        score += 20; // give it a bonus
                    }
                    if (r == board.length - 1) { // if the piece is in the last row
                        score = 10000; // set the score to 10000 because he won
                        return score;
                        // score += 10000; // make a huge bonus for making a piece a king
                    }
                    // score++; // give a small bonus for being a piece
                    score += (r + 1) * 10; // give a bonus based on the row
                    break;

            }
        }
    }
    return score;
}



/**
 * Determines if a piece on the board can move to a given position.
 *
 * @param {number} row - The row of the position to check.
 * @param {number} col - The column of the position to check.
 * @param {Array} board - The game board.
 * @return {boolean} Whether the piece can move to the given position.
 */
function canMove(row, col, board) {
    let firstEval = false;
    let secondEval = false;
    switch (board[row][col]) {
        case BLACK_PIECE:
            if (validateIndex(row + 1, col + 1, board)) {
                // can actually just do return
                firstEval = IsClean(row + 1, col + 1, board);
            }
            if (validateIndex(row + 1, col - 1, board)) {
                // can actually just do return
                secondEval = IsClean(row + 1, col - 1, board);
            }
            break;
        case WHITE_PIECE:
            if (validateIndex(row - 1, col + 1, board)) {
                // can actually just do return
                firstEval = IsClean(row - 1, col + 1, board);
            }
            if (validateIndex(row - 1, col - 1, board)) {
                // can actually just do return
                secondEval = IsClean(row - 1, col - 1, board);
            }
            break;
    }
    return firstEval || secondEval;
}

/**
 * MoveToDirection function moves a piece on the board to a specific direction.
 *
 * @param {number} row - the row index of the piece to be moved
 * @param {number} col - the column index of the piece to be moved
 * @param {Array} board - the game board
 * @return {Array} An array containing two directions: direction1 (either "BottomLeft" or "TopLeft") and direction2 (either "BottomRight or "TopRight")
 */
function MoveToDirection(row, col, board) {
    let direction1 = -1, direction2 = -1;

    switch (board[row][col]) {
        case BLACK_PIECE:
            if (validateIndex(row + 1, col - 1, board)) {
                if (IsClean(row + 1, col - 1, board)) {
                    direction1 = "BottomLeft";
                }
            }
            if (validateIndex(row + 1, col + 1, board)) {
                if (IsClean(row + 1, col + 1, board)) {
                    direction2 = "BottomRight";
                }
            }
            break;
        case WHITE_PIECE:
            if (validateIndex(row - 1, col - 1, board)) {
                if (IsClean(row - 1, col - 1, board)) {
                    direction1 = "TopLeft";
                }
            }
            if (validateIndex(row - 1, col + 1, board)) {
                if (IsClean(row - 1, col + 1, board)) {
                    direction2 = "TopRight";
                }
            }
            break;
    }

    return [direction1, direction2];
}


function canEat(row, col, board) {
    let firstEval = false;
    let secondEval = false;
    switch (board[row][col]) {
        case BLACK_PIECE:
            if (validateIndex(row + 1, col + 1) && validateIndex(row + 2, col + 2)) {
                firstEval = board[row + 1][col + 1] == WHITE_PIECE && IsClean(row + 2, col + 2, board);
            }
            if (validateIndex(row + 1, col - 1) && validateIndex(row + 2, col - 2)) {
                secondEval = board[row + 1][col - 1] == WHITE_PIECE && IsClean(row + 2, col - 2, board);
            }
            break;

        case WHITE_PIECE:
            if (validateIndex(row - 1, col + 1) && validateIndex(row - 2, col + 2)) {
                firstEval = board[row - 1][col + 1] == BLACK_PIECE && IsClean(row - 2, col + 2, board);
            }
            if (validateIndex(row - 1, col - 1) && validateIndex(row - 2, col - 2)) {
                secondEval = board[row - 1][col - 1] == BLACK_PIECE && IsClean(row - 2, col - 2, board);
            }
            break;
    }
    return firstEval || secondEval;
}


/**
 * Determines the directions in which a piece can eat on the board.
 *
 * @param {number} row - The row index of the piece.
 * @param {number} col - The column index of the piece.
 * @param {Array} board - The game board.
 * @return {Array} An array containing two directions: direction1 (either "BottomLeft" or "TopLeft") and direction2 (either "BottomRight or "TopRight").
 */
function EatToDirection(row, col, board) {
    let direction1 = -1, direction2 = -1;
    switch (board[row][col]) {
        case BLACK_PIECE:
            if (validateIndex(row + 1, col - 1, board) && validateIndex(row + 2, col - 2, board)) {
                if (board[row + 1][col - 1] == WHITE_PIECE && IsClean(row + 2, col - 2, board)) {
                    direction1 = "BottomLeft";
                }
            }
            if (validateIndex(row + 1, col + 1, board) && validateIndex(row + 2, col + 2, board)) {
                if (board[row + 1][col + 1] == WHITE_PIECE && IsClean(row + 2, col + 2, board)) {
                    direction2 = "BottomRight";
                }
            }
            break;

        case WHITE_PIECE:
            if (validateIndex(row - 1, col - 1, board) && validateIndex(row - 2, col - 2, board)) {
                if (board[row - 1][col - 1] == BLACK_PIECE && IsClean(row - 2, col - 2, board)) {
                    direction1 = "TopLeft";
                }
            }
            if (validateIndex(row - 1, col + 1, board) && validateIndex(row - 2, col + 2, board)) {
                if (board[row - 1][col + 1] == BLACK_PIECE && IsClean(row - 2, col + 2, board)) {
                    direction2 = "TopRight";
                }
            }
            break;
    }
    return [direction1, direction2];
}

function IsClean(row, col, board) {
    return board[row][col] == BLACK_TILE;
}

function GetBestMove(board, playerTurn, depth) {

    if (depth == 0) {
        return null;
    }

    // variables
    let currentScore = 0;
    let bestScore = -Infinity; // current only works towards black
    let currentMove = {
        originalRow: 0,
        originalCol: 0,
        moveToRow: 0,
        moveToCol: 0,
        eatableRow: -1,
        eatableCol: -1
    };
    let simulatedBoard;

    let bestMove = {
        originalRow: 0,
        originalCol: 0,
        moveToRow: 0,
        moveToCol: 0,
        eatableRow: -1,
        eatableCol: -1
    };

   


    let userMoves = []; // array of all possible moves
    // simulate all possible moves for the player
    for (let r = 0; r < board.length; r++) { // for each row
        for (let c = 0; c < board[r].length; c++) { // for each column
            const piece = board[r][c]; // get the piece
            if (playerTurn == piece) { // if the piece is the same as the playerTurn

                // if the piece can move
                if (canMove(r, c, board)) {
                    const [direction1, direction2] = MoveToDirection(r, c, board); // get the directions on where it can move

                    // first direction - BottomLeft || TopLeft
                    if (direction1 != -1) { // if there is a direction

                        [currentScore, simulatedBoard] = checkMove(r, c, direction1, DISTANCE_TO_MOVE); // simulate the move     
                        const [dr, dc] = getDirectionOffset(direction1); // get the direction offset
                        currentMove = { originalRow: r, originalCol: c, moveToRow: r + dr, moveToCol: c + dc, eatableRow: -1, eatableCol: -1 }; // update the move
                        userMoves.push([currentMove, currentScore, simulatedBoard]); // add the move to the moves array

                        if (currentScore > bestScore) { // if the move is better than the current best move
                            bestScore = currentScore; // update the best score
                            Object.assign(bestMove, currentMove); // update the best move
                        }
                    }

                    // second direction - BottomRight || TopRight
                    if (direction2 != -1) { // if there is a direction

                        [currentScore, simulatedBoard] = checkMove(r, c, direction2, DISTANCE_TO_MOVE); // simulate the move     
                        const [dr, dc] = getDirectionOffset(direction2); // get the direction offset
                        currentMove = { originalRow: r, originalCol: c, moveToRow: r + dr, moveToCol: c + dc, eatableRow: -1, eatableCol: -1 }; // update the move
                        userMoves.push([currentMove, currentScore, simulatedBoard]); // add the move to the moves array

                        if (currentScore > bestScore) { // if the move is better than the current best move
                            bestScore = currentScore; // update the best score
                            Object.assign(bestMove, currentMove); // update the best move
                        }
                    }
                }

                // if the piece can eat
                if (canEat(r, c, board)) {
                    const [direction1, direction2] = EatToDirection(r, c, board); // get the directions on where it can eat

                    // first direction - BottomLeft || TopLeft
                    if (direction1 != -1) {  // if there is a direction

                        [currentScore, simulatedBoard] = checkMove(r, c, direction1, DISTANCE_TO_EAT); // simulate the move     
                        const [dr, dc] = getDirectionOffset(direction1, DISTANCE_TO_EAT); // get the direction offset for the move
                        const [der, dec] = getDirectionOffset(direction1, DISTANCE_TO_MOVE); // get the direction offset for the piece that is being eaten
                        currentMove = { originalRow: r, originalCol: c, moveToRow: r + dr, moveToCol: c + dc, eatableRow: r + der, eatableCol: c + dec }; // update the move
                        userMoves.push([currentMove, currentScore, simulatedBoard]); // add the move to the moves array

                        if (currentScore > bestScore) { // if the move is better than the current best move
                            bestScore = currentScore; // update the best score
                            Object.assign(bestMove, currentMove); // update the best move
                        }
                    }

                    // second direction - BottomRight || TopRight
                    if (direction2 != -1) { // if there is a direction

                        [currentScore, simulatedBoard] = checkMove(r, c, direction2, DISTANCE_TO_EAT); // simulate the move     
                        const [dr, dc] = getDirectionOffset(direction2, DISTANCE_TO_EAT); // get the direction offset for the move
                        const [der, dec] = getDirectionOffset(direction2, DISTANCE_TO_MOVE); // get the direction offset for the piece that is being eaten
                        currentMove = { originalRow: r, originalCol: c, moveToRow: r + dr, moveToCol: c + dc, eatableRow: r + der, eatableCol: c + dec }; // update the move
                        userMoves.push([currentMove, currentScore, simulatedBoard]); // add the move to the moves array

                        if (currentScore > bestScore) { // if the move is better than the current best move
                            bestScore = currentScore; // update the best score
                            Object.assign(bestMove, currentMove); // update the best move
                        }
                    }
                }
            }
        }
    }





    // idea to keep every possible move in a dict, move1 points into another dict that has the move and the score


    if (bestScore != 10000) { // 10000 is a win 
        userMoves.sort(function (a, b) { // sort the moves array by score
            return b[1] - a[1];
        });

        let opponentTurn = (playerTurn == BLACK_PIECE) ? WHITE_PIECE : BLACK_PIECE; // change the turn

        // simulate all possible moves for the opponent
        let overallMoves = []; // the overall moves array built like [score, [move, board]]
        for (let i = 0; i < userMoves.length; i++) {
            let move = userMoves[i][0];
            let moveScore = userMoves[i][1];
            let moveBoard = userMoves[i][2];
            for (let r = 0; r < moveBoard.length; r++) {
                for (let c = 0; c < moveBoard[r].length; c++) {
                    const piece = moveBoard[r][c];
                    if (piece == opponentTurn) {

                        // if the piece can move
                        if (canMove(r, c, moveBoard)) {
                            const [direction1, direction2] = MoveToDirection(r, c, moveBoard); // get the directions on where it can move

                            // first direction - BottomLeft || TopLeft
                            if (direction1 != -1) { // if there is a direction

                                [moveScore, tempo] = checkMove(r, c, direction1, DISTANCE_TO_MOVE); // simulate the move and add it to the moves array                  

                                overallMoves.push([moveScore, move]); // we dont check if its better, we just add it to the moves list

                            }

                            // second direction - BottomRight || TopRight
                            if (direction2 != -1) { // if there is a direction

                                [moveScore, tempo] = checkMove(r, c, direction1, DISTANCE_TO_MOVE); // simulate the move and add it to the moves array                  

                                overallMoves.push([moveScore, move]); // we dont check if its better, we just add it to the moves list

                            }
                        }

                        // if the piece can eat
                        if (canEat(r, c, moveBoard)) {
                            const [direction1, direction2] = EatToDirection(r, c, moveBoard); // get the directions on where it can eat

                            // first direction - BottomLeft || TopLeft
                            if (direction1 != -1) {  // if there is a direction

                                [moveScore, tempo] = checkMove(r, c, direction1, DISTANCE_TO_EAT); // simulate the move and add it to the moves array                  

                                overallMoves.push([moveScore, move]); // we dont check if its better, we just add it to the moves list

                            }

                            // second direction - BottomRight || TopRight
                            if (direction2 != -1) { // if there is a direction

                                [moveScore, tempo] = checkMove(r, c, direction1, DISTANCE_TO_EAT); // simulate the move and add it to the moves array

                                overallMoves.push([moveScore, move]); // we dont check if its better, we just add it to the moves list

                            }
                        }
                    }
                }
            }
        }


        overallMoves.sort(function (a, b) { // sort the moves array by score
            return b[0] - a[0];
        });

        bestMove = overallMoves[0][1]; // we sorted the array so the best move is in slot 1 (best score) overallMoves looks like this: [[score, move], [score, move]] 
    }

    return bestMove; // return the best move
}



/**
 * Makes a move on the simulation board in the given direction and distance.
 *
 * @param {number} r - The row index of the piece to move.
 * @param {number} c - The column index of the piece to move.
 * @param {string} direction - The direction to move the piece in.
 * @param {number} moveDistance - The distance to move the piece.
 * @return {array} an array containing the board score and the simulated board
 */
function checkMove(r, c, direction, moveDistance) {
    const [dr, dc] = getDirectionOffset(direction);
    const moveToRow = r + moveDistance * dr;
    const moveToCol = c + moveDistance * dc;
    return simulateMove(r, c, moveToRow, moveToCol, playBoard, moveDistance == 1 ? "move" : "eat");
}




/**
 * Returns the row and column offsets for a given direction and move distance.
 *
 * @param {string} direction - The direction to move the piece in.
 * @param {number} moveDistance - The distance to move the piece.
 * @return {array} An array containing the row and column offsets for the given direction and move distance.
 */
function getDirectionOffset(direction, moveDistance = 1) {
    switch (direction) {
        case "BottomRight":
            return [moveDistance, moveDistance];
        case "TopRight":
            return [-moveDistance, moveDistance];
        case "BottomLeft":
            return [moveDistance, -moveDistance];
        case "TopLeft":
            return [-moveDistance, -moveDistance];
    }
    return [0, 0];
}




function createSimulationBoard(originalRow, originalCol, moveToRow, moveToCol, board, moveType) {
    let SimulationBoard = cloneBoard(board); // get a clone of the board


    if (moveType == "eat") { // if the move is an eat move


        let temp = SimulationBoard[originalRow][originalCol];
        SimulationBoard[originalRow][originalCol] = SimulationBoard[moveToRow][moveToCol];
        SimulationBoard[moveToRow][moveToCol] = temp;
        if (board[originalRow][originalCol] == BLACK_PIECE) { // if the piece is black
            if (originalCol > moveToCol) // eating to the bottom left
            {
                SimulationBoard[originalRow + 1][originalCol - 1] = BLACK_TILE; // make it blank space
            }
            else if (originalCol < moveToCol) // eating to the bottom right
            {
                SimulationBoard[originalRow + 1][originalCol + 1] = BLACK_TILE; // make it blank space
            }
        }
        else if (board[originalRow][originalCol] == WHITE_PIECE) { // if the piece is white
            if (originalCol > moveToCol) // eating to the top left
            {
                SimulationBoard[originalRow - 1][originalCol - 1] = BLACK_TILE; // make it blank space
            }
            else if (originalCol < moveToCol) // eating to the top right
            {
                SimulationBoard[originalRow - 1][originalCol + 1] = BLACK_TILE; // make it blank space
            }
        }
    }
    else if (moveType == "move") { // if the move is a move move
        let temp = SimulationBoard[originalRow][originalCol];
        SimulationBoard[originalRow][originalCol] = SimulationBoard[moveToRow][moveToCol];
        SimulationBoard[moveToRow][moveToCol] = temp;
    }

    return SimulationBoard;
}


function cloneBoard(board) {
    let simulationBoard = [];

    for (let r = 0; r < board.length; r++) {
        simulationBoard[r] = [];
        for (let c = 0; c < board[0].length; c++) {
            simulationBoard[r][c] = board[r][c];
        }
    }

    return simulationBoard;
}




/**
 * Simulates a move on the game board.
 *
 * @param {number} originalRow - the original row of the piece
 * @param {number} originalCol - the original column of the piece
 * @param {number} moveToRow - the row to move the piece to
 * @param {number} moveToCol - the column to move the piece to
 * @param {array} board - the current game board
 * @param {string} moveType - the type of move to simulate
 * @return {array} an array containing the board score and the simulated board
 */
function simulateMove(originalRow, originalCol, moveToRow, moveToCol, board, moveType) {
    simulatedBoard = createSimulationBoard(originalRow, originalCol, moveToRow, moveToCol, board, moveType); // create a simulated board

    let turn;

    if (board[originalRow][originalCol] == BLACK_PIECE) { // if the piece is black
        turn = WHITE_PIECE;
    }
    else {
        turn = BLACK_PIECE;
    }

    return [calculateBoardScore(simulatedBoard, turn), simulatedBoard];
}

//alert(currentPlayer())
//alert(calculateBoardScore(STARTING_BOARD, currentPlayer()))
