const EMPTY = 'white';
const COLORS = ['red', 'green', 'yellow', 'blue'];

// enumeration for different tetris-pieces
// for now we only support the I, the square and the L type
const PIECE_TYPE = {
  streight: 0,
  square:   1,
  z:        2,
}

class /* struct */ Piece {
  type = PIECE_TYPE.streight;
  x = 0;
  y = 0;
  color = 'red';
}

const GAME_FIELD_WIDTH = 10;
const GAME_FIELD_HEIGHT = 25;
const BOX_WIDTH_PIXEL = 25;

// the game field
// field is a 2 dim array that represents the tetries field
// a cell may contain a color from COLORs or WHITE 
class /*struct*/ Game {
  field = [];
  lastFrame = 0;
  activePiece = new Piece();
}

const game = new Game();

function setup() {
  createCanvas(640, 800);
  for (let x = 0; x < GAME_FIELD_WIDTH; x++) {
    game.field[x] = [];
    for (let y = 0; y < GAME_FIELD_HEIGHT; y++) {
      game.field[x][y] = EMPTY;
    }
  }

  game.activePiece = getRandomItem();
  game.activePiece.x = 5;
  game.lastFrame = millis();
  placePiece(game.activePiece, game.activePiece.color);
}

function getRandomItem() {
}

function deletePiece(item) {
  placePiece(item, EMPTY);
}

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
      game.field[item.x][item.y+1] = color;
      game.field[item.x+1][item.y] = color;
      game.field[item.x+1][item.y+1] = color;
      break;
 
    case PIECE_TYPE.z :
      game.field[item.x][item.y] = color;
      game.field[item.x+1][item.y] = color;
      game.field[item.x+1][item.y+1] = color;
      game.field[item.x+2][item.y+1] = color;
      break;
  }
}

function currentItemCanMove() {
  let current_item = game.activePiece;
  switch (game.activePiece.type) {
    case PIECE_TYPE.streight:
      return game.field[current_item.x][current_item.y + 4] == EMPTY;

    case PIECE_TYPE.square:
      return game.field[current_item.x][current_item.y + 2 ] == EMPTY 
        && game.field[current_item.x + 1][current_item.y + 2] == EMPTY;

    case PIECE_TYPE.z:
      return game.field[current_item.x][current_item.y + 1] == EMPTY
        && game.field[current_item.x+1][current_item.y + 2] == EMPTY
        && game.field[current_item.x+2][current_item.y + 2] == EMPTY

  }
  return true;
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
  //shall we tick? (aka. a game turn)
  if (now - game.lastFrame > 500) { 

    //delete the current piece from the board
    deletePiece(game.activePiece);

    if (currentItemCanMove()) {
      // move piece down
      game.activePiece.y = game.activePiece.y + 1;
      placePiece(game.activePiece, game.activePiece.color);

    } else {
      // leave piece where it is and get a new piece
      placePiece(game.activePiece, game.activePiece.color);

      game.activePiece = getRandomItem();
    }
    //remember last tick-frame 
    game.lastFrame = now;
  }
  
  // draw the board
  push();
  translate(50,50);
  stroke('#bfbfbf');
  strokeWeight(2);
  for (let x = 0; x < GAME_FIELD_WIDTH; x++) {
    for (let y = 0; y < GAME_FIELD_HEIGHT; y++) {
      //fill the rectangle with whatever color we placed at (x,y)
      let color = game.field[x][y];
      fill(color);
      rect(x*BOX_WIDTH_PIXEL, y*BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL, BOX_WIDTH_PIXEL); 
    }
  }
  pop();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
      deletePiece(game.activePiece);
      game.activePiece.x--;
      placePiece(game.activePiece, game.activePiece.color);

    } else if (keyCode == RIGHT_ARROW) {
      deletePiece(game.activePiece);
      game.activePiece.x++;
      placePiece(game.activePiece, game.activePiece.color);
    }
}