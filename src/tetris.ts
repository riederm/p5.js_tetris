
let game: GameEngine;

/**
 * Entry-Method for the game -> this is called by the p5 framework
 * once in the beginning
 */
function setup() {
  createCanvas(640, 800);
  game = new GameEngine(10, 25, new Point(5, 0));
}

/**
 * this method is called continously by the p5 framework
 * to draw 60 fps
 */
function draw() {
  game.gameTick();
}

/**
 * is called by the p5 framework whenever a key is pressed.
 * listens for <- and -> and moves the active piece
 */
function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      game.keyPressed(Key.Left);
      break;
    case RIGHT_ARROW:
      game.keyPressed(Key.Right);
      break;
    case UP_ARROW:
      game.keyPressed(Key.Up);
      break;
    case DOWN_ARROW:
      game.keyPressed(Key.Down);
      break;
    default:
      //do nothing
      break;
  }
}
