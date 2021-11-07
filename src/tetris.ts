
let game : Game;

/**
 * Entry-Method for the game -> this is called by the p5.js framework
 * once in the beginning
 */
function setup () {
  createCanvas(640, 800);
  game = new Game(10, 25, new Point(5,0));

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
  game.tick();
}

/**
 * is called whenever a key is pressed.
 * listens for <- and -> and moves the active piece
 */
function keyPressed() {
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
