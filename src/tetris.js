import {Game} from "./game.js"
import { PIECE_TYPE } from "./piece.js";

const game = new Game();
p5 = {};

/**
 * Entry-Method for the game -> this is called by the p5.js framework
 * once in the beginning
 */
window.setup = function() {
  createCanvas(640, 800);
  p5.rect = rect;
  p5.fill = fill;
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

  return true;
}

/**
 * moves the given piece on the board by applying the
 * given deltaX and deltaY values to its coordinates
 */
function movePiece(piece, deltaX, deltaY) {
  game.deletePiece(piece);
  piece.x += deltaX;
  piece.y += deltaY;
  game.placePiece(piece);
}

/**
 * acts as the game-tick
 * 1. moves the current piece forward if necessary
 * 2. aquires a new random piece for the next move if necessary
 * 3. draws the board
 * 
 * this method is called continously to draw 60 fps
 */
window.draw = function() {
  let now = Date.now();
  //shall we tick?
  if (now - game.lastTick > 500) {
    gameTick();

    //remember last tick-frame 
    game.lastTick = now;
  }

  // draw the board
  push();
  translate(50, 50);
  stroke('#bfbfbf');
  strokeWeight(2);
  game.draw(p5);
  pop();
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
 * is called whenever a key is pressed.
 * listens for <- and -> and moves the active piece
 */
window.keyPressed = function() {
  if (keyCode === LEFT_ARROW) {
    movePiece(game.activePiece, -1, 0);
  
  } else if (keyCode == RIGHT_ARROW) {
    movePiece(game.activePiece, +1, 0);
    
  }
}
