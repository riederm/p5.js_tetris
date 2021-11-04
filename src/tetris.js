// game constants
const EMPTY = 'white';
const COLORS = ['red', 'green', 'yellow', 'blue'];
const GAME_FIELD_WIDTH = 10;
const GAME_FIELD_HEIGHT = 25;
const BOX_WIDTH_PIXEL = 25;

// ENUM for different tetris-pieces
const PIECE_TYPE = {
  streight: 0,
  square: 1,
  z: 2,
}

class /* struct */ Piece {
  /**
   * the type of piece (one of PIECE_TYPE)
   */
  type = PIECE_TYPE.streight;
  /**
   * the x coordinate of top left corner of the piece
   */
  x = 0;
  /**
   * the y coordinate of the top left corner of the piece
   */
  y = 0;
  /**
   * the piece's color - must not be EMPTY
   */
  color = 'red';
}

// the game field
class /*struct*/ Game {
  /**
   * 2 dim array representing the game-field
   * a cell may contain a color from COLOR or EMPTY
   */
  field = [];
  /**
   * the time of the last game-tick
   */
  lastTick = 0;
  /**
   * the active piece which moves at game-ticks
   */
  activePiece = new Piece();
}
const game = new Game();


/**
 * Entry-Method for the game -> this is called by the p5.js framework
 * once in the beginning
 */
function setup() {
  createCanvas(640, 800);

  //initialize the game field
  for (let x = 0; x < GAME_FIELD_WIDTH; x++) {
    game.field[x] = [];
    for (let y = 0; y < GAME_FIELD_HEIGHT; y++) {
      game.field[x][y] = EMPTY;
    }
  }
  game.activePiece = getRandomItem();
  game.activePiece.x = 5;
  game.lastTick = millis();
  placePiece(game.activePiece, game.activePiece.color);
}

/**
 * creates a random piece at (x=GAME_FIELD_WIDTH/2, y=0)
 */
function getRandomItem() {
  let p = new Piece();
  p.type = random([PIECE_TYPE.streight, PIECE_TYPE.square, PIECE_TYPE.z]);
  p.color = random(COLORS);
  p.y = 0;
  p.x = Math.trunc(GAME_FIELD_WIDTH/2);
  return p;
}

/**
 * removes the given item from the baord.
 * this clears all the item's fields to EMPTY
 */
function deletePiece(item) {
  placePiece(item, EMPTY);
}

/**
 * places the given item on the board.
 * technically this sets the item's fields to 
 * the item's color
 */
function placePiece(item, color) {
  switch (item.type) {
    case PIECE_TYPE.streight:
      for (let i = 0; i < 4; i++) {
        if (item.y + i < GAME_FIELD_HEIGHT) {
          game.field[item.x][item.y + i] = color;
        }
      }
      break;

    case PIECE_TYPE.square:
      game.field[item.x][item.y] = color;
      game.field[item.x][item.y + 1] = color;
      game.field[item.x + 1][item.y] = color;
      game.field[item.x + 1][item.y + 1] = color;
      break;

    case PIECE_TYPE.z:
      game.field[item.x][item.y] = color;
      game.field[item.x + 1][item.y] = color;
      game.field[item.x + 1][item.y + 1] = color;
      game.field[item.x + 2][item.y + 1] = color;
      break;
  }
}

/**
 * returns true, if the current Item can move down,
 * otherwise false 
 */
function currentItemCanMove() {
  let current_item = game.activePiece;
  switch (game.activePiece.type) {
    case PIECE_TYPE.streight:
      return game.field[current_item.x][current_item.y + 4] == EMPTY;

    case PIECE_TYPE.square:
      return game.field[current_item.x][current_item.y + 2] == EMPTY
        && game.field[current_item.x + 1][current_item.y + 2] == EMPTY;

    case PIECE_TYPE.z:
      return game.field[current_item.x][current_item.y + 1] == EMPTY
        && game.field[current_item.x + 1][current_item.y + 2] == EMPTY
        && game.field[current_item.x + 2][current_item.y + 2] == EMPTY

  }
  return true;
}

/**
 * moves the given piece on the board by applying the
 * given deltaX and deltaY values to its coordinates
 */
function movePiece(piece, deltaX, deltaY) {
  deletePiece(piece);
  piece.x += deltaX;
  piece.y += deltaY;
  placePiece(piece, piece.color);
}

/**
 * acts as the game-tick
 * 1. moves the current piece forward if necessary
 * 2. aquires a new random piece for the next move if necessary
 * 3. draws the board
 * 
 * this method is called continously to draw 60 fps
 */
function draw() {
  let now = millis();
  //shall we tick?
  if (now - game.lastTick > 500) {
    gameTick();

    //remember last tick-frame 
    game.lastTick = now;
  }

  // draw the board
  drawBoard();
}

/**
 * perform a game tick. A Game-Tick means to perform
 * a "turn" or "move". This means that a the active piece
 * moves and/or a new piece is introduced into the game
 */
function gameTick() {
  //delete the current piece from the board
  if (currentItemCanMove()) {
    // move piece down
    movePiece(game.activePiece, 0, 1);
  } else {
    // leave piece where it is and get a new piece
    game.activePiece = getRandomItem();
  }
}

/**
 * draws the board's state as reflected by the game-struct
 * every element of game.field will be drawn as a filled 
 * rectangle
 */
function drawBoard() {
  push();
  translate(50, 50);
  stroke('#bfbfbf');
  strokeWeight(2);
  for (let x = 0; x < GAME_FIELD_WIDTH; x++) {
    for (let y = 0; y < GAME_FIELD_HEIGHT; y++) {
      //fill the rectangle with whatever color we placed at (x,y)
      let color = game.field[x][y];
      fill(color);
      rect(x * BOX_WIDTH_PIXEL, y * BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL);
    }
  }
  pop();
}

/**
 * is called whenever a key is pressed.
 * listens for <- and -> and moves the active piece
 */
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    movePiece(game.activePiece, -1, 0);
  
  } else if (keyCode == RIGHT_ARROW) {
    movePiece(game.activePiece, +1, 0);
    
  }
}