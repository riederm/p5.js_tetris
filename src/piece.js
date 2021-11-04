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

    constructor(x,y, color) {
        this.coordinates =  new Point(x,y);
        this.#color = color;
    }

    getColor() {
        return this.#color;
    }

    /*abstract*/ getOcupiedFields() {
        return [];
    }
}

export class BlockPiece extends Piece {
    constructor(x, y, color) {
        super(x,y, color)
    }

    getOcupiedFields() {
        return [
            this.coordinates,
            this.coordinates.cloneRelative(1,0),
            this.coordinates.cloneRelative(0,1),
            this.coordinates.cloneRelative(1,1),
        ];
    }
}

export class StreightPiece extends Piece {
    constructor(x,y, color) {
        super(x,y, color)
    }

    getOcupiedFields() {
        return [
            this.coordinates,
            this.coordinates.cloneRelative(0,1),
            this.coordinates.cloneRelative(0,2),
            this.coordinates.cloneRelative(0,3),
        ];
    }
}

export class ZPiece extends Piece {
    constructor(x,y, color) {
        super(x,y, color)
    }

    getOcupiedFields() {
        return [
            this.coordinates,
            this.coordinates.cloneRelative(1,0),
            this.coordinates.cloneRelative(1,1),
            this.coordinates.cloneRelative(2,1),
        ];
    }
}

export class LPiece extends Piece {
    constructor(x,y, color) {
        super(x,y, color)
    }

    getOcupiedFields() {
        return [
            this.coordinates,
            this.coordinates.cloneRelative(0,1),
            this.coordinates.cloneRelative(0,2),
            this.coordinates.cloneRelative(1,2),
        ];
    }
}

