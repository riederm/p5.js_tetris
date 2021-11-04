import { Game } from "./game.js"
import { PIECE_TYPE } from "./piece.js";

const game = new Game();
p5 = {};

/**
 * Entry-Method for the game -> this is called by the p5.js framework
 * once in the beginning
 */
window.setup = function () {
  createCanvas(640, 800);
  p5.rect = rect;
  p5.fill = fill;
  p5.push = push;
  p5.pop = pop;
  p5.stroke = stroke;
  p5.strokeWeight = strokeWeight;
  p5.translate = translate;
}

/**
 * acts as the game-tick
 * 1. moves the current piece forward if necessary
 * 2. aquires a new random piece for the next move if necessary
 * 3. draws the board
 * 
 * this method is called continously to draw 60 fps
 */
window.draw = function () {
  let now = Date.now();
  //shall we tick?
  if (now - game.lastTick > 500) {
    game.tick();

    //remember last tick-frame 
    game.lastTick = now;
  }

  // draw the board
  game.draw(p5);
}

/**
 * is called whenever a key is pressed.
 * listens for <- and -> and moves the active piece
 */
window.keyPressed = function () {
  if (keyCode === LEFT_ARROW) {
    game.move(-1, 0);

  } else if (keyCode == RIGHT_ARROW) {
    game.move(1, 0);

  } else if (keyCode == UP_ARROW) {
    game.turn();

  } else if (keyCode == DOWN_ARROW) {
    game.down();
  }
}
