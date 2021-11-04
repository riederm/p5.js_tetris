import { Point } from "./point.js";

// ENUM for different tetris-pieces
export const PIECE_TYPE = {
    streight: 'streight',
    square: 'square',
    z: 'z',
}

export /*abstract*/ class Piece {
    coordinates = new Point(0, 0);

    /**
     * the piece's color - must not be EMPTY
     */
    #color = 'red';

    orientation = 0;

    constructor(x, y, color) {
        this.coordinates = new Point(x, y);
        this.#color = color;
    }

    getColor() {
        return this.#color;
    }

    /*abstract*/ getOcupiedFields() {
        return [];
    }

    move(deltaX, deltaY) {
        this.coordinates = this.coordinates.cloneRelative(deltaX, deltaY);
    }

    turnUp() {
        this.orientation++;
    }

    turnDown() {
        this.orientation--;
    }
}

export class BlockPiece extends Piece {
    constructor(x, y, color) {
        super(x, y, color)
    }

    getOcupiedFields() {
        return [
            this.coordinates,
            this.coordinates.cloneRelative(1, 0),
            this.coordinates.cloneRelative(0, 1),
            this.coordinates.cloneRelative(1, 1),
        ];
    }
}

export class StreightPiece extends Piece {

    constructor(x, y, color) {
        super(x, y, color)
    }

    getOcupiedFields() {
        switch (this.orientation % 2) {
            case 0:
                return [
                    this.coordinates,
                    this.coordinates.cloneRelative(0, 1),
                    this.coordinates.cloneRelative(0, 2),
                    this.coordinates.cloneRelative(0, 3),
                ];
            default:
                return [
                    this.coordinates,
                    this.coordinates.cloneRelative(1, 0),
                    this.coordinates.cloneRelative(2, 0),
                    this.coordinates.cloneRelative(3, 0),
                ];
                break;
        }
    }
}

export class ZPiece extends Piece {
    constructor(x, y, color) {
        super(x, y, color)
    }


    getOcupiedFields() {
        switch (this.orientation % 2) {
            case 0:
                return [
                    this.coordinates,
                    this.coordinates.cloneRelative(1, 0),
                    this.coordinates.cloneRelative(1, 1),
                    this.coordinates.cloneRelative(2, 1),
                ];
            case 1:
                return [
                    this.coordinates.cloneRelative(1, 0),
                    this.coordinates.cloneRelative(1, 1),
                    this.coordinates.cloneRelative(0, 1),
                    this.coordinates.cloneRelative(0, 2),
                ];
        }
    }
}

export class LPiece extends Piece {
    constructor(x, y, color) {
        super(x, y, color)
    }

    getOcupiedFields() {
        switch (this.orientation % 4) {
            case 0:
                // o
                // o
                // o o
                return [
                    this.coordinates,
                    this.coordinates.cloneRelative(0, 1),
                    this.coordinates.cloneRelative(0, 2),
                    this.coordinates.cloneRelative(1, 2),
                ];
            case 1:
                //     0
                // o o o
                return [
                    this.coordinates.cloneRelative(0, 1),
                    this.coordinates.cloneRelative(1, 1),
                    this.coordinates.cloneRelative(2, 1),
                    this.coordinates.cloneRelative(2, 0),
                ];
            case 2:
                // 0 0
                //   o
                //   0
                return [
                    this.coordinates,
                    this.coordinates.cloneRelative(1, 0),
                    this.coordinates.cloneRelative(1, 1),
                    this.coordinates.cloneRelative(1, 2),
                ];
            default:    
                // 0 0 0
                // 0
            return [
                    this.coordinates,
                    this.coordinates.cloneRelative(1, 0),
                    this.coordinates.cloneRelative(2, 0),
                    this.coordinates.cloneRelative(0, 1),
                ];

        }
    }
}

