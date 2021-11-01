
const WIDTH = 10;
const HEIGHT = 25;
const BOX_WIDTH = 25;

const field = [];
const EMPTY = 'white';

const ITEM_TYPE = {
  streight: 0,
  square: 1,
  t: 2,
  l: 3,
  skew: 4
}

class /* struct */ Item {
  type = ITEM_TYPE.l;
  x = 0;
  y = 0;
  color = 'red';
}

class /*struct*/ Game {
  field = [];
  tick = 0;
  current_item = new Item();
}

const game = new Game();

function setup() {
  createCanvas(640, 800);
  for (let x = 0; x < WIDTH; x++) {
    game.field[x] = [];
    for (let y = 0; y < HEIGHT; y++) {
      game.field[x][y] = EMPTY;
    }
  }

  game.current_item = getRandomItem();
  game.current_item.x = 5;
  game.tick = millis();
  //update the item's position
  place_item(game.current_item, game.current_item.color);
}

function getRandomItem() {
  let i = new Item();
  i.type = random([ITEM_TYPE.streight, ITEM_TYPE.square]);
  i.color = random(['red', 'green', 'yellow', 'blue']);
  i.y = 0;
  i.x = 5;
  return i;
}

function delete_item(item) {
  place_item(item, EMPTY);
}

function place_item(item, color) {
  switch (item.type) {
    case ITEM_TYPE.streight:
        for (let i = 0; i < 4; i++) {
          if (item.y + i < HEIGHT) {
            game.field[item.x][item.y + i] = color;
          }
        }
      break;
    case ITEM_TYPE.square:
      game.field[item.x][item.y] = color;
      game.field[item.x][item.y+1] = color;
      game.field[item.x+1][item.y] = color;
      game.field[item.x+1][item.y+1] = color;
      break;
  }
}

function current_item_can_move() {
  let current_item = game.current_item;
  switch (game.current_item.type) {
    case ITEM_TYPE.streight:
      return game.field[current_item.x][current_item.y + 4] == EMPTY;
    case ITEM_TYPE.square:
      return game.field[current_item.x][current_item.y + 2 ] == EMPTY 
        && game.field[current_item.x + 1][current_item.y + 2] == EMPTY;
  }
  return true;
}

function draw() {
  let current_time = millis();
  if (current_time - game.tick > 500) {
    delete_item(game.current_item);

    if (current_item_can_move()) {
      game.current_item.y = game.current_item.y + 1;
      place_item(game.current_item, game.current_item.color);
    } else {
      place_item(game.current_item, game.current_item.color);
      game.current_item = getRandomItem();
    }
    game.tick = current_time;
  }
  
  push();
  translate(50,50);
  // draw the board
  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      fill(game.field[x][y]);
      rect(x*BOX_WIDTH, y*BOX_WIDTH, BOX_WIDTH, BOX_WIDTH); 
    }
  }
  pop();
}


function keyPressed() {
    if (keyCode === LEFT_ARROW) {
      delete_item(game.current_item);
      game.current_item.x--;
      place_item(game.current_item, game.current_item.color);
    } else if (keyCode == RIGHT_ARROW) {
      delete_item(game.current_item);
      game.current_item.x++;
      place_item(game.current_item, game.current_item.color);
    }
}