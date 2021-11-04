import { Border } from "./border.js";
import { EMPTY } from "./box.js";
import { Box } from "./box.js";
import { BlockPiece, StreightPiece, Piece, PIECE_TYPE } from "./piece.js";

const COLORS = ['red', 'green', 'yellow', 'blue'];
const GAME_FIELD_WIDTH = 10;

const GAME_FIELD_HEIGHT = 25;

// the game field
export class Game {
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
    activePiece = {};

    constructor() {
        //initialize the game field
        for (let x = 0; x < this.getWidth(); x++) {
            this.field[x] = [];
            for (let y = 0; y < this.getHeight(); y++) {
                this.field[x][y] = new Box(x, y);
            }
        }
        this.activePiece = this.#getRandomItem();
        this.lastTick = Date.now();
        this.placePiece(this.activePiece);
    }

    getWidth(){
        return GAME_FIELD_WIDTH;
    }

    getHeight(){
        return GAME_FIELD_HEIGHT;
    }


    /**
     * creates a random piece at (x=GAME_FIELD_WIDTH/2, y=0)
     */
    #getRandomItem() {
        let pieces = [PIECE_TYPE.streight, PIECE_TYPE.square, PIECE_TYPE.z];
        let activePiece = {};
        let color = COLORS[Math.floor(Math.random()*COLORS.length)];
        switch(pieces[Math.floor(Math.random()*pieces.length)]){
            case PIECE_TYPE.streight:
                return new StreightPiece(5, 0, color);
            case PIECE_TYPE.square: 
            default:
                return new BlockPiece(5, 0, color);

        }
    }

    /**
     * removes the given item from the baord.
     * this clears all the item's fields to EMPTY
     */
    deletePiece(piece) {
        this.#doPlacePiece(piece, EMPTY);
    }

    /**
     * places the given item on the board.
     * technically this sets the item's fields to 
     * the item's color
     */
    placePiece(piece) {
        this.#doPlacePiece(piece, piece.getColor());
    }

    draw(p5) {
        for (let x = 0; x < GAME_FIELD_WIDTH; x++) {
            for (let y = 0; y < GAME_FIELD_HEIGHT; y++) {
                const field = this.getField(x,y);
                field.draw(p5);
            }
        }
    }
    

    /**
     * perform a game tick. A Game-Tick means to perform
     * a "turn" or "move". This means that a the active piece
     * moves and/or a new piece is introduced into the game
     */
    tick() {
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
     * returns the field at the given coordinates
     */
    getField(x, y) {
        if (x >= 0 && x < GAME_FIELD_WIDTH
            && y >= 0 && y < GAME_FIELD_HEIGHT) {
                return this.field[x][y];
        }
        return new Border();
    }

    /**
     * helper method that updates the field's 
     */
    #doPlacePiece(piece, color) {
        for (const p of piece.getOcupiedFields()) {
            const f = this.getField(p.getX(), p.getY());
            f.fill(color);
        }
    }
}